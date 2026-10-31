
function parseGithubUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") {
    throw new Error("Invalid GitHub URL provided.");
  }

  const cleaned = rawUrl.trim().replace(/\/+$/, "");
  const match = cleaned.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)/i) 
    || cleaned.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);

  if (!match) {
    throw new Error("Could not parse GitHub owner and repository name from URL.");
  }

  const owner = match[1];
  const repo = match[2].replace(/\.git$/i, "");

  return { owner, repo, fullName: `${owner}/${repo}` };
}

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
      }
    }
  }
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
 * Fetch the recursive Git tree from GitHub to discover full directory hierarchy and file list
 */
async function fetchRepoTree(owner, repo, defaultBranch = "main", headers = {}) {
  const branchesToTry = [defaultBranch, "main", "master"];

  for (const branch of branchesToTry) {
    try {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
      const res = await fetch(apiUrl, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.tree)) {
          return {
            items: data.tree.map((item) => ({
              path: item.path,
              name: item.path.split("/").pop(),
              type: item.type === "tree" ? "dir" : "file",
              size: item.size || 0,
            })),
            truncated: !!data.truncated,
          };
        }
      }
    } catch (err) {
      // Continue trying next branch
    }
  }

  return { items: [], truncated: false };
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

  // 2. Fetch README, package.json, languages, root contents, manifests, and git tree concurrently
  const [readme, packageJson, languages, rootContents, requirementsTxt, cargoToml, goMod, repoTree] = await Promise.all([
    fetchReadme(owner, repo, defaultBranch),
    fetchPackageJson(owner, repo, defaultBranch),
    fetchLanguages(owner, repo, headers),
    fetchRootContents(owner, repo, headers),
    fetchRawFile(owner, repo, "requirements.txt", defaultBranch),
    fetchRawFile(owner, repo, "Cargo.toml", defaultBranch),
    fetchRawFile(owner, repo, "go.mod", defaultBranch),
    fetchRepoTree(owner, repo, defaultBranch, headers),
  ]);

  // Derive folder and file lists
  const treeItems = repoTree?.items || [];
  const foldersSet = new Set();
  const filesSet = new Set();

  treeItems.forEach((item) => {
    if (item.type === "dir") {
      foldersSet.add(item.path);
    } else {
      filesSet.add(item.path);
      // Also register any parent directories inferred from file path
      const parts = item.path.split("/");
      for (let i = 1; i < parts.length; i++) {
        foldersSet.add(parts.slice(0, i).join("/"));
      }
    }
  });

  // Supplement with root contents if tree was empty
  (rootContents || []).forEach((rc) => {
    if (rc.type === "dir") foldersSet.add(rc.path);
    if (rc.type === "file") filesSet.add(rc.path);
  });

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
    tree: treeItems,
    folders: Array.from(foldersSet).sort(),
    files: Array.from(filesSet).sort(),
    treeTruncated: repoTree?.truncated || false,
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
  fetchRepoTree,
};
