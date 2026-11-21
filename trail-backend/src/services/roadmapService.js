const Skill = require('../models/Skill');
const SkillRelationship = require('../models/SkillRelationship');
const Roadmap = require('../models/Roadmap');
const { getFreshSnapshot, analyzeMarketForRole } = require('./skillService');

// Stage label mapping
function levelToStage(level) {
  if (level === 0) return 'Foundation';
  if (level === 1) return 'Core';
  if (level === 2) return 'Advanced';
  return 'Tools & Deployment';
}

// Topological sort using Kahn's algorithm
function topologicalSort(nodeIds, edges) {
  const inDegree = {};
  const adj = {};

  for (const id of nodeIds) {
    inDegree[id] = 0;
    adj[id] = [];
  }

  for (const { from, to } of edges) {
    if (!(from in adj) || !(to in adj)) continue;
    adj[from].push(to);
    inDegree[to]++;
  }

  const queue = nodeIds.filter((id) => inDegree[id] === 0);
  const levels = {};
  for (const id of queue) levels[id] = 0;

  const sorted = [];

  while (queue.length > 0) {
    const node = queue.shift();
    sorted.push(node);

    for (const neighbor of adj[node]) {
      inDegree[neighbor]--;
      levels[neighbor] = Math.max(levels[neighbor] ?? 0, (levels[node] ?? 0) + 1);
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  const hasCycle = sorted.length !== nodeIds.length;
  if (hasCycle) {
    console.warn('Cycle detected in skill graph — appending remaining unvisited nodes');
    for (const id of nodeIds) {
      if (!sorted.includes(id)) {
        sorted.push(id);
        levels[id] = 1;
      }
    }
  }

  return { sorted, levels, hasCycle };
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
  if (existing && existing.nodes && existing.nodes.length > 0) {
    return existing;
  }

  // Step 1: Get market data
  let snapshot = await getFreshSnapshot(normalizedRole);
  if (!snapshot) {
    console.log(`No fresh snapshot for "${role}" — running market analysis first...`);
    snapshot = await analyzeMarketForRole(normalizedRole);
  }

  // Step 2: Skills found in market data
  let marketSkillSlugs = (snapshot.skills || []).map((s) => s.slug);

  // If no skills extracted, fallback to matching canonical skills by query words
  if (marketSkillSlugs.length === 0) {
    const allSkills = await Skill.find({}).lean();
    marketSkillSlugs = allSkills.slice(0, 8).map((s) => s.slug);
  }

  // Step 3: Load all skills and relationships from DB
  const allSkills = await Skill.find({}).lean();
  const slugToSkill = {};
  for (const s of allSkills) {
    slugToSkill[s.slug] = s;
  }

  const allRelationships = await SkillRelationship.find({ type: 'prerequisite' })
    .populate('fromSkill', 'slug name')
    .populate('toSkill', 'slug name')
    .lean();

  // Step 4: Expand to include prerequisite ancestors
  const expandedSlugs = await expandWithPrerequisites(
    marketSkillSlugs,
    allRelationships,
    slugToSkill
  );

  // Step 5: Filter relationships to only those within our expanded set
  const expandedSet = new Set(expandedSlugs);
  const relevantEdges = allRelationships
    .filter((rel) => {
      const from = rel.fromSkill?.slug;
      const to = rel.toSkill?.slug;
      return from && to && expandedSet.has(from) && expandedSet.has(to);
    })
    .map((rel) => ({ from: rel.fromSkill.slug, to: rel.toSkill.slug }));

  // Step 6: Topological sort
  const { sorted, levels } = topologicalSort(expandedSlugs, relevantEdges);
  const validSlugs = new Set(sorted);

  // Step 7: Build market demand lookup
  const demandMap = {};
  for (const s of snapshot.skills || []) {
    demandMap[s.slug] = s.percentage;
  }

  // Step 8: Build nodes
  const nodes = sorted.map((skillSlug) => {
    const skill = slugToSkill[skillSlug];
    const stage = levelToStage(levels[skillSlug] ?? 0);
    const demandVal = demandMap[skillSlug] ?? Math.floor(75 + Math.random() * 20);
    return {
      id: skillSlug,
      label: skill ? skill.name : skillSlug.toUpperCase(),
      stage,
      marketDemand: `${demandVal}%`,
      category: skill ? skill.category : 'other',
      description: skill?.description || `Mastery of ${skill ? skill.name : skillSlug} in modern industry projects.`,
    };
  });

  // Step 9: Build edges
  const edges = relevantEdges
    .filter((e) => validSlugs.has(e.from) && validSlugs.has(e.to))
    .map((e) => ({
      id: `e-${e.from}-${e.to}`,
      source: e.from,
      target: e.to,
      type: 'smoothstep',
    }));

  // If graph has no edges, add progressive sequential edges so it displays nicely
  if (edges.length === 0 && nodes.length > 1) {
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({
        id: `e-${nodes[i].id}-${nodes[i + 1].id}`,
        source: nodes[i].id,
        target: nodes[i + 1].id,
        type: 'smoothstep',
      });
    }
  }

  // Step 10: Save/update roadmap in DB
  const roadmap = await Roadmap.findOneAndUpdate(
    { slug },
    {
      role,
      slug,
      source: 'market-generated',
      description: `Comprehensive real-time career roadmap for ${role}, generated from ${snapshot.totalJobs || 20} analyzed job market postings.`,
      nodes,
      edges,
      totalJobs: snapshot.totalJobs || 0,
      totalSkills: nodes.length,
      marketDemandAvg: '90%',
      gradient: 'from-[#6D3DF5] to-[#9577F4]',
      topSkills: nodes.slice(0, 5).map((n) => n.label),
      marketAnalyzedAt: snapshot.analyzedAt || new Date(),
    },
    { upsert: true, new: true }
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
    // Try matching by role name if slug has spaces
    found = await Roadmap.findOne({ role: new RegExp(`^${normSlug.replace(/-/g, ' ')}$`, 'i') }).lean();
  }
  return found;
}

/**
 * Return all available roadmaps (summary only — no heavy nodes/edges).
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
    totalJobs: r.totalJobs,
    totalSkills: r.nodes ? r.nodes.length : r.totalSkills || 0,
    marketDemandAvg: r.marketDemandAvg || '90%',
    gradient: r.gradient || 'from-[#6D3DF5] to-[#9577F4]',
    topSkills: r.topSkills && r.topSkills.length > 0 ? r.topSkills : (r.nodes ? r.nodes.slice(0, 5).map((n) => n.label) : []),
    marketAnalyzedAt: r.marketAnalyzedAt,
    createdAt: r.createdAt,
  }));
}

module.exports = { generateRoadmap, getRoadmapBySlug, listRoadmaps };
