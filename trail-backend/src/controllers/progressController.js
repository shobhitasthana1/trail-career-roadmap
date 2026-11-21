const Progress = require('../models/Progress');
const Roadmap = require('../models/Roadmap');

const VALID_STATUSES = ['not_started', 'in_progress', 'completed'];

/**
 * GET /api/v1/progress/:roadmapSlug
 * Get the user's progress for a specific roadmap.
 */
async function getProgress(req, res, next) {
  try {
    const roadmap = await Roadmap.findOne({ slug: req.params.roadmapSlug }).lean();
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    const progress = await Progress.findOne({ user: req.user.id, roadmap: roadmap._id }).lean();
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'No progress found. Save this roadmap first.',
      });
    }

    res.json({
      success: true,
      roadmapSlug: req.params.roadmapSlug,
      completionPercentage: progress.completionPercentage,
      skills: progress.skills,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/v1/progress/:roadmapSlug/skills/:skillId
 * Body: { "status": "completed" | "in_progress" | "not_started" }
 *
 * Update the status of a single skill.
 * Backend recalculates completionPercentage — never trusted from the client.
 */
async function updateSkillStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `status must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const roadmap = await Roadmap.findOne({ slug: req.params.roadmapSlug }).lean();
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    const progress = await Progress.findOne({ user: req.user.id, roadmap: roadmap._id });
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'No progress found. Save this roadmap first.',
      });
    }

    // Find the skill entry
    const skillEntry = progress.skills.find((s) => s.skillId === req.params.skillId);
    if (!skillEntry) {
      return res.status(404).json({
        success: false,
        message: `Skill "${req.params.skillId}" not found in this roadmap`,
      });
    }

    // Update status
    skillEntry.status = status;

    // Recalculate completion percentage (server-side only)
    const completed = progress.skills.filter((s) => s.status === 'completed').length;
    progress.completionPercentage = Math.round((completed / progress.skills.length) * 100);

    await progress.save();

    res.json({
      success: true,
      skillId: req.params.skillId,
      status,
      completionPercentage: progress.completionPercentage,
      completedCount: completed,
      totalCount: progress.skills.length,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProgress, updateSkillStatus };
