const Skill = require('../models/Skill');
const JobPosting = require('../models/JobPosting');
const MarketSnapshot = require('../models/MarketSnapshot');
const { extractSkillsFromDescription } = require('./llmService');

// ── Normalization ─────────────────────────────────────────────────────────────

let skillCache = null; // in-memory cache so we don't re-query for every job

async function loadSkillCache() {
  if (skillCache) return skillCache;
  const skills = await Skill.find({}).lean();
  skillCache = skills;
  return skillCache;
}

/**
 * Given a raw skill string (e.g. "NodeJS", "node js", "React.js"),
 * return the canonical Skill document, or null if not found.
 *
 * Matching order:
 *  1. Exact canonical name match (case-insensitive)
 *  2. Alias match (case-insensitive)
 */
async function normalizeSkill(rawName) {
  const skills = await loadSkillCache();
  const needle = rawName.toLowerCase().trim();

  for (const skill of skills) {
    if (skill.name.toLowerCase() === needle) return skill;
    if (skill.aliases.some((a) => a.toLowerCase() === needle)) return skill;
  }

  return null; // unknown skill — not in our canonical set
}

// ── Market analysis ───────────────────────────────────────────────────────────

/**
 * Delay helper to stay within Gemini free-tier rate limit (15 req/min).
 * We wait 4 seconds between LLM calls → ~15 calls/min maximum.
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Main function called by the controller.
 *
 * 1. Load all stored job postings for the role
 * 2. For each unprocessed posting, call Gemini to extract skills
 * 3. Normalize skill names against our canonical Skill collection
 * 4. Count how many postings mention each canonical skill
 * 5. Calculate demand percentage = count / totalJobs * 100
 * 6. Save a MarketSnapshot
 * 7. Return the snapshot
 */
async function analyzeMarketForRole(role) {
  const normalizedRole = role.toLowerCase().trim();

  // Reload skill cache fresh for each analysis
  skillCache = null;

  const postings = await JobPosting.find({ role: normalizedRole }).lean();

  if (postings.length === 0) {
    throw new Error(`No job postings found for role "${role}". Run a job search first.`);
  }

  console.log(`Analyzing ${postings.length} job postings for "${role}"...`);

  // skill slug → count of postings that mention it
  const skillCounts = {};
  let processed = 0;

  for (const posting of postings) {
    if (!posting.description) continue;

    // Skip if already extracted (isProcessed flag)
    let extractedSkills = posting.extractedSkills || [];

    if (!posting.isProcessed || extractedSkills.length === 0) {
      // Rate-limit: wait 4s between calls (stays under 15 RPM)
      if (processed > 0) await delay(4000);

      console.log(`  Extracting skills from posting ${processed + 1}/${postings.length}...`);
      extractedSkills = await extractSkillsFromDescription(posting.description);

      // Save extracted skills back to the posting
      await JobPosting.findByIdAndUpdate(posting._id, {
        extractedSkills,
        isProcessed: true,
      });
    }

    // Normalize each extracted skill and count it (once per posting)
    const seenInThisPosting = new Set();

    for (const rawSkill of extractedSkills) {
      const canonical = await normalizeSkill(rawSkill);
      if (!canonical) continue; // unknown skill, skip

      if (seenInThisPosting.has(canonical.slug)) continue; // count each skill once per posting
      seenInThisPosting.add(canonical.slug);

      skillCounts[canonical.slug] = (skillCounts[canonical.slug] || 0) + 1;
    }

    processed++;
  }

  const totalJobs = postings.length;

  // Build sorted skills array (highest demand first)
  const skillsArray = Object.entries(skillCounts)
    .map(([slug, count]) => {
      const skill = skillCache.find((s) => s.slug === slug);
      return {
        skillName: skill ? skill.name : slug,
        slug,
        count,
        percentage: Math.round((count / totalJobs) * 100),
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  // Save the snapshot
  const snapshot = await MarketSnapshot.create({
    role: normalizedRole,
    totalJobs,
    source: 'adzuna',
    skills: skillsArray,
    analyzedAt: new Date(),
  });

  console.log(`  ✓ Market snapshot saved: ${skillsArray.length} skills found`);

  return snapshot;
}

/**
 * Check if a fresh snapshot already exists (within last 24 hours).
 * Returns the snapshot if fresh, null if stale/missing.
 */
async function getFreshSnapshot(role) {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return MarketSnapshot.findOne({
    role: role.toLowerCase().trim(),
    analyzedAt: { $gte: oneDayAgo },
  })
    .sort({ analyzedAt: -1 })
    .lean();
}

module.exports = { analyzeMarketForRole, getFreshSnapshot, normalizeSkill };
