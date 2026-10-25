/**
 * AI/githubService.js
 * Ingestion module to extract repository metadata, README, and dependency manifests.
 */

// Helper to extract owner and repo from URL or "owner/repo" string
function parseGithubUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") {
    throw new Error("Invalid GitHub URL provided.");
  }

  const cleaned = rawUrl.trim().replace(/\/+$/, "");
  // Matches:
  // - https://github.com/owner/repo
  // - http://github.com/owner/repo
  // - github.com/owner/repo
  // - owner/repo
  const match = cleaned.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)/i) 
    || cleaned.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);

  if (!match) {
    throw new Error("Could not parse GitHub owner and repository name from URL.");
  }

  const owner = match[1];
  const repo = match[2].replace(/\.git$/i, "");

  return { owner, repo, fullName: `${owner}/${repo}` };
}

/**
 * Fetch raw README text from GitHub
 */
async function fetchReadme(owner, repo, defaultBranch = "main") {
  const branchesToTry = [defaultBranch, "main", "master"];
  const filenamesToTry = ["README.md", "Readme.md", "readme.md", "README", "README.rst"];

  for (const branch of branchesToTry) {
    for (const filename of filenamesToTry) {
      try {
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filename}`;
        const res = await fetch(rawUrl, {
          headers: { "User-Agent": "Codebase-Onboarder" },
        });

        if (res.ok) {
          const text = await res.text();
          if (text && text.trim().length > 0) {
            return text;
          }
        }
      } catch (err) {
        // Continue trying next option
      }
    }
  }

  // Fallback: GitHub API readme endpoint
  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
    const res = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Codebase-Onboarder",
        Accept: "application/vnd.github.v3.raw",
      },
    });
    if (res.ok) {
      return await res.text();
    }
  } catch (err) {
    // Readme not found
  }

  return "";
}

/**
 * Fetch raw file from GitHub raw content
 */
async function fetchRawFile(owner, repo, filename, defaultBranch = "main") {
  const branchesToTry = [defaultBranch, "main", "master"];

  for (const branch of branchesToTry) {
    try {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filename}`;
      const res = await fetch(rawUrl, {
        headers: { "User-Agent": "Codebase-Onboarder" },
      });

      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 0) {
          return text;
        }
      }
    } catch (err) {
      // Continue trying next branch
    }
  }
  return null;
}

/**
 * Fetch language byte breakdown from GitHub API
 */
async function fetchLanguages(owner, repo, headers) {
  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/languages`;
    const res = await fetch(apiUrl, { headers });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Languages API not available or rate limited
  }
  return null;
}

/**
 * Fetch root directory contents to detect presence of configuration and docker files
 */
async function fetchRootContents(owner, repo, headers) {
  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
    const res = await fetch(apiUrl, { headers });
    if (res.ok) {
      const items = await res.json();
      if (Array.isArray(items)) {
        return items.map((item) => ({
          name: item.name,
          path: item.path,
          type: item.type, // "file" or "dir"
        }));
      }
    }
  } catch (err) {
    // Continue
  }
  return [];
}

/**
 * Fetch package.json if it exists (for JS/TS apps)
 */
async function fetchPackageJson(owner, repo, defaultBranch = "main") {
  const branchesToTry = [defaultBranch, "main", "master"];

  for (const branch of branchesToTry) {
    try {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/package.json`;
      const res = await fetch(rawUrl, {
        headers: { "User-Agent": "Codebase-Onboarder" },
      });

      if (res.ok) {
        const text = await res.text();
        return JSON.parse(text);
      }
    } catch (err) {
      // Continue
    }
  }
  return null;
}

/**
 * Main ingestion function: extracts complete repository context
 */
async function getRepoData(repoUrl, githubToken = null) {
  const { owner, repo, fullName } = parseGithubUrl(repoUrl);

  const headers = {
    "User-Agent": "Codebase-Onboarder",
    Accept: "application/vnd.github.v3+json",
  };
  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  // 1. Fetch main repo details
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const response = await fetch(apiUrl, { headers });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`GitHub repository "${fullName}" was not found or is private.`);
    }
    if (response.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Please try again in a few minutes.");
    }
    throw new Error(`Failed to fetch repository metadata: HTTP ${response.status}`);
  }

  const data = await response.json();
  const defaultBranch = data.default_branch || "main";

  // 2. Fetch README, package.json, languages, and root contents concurrently
  const [readme, packageJson, languages, rootContents, requirementsTxt, cargoToml, goMod] = await Promise.all([
    fetchReadme(owner, repo, defaultBranch),
    fetchPackageJson(owner, repo, defaultBranch),
    fetchLanguages(owner, repo, headers),
    fetchRootContents(owner, repo, headers),
    fetchRawFile(owner, repo, "requirements.txt", defaultBranch),
    fetchRawFile(owner, repo, "Cargo.toml", defaultBranch),
    fetchRawFile(owner, repo, "go.mod", defaultBranch),
  ]);

  return {
    owner,
    repo,
    fullName: data.full_name || fullName,
    url: data.html_url || `https://github.com/${fullName}`,
    description: data.description || "",
    stars: data.stargazers_count || 0,
    forks: data.forks_count || 0,
    language: data.language || "Unknown",
    topics: data.topics || [],
    defaultBranch,
    readme,
    packageJson,
    languages: languages || (data.language ? { [data.language]: 100 } : {}),
    rootContents: rootContents || [],
    manifests: {
      requirementsTxt,
      cargoToml,
      goMod,
    },
    license: data.license ? data.license.name || data.license.spdx_id : null,
  };
}

module.exports = {
  parseGithubUrl,
  getRepoData,
};
