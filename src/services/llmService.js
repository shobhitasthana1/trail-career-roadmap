const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Extract technical skills from a single job description.
 * Returns an array of skill name strings, e.g. ["Node.js", "MongoDB", "Docker"]
 * Returns [] on any error — never throws, so one bad description can't break a batch.
 */
async function extractSkillsFromDescription(description) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in .env');
  }

  // Trim description to avoid hitting token limits on very long postings
  const trimmed = description.substring(0, 3000);

  const prompt = `You are a technical skill extractor. Given the job description below, extract all technical skills, programming languages, frameworks, libraries, tools, databases, and platforms mentioned.

Return ONLY a valid JSON array of strings. No explanation, no markdown, no extra text. Example: ["JavaScript", "Node.js", "MongoDB"]

Job description:
${trimmed}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1, // low temperature = more consistent structured output
    },
  };

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Gemini API error ${response.status}:`, text);
    return [];
  }

  const data = await response.json();

  try {
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return [];

    const skills = JSON.parse(text);
    if (!Array.isArray(skills)) return [];

    // Sanitize: keep only non-empty strings
    return skills.filter((s) => typeof s === 'string' && s.trim().length > 0);
  } catch (err) {
    console.error('Failed to parse Gemini response:', err.message);
    return [];
  }
}

module.exports = { extractSkillsFromDescription };
