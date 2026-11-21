const Resource = require('../models/Resource');
const Skill = require('../models/Skill');
const User = require('../models/User');

// Query resources with optional category, type, and search filters
async function listResources(req, res, next) {
  try {
    const { skillSlug, category, type, difficulty, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (type && type !== 'All') {
      filter.type = new RegExp(`^${type}$`, 'i');
    }

    if (difficulty && difficulty !== 'All') {
      filter.difficulty = new RegExp(`^${difficulty}$`, 'i');
    }

    if (skillSlug) {
      const skill = await Skill.findOne({ slug: skillSlug.toLowerCase() }).lean();
      if (skill) {
        filter.$or = [
          { skill: skill._id },
          { skills: new RegExp(skill.name, 'i') },
          { skills: new RegExp(skill.slug, 'i') },
        ];
      } else {
        filter.skills = new RegExp(skillSlug, 'i');
      }
    }

    if (search && search.trim()) {
      const queryRegex = new RegExp(search.trim(), 'i');
      const searchConditions = [
        { title: queryRegex },
        { provider: queryRegex },
        { description: queryRegex },
        { skills: queryRegex },
      ];

      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    const resources = await Resource.find(filter)
      .populate('skill', 'name slug')
      .sort({ createdAt: -1 })
      .lean();

    const formatted = resources.map((r) => ({
      id: r.resourceId || r._id.toString(),
      _id: r._id,
      title: r.title,
      provider: r.provider || '',
      url: r.url,
      description: r.description || '',
      category: r.category || 'General',
      skills: r.skills || [],
      type: r.type || 'Docs',
      difficulty: r.difficulty || 'Beginner',
      isFree: r.isFree !== false,
    }));

    res.json({ success: true, count: formatted.length, resources: formatted });
  } catch (err) {
    next(err);
  }
}

// Fetch single resource by ID
async function getResource(req, res, next) {
  try {
    const { id } = req.params;
    let resource = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      resource = await Resource.findById(id).populate('skill', 'name slug').lean();
    }
    if (!resource) {
      resource = await Resource.findOne({ resourceId: id }).populate('skill', 'name slug').lean();
    }

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    res.json({
      success: true,
      resource: {
        id: resource.resourceId || resource._id.toString(),
        _id: resource._id,
        title: resource.title,
        provider: resource.provider || '',
        url: resource.url,
        description: resource.description || '',
        category: resource.category || 'General',
        skills: resource.skills || [],
        type: resource.type || 'Docs',
        difficulty: resource.difficulty || 'Beginner',
        isFree: resource.isFree !== false,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Fetch list of bookmarked resource IDs for user
async function getBookmarks(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('bookmarkedResources').lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, bookmarkedIds: user.bookmarkedResources || [] });
  } catch (err) {
    next(err);
  }
}

// Toggle a bookmark on or off for the user
async function toggleBookmark(req, res, next) {
  try {
    const { resourceId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.bookmarkedResources) user.bookmarkedResources = [];
    const idx = user.bookmarkedResources.indexOf(resourceId);
    let isBookmarked = false;

    if (idx > -1) {
      user.bookmarkedResources.splice(idx, 1);
      isBookmarked = false;
    } else {
      user.bookmarkedResources.push(resourceId);
      isBookmarked = true;
    }

    await user.save();

    res.json({
      success: true,
      isBookmarked,
      bookmarkedIds: user.bookmarkedResources,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listResources, getResource, getBookmarks, toggleBookmark };
