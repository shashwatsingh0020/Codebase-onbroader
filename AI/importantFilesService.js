
const FILE_IMPORTANCE_CATALOG = [
  // --- HIGH IMPORTANCE: ENTRY POINTS & ROOTS ---
  {
    pattern: /^(server\.(js|ts|mjs|cjs)|backend\/server\.(js|ts))$/i,
    name: "server.js",
    importance: "High",
    category: "Backend Entry Point",
    readingOrder: 3,
    explanation:
      "Primary server entry point. Initializes the HTTP/Express server, establishes database connections, mounts middleware (CORS, body parsing), and registers API route controllers.",
    keyHighlights: [
      "Initializes Express application and port binding",
      "Connects to database persistence layer",
      "Mounts authentication and resource API routes",
    ],
  },
  {
    pattern: /^(app\.(jsx|tsx)|src\/app\.(jsx|tsx)|frontend\/src\/app\.(jsx|tsx))$/i,
    name: "App.jsx",
    importance: "High",
    category: "Root UI Component",
    readingOrder: 4,
    explanation:
      "Root React component. Configures client-side routing (React Router), defines navigation layout, and wraps the component hierarchy in global context providers (e.g., AuthProvider).",
    keyHighlights: [
      "Declares application routes and protected view guards",
      "Wraps app in global state and authentication context",
      "Coordinates top-level layout, navbar, and notifications",
    ],
  },
  {
    pattern: /^(package\.json|.*\/package\.json)$/i,
    name: "package.json",
    importance: "High",
    category: "Project Manifest & Dependencies",
    readingOrder: 2,
    explanation:
      "Fundamental project manifest. Declares runtime dependencies, dev dependencies, execution scripts (start, dev, build), and package metadata essential for compiling and running the project.",
    keyHighlights: [
      "Lists core dependencies and framework versions",
      "Defines npm scripts for running and building",
      "Specifies Node engine and package module type",
    ],
  },
  {
    pattern: /^(index\.(js|ts)|src\/index\.(js|ts)|main\.(js|ts)|main\.(jsx|tsx)|src\/main\.(jsx|tsx)|frontend\/src\/main\.(jsx|tsx))$/i,
    name: "main.jsx / index.js",
    importance: "High",
    category: "Application Bootstrapper",
    readingOrder: 3,
    explanation:
      "Application bootstrapper. In client apps, renders the React root DOM node with StrictMode and styles; in server apps, starts the event loop and loads environment variables.",
    keyHighlights: [
      "Mounts root virtual DOM to HTML container",
      "Imports global styling stylesheets",
      "Initializes application runtime context",
    ],
  },
  {
    pattern: /^(main\.py|app\.py|manage\.py|wsgi\.py|asgi\.py)$/i,
    name: "main.py / app.py",
    importance: "High",
    category: "Backend Entry Point",
    readingOrder: 3,
    explanation:
      "Primary Python application entry point. Configures framework instances (FastAPI, Flask, Django), attaches router endpoints, and registers lifecycle event hooks.",
    keyHighlights: [
      "Initializes backend framework app instance",
      "Registers API routers and CORS middleware",
      "Handles database session lifecycle",
    ],
  },
  {
    pattern: /^(main\.go|cmd\/.*\/main\.go)$/i,
    name: "main.go",
    importance: "High",
    category: "Go Binary Entry Point",
    readingOrder: 3,
    explanation:
      "Entry point for Go applications. Initializes flags, configures dependency injection, registers HTTP handlers, and starts listening for network connections.",
    keyHighlights: [
      "Main function executing application lifecycle",
      "Initializes network server and channels",
    ],
  },
  {
    pattern: /^(cargo\.toml|.*\/cargo\.toml)$/i,
    name: "Cargo.toml",
    importance: "High",
    category: "Rust Manifest",
    readingOrder: 2,
    explanation:
      "Rust package manifest defining crates, feature flags, compilation profiles, and binary targets.",
    keyHighlights: ["Declares Rust crate dependencies", "Configures compilation profiles"],
  },
  {
    pattern: /^(requirements\.txt|pipfile|pyproject\.toml)$/i,
    name: "requirements.txt",
    importance: "High",
    category: "Python Dependencies",
    readingOrder: 2,
    explanation:
      "Specifies the Python packages and exact version pins required to install and execute the backend environment.",
    keyHighlights: ["Pins library versions for reproducible builds", "Enables virtualenv installation"],
  },
  {
    pattern: /^(readme\.md|readme|readme\.rst)$/i,
    name: "README.md",
    importance: "Medium",
    category: "Project Documentation",
    readingOrder: 1,
    explanation:
      "The primary onboarding document. Outlines the project mission, problem statement, prerequisites, installation commands, architecture diagrams, and contribution guidelines.",
    keyHighlights: [
      "Explains project purpose and key features",
      "Provides local setup and installation steps",
      "Highlights architecture and contributor rules",
    ],
  },
  {
    pattern: /^(\.env\.example|\.env\.sample|\.env\.template)$/i,
    name: ".env.example",
    importance: "Medium",
    category: "Environment Template",
    readingOrder: 2,
    explanation:
      "Template listing all required environment variables (database connection strings, API secrets, port configurations) needed to run the app locally without exposing secrets.",
    keyHighlights: [
      "Documents required secrets and configuration keys",
      "Serves as blueprint for local .env files",
    ],
  },
  {
    pattern: /^(vite\.config\.(js|ts|mjs)|webpack\.config\.(js|ts)|next\.config\.(js|mjs|ts))$/i,
    name: "vite.config.js / bundler config",
    importance: "Medium",
    category: "Build & Bundler Config",
    readingOrder: 5,
    explanation:
      "Bundler and build configuration. Specifies React plugins, CSS preprocess pipelines, dev server proxies, output aliases, and production optimization targets.",
    keyHighlights: [
      "Configures React compilation plugins",
      "Sets up development server port and proxy rules",
      "Defines module aliases and bundle splitting",
    ],
  },
  {
    pattern: /^(dockerfile|docker-compose\.(yml|yaml))$/i,
    name: "Dockerfile / docker-compose",
    importance: "Medium",
    category: "Containerization & DevOps",
    readingOrder: 5,
    explanation:
      "Container definitions specifying base OS image, dependency caching layers, runtime commands, and multi-service orchestration (app + database).",
    keyHighlights: [
      "Encapsulates reproducible runtime container environment",
      "Orchestrates dependent services (database, cache, app)",
    ],
  },
  {
    pattern: /^(tsconfig\.json|jsconfig\.json)$/i,
    name: "tsconfig.json",
    importance: "Medium",
    category: "TypeScript Configuration",
    readingOrder: 5,
    explanation:
      "Configures TypeScript compiler rules, target JavaScript version, strict typing modes, JSX compilation settings, and path aliases.",
    keyHighlights: ["Enforces type checking strictness", "Sets up module resolution aliases"],
  },
  {
    pattern: /^(tailwind\.config\.(js|ts|cjs|mjs))$/i,
    name: "tailwind.config.js",
    importance: "Medium",
    category: "Styling & Design System",
    readingOrder: 6,
    explanation:
      "Tailwind CSS configuration defining theme colors, font families, responsive breakpoints, design tokens, and utility plugins.",
    keyHighlights: ["Configures custom color schemes and typography", "Enables custom Tailwind UI plugins"],
  },

  {
    pattern: /(models?\/.*|schema\.(prisma|ts|js))$/i,
    name: "models/*.js (Data Model)",
    importance: "High",
    category: "Database Schema",
    readingOrder: 4,
    explanation:
      "Database schema and data access definition. Declares document structure, validation rules, relationships, and persistence queries.",
    keyHighlights: [
      "Specifies entity fields, types, and constraints",
      "Encapsulates database access operations",
    ],
  },
  {
    pattern: /(routes?\/.*|controllers?\/.*|api\/.*)$/i,
    name: "routes/*.js (API Routes)",
    importance: "High",
    category: "API & Routing",
    readingOrder: 4,
    explanation:
      "Defines HTTP endpoints, parameter validation, request interceptors, and business logic execution flow for frontend communication.",
    keyHighlights: [
      "Connects API URL routes to backend controllers",
      "Validates client request parameters",
    ],
  },
  {
    pattern: /(context\/.*|store\/.*|slices?\/.*)$/i,
    name: "context/*.jsx (State Store)",
    importance: "Medium",
    category: "Global State",
    readingOrder: 4,
    explanation:
      "Global state provider managing user session, authorization tokens, active repository caches, and reactive notifications across the UI.",
    keyHighlights: [
      "Maintains persistent client state",
      "Exposes custom state hooks for components",
    ],
  },
];


function inspectFileHeuristically(filePath) {
  const normalized = filePath.replace(/\\/g, "/").trim();
  const fileName = normalized.split("/").pop();

  // Try matching against catalog
  for (const entry of FILE_IMPORTANCE_CATALOG) {
    if (entry.pattern.test(normalized) || entry.pattern.test(fileName)) {
      return {
        name: fileName,
        path: normalized,
        importance: entry.importance,
        category: entry.category,
        explanation: entry.explanation,
        readingOrder: entry.readingOrder,
        keyHighlights: entry.keyHighlights,
      };
    }
  }

  // Fallback heuristic based on file extension & location
  const ext = fileName.split(".").pop().toLowerCase();
  let importance = "Low";
  let category = "Source File";
  let explanation = `Source file '${fileName}' implementing project logic.`;
  let readingOrder = 7;

  if (["js", "jsx", "ts", "tsx", "py", "go", "rs", "java"].includes(ext)) {
    if (fileName.toLowerCase().includes("auth") || fileName.toLowerCase().includes("user")) {
      importance = "High";
      category = "Security & Identity";
      explanation = "Handles authentication credentials, user session security, and access control.";
      readingOrder = 4;
    } else if (fileName.toLowerCase().includes("config") || fileName.toLowerCase().includes("constant")) {
      importance = "Medium";
      category = "Configuration";
      explanation = "Defines shared constants, configuration parameters, or service options.";
      readingOrder = 5;
    } else {
      importance = "Medium";
      category = "Application Logic";
      explanation = `Core application logic module implemented in ${fileName}.`;
      readingOrder = 6;
    }
  } else if (["json", "yaml", "yml", "toml"].includes(ext)) {
    importance = "Medium";
    category = "Configuration / Data";
    explanation = `Data configuration file '${fileName}' defining application settings.`;
    readingOrder = 5;
  } else if (["md", "txt"].includes(ext)) {
    importance = "Low";
    category = "Documentation";
    explanation = `Informational reference text in '${fileName}'.`;
    readingOrder = 8;
  }

  return {
    name: fileName,
    path: normalized,
    importance,
    category,
    explanation,
    readingOrder,
    keyHighlights: [`Module ${fileName}`],
  };
}

/**
 * Gemini AI call for Important Files when API key is provided
 */
async function callGeminiForImportantFiles(repoData, candidateFiles, apiKey) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
You are an expert software architect analyzing the repository "${repoData.fullName}".
Analyze the following candidate files and explain their architectural importance for an onboarding developer.
Importance must be strictly one of: "High", "Medium", "Low".

Examples:
- server.js       → High importance (Primary backend entry point)
- package.json    → High importance (Core project dependencies & scripts)
- App.jsx         → High importance (Root UI component & client routing)
- README.md       → Medium importance (Project overview and setup guide)

Candidate Files:
${JSON.stringify(candidateFiles.map((f) => ({ name: f.name, path: f.path })), null, 2)}

Respond strictly in valid JSON with NO markdown fences:
{
  "summary": "1-2 sentences summarizing which files are most critical to understand first.",
  "recommendedSequence": ["README.md", "package.json", "server.js", "App.jsx"],
  "files": [
    {
      "path": "file path",
      "name": "file name",
      "importance": "High",
      "category": "Entry Point",
      "explanation": "Clear 1-2 sentence explanation of why this file is important and its role in the codebase.",
      "readingOrder": 1,
      "keyHighlights": ["Highlight 1", "Highlight 2"]
    }
  ]
}
`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const cleaned = text
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();
        return JSON.parse(cleaned);
      }
    }
  } catch (err) {
    console.warn("[ImportantFiles] Gemini call failed, falling back to heuristics:", err.message);
  }
  return null;
}


async function identifyImportantFiles(repoDataOrFiles, fileList = []) {
  let candidateFiles = [];
  let repoData = null;

  if (Array.isArray(repoDataOrFiles)) {
    candidateFiles = repoDataOrFiles.map((f) => (typeof f === "string" ? f.trim() : f.path || f.name));
  } else if (repoDataOrFiles && typeof repoDataOrFiles === "object") {
    repoData = repoDataOrFiles;
    const allFiles = repoData.files || [];

    // Filter candidate important files from the entire repo tree
    const curated = allFiles.filter((filePath) => {
      const name = filePath.split("/").pop();
      const lowerName = name.toLowerCase();

      // Include root/key entry points
      if (
        lowerName === "server.js" ||
        lowerName === "package.json" ||
        lowerName === "app.jsx" ||
        lowerName === "app.tsx" ||
        lowerName === "readme.md" ||
        lowerName === "index.js" ||
        lowerName === "main.jsx" ||
        lowerName === "main.py" ||
        lowerName === "app.py" ||
        lowerName === "cargo.toml" ||
        lowerName === "go.mod" ||
        lowerName === "vite.config.js" ||
        lowerName === "dockerfile" ||
        lowerName === ".env.example"
      ) {
        return true;
      }

      // Include models, routes, controllers
      if (
        filePath.includes("models/") ||
        filePath.includes("routes/") ||
        filePath.includes("controllers/") ||
        filePath.includes("context/") ||
        filePath.includes("services/")
      ) {
        return true;
      }

      return false;
    });

    candidateFiles = curated.length > 0 ? curated : allFiles.slice(0, 15);
  }

  // Ensure standard core files are represented if none discovered
  if (candidateFiles.length === 0) {
    candidateFiles = ["server.js", "package.json", "App.jsx", "README.md"];
  }

  // Deduplicate
  const uniqueCandidatePaths = Array.from(new Set(candidateFiles));

  // Run heuristic analyzer on all candidates
  let analyzed = uniqueCandidatePaths.map((fPath) => inspectFileHeuristically(fPath));

  // Optional AI enrichment with Gemini
  let aiResult = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim().length > 5 && repoData) {
    aiResult = await callGeminiForImportantFiles(repoData, analyzed, apiKey);
  }

  if (aiResult?.files && Array.isArray(aiResult.files)) {
    analyzed = analyzed.map((file) => {
      const aiMatch = aiResult.files.find(
        (af) => af.path === file.path || af.name === file.name
      );
      if (aiMatch) {
        return {
          ...file,
          importance: aiMatch.importance || file.importance,
          category: aiMatch.category || file.category,
          explanation: aiMatch.explanation || file.explanation,
          readingOrder: aiMatch.readingOrder || file.readingOrder,
          keyHighlights: aiMatch.keyHighlights || file.keyHighlights,
        };
      }
      return file;
    });
  }

  // Sort by reading order, then by importance (High -> Medium -> Low)
  const importanceWeight = { High: 1, Medium: 2, Low: 3 };
  analyzed.sort((a, b) => {
    const orderDiff = (a.readingOrder || 5) - (b.readingOrder || 5);
    if (orderDiff !== 0) return orderDiff;
    return (importanceWeight[a.importance] || 3) - (importanceWeight[b.importance] || 3);
  });

  const highImportanceCount = analyzed.filter((f) => f.importance === "High").length;
  const mediumImportanceCount = analyzed.filter((f) => f.importance === "Medium").length;

  const recommendedSequence =
    aiResult?.recommendedSequence ||
    analyzed.slice(0, 5).map((f) => f.name);

  const summary =
    aiResult?.summary ||
    `Identified ${analyzed.length} key architectural files (${highImportanceCount} High importance, ${mediumImportanceCount} Medium importance). New developers should start by reading ${recommendedSequence.slice(0, 3).join(", ")} to grasp the architecture and execution flow quickly.`;

  return {
    summary,
    totalIdentified: analyzed.length,
    highImportanceCount,
    mediumImportanceCount,
    recommendedSequence,
    files: analyzed,
    engine: aiResult ? "Google Gemini AI" : "Codebase File Inspector",
  };
}

module.exports = {
  identifyImportantFiles,
  inspectFileHeuristically,
  FILE_IMPORTANCE_CATALOG,
};
