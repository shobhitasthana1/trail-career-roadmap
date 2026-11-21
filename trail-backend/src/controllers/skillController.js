const Skill = require('../models/Skill');
const SkillRelationship = require('../models/SkillRelationship');
const { analyzeMarketForRole, getFreshSnapshot } = require('../services/skillService');

// Role definitions — which skills are relevant for each role
// A role matches if the user has skills that overlap with this set
const ROLE_SKILL_MAP = {
  'Frontend Developer': ['html', 'css', 'javascript', 'typescript', 'react', 'vuejs', 'angular', 'tailwindcss'],
  'Backend Developer': ['nodejs', 'expressjs', 'nestjs', 'java', 'spring-boot', 'python', 'django', 'fastapi', 'flask', 'csharp', 'dotnet', 'php', 'laravel', 'rest-apis', 'graphql', 'mongodb', 'postgresql', 'mysql', 'redis'],
  'Full Stack Developer': ['html', 'css', 'javascript', 'react', 'nodejs', 'expressjs', 'mongodb', 'postgresql', 'rest-apis'],
  'Data Analyst': ['python', 'sql', 'pandas', 'numpy', 'data-visualization', 'postgresql', 'mysql'],
  'Data Scientist': ['python', 'pandas', 'numpy', 'machine-learning', 'data-visualization', 'sql'],
  'DevOps Engineer': ['linux', 'docker', 'kubernetes', 'ci-cd', 'aws', 'azure', 'gcp', 'terraform', 'git'],
};

/**
 * POST /api/v1/skills/role-match
 * Body: { "skills": ["javascript", "react", "nodejs", "mongodb"] }
 *
 * Returns roles sorted by how well the user's skills match, with a percentage.
 */
async function roleMatch(req, res, next) {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ success: false, message: 'skills must be a non-empty array of skill slugs' });
    }

    const userSkillSet = new Set(skills.map((s) => s.toLowerCase().trim()));

    const matches = Object.entries(ROLE_SKILL_MAP).map(([role, roleSkills]) => {
      const overlap = roleSkills.filter((s) => userSkillSet.has(s));
      const matchPercentage = Math.round((overlap.length / roleSkills.length) * 100);
      return {
        role,
        slug: role.toLowerCase().replace(/\s+/g, '-'),
        matchPercentage,
        matchedSkills: overlap,
        totalRoleSkills: roleSkills.length,
      };
    });

    // Sort by match percentage descending
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Only return roles with at least some overlap
    const relevant = matches.filter((m) => m.matchPercentage > 0);

    res.json({
      success: true,
      inputSkills: [...userSkillSet],
      matches: relevant,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/skills
 * List all canonical skills.
 */
async function listSkills(req, res, next) {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const skills = await Skill.find(filter).select('name slug category aliases').sort('name').lean();
    res.json({ success: true, count: skills.length, skills });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/skills/analyze?role=backend+developer
 */
async function analyzeSkills(req, res, next) {
  try {
    const role = (req.query.role || '').trim();
    if (!role) {
      return res.status(400).json({ success: false, message: 'role query parameter is required' });
    }

    const cached = await getFreshSnapshot(role);
    if (cached) {
      return res.json({
        success: true,
        cached: true,
        analyzedAt: cached.analyzedAt,
        role: cached.role,
        totalJobs: cached.totalJobs,
        skills: cached.skills,
      });
    }

    const snapshot = await analyzeMarketForRole(role);
    res.json({
      success: true,
      cached: false,
      analyzedAt: snapshot.analyzedAt,
      role: snapshot.role,
      totalJobs: snapshot.totalJobs,
      skills: snapshot.skills,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { roleMatch, listSkills, analyzeSkills };
