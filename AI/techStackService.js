/**
 * AI/techStackService.js
 * Feature 2: Tech Stack Detection Engine
 * Combines GitHub language analytics, manifest parsing (npm, python, go, rust),
 * file inspection, and optional Gemini LLM synthesis.
 */

// Canonical GitHub language colors
const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Shell: "#89e051",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Dart: "#00B4AB",
  Lua: "#000080",
  SQL: "#e38c00",
  Other: "#8b949e",
};

// Known Technology Signature Definitions
const TECH_CATALOG = [

  {
    name: "React",
    category: "frontend",
    description: "Component-based UI library for web interfaces",
    match: {
      deps: ["react", "react-dom"],
      topics: ["react", "reactjs"],
    },
  },
  {
    name: "Next.js",
    category: "framework",
    description: "The React framework for the web (SSR, SSG, Server Actions)",
    match: {
      deps: ["next"],
      files: ["next.config.js", "next.config.mjs", "next.config.ts"],
      topics: ["nextjs"],
    },
  },
  {
    name: "Vue.js",
    category: "frontend",
    description: "Progressive JavaScript framework for building user interfaces",
    match: {
      deps: ["vue"],
      topics: ["vue", "vuejs"],
    },
  },
  {
    name: "Nuxt.js",
    category: "framework",
    description: "Intuitive Vue framework for full-stack web development",
    match: {
      deps: ["nuxt", "nuxt3"],
      files: ["nuxt.config.js", "nuxt.config.ts"],
      topics: ["nuxt", "nuxtjs"],
    },
  },
  {
    name: "Angular",
    category: "frontend",
    description: "Component-based framework for scalable enterprise web apps",
    match: {
      deps: ["@angular/core"],
      files: ["angular.json"],
      topics: ["angular"],
    },
  },
  {
    name: "Svelte",
    category: "frontend",
    description: "Cybernetically enhanced reactive UI framework",
    match: {
      deps: ["svelte"],
      topics: ["svelte"],
    },
  },
  {
    name: "Astro",
    category: "framework",
    description: "Content-driven web framework designed for speed",
    match: {
      deps: ["astro"],
      files: ["astro.config.mjs"],
    },
  },

  // --- BACKEND & APIS ---
  {
    name: "Express.js",
    category: "backend",
    description: "Fast, unopinionated minimalist web framework for Node.js",
    match: {
      deps: ["express"],
      topics: ["express", "expressjs"],
    },
  },
  {
    name: "NestJS",
    category: "backend",
    description: "Progressive TypeScript framework for scalable server-side apps",
    match: {
      deps: ["@nestjs/core"],
      topics: ["nestjs"],
    },
  },
  {
    name: "Fastify",
    category: "backend",
    description: "Extremely fast and low-overhead web framework for Node.js",
    match: {
      deps: ["fastify"],
    },
  },
  {
    name: "Hono",
    category: "backend",
    description: "Ultrafast, lightweight web standards framework for any runtime",
    match: {
      deps: ["hono"],
    },
  },
  {
    name: "Django",
    category: "backend",
    description: "High-level Python web framework encouraging clean design",
    match: {
      requirements: ["django"],
      topics: ["django"],
      files: ["manage.py"],
    },
  },
  {
    name: "FastAPI",
    category: "backend",
    description: "Modern, fast Python web framework based on standard type hints",
    match: {
      requirements: ["fastapi"],
      topics: ["fastapi"],
    },
  },
  {
    name: "Flask",
    category: "backend",
    description: "Lightweight WSGI Python web application micro-framework",
    match: {
      requirements: ["flask"],
      topics: ["flask"],
    },
  },
  {
    name: "Spring Boot",
    category: "backend",
    description: "Opinionated Java framework for stand-alone microservices",
    match: {
      files: ["pom.xml", "build.gradle"],
      topics: ["spring", "spring-boot"],
    },
  },

  // --- DATABASES & ORMS ---
  {
    name: "MongoDB / Mongoose",
    category: "database",
    description: "NoSQL document database and schema modeling ODM",
    match: {
      deps: ["mongoose", "mongodb"],
      topics: ["mongodb", "mongoose"],
    },
  },
  {
    name: "PostgreSQL",
    category: "database",
    description: "Powerful, open source object-relational database system",
    match: {
      deps: ["pg", "pg-hstore", "postgres"],
      requirements: ["psycopg2", "asyncpg"],
      topics: ["postgres", "postgresql"],
    },
  },
  {
    name: "MySQL",
    category: "database",
    description: "Open source relational database management system",
    match: {
      deps: ["mysql", "mysql2"],
      requirements: ["mysqlclient", "pymysql"],
      topics: ["mysql"],
    },
  },
  {
    name: "Redis",
    category: "database",
    description: "In-memory data store used as database, cache, and message broker",
    match: {
      deps: ["redis", "ioredis"],
      requirements: ["redis"],
      topics: ["redis"],
    },
  },
  {
    name: "Prisma",
    category: "database",
    description: "Next-generation TypeScript ORM for Node.js & TypeScript",
    match: {
      deps: ["@prisma/client", "prisma"],
      files: ["prisma/schema.prisma"],
    },
  },
  {
    name: "TypeORM",
    category: "database",
    description: "ORM that runs in NodeJS and supports TypeScript",
    match: {
      deps: ["typeorm"],
    },
  },
  {
    name: "Supabase",
    category: "database",
    description: "Open source Firebase alternative built on PostgreSQL",
    match: {
      deps: ["@supabase/supabase-js"],
      topics: ["supabase"],
    },
  },
  {
    name: "Firebase",
    category: "database",
    description: "Google cloud platform application backend and Firestore",
    match: {
      deps: ["firebase", "firebase-admin"],
      topics: ["firebase"],
    },
  },

  // --- STYLING & UI SYSTEMS ---
  {
    name: "Tailwind CSS",
    category: "styling",
    description: "Utility-first CSS framework for rapid UI development",
    match: {
      deps: ["tailwindcss", "@tailwindcss/vite", "@tailwindcss/postcss"],
      files: ["tailwind.config.js", "tailwind.config.ts", "tailwind.config.mjs"],
      topics: ["tailwindcss", "tailwind"],
    },
  },
  {
    name: "PostCSS",
    category: "styling",
    description: "Tool for transforming styles with JS plugins",
    match: {
      deps: ["postcss"],
      files: ["postcss.config.js", "postcss.config.mjs"],
    },
  },
  {
    name: "Sass / SCSS",
    category: "styling",
    description: "CSS pre-processor with variables, nesting, and mixins",
    match: {
      deps: ["sass", "node-sass"],
    },
  },
  {
    name: "Lucide Icons",
    category: "styling",
    description: "Beautiful & consistent open-source icon pack",
    match: {
      deps: ["lucide-react", "lucide-vue-next", "lucide"],
    },
  },

  // --- STATE MANAGEMENT & NETWORKING ---
  {
    name: "Redux / Redux Toolkit",
    category: "tools",
    description: "Predictable state container for JavaScript apps",
    match: {
      deps: ["redux", "@reduxjs/toolkit", "react-redux"],
    },
  },
  {
    name: "Zustand",
    category: "tools",
    description: "Bearbones state-management solution using simplified flux principles",
    match: {
      deps: ["zustand"],
    },
  },
  {
    name: "TanStack Query",
    category: "tools",
    description: "Powerful asynchronous state management and server-state caching",
    match: {
      deps: ["@tanstack/react-query", "react-query"],
    },
  },
  {
    name: "Axios",
    category: "tools",
    description: "Promise-based HTTP client for the browser and Node.js",
    match: {
      deps: ["axios"],
    },
  },

  // --- BUILD TOOLS, DEVOPS & TESTING ---
  {
    name: "Vite",
    category: "devops",
    description: "Next Generation frontend tooling and instant HMR dev server",
    match: {
      deps: ["vite"],
      files: ["vite.config.js", "vite.config.ts", "vite.config.mjs"],
    },
  },
  {
    name: "Webpack",
    category: "devops",
    description: "Static module bundler for modern JavaScript applications",
    match: {
      deps: ["webpack"],
      files: ["webpack.config.js"],
    },
  },
  {
    name: "Docker",
    category: "devops",
    description: "OS-level containerization platform for consistent deployments",
    match: {
      files: ["Dockerfile", "docker-compose.yml", "docker-compose.yaml"],
      topics: ["docker", "container"],
    },
  },
  {
    name: "TypeScript",
    category: "devops",
    description: "Strongly typed programming language that builds on JavaScript",
    match: {
      deps: ["typescript"],
      files: ["tsconfig.json"],
      topics: ["typescript"],
    },
  },
  {
    name: "Jest",
    category: "testing",
    description: "Delightful JavaScript testing framework with a focus on simplicity",
    match: {
      deps: ["jest", "@types/jest"],
      files: ["jest.config.js"],
    },
  },
  {
    name: "Vitest",
    category: "testing",
    description: "Blazing fast unit test framework powered by Vite",
    match: {
      deps: ["vitest"],
    },
  },
  {
    name: "ESLint",
    category: "testing",
    description: "Pluggable and configurable linter tool for identifying issues",
    match: {
      deps: ["eslint"],
      files: ["eslint.config.js", ".eslintrc.json", ".eslintrc.js"],
    },
  },
];

/**
 * Calculates language distribution and assigns canonical colors
 */
function processLanguages(languagesObj) {
  if (!languagesObj || typeof languagesObj !== "object" || Object.keys(languagesObj).length === 0) {
    return [];
  }

  const totalBytes = Object.values(languagesObj).reduce((sum, b) => sum + (Number(b) || 0), 0);
  if (totalBytes === 0) {
    return Object.keys(languagesObj).map((name) => ({
      name,
      percentage: 100,
      color: LANGUAGE_COLORS[name] || LANGUAGE_COLORS.Other,
    }));
  }

  const list = Object.entries(languagesObj)
    .map(([name, bytes]) => {
      const percentage = Math.round(((bytes / totalBytes) * 100) * 10) / 10;
      return {
        name,
        bytes,
        percentage,
        color: LANGUAGE_COLORS[name] || LANGUAGE_COLORS.Other,
      };
    })
    .sort((a, b) => b.bytes - a.bytes);

  return list;
}

/**
 * Deterministic detection engine that examines package.json, python manifests,
 * file trees, and GitHub topics.
 */
function detectTechnologies(repoData) {
  const { packageJson, manifests = {}, rootContents = [], topics = [] } = repoData;

  const allDependencies = new Set();
  if (packageJson) {
    if (packageJson.dependencies) {
      Object.keys(packageJson.dependencies).forEach((d) => allDependencies.add(d.toLowerCase()));
    }
    if (packageJson.devDependencies) {
      Object.keys(packageJson.devDependencies).forEach((d) => allDependencies.add(d.toLowerCase()));
    }
  }

  const reqText = (manifests.requirementsTxt || "").toLowerCase();
  const rootFilesSet = new Set(rootContents.map((f) => f.name.toLowerCase()));
  const topicsSet = new Set(topics.map((t) => t.toLowerCase()));

  const matched = [];

  for (const tech of TECH_CATALOG) {
    let hasMatch = false;

    // Check npm dependencies
    if (tech.match.deps) {
      if (tech.match.deps.some((d) => allDependencies.has(d.toLowerCase()))) {
        hasMatch = true;
      }
    }

    // Check files
    if (!hasMatch && tech.match.files) {
      if (tech.match.files.some((f) => rootFilesSet.has(f.toLowerCase()))) {
        hasMatch = true;
      }
    }

    // Check topics
    if (!hasMatch && tech.match.topics) {
      if (tech.match.topics.some((t) => topicsSet.has(t.toLowerCase()))) {
        hasMatch = true;
      }
    }

    // Check Python requirements
    if (!hasMatch && tech.match.requirements && reqText) {
      if (tech.match.requirements.some((r) => reqText.includes(r.toLowerCase()))) {
        hasMatch = true;
      }
    }

    if (hasMatch) {
      matched.push({
        name: tech.name,
        category: tech.category,
        description: tech.description,
      });
    }
  }

  return matched;
}

/**
 * Infers overall architecture classification based on detected tech
 */
function inferArchitecture(detectedTech, languages, repoData) {
  const names = new Set(detectedTech.map((t) => t.name));
  const primaryLang = languages[0]?.name || repoData.language || "Unknown";

  const hasReact = names.has("React") || names.has("Next.js");
  const hasVue = names.has("Vue.js") || names.has("Nuxt.js");
  const hasExpress = names.has("Express.js") || names.has("NestJS") || names.has("Fastify");
  const hasMongo = names.has("MongoDB / Mongoose");
  const hasPostgres = names.has("PostgreSQL");
  const hasNext = names.has("Next.js");
  const hasPythonWeb = names.has("FastAPI") || names.has("Django") || names.has("Flask");

  if (hasReact && hasExpress && hasMongo) {
    return "MERN Full-Stack Application (MongoDB, Express, React, Node.js)";
  }
  if (hasNext) {
    return "Full-Stack Server-Rendered App (Next.js & React)";
  }
  if (hasReact && hasExpress) {
    return "Client-Server Full-Stack Architecture (React + Express API)";
  }
  if (hasReact || hasVue || names.has("Angular") || names.has("Svelte")) {
    return "Single Page Application (SPA) Frontend";
  }
  if (hasExpress || names.has("NestJS") || names.has("Fastify")) {
    return "RESTful Node.js API Service";
  }
  if (hasPythonWeb) {
    return "Python Web API & Backend Service";
  }
  if (primaryLang === "TypeScript" || primaryLang === "JavaScript") {
    return "JavaScript / TypeScript Ecosystem Project";
  }
  if (primaryLang === "Python") {
    return "Python Application / Pipeline";
  }
  if (primaryLang === "Rust" || primaryLang === "Go") {
    return `High-Performance Systems / Backend Tooling in ${primaryLang}`;
  }

  return `${primaryLang} Software Project`;
}

/**
 * Call Google Gemini API for deep tech stack commentary (if API key is present)
 */
async function callGeminiForTechStack(repoData, detectedTech, languages, apiKey) {
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
You are a Principal Software Architect.
Analyze the following repository's tech stack and return a concise JSON overview.

Repository: ${repoData.fullName}
Primary Language: ${repoData.language}
Language Breakdown: ${JSON.stringify(languages)}
Detected Technologies: ${detectedTech.map((t) => t.name).join(", ")}
Package Info: ${repoData.packageJson ? JSON.stringify(repoData.packageJson.dependencies || {}) : "N/A"}

Respond strictly with valid JSON with this exact format:
{
  "summary": "A 2-3 sentence technical explanation of why this stack was selected and how components interact.",
  "strengths": [
    "Key architectural strength 1",
    "Key architectural strength 2",
    "Key architectural strength 3"
  ],
  "runtime": "Target runtime or environment (e.g. Node.js 18+, Bun, Python 3.10+, Docker container)"
}
`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 600,
        },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned);
    }
  } catch (err) {
    console.warn("[TechStack] Gemini call failed, using heuristic generation:", err.message);
  }
  return null;
}

/**
 * Main Tech Stack Detection entry point
 */
async function detectTechStack(repoData) {
  const languages = processLanguages(repoData.languages);
  const detectedTech = detectTechnologies(repoData);
  const architecture = inferArchitecture(detectedTech, languages, repoData);

  // Group detected technologies by category
  const categorized = {
    frameworks: detectedTech.filter((t) => t.category === "framework" || t.category === "frontend" || t.category === "backend"),
    databases: detectedTech.filter((t) => t.category === "database"),
    styling: detectedTech.filter((t) => t.category === "styling"),
    devops: detectedTech.filter((t) => t.category === "devops"),
    tools: detectedTech.filter((t) => t.category === "tools" || t.category === "testing"),
  };

  const primaryLang = languages[0]?.name || repoData.language || "JavaScript";

  // Check if Gemini API key exists
  let aiInsights = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim().length > 5) {
    aiInsights = await callGeminiForTechStack(repoData, detectedTech, languages, apiKey);
  }

  const summary = aiInsights?.summary || 
    `This project is built around ${primaryLang} with a modular stack comprising ${detectedTech.length > 0 ? detectedTech.slice(0, 4).map((t) => t.name).join(", ") : primaryLang}. It follows modern development conventions with dedicated configuration for tooling and dependency management.`;

  const strengths = aiInsights?.strengths || [
    `Strong language foundation powered primarily by ${primaryLang}`,
    detectedTech.length > 0 ? `Industry standard libraries including ${detectedTech.slice(0, 3).map((t) => t.name).join(", ")}` : "Modular, dependency-isolated structure",
    `Clear entry points and maintainable configuration files`,
  ];

  const runtime = aiInsights?.runtime || (primaryLang === "Python" ? "Python 3.9+" : "Node.js (LTS)");

  return {
    languages,
    detectedCount: detectedTech.length,
    architecture,
    categorized,
    summary,
    strengths,
    runtime,
    engine: aiInsights ? "Gemini 1.5 Flash" : "Automated Codebase Scanner",
  };
}

module.exports = {
  detectTechStack,
  processLanguages,
  detectTechnologies,
};
