const { searchAndStoreJobs } = require('../services/jobService');

/**
 * GET /api/v1/jobs/search?role=backend+developer
 */
async function searchJobs(req, res, next) {
  try {
    const role = (req.query.role || '').trim();

    if (!role) {
      return res.status(400).json({ success: false, message: 'role query parameter is required' });
    }

    const result = await searchAndStoreJobs(role);

    res.json({
      success: true,
      role: result.role,
      totalFetched: result.totalFetched,
      totalSaved: result.totalSaved,
      totalInDb: result.totalInDb,
      jobs: result.jobs.map((job) => ({
        id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        url: job.url,
        postedAt: job.postedAt,
        // don't send the full description in the list — it's large
        descriptionPreview: job.description
          ? job.description.substring(0, 200) + '...'
          : null,
      })),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { searchJobs };
