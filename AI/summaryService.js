/**
 * AI/summaryService.js
 * Feature 1: Project Summary Generator using Gemini / OpenAI with intelligent fallback.
 */

/**
 * Heuristic summary builder when no AI API key is configured or if the AI API is unavailable.
 */
function buildHeuristicSummary(repoData) {
  const { fullName, description, readme, language, topics, packageJson } = repoData;

  const headline = description && description.trim().length > 5
    ? description
    : `${fullName} - A ${language || "software"} repository.`;

  // Parse sections from README
  const cleanReadme = (readme || "")
    .replace(/!\[.*?\]\(.*?\)/g, "") // remove images
    .replace(/<[^>]*>/g, "")        // remove html tags
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1"); // links to text

  const paragraphs = cleanReadme
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40 && !p.startsWith("#"));

  const firstPara = paragraphs[0] || description || "No detailed description provided in repository.";
  const secondPara = paragraphs[1] || "";

  const overview = secondPara 
    ? `${firstPara}\n\n${secondPara}`
    : firstPara;

  // Extract key bullet points or infer from topics/packageJson
  const keyObjectives = [];
  if (topics && topics.length > 0) {
    keyObjectives.push(`Designed with a focus on ${topics.slice(0, 4).join(", ")}.`);
  }
  if (packageJson && packageJson.dependencies) {
    const deps = Object.keys(packageJson.dependencies).slice(0, 5).join(", ");
    keyObjectives.push(`Integrated with modern ecosystem dependencies: ${deps}.`);
  }
  keyObjectives.push(`Provides a modular architecture built primarily in ${language || "JavaScript"}.`);
  keyObjectives.push(`Open source codebase maintained under GitHub repository ${fullName}.`);

  const targetAudience = [
    `${language || "Software"} engineers and developers`,
    `Open-source contributors and technical leads`,
    `Teams building solutions around ${topics.length > 0 ? topics.join(", ") : language || "modern web"}`,
  ];

  const architectureHighlights = [
    `Primary language: ${language || "JavaScript"}`,
    `Default branch: ${repoData.defaultBranch}`,
    packageJson ? `Configured as a Node.js project with ${Object.keys(packageJson.dependencies || {}).length} production dependencies` : `Clean repository structure`,
  ];

  return {
    headline,
    overview,
    keyObjectives,
    targetAudience,
    architectureHighlights,
    engine: "heuristic-parser",
    note: "Generated via repo metadata. Add GEMINI_API_KEY in Backend/.env for full AI generation.",
  };
}

/**
 * Call Google Gemini API
 */
async function callGemini(repoData, apiKey) {
  // Try 1.5-flash or 2.0-flash
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
You are an expert software architect and technical lead.
Analyze the following GitHub repository and generate a high-level "Project Summary" (Feature 1 of onboarding guide).

Repository Details:
- Name: ${repoData.fullName}
- Description: ${repoData.description || "None"}
- Primary Language: ${repoData.language || "Unknown"}
- Topics/Tags: ${(repoData.topics || []).join(", ")}
- Package Info: ${repoData.packageJson ? JSON.stringify({ name: repoData.packageJson.name, description: repoData.packageJson.description, dependencies: Object.keys(repoData.packageJson.dependencies || {}).slice(0, 15) }) : "N/A"}

README Extract:
${(repoData.readme || "").slice(0, 5000)}

You MUST respond strictly with a valid JSON object with EXACTLY this structure (no markdown fences, just pure JSON):
{
  "headline": "A punchy, informative one-line summary of what the project does",
  "overview": "A comprehensive 2-3 paragraph explanation of what the project is, the problem it solves, and its significance.",
  "keyObjectives": [
    "Specific goal or capability 1",
    "Specific goal or capability 2",
    "Specific goal or capability 3",
    "Specific goal or capability 4"
  ],
  "targetAudience": [
    "Specific user or developer group 1",
    "Specific user or developer group 2",
    "Specific user or developer group 3"
  ],
  "architectureHighlights": [
    "Architecture highlight 1",
    "Architecture highlight 2",
    "Architecture highlight 3"
  ]
}
`;

  const payload = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2048,
    },
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textOutput) {
    throw new Error("Empty response returned from Gemini API.");
  }

  // Clean output from any markdown ```json ... ``` formatting
  const cleanJson = textOutput
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleanJson);
  parsed.engine = "Google Gemini AI";
  return parsed;
}

/**
 * Call OpenAI API if configured
 */
async function callOpenAI(repoData, apiKey) {
  const endpoint = "https://api.openai.com/v1/chat/completions";

  const prompt = `
You are an expert software architect. Generate a Project Summary (Feature 1) for this GitHub repository:
- Name: ${repoData.fullName}
- Description: ${repoData.description}
- Language: ${repoData.language}
- README snippet: ${(repoData.readme || "").slice(0, 4000)}

Respond strictly in JSON with:
{
  "headline": "One-line punchy description",
  "overview": "Detailed 2-3 paragraph summary",
  "keyObjectives": ["goal 1", "goal 2", "goal 3", "goal 4"],
  "targetAudience": ["audience 1", "audience 2", "audience 3"],
  "architectureHighlights": ["highlight 1", "highlight 2", "highlight 3"]
}
`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  const parsed = JSON.parse(content);
  parsed.engine = "OpenAI GPT";
  return parsed;
}

/**
 * Main function: Generates Feature 1 Project Summary
 */
async function generateProjectSummary(repoData) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey && geminiKey.trim().length > 5) {
    try {
      console.log(`[AI] Generating Project Summary for ${repoData.fullName} using Gemini...`);
      return await callGemini(repoData, geminiKey.trim());
    } catch (err) {
      console.error("[AI] Gemini generation failed, falling back to heuristic:", err.message);
    }
  }

  if (openaiKey && openaiKey.trim().length > 5) {
    try {
      console.log(`[AI] Generating Project Summary for ${repoData.fullName} using OpenAI...`);
      return await callOpenAI(repoData, openaiKey.trim());
    } catch (err) {
      console.error("[AI] OpenAI generation failed, falling back to heuristic:", err.message);
    }
  }

  // Graceful fallback to heuristic parser if no keys configured
  console.log(`[AI] No valid API key provided or API unavailable. Using heuristic summary engine.`);
  return buildHeuristicSummary(repoData);
}

module.exports = {
  generateProjectSummary,
  buildHeuristicSummary,
};
