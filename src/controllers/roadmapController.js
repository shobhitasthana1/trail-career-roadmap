const { generateRoadmap, getRoadmapBySlug, listRoadmaps } = require('../services/roadmapService');

/**
 * GET /api/v1/roadmaps
 * List all available roadmaps (prebuilt + generated).
 */
async function listRoadmapsHandler(req, res, next) {
  try {
    const roadmaps = await listRoadmaps();
    res.json({ success: true, count: roadmaps.length, roadmaps });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/roadmaps/:slug
 * Return a specific roadmap with full nodes and edges.
 */
async function getRoadmapHandler(req, res, next) {
  try {
    const roadmap = await getRoadmapBySlug(req.params.slug);
    if (!roadmap) {
      return res.status(404).json({ success: false, message: `Roadmap "${req.params.slug}" not found. Generate it first.` });
    }
    res.json({ success: true, roadmap });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/roadmaps/generate
 * Body: { role: "Backend Developer" }
 *
 * Generates a roadmap from current market data.
 * Uses cached snapshot if fresh; otherwise triggers analysis.
 */
async function generateRoadmapHandler(req, res, next) {
  try {
    const role = (req.body.role || '').trim();
    if (!role) {
      return res.status(400).json({ success: false, message: 'role is required in request body' });
    }

    console.log(`Generating roadmap for "${role}"...`);
    const roadmap = await generateRoadmap(role);

    res.json({
      success: true,
      roadmap: {
        id: roadmap._id,
        role: roadmap.role,
        slug: roadmap.slug,
        source: roadmap.source,
        totalJobs: roadmap.totalJobs,
        marketAnalyzedAt: roadmap.marketAnalyzedAt,
        nodeCount: roadmap.nodes.length,
        edgeCount: roadmap.edges.length,
      },
      nodes: roadmap.nodes,
      edges: roadmap.edges,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/roadmaps/:slug/export-data
 * Return structured data for frontend PNG/SVG/PDF export.
 */
async function exportRoadmapHandler(req, res, next) {
  try {
    const roadmap = await getRoadmapBySlug(req.params.slug);
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    res.json({
      success: true,
      export: {
        title: roadmap.role,
        source: roadmap.source,
        generatedAt: roadmap.marketAnalyzedAt || roadmap.createdAt,
        totalJobs: roadmap.totalJobs,
        nodes: roadmap.nodes,
        edges: roadmap.edges,
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
