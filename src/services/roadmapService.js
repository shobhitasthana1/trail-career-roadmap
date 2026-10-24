const Skill = require('../models/Skill');
const SkillRelationship = require('../models/SkillRelationship');
const Roadmap = require('../models/Roadmap');
const { getFreshSnapshot, analyzeMarketForRole } = require('./skillService');

// ── Stage labels ──────────────────────────────────────────────────────────────
function levelToStage(level) {
  if (level === 0) return 'Foundation';
  if (level === 1) return 'Core';
  if (level === 2) return 'Intermediate';
  return 'Advanced';
}

// ── Topological sort (Kahn's algorithm) ───────────────────────────────────────
/**
 * @param {string[]} nodeIds   - array of skill slugs
 * @param {Array}    edges     - array of { from, to } prerequisite pairs
 * @returns {{ sorted: string[], levels: Object, hasCycle: boolean }}
 *
 * levels[slug] = the depth of that node in the DAG (0 = no prerequisites)
 * hasCycle = true if a cycle was detected (that subgraph is excluded)
 */
function topologicalSort(nodeIds, edges) {
  const inDegree = {};
  const adj = {};

  for (const id of nodeIds) {
    inDegree[id] = 0;
    adj[id] = [];
  }

  for (const { from, to } of edges) {
    if (!(from in adj) || !(to in adj)) continue; // skip edges to unknown nodes
    adj[from].push(to);
    inDegree[to]++;
  }

  // All nodes with no prerequisites start in the queue
  const queue = nodeIds.filter((id) => inDegree[id] === 0);
  const levels = {};
  for (const id of queue) levels[id] = 0;

  const sorted = [];

  while (queue.length > 0) {
    const node = queue.shift();
    sorted.push(node);

    for (const neighbor of adj[node]) {
      inDegree[neighbor]--;
      levels[neighbor] = Math.max(levels[neighbor] ?? 0, levels[node] + 1);
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  const hasCycle = sorted.length !== nodeIds.length;

  if (hasCycle) {
    console.warn('Cycle detected in skill graph — cyclic nodes will be excluded.');
  }

  return { sorted, levels, hasCycle };
}

// ── Collect prerequisite skills recursively ───────────────────────────────────
/**
 * Given a set of target skill slugs, walk UP the prerequisite graph
 * and collect all ancestor skills too.
 *
 * e.g. if "react" is a target, we also include "javascript" and "html"
 * even if they weren't in the market data.
 */
async function expandWithPrerequisites(slugs, allRelationships, slugToSkill) {
  const expanded = new Set(slugs);
  const queue = [...slugs];

  // Build a reverse map: toSlug → [fromSlug] (prerequisite lookup)
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

// ── Main roadmap generator ────────────────────────────────────────────────────
/**
 * Generate a roadmap for a given role.
 *
 * Flow:
 * 1. Get the latest market snapshot (or trigger analysis)
 * 2. Collect relevant skills from market data
 * 3. Expand with prerequisite ancestors
 * 4. Load prerequisite relationships between those skills
 * 5. Topological sort
 * 6. Build nodes (with market demand) and edges
 * 7. Save to Roadmap collection and return
 */
async function generateRoadmap(role) {
  const normalizedRole = role.toLowerCase().trim();

  // Step 1: Get market data
  let snapshot = await getFreshSnapshot(normalizedRole);
  if (!snapshot) {
    console.log(`No fresh snapshot for "${role}" — running market analysis first...`);
    snapshot = await analyzeMarketForRole(normalizedRole);
  }

  // Step 2: Start with skills found in market data
  const marketSkillSlugs = snapshot.skills.map((s) => s.slug);

  if (marketSkillSlugs.length === 0) {
    throw new Error(`No recognized skills found in market data for "${role}". The job descriptions may not match our skill library.`);
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
  const { sorted, levels, hasCycle } = topologicalSort(expandedSlugs, relevantEdges);

  // Only keep skills that made it through the sort (excludes cyclic nodes)
  const validSlugs = new Set(sorted);

  // Step 7: Build market demand lookup
  const demandMap = {};
  for (const s of snapshot.skills) {
    demandMap[s.slug] = s.percentage;
  }

  // Step 8: Build nodes
  const nodes = sorted.map((slug) => {
    const skill = slugToSkill[slug];
    const stage = levelToStage(levels[slug] ?? 0);
    return {
      id: slug,
      label: skill ? skill.name : slug,
      stage,
      marketDemand: demandMap[slug] ?? 0,
      category: skill ? skill.category : 'other',
      description: skill?.description || '',
    };
  });

  // Step 9: Build edges (only between valid nodes)
  const edges = relevantEdges
    .filter((e) => validSlugs.has(e.from) && validSlugs.has(e.to))
    .map((e) => ({
      id: `${e.from}-${e.to}`,
      source: e.from,
      target: e.to,
      type: 'prerequisite',
    }));

  const slug = normalizedRole.replace(/\s+/g, '-');

  // Step 10: Save/update roadmap in DB
  const roadmap = await Roadmap.findOneAndUpdate(
    { slug, source: 'market-generated' },
    {
      role,
      slug,
      source: 'market-generated',
      nodes,
      edges,
      totalJobs: snapshot.totalJobs,
      marketAnalyzedAt: snapshot.analyzedAt,
    },
    { upsert: true, new: true }
  );

  return roadmap;
}

/**
 * Return a prebuilt or previously generated roadmap by slug.
 */
async function getRoadmapBySlug(slug) {
  return Roadmap.findOne({ slug }).lean();
}

/**
 * Return all available roadmaps (summary only — no nodes/edges).
 */
async function listRoadmaps() {
  return Roadmap.find({}, 'role slug source totalJobs marketAnalyzedAt createdAt').lean();
}

module.exports = { generateRoadmap, getRoadmapBySlug, listRoadmaps };
