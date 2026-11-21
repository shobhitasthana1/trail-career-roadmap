const { generateRoadmap, getRoadmapBySlug, listRoadmaps } = require('../services/roadmapService');

// Return all available roadmaps
async function listRoadmapsHandler(req, res, next) {
  try {
    const roadmaps = await listRoadmaps();
    res.json({ success: true, count: roadmaps.length, roadmaps });
  } catch (err) {
    next(err);
  }
}

// Return roadmap nodes and edges by slug
async function getRoadmapHandler(req, res, next) {
  try {
    const slug = (req.params.slug || '').toLowerCase().trim();
    const roadmap = await getRoadmapBySlug(slug);
    if (!roadmap) {
      return res.status(404).json({ success: false, message: `Roadmap "${slug}" not found. Generate it first.` });
    }

    const nodes = roadmap.nodes || [];
    const edges = roadmap.edges || [];

    res.json({
      success: true,
      roadmap: {
        id: roadmap._id,
        role: roadmap.role,
        slug: roadmap.slug,
        source: roadmap.source,
        description: roadmap.description,
        totalJobs: roadmap.totalJobs || 0,
        totalSkills: nodes.length,
        marketDemandAvg: roadmap.marketDemandAvg || '',
        gradient: roadmap.gradient || '',
        topSkills: roadmap.topSkills || [],
        marketAnalyzedAt: roadmap.marketAnalyzedAt,
        nodeCount: nodes.length,
        edgeCount: edges.length,
      },
      nodes,
      edges,
    });
  } catch (err) {
    next(err);
  }
}

// Generate a roadmap on the fly from market data
async function generateRoadmapHandler(req, res, next) {
  try {
    const role = (req.body.role || '').trim();
    if (!role) {
      return res.status(400).json({ success: false, message: 'role is required in request body' });
    }

    console.log(`Generating roadmap for "${role}"...`);
    const roadmap = await generateRoadmap(role);

    const nodes = roadmap.nodes || [];
    const edges = roadmap.edges || [];

    res.json({
      success: true,
      roadmap: {
        id: roadmap._id,
        role: roadmap.role,
        slug: roadmap.slug,
        source: roadmap.source,
        description: roadmap.description,
        totalJobs: roadmap.totalJobs,
        totalSkills: nodes.length,
        marketDemandAvg: roadmap.marketDemandAvg,
        gradient: roadmap.gradient,
        topSkills: roadmap.topSkills,
        marketAnalyzedAt: roadmap.marketAnalyzedAt,
        nodeCount: nodes.length,
        edgeCount: edges.length,
      },
      nodes,
      edges,
    });
  } catch (err) {
    next(err);
  }
}

// Export formatted roadmap payload for sharing or download
async function exportRoadmapHandler(req, res, next) {
  try {
    const slug = (req.params.slug || '').toLowerCase().trim();
    const roadmap = await getRoadmapBySlug(slug);
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    const nodes = roadmap.nodes || [];
    const edges = roadmap.edges || [];

    res.json({
      success: true,
      export: {
        title: roadmap.role,
        slug: roadmap.slug,
        source: roadmap.source,
        description: roadmap.description,
        generatedAt: roadmap.marketAnalyzedAt || roadmap.createdAt || new Date().toISOString(),
        totalJobs: roadmap.totalJobs,
        nodes,
        edges,
      },
      data: {
        roadmap: {
          role: roadmap.role,
          slug: roadmap.slug,
          source: roadmap.source,
          description: roadmap.description,
        },
        nodes,
        edges,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listRoadmapsHandler,
  getRoadmapHandler,
  generateRoadmapHandler,
  exportRoadmapHandler,
};
