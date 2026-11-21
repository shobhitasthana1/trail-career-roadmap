const Resource = require('../models/Resource');
const Skill = require('../models/Skill');

/**
 * GET /api/v1/resources?skillSlug=nodejs
 * List resources, optionally filtered by skill slug.
 */
async function listResources(req, res, next) {
  try {
    const { skillSlug } = req.query;
    let filter = {};

    if (skillSlug) {
      const skill = await Skill.findOne({ slug: skillSlug }).lean();
      if (!skill) {
        return res.status(404).json({ success: false, message: `Skill "${skillSlug}" not found` });
      }
      filter.skill = skill._id;
    }

    const resources = await Resource.find(filter)
      .populate('skill', 'name slug')
      .sort({ isFree: -1, type: 1 })
      .lean();

    res.json({ success: true, count: resources.length, resources });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/resources/:id
 * Get a single resource by ID.
 */
async function getResource(req, res, next) {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('skill', 'name slug')
      .lean();

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    res.json({ success: true, resource });
  } catch (err) {
    next(err);
  }
}

module.exports = { listResources, getResource };
