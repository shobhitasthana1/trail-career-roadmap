const JobPosting = require('../models/JobPosting');

const ADZUNA_BASE = 'https://api.adzuna.com/v1/api/jobs';
const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;

// Country to search in — 'us' or 'gb' give the most results
const COUNTRY = 'gb';
const RESULTS_PER_PAGE = 20;

/**
 * Fetch one page of jobs from Adzuna for a given role.
 * Returns an array of raw Adzuna result objects, or [] on error.
 */
async function fetchFromAdzuna(role, page = 1) {
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
  return data.results || [];
}

/**
 * Save new job postings to MongoDB, skipping duplicates.
 * Returns the count of newly inserted jobs.
 */
async function saveJobs(rawJobs, role) {
  let savedCount = 0;

  for (const job of rawJobs) {
    // Skip if description is missing — useless for skill extraction
    if (!job.description) continue;

    try {
      await JobPosting.create({
        externalId: String(job.id),
        source: 'adzuna',
        role: role.toLowerCase().trim(),
        title: job.title || '',
        company: job.company?.display_name || '',
        location: job.location?.display_name || '',
        description: job.description,
        url: job.redirect_url || '',
        postedAt: job.created ? new Date(job.created) : null,
      });
      savedCount++;
    } catch (err) {
      // E11000 = duplicate key — job already stored, skip silently
      if (err.code !== 11000) {
        console.error(`Error saving job ${job.id}:`, err.message);
      }
    }
  }

  return savedCount;
}

/**
 * Main entry point used by the controller.
 *
 * 1. Fetch up to `pages` pages from Adzuna
 * 2. Save new ones, skip duplicates
 * 3. Return all stored jobs for this role
 */
async function searchAndStoreJobs(role, pages = 2) {
  if (!APP_ID || !APP_KEY) {
    throw new Error('Adzuna credentials are not set in .env');
  }

  let totalFetched = 0;
  let totalSaved = 0;

  for (let page = 1; page <= pages; page++) {
    let rawJobs;
    try {
      rawJobs = await fetchFromAdzuna(role, page);
    } catch (err) {
      console.error(`Page ${page} fetch failed: ${err.message}`);
      break; // stop paging on error, return what we have
    }

    if (rawJobs.length === 0) break; // no more results

    totalFetched += rawJobs.length;
    const saved = await saveJobs(rawJobs, role);
    totalSaved += saved;
  }

  // Return all stored postings for this role (new + previously cached)
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

module.exports = { searchAndStoreJobs };
