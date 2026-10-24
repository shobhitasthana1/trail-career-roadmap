const Roadmap = require('../models/Roadmap');
const Progress = require('../models/Progress');
const User = require('../models/User');

/**
 * POST /api/v1/roadmaps/:slug/save
 * Save a roadmap to the user's collection.
 * Creates a Progress record initialised to not_started for every node.
 */
async function saveRoadmap(req, res, next) {
  try {
    const roadmap = await Roadmap.findOne({ slug: req.params.slug }).lean();
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    // Check if already saved (progress record exists)
    const existing = await Progress.findOne({ user: req.user.id, roadmap: roadmap._id });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Roadmap already saved' });
    }

    // Initialise every skill node as not_started
    const skills = roadmap.nodes.map((node) => ({
      skillId: node.id,
      status: 'not_started',
    }));

    const progress = await Progress.create({
      user: req.user.id,
      roadmap: roadmap._id,
      skills,
      completionPercentage: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Roadmap saved',
      progressId: progress._id,
      totalSkills: skills.length,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/roadmaps/:slug/save
 * Remove a saved roadmap (deletes the progress record).
 */
async function unsaveRoadmap(req, res, next) {
  try {
    const roadmap = await Roadmap.findOne({ slug: req.params.slug }).lean();
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    const deleted = await Progress.findOneAndDelete({ user: req.user.id, roadmap: roadmap._id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Roadmap was not saved' });
    }

    res.json({ success: true, message: 'Roadmap removed from saved list' });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/roadmaps/saved
 * List all roadmaps the authenticated user has saved.
 */
async function getSavedRoadmaps(req, res, next) {
  try {
    const progressRecords = await Progress.find({ user: req.user.id })
      .populate('roadmap', 'role slug source totalJobs marketAnalyzedAt')
      .lean();

    const saved = progressRecords.map((p) => ({
      progressId: p._id,
      completionPercentage: p.completionPercentage,
      roadmap: p.roadmap,
    }));

    res.json({ success: true, count: saved.length, saved });
  } catch (err) {
    next(err);
  }
}

module.exports = { saveRoadmap, unsaveRoadmap, getSavedRoadmaps };
