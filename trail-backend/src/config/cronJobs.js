const cron = require('node-cron');
const { analyzeMarketForRole } = require('../services/skillService');
const { generateRoadmap } = require('../services/roadmapService');
const { searchAndStoreJobs } = require('../services/jobService');

// Roles to keep fresh automatically
const PREBUILT_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'DevOps Engineer',
];

/**
 * Refresh one role:
 *  1. Fetch latest job postings from Adzuna
 *  2. Analyze skills from new postings
 *  3. Regenerate the roadmap
 */
async function refreshRole(role) {
  console.log(`[cron] Refreshing "${role}"...`);
  try {
    await searchAndStoreJobs(role, 2);
    await analyzeMarketForRole(role);
    await generateRoadmap(role);
    console.log(`[cron] ✓ "${role}" refreshed successfully`);
  } catch (err) {
    console.error(`[cron] ✗ Failed to refresh "${role}":`, err.message);
  }
}

/**
 * Schedule: runs once every 24 hours at 02:00 AM server time.
 * Processes each role sequentially to stay within API rate limits.
 */
function startCronJobs() {
  cron.schedule('0 2 * * *', async () => {
    console.log('[cron] Starting scheduled market data refresh...');
    for (const role of PREBUILT_ROLES) {
      await refreshRole(role);
    }
    console.log('[cron] Scheduled refresh complete.');
  });

  console.log('Cron job scheduled: market data refresh at 02:00 AM daily');
}

module.exports = { startCronJobs, refreshRole };
