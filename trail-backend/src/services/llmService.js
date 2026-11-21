const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// Common tech keywords used as a reliable fallback parser
const TECH_KEYWORDS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', '.NET', 'Go', 'Golang', 'Rust', 'PHP',
  'HTML', 'CSS', 'Tailwind', 'Tailwind CSS', 'Bootstrap',
  'React', 'React.js', 'Vue', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'NodeJS', 'Express', 'Express.js',
  'Spring Boot', 'Django', 'FastAPI', 'Flask', 'Laravel', 'NestJS',
  'SQL', 'PostgreSQL', 'Postgres', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Oracle',
  'REST', 'REST APIs', 'RESTful', 'GraphQL', 'Microservices', 'Authentication', 'JWT', 'OAuth',
  'Docker', 'Kubernetes', 'K8s', 'AWS', 'Azure', 'GCP', 'Cloud', 'CI/CD', 'GitHub Actions', 'Terraform',
  'Git', 'Linux', 'Bash', 'Pandas', 'NumPy', 'Machine Learning', 'Deep Learning', 'PyTorch',
  'TensorFlow', 'Data Visualization', 'Tableau', 'Power BI'
];

function extractWithKeywords(description) {
  if (!description) return [];
  const text = description.toLowerCase();
  const matched = [];

  for (const keyword of TECH_KEYWORDS) {
    const escaped = keyword.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
    if (regex.test(text)) {
      matched.push(keyword);
    }
  }

  return matched;
}

// Extract skills using Groq API (high throughput & fast inference)
async function extractWithGroq(description) {
  if (!GROQ_API_KEY) return null;

  try {
    const trimmed = description.substring(0, 3500);
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert technical skill extractor. Identify technical skills, languages, frameworks, libraries, tools, databases, and platforms mentioned in the job description. Return ONLY a valid JSON array of strings, for example: ["React", "TypeScript", "Node.js"]. Do not include markdown codeblocks or extra text.',
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
      console.warn(`Groq API responded with status ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return null;

    // Clean any accidental markdown fence if present
    const cleanJson = content.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleanJson);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.filter((s) => typeof s === 'string' && s.trim().length > 0);
    }
  } catch (err) {
    console.warn(`Groq extraction attempt failed: ${err.message}`);
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
    const prompt = `You are a technical skill extractor. Given the job description below, extract all technical skills, programming languages, frameworks, libraries, tools, databases, and platforms mentioned.

Return ONLY a valid JSON array of strings. No explanation, no markdown, no extra text. Example: ["JavaScript", "Node.js", "MongoDB"]

Job description:
${trimmed}`;

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
  } catch (err) {
    // Continue to next provider
  }
  return null;
}

/**
 * Main skill extraction function.
 * Evaluates providers in order of reliability:
 * 1. Groq API (fast and stable)
 * 2. Gemini API
 * 3. Keyword / regex matching fallback against canonical skills
 */
async function extractSkillsFromDescription(description) {
  if (!description) return [];

  // Try Groq first
  const groqSkills = await extractWithGroq(description);
  if (groqSkills && groqSkills.length > 0) {
    return groqSkills;
  }

  // Try Gemini second
  const geminiSkills = await extractWithGemini(description);
  if (geminiSkills && geminiSkills.length > 0) {
    return geminiSkills;
  }

  // Resilient fallback parser
  return extractWithKeywords(description);
}

module.exports = {
  extractSkillsFromDescription,
  extractWithGroq,
  extractWithGemini,
  extractWithKeywords,
};
