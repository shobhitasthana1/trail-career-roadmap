const JobPosting = require('../models/JobPosting');

const ADZUNA_BASE = 'https://api.adzuna.com/v1/api/jobs';
const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;
const COUNTRY = 'gb';
const RESULTS_PER_PAGE = 20;

const JSEARCH_URL = 'https://jsearch.p.rapidapi.com/search';
const JSEARCH_KEY = process.env.JSEARCH_API_KEY || process.env.RAPIDAPI_KEY;

// Fetch job listings from Adzuna API
async function fetchFromAdzuna(role, page = 1) {
  if (!APP_ID || !APP_KEY) return [];

  const params = new URLSearchParams({
    app_id: APP_ID,
    app_key: APP_KEY,
    results_per_page: RESULTS_PER_PAGE,
    what: role,
    'content-type': 'application/json',
  });

  const url = `${ADZUNA_BASE}/${COUNTRY}/search/${page}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Adzuna API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return (data.results || []).map((job) => ({
    externalId: String(job.id),
    source: 'adzuna',
    title: job.title || '',
    company: job.company?.display_name || '',
    location: job.location?.display_name || '',
    description: job.description || '',
    url: job.redirect_url || '',
    postedAt: job.created ? new Date(job.created) : new Date(),
  }));
}

// Fetch job listings from JSearch API via RapidAPI
async function fetchFromJSearch(role, page = 1) {
  if (!JSEARCH_KEY) return [];

  try {
    const params = new URLSearchParams({
      query: `${role} developer`,
      page: String(page),
      num_pages: '1',
    });

    const response = await fetch(`${JSEARCH_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': JSEARCH_KEY,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      console.warn(`JSearch API returned HTTP status ${response.status}`);
      return [];
    }

    const data = await response.json();
    return (data.data || []).map((job) => ({
      externalId: String(job.job_id),
      source: 'jsearch',
      title: job.job_title || '',
      company: job.employer_name || '',
      location: [job.job_city, job.job_country].filter(Boolean).join(', ') || 'Remote',
      description: job.job_description || '',
      url: job.job_apply_link || '',
      postedAt: job.job_posted_at_datetime_utc ? new Date(job.job_posted_at_datetime_utc) : new Date(),
    }));
  } catch (err) {
    console.warn(`JSearch fetch error: ${err.message}`);
    return [];
  }
}

// Persist unique job records to MongoDB
async function saveJobs(normalizedJobs, role) {
  let savedCount = 0;

  for (const job of normalizedJobs) {
    if (!job.description || job.description.length < 50) continue;

    try {
      await JobPosting.create({
        externalId: job.externalId,
        source: job.source,
        role: role.toLowerCase().trim(),
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        url: job.url,
        postedAt: job.postedAt,
      });
      savedCount++;
    } catch (err) {
      // E11000 indicates duplicate job already saved
      if (err.code !== 11000) {
        console.error(`Error saving job posting: ${err.message}`);
      }
    }
  }

  return savedCount;
}

/**
 * Searches and saves jobs using available job APIs.
 * Pulls from Adzuna and JSearch with automatic cross-fallback.
 */
async function searchAndStoreJobs(role, pages = 2) {
  let totalFetched = 0;
  let totalSaved = 0;

  // Try Adzuna first if credentials are present
  if (APP_ID && APP_KEY) {
    for (let page = 1; page <= pages; page++) {
      try {
        const rawJobs = await fetchFromAdzuna(role, page);
        if (!rawJobs || rawJobs.length === 0) break;
        totalFetched += rawJobs.length;
        const saved = await saveJobs(rawJobs, role);
        totalSaved += saved;
      } catch (err) {
        console.warn(`Adzuna page ${page} fetch failed: ${err.message}`);
        break;
      }
    }
  }

  // If Adzuna returned 0 postings or is unavailable, use JSearch API
  if (totalFetched === 0 && JSEARCH_KEY) {
    console.log(`Using JSearch API for role "${role}"`);
    try {
      const jsearchJobs = await fetchFromJSearch(role, 1);
      totalFetched += jsearchJobs.length;
      const saved = await saveJobs(jsearchJobs, role);
      totalSaved += saved;
    } catch (err) {
      console.warn(`JSearch fetch failed: ${err.message}`);
    }
  }

  // Return stored postings from DB
  const allJobs = await JobPosting.find({ role: role.toLowerCase().trim() })
    .sort({ postedAt: -1 })
    .limit(50)
    .lean();

  return {
    role,
    totalFetched,
    totalSaved,
    totalInDb: allJobs.length,
    jobs: allJobs,
  };
}

module.exports = {
  searchAndStoreJobs,
  fetchFromAdzuna,
  fetchFromJSearch,
};
