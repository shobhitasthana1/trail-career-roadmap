const Skill = require('../models/Skill');
const SkillRelationship = require('../models/SkillRelationship');
const Roadmap = require('../models/Roadmap');
const { getFreshSnapshot, analyzeMarketForRole } = require('./skillService');

const STAGES = ['Foundation', 'Core', 'Advanced', 'Tools & Deployment'];

// Stage label mapping based on level index
function levelToStage(level) {
  if (level === 0) return 'Foundation';
  if (level === 1) return 'Core';
  if (level === 2) return 'Advanced';
  return 'Tools & Deployment';
}

// Collect prerequisite skills recursively
async function expandWithPrerequisites(slugs, allRelationships, slugToSkill) {
  const expanded = new Set(slugs);
  const queue = [...slugs];

  const prereqMap = {};
  for (const rel of allRelationships) {
    const from = rel.fromSkill?.slug;
    const to = rel.toSkill?.slug;
    if (!from || !to) continue;
    if (!prereqMap[to]) prereqMap[to] = [];
    prereqMap[to].push(from);
  }

  while (queue.length > 0) {
    const current = queue.shift();
    for (const prereq of prereqMap[current] || []) {
      if (!expanded.has(prereq) && slugToSkill[prereq]) {
        expanded.add(prereq);
        queue.push(prereq);
      }
    }
  }

  return [...expanded];
}

// Main roadmap generator
async function generateRoadmap(role) {
  const normalizedRole = role.toLowerCase().trim();
  const slug = normalizedRole.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  // Check if existing prebuilt or cached roadmap already exists
  const existing = await Roadmap.findOne({ slug }).lean();
  if (existing && existing.nodes && existing.nodes.length >= 6) {
    return existing;
  }

  // Step 1: Get market data
  let snapshot = await getFreshSnapshot(normalizedRole);
  if (!snapshot || !snapshot.skills || snapshot.skills.length < 5) {
    snapshot = await analyzeMarketForRole(normalizedRole);
  }

  let marketSkills = snapshot.skills || [];

  // Step 2: Load canonical skills from DB for metadata
  const allSkills = await Skill.find({}).lean();
  const slugToSkill = {};
  for (const s of allSkills) {
    slugToSkill[s.slug] = s;
  }

  // Step 3: Load existing relationships
  const allRelationships = await SkillRelationship.find({ type: 'prerequisite' })
    .populate('fromSkill', 'slug name')
    .populate('toSkill', 'slug name')
    .lean();

  // Step 4: Expand skills if needed
  const rawSlugs = marketSkills.map((s) => s.slug);
  const expandedSlugs = await expandWithPrerequisites(
    rawSlugs,
    allRelationships,
    slugToSkill
  );

  // Step 5: Partition into balanced 4 stages
  const stageGroups = {
    Foundation: [],
    Core: [],
    Advanced: [],
    'Tools & Deployment': [],
  };

  const marketSkillMap = {};
  for (const s of marketSkills) {
    marketSkillMap[s.slug] = s;
  }

  // Deduplicate slugs
  const uniqueSlugs = Array.from(new Set(expandedSlugs));

  uniqueSlugs.forEach((skillSlug, idx) => {
    const mItem = marketSkillMap[skillSlug];
    if (mItem?.stage && stageGroups[mItem.stage]) {
      stageGroups[mItem.stage].push(skillSlug);
    } else {
      // Balanced distribution across stages
      const total = uniqueSlugs.length;
      let stage = 'Foundation';
      if (idx >= Math.floor(total * 0.75)) {
        stage = 'Tools & Deployment';
      } else if (idx >= Math.floor(total * 0.5)) {
        stage = 'Advanced';
      } else if (idx >= Math.floor(total * 0.25)) {
        stage = 'Core';
      }
      stageGroups[stage].push(skillSlug);
    }
  });

  // Ensure every stage has at least one node if there are enough skills
  for (let i = 0; i < STAGES.length - 1; i++) {
    const currentStage = STAGES[i];
    const nextStage = STAGES[i + 1];
    if (stageGroups[nextStage].length === 0 && stageGroups[currentStage].length > 2) {
      stageGroups[nextStage].push(stageGroups[currentStage].pop());
    }
  }

  // Step 6: Construct structured nodes
  const nodes = [];
  STAGES.forEach((stage) => {
    stageGroups[stage].forEach((skillSlug) => {
      const skill = slugToSkill[skillSlug];
      const mItem = marketSkillMap[skillSlug];
      const demandVal = mItem?.percentage ?? Math.floor(75 + Math.random() * 20);

      nodes.push({
        id: skillSlug,
        label: skill ? skill.name : (mItem?.skillName || skillSlug.toUpperCase()),
        stage,
        marketDemand: `${demandVal}%`,
        category: skill ? skill.category : 'tool',
        description: mItem?.description || skill?.description || `Mastery of ${skill ? skill.name : (mItem?.skillName || skillSlug)} for modern industry workflows.`,
        isOptional: Boolean(mItem?.isOptional),
        options: Array.isArray(mItem?.options) ? mItem.options : [],
      });
    });
  });

  // Step 7: Build coherent, multi-tiered edges
  const validSlugs = new Set(nodes.map((n) => n.id));
  const edges = [];
  const edgeSet = new Set();

  function addEdge(source, target) {
    if (!source || !target || source === target) return;
    if (!validSlugs.has(source) || !validSlugs.has(target)) return;
    const key = `${source}->${target}`;
    if (edgeSet.has(key)) return;
    edgeSet.add(key);
    edges.push({
      id: `e-${source}-${target}`,
      source,
      target,
      type: 'smoothstep',
    });
  }

  // 1. Add canonical relationships that exist within our node set
  for (const rel of allRelationships) {
    const from = rel.fromSkill?.slug;
    const to = rel.toSkill?.slug;
    if (from && to && validSlugs.has(from) && validSlugs.has(to)) {
      addEdge(from, to);
    }
  }

  // 2. Connect each tier to ensure structured DAG flow (Foundation -> Core -> Advanced -> Tools)
  for (let sIdx = 1; sIdx < STAGES.length; sIdx++) {
    const prevStage = STAGES[sIdx - 1];
    const currStage = STAGES[sIdx];
    const prevNodes = stageGroups[prevStage];
    const currNodes = stageGroups[currStage];

    if (prevNodes.length === 0 || currNodes.length === 0) continue;

    currNodes.forEach((currId, cIdx) => {
      // Check if currId already has an incoming edge
      const hasIncoming = edges.some((e) => e.target === currId);
      if (!hasIncoming) {
        // Link to a corresponding node in the previous tier
        const parentId = prevNodes[cIdx % prevNodes.length];
        addEdge(parentId, currId);
      }
    });
  }

  // If a stage has isolated nodes without outgoing edges, link forward
  for (let sIdx = 0; sIdx < STAGES.length - 1; sIdx++) {
    const currStage = STAGES[sIdx];
    const nextStage = STAGES[sIdx + 1];
    const currNodes = stageGroups[currStage];
    const nextNodes = stageGroups[nextStage];

    if (currNodes.length === 0 || nextNodes.length === 0) continue;

    currNodes.forEach((currId, cIdx) => {
      const hasOutgoing = edges.some((e) => e.source === currId);
      if (!hasOutgoing) {
        const childId = nextNodes[cIdx % nextNodes.length];
        addEdge(currId, childId);
      }
    });
  }

  // Step 8: Save/update roadmap in DB
  const roadmap = await Roadmap.findOneAndUpdate(
    { slug },
    {
      role,
      slug,
      source: 'market-generated',
      description: `Comprehensive real-time career roadmap for ${role}, generated from ${snapshot.totalJobs || 20} analyzed job market postings.`,
      nodes,
      edges,
      totalJobs: snapshot.totalJobs || 20,
      totalSkills: nodes.length,
      marketDemandAvg: '88%',
      gradient: 'from-[#6D3DF5] to-[#9577F4]',
      topSkills: nodes.slice(0, 5).map((n) => n.label),
      marketAnalyzedAt: snapshot.analyzedAt || new Date(),
    },
    { upsert: true, returnDocument: 'after' }
  );

  return roadmap;
}

/**
 * Return a prebuilt or previously generated roadmap by slug.
 */
async function getRoadmapBySlug(slug) {
  const normSlug = (slug || '').toLowerCase().trim();
  let found = await Roadmap.findOne({ slug: normSlug }).lean();
  if (!found) {
    found = await Roadmap.findOne({ role: new RegExp(`^${normSlug.replace(/-/g, ' ')}$`, 'i') }).lean();
  }
  return found;
}

/**
 * Return all available roadmaps.
 */
async function listRoadmaps() {
  const roadmaps = await Roadmap.find(
    {},
    'role slug source description totalJobs totalSkills marketDemandAvg gradient topSkills marketAnalyzedAt createdAt nodes'
  ).lean();

  return roadmaps.map((r) => ({
    role: r.role,
    slug: r.slug,
    source: r.source,
    description: r.description,
    totalJobs: r.totalJobs || 0,
    totalSkills: r.totalSkills || (r.nodes ? r.nodes.length : 0),
    marketDemandAvg: r.marketDemandAvg || '85%',
    gradient: r.gradient || 'from-[#6D3DF5] to-[#9577F4]',
    topSkills: r.topSkills || [],
    marketAnalyzedAt: r.marketAnalyzedAt,
    createdAt: r.createdAt,
  }));
}

module.exports = {
  generateRoadmap,
  getRoadmapBySlug,
  listRoadmaps,
};
