const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const CANDIDATE_GROQ_MODELS = [
  process.env.GROQ_MODEL,
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'llama-3.3-70b-versatile',
  'llama3-70b-8192',
  'llama3-8b-8192',
].filter(Boolean);

let verifiedGroqModel = CANDIDATE_GROQ_MODELS[0] || 'openai/gpt-oss-20b';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// Comprehensive tech keywords categorized across disciplines
const TECH_KEYWORDS = [
  // Programming languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', '.NET', 'Go', 'Golang', 'Rust', 'PHP', 'Kotlin', 'Swift', 'C++',
  // Web frontend
  'HTML', 'CSS', 'Tailwind', 'Tailwind CSS', 'Bootstrap', 'React', 'React.js', 'Vue', 'Vue.js', 'Angular', 'Next.js', 'Redux',
  // Backend & APIs
  'Node.js', 'NodeJS', 'Express', 'Express.js', 'Spring Boot', 'Django', 'FastAPI', 'Flask', 'Laravel', 'NestJS',
  'REST', 'REST APIs', 'RESTful', 'GraphQL', 'Microservices', 'Authentication', 'JWT', 'OAuth',
  // Databases
  'SQL', 'PostgreSQL', 'Postgres', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Oracle', 'Cassandra',
  // DevOps & Cloud
  'Docker', 'Kubernetes', 'K8s', 'AWS', 'Azure', 'GCP', 'Cloud', 'CI/CD', 'GitHub Actions', 'Terraform', 'Linux', 'Bash', 'Git',
  // QA, Testing & Quality Assurance
  'Manual Testing', 'Automation Testing', 'Test Automation', 'Selenium', 'Cypress', 'Playwright', 'Jest', 'Mocha',
  'Postman', 'JIRA', 'Regression Testing', 'Unit Testing', 'Integration Testing', 'API Testing', 'Load Testing', 'TestNG', 'JUnit', 'TestRail',
  // Product Management & Agile
  'Agile', 'Scrum', 'Product Roadmapping', 'User Research', 'Wireframing', 'A/B Testing', 'Product Strategy', 'PRD',
  'Stakeholder Management', 'Metrics & KPIs', 'Data Analytics', 'Feature Prioritization',
  // Data Science, ML & AI
  'Pandas', 'NumPy', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Data Visualization', 'Tableau', 'Power BI'
];

function extractWithKeywords(description) {
  if (!description) return [];
  const text = description.toLowerCase();
  const matched = [];

  for (const keyword of TECH_KEYWORDS) {
    const lower = keyword.toLowerCase();
    // Guard against short words like "Go" matching inside "going" or "algorithm"
    if (lower === 'go') {
      if (/\b(golang|go language|go developer)\b/i.test(description)) {
        matched.push('Go');
      }
      continue;
    }
    const escaped = lower.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
    if (regex.test(text)) {
      matched.push(keyword);
    }
  }

  return matched;
}

// Extract skills using Groq API with automatic model failover
async function extractWithGroq(description) {
  if (!GROQ_API_KEY) return null;

  const trimmed = description.substring(0, 3500);

  for (const model of CANDIDATE_GROQ_MODELS) {
    try {
      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert technical skill extractor. Identify all technical skills, methodologies, frameworks, libraries, tools, and platforms mentioned in the job description. Return ONLY a valid JSON array of strings, for example: ["Selenium", "Cypress", "JIRA", "SQL"]. Do not include markdown codeblocks or extra text.',
            },
            {
              role: 'user',
              content: trimmed,
            },
          ],
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content?.trim();
      if (!content) continue;

      const cleanJson = content.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        verifiedGroqModel = model;
        return parsed.filter((s) => typeof s === 'string' && s.trim().length > 0);
      }
    } catch {
      // Try next candidate model
    }
  }
  return null;
}

// Generate structured 4-stage role curriculum directly using Groq
async function generateRoleCurriculum(role) {
  if (!GROQ_API_KEY) return null;

  const modelToUse = verifiedGroqModel || 'openai/gpt-oss-20b';

  const systemPrompt = `You are a career engineering expert designing high-clarity curriculum roadmaps.
Design a cohesive 4-stage learning path for the role: "${role}".

CRITICAL ARCHITECTURE RULES:
1. TRANSFERABLE CORE FUNDAMENTALS:
   - For software/engineering roles, ALWAYS include transferable fundamentals:
     • "Problem Solving & Logic"
     • "Data Structures & Algorithms"
     • "Version Control (Git)"
     • "Database & SQL Design"
     • "Clean Architecture & Design Patterns"
   - For QA roles, include: "Software Testing Fundamentals", "Test Scenario Design", "Defect Lifecycle & JIRA", "Test Automation".
   - For Product roles, include: "Problem Solving & Prioritization", "User Research & Empathy", "Product Strategy", "Metrics & KPIs".

2. NO COMPETING LANGUAGE / FRAMEWORK OVERLOAD:
   - NEVER list 5 competing languages (e.g., do NOT list Python, Java, C#, Go, Rust, and PHP all together).
   - Pick ONE primary cohesive stack (e.g., Python or TypeScript/Node.js or Java), and put alternative language choices in the "options" array.
   - NEVER list competing backend frameworks together (e.g., do NOT list Django, Spring Boot, Laravel, and Express together). Align the primary framework to the chosen track.
   - If an elective or alternative framework is suggested, set "isOptional": true.

3. BALANCED 4 STAGES (2 to 3 skills per stage):
   - Foundation: Core fundamentals & logic
   - Core: Primary language/framework & database
   - Advanced: System design, architecture, security & testing
   - Tools & Deployment: CI/CD, containers, cloud & monitoring

Return ONLY valid JSON with this format:
{
  "Foundation": [
    { "name": "Problem Solving & Algorithms", "description": "Algorithmic thinking, complexity analysis, and core data structures.", "isOptional": false },
    { "name": "Version Control (Git)", "description": "Collaborative branching workflows and repository management.", "isOptional": false },
    { "name": "Primary Programming Language", "description": "Master one primary industry language.", "isOptional": false, "options": ["Python", "TypeScript", "Java", "Go"] }
  ],
  "Core": [
    { "name": "Web APIs & Framework", "description": "Build production RESTful APIs and microservices.", "isOptional": false, "options": ["FastAPI", "Express", "Spring Boot"] },
    { "name": "Database Design & SQL", "description": "Relational schema design, indexing, and query optimization.", "isOptional": false },
    { "name": "Authentication & Security", "description": "JWT, OAuth2, session management, and OWASP security.", "isOptional": false }
  ],
  "Advanced": [ ... ],
  "Tools & Deployment": [ ... ]
}`;

  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Design a structured, non-redundant roadmap for: ${role}` },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return null;

    const cleanJson = content.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleanJson);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (err) {
    console.warn(`Groq curriculum generation warning for "${role}": ${err.message}`);
  }
  return null;
}

// Extract skills using Gemini API
async function extractWithGemini(description) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('your_') || GEMINI_API_KEY.length < 20) {
    return null;
  }

  try {
    const trimmed = description.substring(0, 3000);
    const prompt = `You are a technical skill extractor. Given the job description below, extract all technical skills, frameworks, tools, and platforms mentioned. Return ONLY a valid JSON array of strings. Example: ["Selenium", "JIRA", "SQL"]. Job description:\n${trimmed}`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    };

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((s) => typeof s === 'string' && s.trim().length > 0);
        }
      }
    }
  } catch {
    // Continue to fallback
  }
  return null;
}

// Main skill extraction function
async function extractSkillsFromDescription(description) {
  if (!description) return [];

  const groqSkills = await extractWithGroq(description);
  if (groqSkills && groqSkills.length > 0) {
    return groqSkills;
  }

  const geminiSkills = await extractWithGemini(description);
  if (geminiSkills && geminiSkills.length > 0) {
    return geminiSkills;
  }

  return extractWithKeywords(description);
}

module.exports = {
  extractSkillsFromDescription,
  extractWithGroq,
  generateRoleCurriculum,
  extractWithGemini,
  extractWithKeywords,
};
