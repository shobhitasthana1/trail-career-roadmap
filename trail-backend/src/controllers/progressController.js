const Progress = require('../models/Progress');
const Roadmap = require('../models/Roadmap');

const VALID_STATUSES = ['not_started', 'in_progress', 'completed', 'not-started', 'in-progress'];

function normalizeStatus(st) {
  if (!st) return 'not_started';
  return st.replace('-', '_');
}

function denormalizeStatus(st) {
  if (!st) return 'not-started';
  return st.replace('_', '-');
}

// Get user progress details for a roadmap
async function getProgress(req, res, next) {
  try {
    const roadmapSlug = (req.params.roadmapSlug || '').toLowerCase().trim();
    const roadmap = await Roadmap.findOne({ slug: roadmapSlug }).lean();
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

    const removedSet = new Set(progress.removedSkills || []);
    const activeSkills = (progress.skills || [])
      .filter((s) => !removedSet.has(s.skillId))
      .map((s) => ({
        skillId: s.skillId,
        status: denormalizeStatus(s.status),
      }));

    const skillsMap = {};
    activeSkills.forEach((s) => {
      skillsMap[s.skillId] = s.status;
    });

    const completed = activeSkills.filter((s) => s.status === 'completed').map((s) => s.skillId);
    const inProgress = activeSkills.filter((s) => s.status === 'in-progress').map((s) => s.skillId);
    const notStarted = activeSkills.filter((s) => s.status === 'not-started').map((s) => s.skillId);

    res.json({
      success: true,
      roadmapSlug,
      completionPercentage: progress.completionPercentage,
      progressPct: progress.completionPercentage,
      skills: activeSkills,
      skillsMap,
      completedSkills: completed,
      inProgressSkills: inProgress,
      notStartedSkills: notStarted,
      totalSkills: activeSkills.length,
      removedSkills: progress.removedSkills || [],
    });
  } catch (err) {
    next(err);
  }
}

// Update the learning status of a single skill
async function updateSkillStatus(req, res, next) {
  try {
    const { status } = req.body;
    const roadmapSlug = (req.params.roadmapSlug || '').toLowerCase().trim();
    const skillId = req.params.skillId;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'status must be one of: not-started, in-progress, completed',
      });
    }

    const normalizedStatus = normalizeStatus(status);

    const roadmap = await Roadmap.findOne({ slug: roadmapSlug }).lean();
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    let progress = await Progress.findOne({ user: req.user.id, roadmap: roadmap._id });

    // Auto-create progress record if not started yet
    if (!progress) {
      const skills = (roadmap.nodes || []).map((node) => ({
        skillId: node.id,
        status: node.id === skillId ? normalizedStatus : 'not_started',
      }));

      progress = await Progress.create({
        user: req.user.id,
        roadmap: roadmap._id,
        skills,
        completionPercentage: 0,
      });
    }

    let skillEntry = progress.skills.find((s) => s.skillId === skillId);
    if (!skillEntry) {
      skillEntry = { skillId, status: normalizedStatus };
      progress.skills.push(skillEntry);
    } else {
      skillEntry.status = normalizedStatus;
    }

    if (progress.removedSkills && progress.removedSkills.includes(skillId)) {
      progress.removedSkills = progress.removedSkills.filter((id) => id !== skillId);
    }

    // Recalculate completion percentage over active skills
    const removedSet = new Set(progress.removedSkills || []);
    const activeSkills = progress.skills.filter((s) => !removedSet.has(s.skillId));
    const completed = activeSkills.filter((s) => s.status === 'completed').length;
    progress.completionPercentage = activeSkills.length > 0
      ? Math.round((completed / activeSkills.length) * 100)
      : 0;

    await progress.save();

    res.json({
      success: true,
      skillId,
      status: denormalizeStatus(normalizedStatus),
      completionPercentage: progress.completionPercentage,
      progressPct: progress.completionPercentage,
      completedCount: completed,
      totalCount: activeSkills.length,
    });
  } catch (err) {
    next(err);
  }
}

// Remove a skill node from the user's journey
async function deleteSkillFromProgress(req, res, next) {
  try {
    const roadmapSlug = (req.params.roadmapSlug || '').toLowerCase().trim();
    const skillId = req.params.skillId;

    const roadmap = await Roadmap.findOne({ slug: roadmapSlug }).lean();
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    const progress = await Progress.findOne({ user: req.user.id, roadmap: roadmap._id });
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress not found' });
    }

    if (!progress.removedSkills) progress.removedSkills = [];
    if (!progress.removedSkills.includes(skillId)) {
      progress.removedSkills.push(skillId);
    }

    const removedSet = new Set(progress.removedSkills);
    const activeSkills = progress.skills.filter((s) => !removedSet.has(s.skillId));
    const completed = activeSkills.filter((s) => s.status === 'completed').length;
    progress.completionPercentage = activeSkills.length > 0
      ? Math.round((completed / activeSkills.length) * 100)
      : 0;

    await progress.save();

    res.json({
      success: true,
      message: `Skill ${skillId} removed from journey`,
      slug: roadmapSlug,
      skillId,
      removedSkills: progress.removedSkills,
      completionPercentage: progress.completionPercentage,
    });
  } catch (err) {
    next(err);
  }
}

// Restore a previously hidden skill node
async function restoreSkillToProgress(req, res, next) {
  try {
    const roadmapSlug = (req.params.roadmapSlug || '').toLowerCase().trim();
    const skillId = req.params.skillId;
    const previousStatus = normalizeStatus(req.body.status || 'not_started');

    const roadmap = await Roadmap.findOne({ slug: roadmapSlug }).lean();
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    const progress = await Progress.findOne({ user: req.user.id, roadmap: roadmap._id });
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress not found' });
    }

    if (progress.removedSkills) {
      progress.removedSkills = progress.removedSkills.filter((id) => id !== skillId);
    }

    let skillEntry = progress.skills.find((s) => s.skillId === skillId);
    if (!skillEntry) {
      progress.skills.push({ skillId, status: previousStatus });
    } else {
      skillEntry.status = previousStatus;
    }

    const removedSet = new Set(progress.removedSkills || []);
    const activeSkills = progress.skills.filter((s) => !removedSet.has(s.skillId));
    const completed = activeSkills.filter((s) => s.status === 'completed').length;
    progress.completionPercentage = activeSkills.length > 0
      ? Math.round((completed / activeSkills.length) * 100)
      : 0;

    await progress.save();

    res.json({
      success: true,
      message: `Skill ${skillId} restored to journey`,
      slug: roadmapSlug,
      skillId,
      status: denormalizeStatus(previousStatus),
      removedSkills: progress.removedSkills,
      completionPercentage: progress.completionPercentage,
    });
  } catch (err) {
    next(err);
  }
}

// Reset all skills back to default visibility
async function resetSkillsProgress(req, res, next) {
  try {
    const roadmapSlug = (req.params.roadmapSlug || '').toLowerCase().trim();
    const roadmap = await Roadmap.findOne({ slug: roadmapSlug }).lean();
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    const progress = await Progress.findOne({ user: req.user.id, roadmap: roadmap._id });
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress not found' });
    }

    progress.removedSkills = [];
    const completed = progress.skills.filter((s) => s.status === 'completed').length;
    progress.completionPercentage = progress.skills.length > 0
      ? Math.round((completed / progress.skills.length) * 100)
      : 0;

    await progress.save();

    res.json({
      success: true,
      message: `All skills restored for ${roadmapSlug}`,
      slug: roadmapSlug,
      removedSkills: [],
      completionPercentage: progress.completionPercentage,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProgress,
  updateSkillStatus,
  deleteSkillFromProgress,
  restoreSkillToProgress,
  resetSkillsProgress,
};
