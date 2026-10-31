
const FOLDER_CATALOG = [
  {
    pattern: /^(frontend|client|web|ui|interface)$/i,
    name: "Frontend",
    category: "Frontend / UI",
    role: "Client-side Web Interface",
    importance: "High",
    defaultExplanation:
      "Houses the client-side user interface, rendering interactive components, handling browser routing, state management, and user interactions.",
  },
  {
    pattern: /^(backend|server|api|service|server-app)$/i,
    name: "Backend",
    category: "Backend / Server",
    role: "Server & REST API",
    importance: "High",
    defaultExplanation:
      "Contains server-side application logic, REST/GraphQL API route handlers, database schemas, authentication middleware, and external service connectors.",
  },
  {
    pattern: /^(ai|ml|agents?|llm|intelligence|nlp|prompts?|models?_ai)$/i,
    name: "AI / ML Engine",
    category: "AI & Machine Learning",
    role: "AI Agents & Intelligence Layer",
    importance: "High",
    defaultExplanation:
      "Encapsulates artificial intelligence services, LLM integrations (Gemini, OpenAI), prompt orchestration, repository ingestion pipelines, and heuristic analyzers.",
  },
  {
    pattern: /^src$/i,
    name: "Source Root",
    category: "Core Source Code",
    role: "Primary Application Source",
    importance: "High",
    defaultExplanation:
      "The primary source directory containing all active application code, business logic, components, and module definitions before build compilation.",
  },
  {
    pattern: /^(components|widgets)$/i,
    name: "Components",
    category: "UI Components",
    role: "Reusable View Elements",
    importance: "High",
    defaultExplanation:
      "Contains reusable visual building blocks (buttons, modals, cards, navigation bars, form inputs) designed for modularity and consistent user experience.",
  },
  {
    pattern: /^(pages|views|screens)$/i,
    name: "Pages & Views",
    category: "Page Views",
    role: "Route-Level Screens",
    importance: "High",
    defaultExplanation:
      "Contains full-screen route views corresponding to specific URL endpoints (e.g., Home, Dashboard, Login, Profile) coordinating smaller components.",
  },
  {
    pattern: /^(models|schemas|entities)$/i,
    name: "Models & Schemas",
    category: "Database & Models",
    role: "Data Layer & Persistence",
    importance: "High",
    defaultExplanation:
      "Defines database collection schemas, document validation constraints, data relations, and ORM/ODM models (such as Mongoose or Prisma).",
  },
  {
    pattern: /^(controllers|handlers)$/i,
    name: "Controllers",
    category: "API & Controllers",
    role: "Request Processing Logic",
    importance: "High",
    defaultExplanation:
      "Implements HTTP request/response business logic, processes incoming parameters, validates user payloads, and delegates data access to models.",
  },
  {
    pattern: /^routes$/i,
    name: "Routes",
    category: "API & Routing",
    role: "URL Routing Table",
    importance: "High",
    defaultExplanation:
      "Maps HTTP methods (GET, POST, PUT, DELETE) and URL endpoints to their corresponding controller functions and authentication middleware.",
  },
  {
    pattern: /^(middleware|middlewares)$/i,
    name: "Middleware",
    category: "Middleware & Security",
    role: "Request Interceptors",
    importance: "High",
    defaultExplanation:
      "Provides request interceptors for token verification, CORS headers, rate limiting, error handling, and input sanitization before controllers execute.",
  },
  {
    pattern: /^(services|services_backend)$/i,
    name: "Services",
    category: "Business Logic",
    role: "Domain Logic Services",
    importance: "Medium",
    defaultExplanation:
      "Encapsulates complex business rules, third-party integrations (e.g., payment gateways, email senders, external APIs), keeping controllers lean.",
  },
  {
    pattern: /^(utils|util|helpers|lib|common|shared)$/i,
    name: "Utilities & Helpers",
    category: "Shared Utilities",
    role: "Reusable Helper Functions",
    importance: "Medium",
    defaultExplanation:
      "Hosts shared helper functions, date/string formatters, mathematical algorithms, cryptographic routines, and reusable utility scripts.",
  },
  {
    pattern: /^(config|configs|configuration)$/i,
    name: "Configuration",
    category: "Configuration",
    role: "App Settings & Environment",
    importance: "Medium",
    defaultExplanation:
      "Manages environment configurations, database connection strings, third-party API credentials, and application constants.",
  },
  {
    pattern: /^(public|static|assets)$/i,
    name: "Public & Assets",
    category: "Static Assets",
    role: "Static Web Media",
    importance: "Medium",
    defaultExplanation:
      "Holds uncompiled static assets served directly by the web server or bundler, including images, icons, favicons, fonts, and base HTML files.",
  },
  {
    pattern: /^(tests?|__tests__|spec|specs|e2e)$/i,
    name: "Tests",
    category: "Quality Assurance",
    role: "Automated Test Suites",
    importance: "Medium",
    defaultExplanation:
      "Houses automated unit tests, integration specs, mock fixtures, and end-to-end test scripts ensuring software reliability and regression prevention.",
  },
  {
    pattern: /^(docs|documentation)$/i,
    name: "Documentation",
    category: "Documentation",
    role: "Developer Guides & Docs",
    importance: "Low",
    defaultExplanation:
      "Contains architectural design documents, API specifications, onboarding guides, and contributor references for engineering teams.",
  },
  {
    pattern: /^(scripts|bin|tools)$/i,
    name: "Scripts & Tooling",
    category: "Tooling & Build",
    role: "Automation Scripts",
    importance: "Medium",
    defaultExplanation:
      "Stores build automation, database seeding, migration commands, and deployment scripts used by developers and CI/CD pipelines.",
  },
  {
    pattern: /^(hooks)$/i,
    name: "Custom Hooks",
    category: "Frontend / State",
    role: "Reusable React Hooks",
    importance: "Medium",
    defaultExplanation:
      "Contains custom React lifecycle hooks encapsulating stateful logic, API fetching patterns, and UI event listeners for component reuse.",
  },
  {
    pattern: /^(context|contexts|store|redux)$/i,
    name: "State Management",
    category: "Frontend / State",
    role: "Global Application State",
    importance: "High",
    defaultExplanation:
      "Maintains global application state (such as authentication context, theme preferences, and user session caches) across React components.",
  },
  {
    pattern: /^(styles|css|scss)$/i,
    name: "Styles",
    category: "Styling & Design",
    role: "Global CSS & Design System",
    importance: "Low",
    defaultExplanation:
      "Centralizes global CSS stylesheets, Tailwind configuration, CSS variables, typography definitions, and theme design system tokens.",
  },
];

/**
 * Heuristically explains a single folder based on its path, name, and children files
 */
function explainFolderHeuristically(folderPath, filesInRepo = []) {
  const normalizedPath = folderPath.replace(/\/+$/, "").trim();
  const folderName = normalizedPath.split("/").pop();

  // Find files directly or nested under this folder
  const matchingFiles = filesInRepo.filter(
    (f) => f.startsWith(`${normalizedPath}/`) || f === normalizedPath
  );
  const directChildFiles = matchingFiles
    .map((f) => f.slice(normalizedPath.length + 1))
    .filter((f) => f && !f.includes("/"));

  // Check catalog for known folder pattern
  const matchedCatalog = FOLDER_CATALOG.find((entry) =>
    entry.pattern.test(folderName)
  );

  let category = matchedCatalog?.category || "Application Module";
  let role = matchedCatalog?.role || `${folderName} Module`;
  let importance = matchedCatalog?.importance || "Medium";
  let explanation = matchedCatalog?.defaultExplanation;

  // Contextual enrichment based on subpath
  if (!matchedCatalog) {
    if (normalizedPath.startsWith("Frontend/") || normalizedPath.startsWith("client/")) {
      category = "Frontend / UI";
      role = `Frontend ${folderName}`;
      importance = "Medium";
      explanation = `Module supporting the client interface under ${normalizedPath}, organizing specialized component or utility logic.`;
    } else if (normalizedPath.startsWith("Backend/") || normalizedPath.startsWith("server/")) {
      category = "Backend / Server";
      role = `Backend ${folderName}`;
      importance = "Medium";
      explanation = `Module supporting server operations under ${normalizedPath}, handling specialized API, data, or middleware tasks.`;
    } else if (normalizedPath.startsWith("AI/")) {
      category = "AI & Machine Learning";
      role = `AI Subsystem: ${folderName}`;
      importance = "Medium";
      explanation = `Specialized intelligence component supporting AI processing and model interactions.`;
    } else {
      explanation = `Directory '${folderName}' responsible for organizing project assets and modular components under '${normalizedPath}'.`;
    }
  } else {
    // If it's a top-level Frontend, Backend, or AI folder, make explanation rich and specific
    if (/^frontend$/i.test(folderName)) {
      explanation =
        "The client-side interface of the application. Contains user-facing components, pages, routing, style definitions, and client state management.";
    } else if (/^backend$/i.test(folderName)) {
      explanation =
        "The server-side application. Powers REST/HTTP endpoints, connects to the database, executes authentication, and handles business logic.";
    } else if (/^ai$/i.test(folderName)) {
      explanation =
        "The artificial intelligence integration layer. Manages repository analysis, LLM prompt generation, API calls to AI models, and algorithmic heuristics.";
    }
  }

  // Key sample contents
  const sampleContents = directChildFiles.slice(0, 6);

  return {
    name: folderName,
    path: normalizedPath,
    category,
    role,
    importance,
    explanation,
    fileCount: matchingFiles.length,
    keyContents: sampleContents,
  };
}

/**
 * Call Gemini AI to enrich folder explanations when API key is available
 */
async function callGeminiForFolderStructure(repoData, detectedFolders, apiKey) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const folderSummaryList = detectedFolders.map((f) => ({
    name: f.name,
    path: f.path,
    fileCount: f.fileCount,
    sampleContents: f.keyContents,
  }));

  const prompt = `
You are an expert software architect analyzing the repository "${repoData.fullName}".
Analyze the following folder structure and explain what each folder does.

Repository description: ${repoData.description || "N/A"}
Primary language: ${repoData.language || "N/A"}

Folders to explain:
${JSON.stringify(folderSummaryList, null, 2)}

Respond strictly in valid JSON format with NO markdown fences, matching this structure:
{
  "overview": "A 1-2 sentence high-level summary of how this codebase is architected and structured into layers.",
  "folders": [
    {
      "path": "Frontend",
      "name": "Frontend",
      "category": "Frontend / UI",
      "role": "Client-side Web Interface",
      "importance": "High",
      "explanation": "Clear, concise 1-2 sentence explanation of what this folder does and its role in the project."
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
    console.warn("[FolderStructure] Gemini call failed, falling back to heuristics:", err.message);
  }
  return null;
}


async function explainFolderStructure(repoDataOrFolders, filesList = []) {
  let foldersToExplain = [];
  let filesInRepo = filesList;
  let repoData = null;

  // Determine input shape
  if (Array.isArray(repoDataOrFolders)) {
    // Direct array of folder names: e.g. ["Frontend/", "Backend/", "AI/"]
    foldersToExplain = repoDataOrFolders.map((f) => f.replace(/\/+$/, "").trim()).filter(Boolean);
  } else if (repoDataOrFolders && typeof repoDataOrFolders === "object") {
    repoData = repoDataOrFolders;
    filesInRepo = repoData.files || [];

  
    if (Array.isArray(repoData.folders) && repoData.folders.length > 0) {
    
      const topLevelFolders = repoData.folders.filter((f) => !f.includes("/"));
      const keySecondLevel = repoData.folders.filter((f) => {
        const depth = f.split("/").length;
        return depth === 2;
      });
      foldersToExplain = Array.from(new Set([...topLevelFolders, ...keySecondLevel]));
    } else if (Array.isArray(repoData.rootContents)) {
      foldersToExplain = repoData.rootContents
        .filter((item) => item.type === "dir")
        .map((item) => item.path);
    }
  }

  if (foldersToExplain.length === 0) {
    foldersToExplain = ["Frontend", "Backend", "AI"];
  }

  foldersToExplain.sort((a, b) => {
    const priority = ["frontend", "backend", "ai", "src", "components", "pages", "models", "controllers", "routes"];
    const aIndex = priority.indexOf(a.toLowerCase());
    const bIndex = priority.indexOf(b.toLowerCase());
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  let explanations = foldersToExplain.map((fPath) =>
    explainFolderHeuristically(fPath, filesInRepo)
  );

  let aiResult = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim().length > 5 && repoData) {
    aiResult = await callGeminiForFolderStructure(repoData, explanations, apiKey);
  }

  if (aiResult?.folders && Array.isArray(aiResult.folders)) {
    explanations = explanations.map((folder) => {
      const aiMatch = aiResult.folders.find(
        (af) => af.path === folder.path || af.name === folder.name
      );
      if (aiMatch) {
        return {
          ...folder,
          category: aiMatch.category || folder.category,
          role: aiMatch.role || folder.role,
          importance: aiMatch.importance || folder.importance,
          explanation: aiMatch.explanation || folder.explanation,
        };
      }
      return folder;
    });
  }

  const topNames = explanations
    .filter((f) => !f.path.includes("/"))
    .map((f) => f.name);

  const overview =
    aiResult?.overview ||
    (topNames.includes("Frontend") && topNames.includes("Backend")
      ? `The codebase is organized into a modular multi-tier architecture with distinct client (${topNames.filter(n => n === "Frontend").join(", ")}), server (${topNames.filter(n => n === "Backend").join(", ")}), and ${topNames.includes("AI") ? "AI processing layers" : "core services"} for clear separation of concerns.`
      : `The project organizes its functionality into ${explanations.length} primary modular directories supporting components, business logic, configuration, and build assets.`);

  return {
    overview,
    totalFolders: explanations.length,
    folders: explanations,
    engine: aiResult ? "Google Gemini AI" : "Codebase Structure Analyzer",
  };
}

module.exports = {
  explainFolderStructure,
  explainFolderHeuristically,
  FOLDER_CATALOG,
};
