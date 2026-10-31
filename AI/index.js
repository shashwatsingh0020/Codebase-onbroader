/**
 * AI/index.js
 * Main entry point for AI Module
 */

const { getRepoData, parseGithubUrl } = require("./githubService");
const { generateProjectSummary } = require("./summaryService");
const { detectTechStack } = require("./techStackService");
const { explainFolderStructure } = require("./folderStructureService");
const { identifyImportantFiles } = require("./importantFilesService");

/**
 * Executes complete repository onboarding analysis:
 * - Feature 1: Project Summary
 * - Feature 2: Tech Stack Detection
 * - Feature 3 / Phase 4: Folder Structure Explanation
 * - Feature 4 / Phase 5: Important Files Identification
 */
async function analyzeProjectSummary(repoUrl, githubToken = null) {
  // 1. Fetch GitHub metadata, README, languages, tree, and manifests
  const repoData = await getRepoData(repoUrl, githubToken);

  // 2. Generate all features concurrently
  const [summary, techStack, folderStructure, importantFiles] = await Promise.all([
    generateProjectSummary(repoData),
    detectTechStack(repoData),
    explainFolderStructure(repoData),
    identifyImportantFiles(repoData),
  ]);

  return {
    meta: {
      fullName: repoData.fullName,
      owner: repoData.owner,
      repo: repoData.repo,
      url: repoData.url,
      description: repoData.description,
      stars: repoData.stars,
      forks: repoData.forks,
      language: repoData.language,
      topics: repoData.topics,
      defaultBranch: repoData.defaultBranch,
      license: repoData.license,
    },
    summary,
    techStack,
    folderStructure,
    importantFiles,
  };
}

/**
 * Executes Feature 2 independently: Tech Stack Detection
 */
async function analyzeTechStack(repoUrl, githubToken = null) {
  const repoData = await getRepoData(repoUrl, githubToken);
  const techStack = await detectTechStack(repoData);

  return {
    meta: {
      fullName: repoData.fullName,
      owner: repoData.owner,
      repo: repoData.repo,
      url: repoData.url,
      description: repoData.description,
      stars: repoData.stars,
      forks: repoData.forks,
      language: repoData.language,
      topics: repoData.topics,
      defaultBranch: repoData.defaultBranch,
      license: repoData.license,
    },
    techStack,
  };
}

/**
 * Executes Feature 3 / Phase 4 independently: Folder Structure Explanation
 */
async function analyzeFolderStructure(repoUrlOrFolders, githubToken = null) {
  // If array of folder names was passed directly
  if (Array.isArray(repoUrlOrFolders)) {
    const folderStructure = await explainFolderStructure(repoUrlOrFolders);
    return { folderStructure };
  }

  const repoData = await getRepoData(repoUrlOrFolders, githubToken);
  const folderStructure = await explainFolderStructure(repoData);

  return {
    meta: {
      fullName: repoData.fullName,
      owner: repoData.owner,
      repo: repoData.repo,
      url: repoData.url,
      description: repoData.description,
      stars: repoData.stars,
      forks: repoData.forks,
      language: repoData.language,
      topics: repoData.topics,
      defaultBranch: repoData.defaultBranch,
      license: repoData.license,
    },
    folderStructure,
  };
}

/**
 * Executes Feature 4 / Phase 5 independently: Important Files Identification
 */
async function analyzeImportantFiles(repoUrlOrFiles, githubToken = null) {
  // If array of file names was passed directly
  if (Array.isArray(repoUrlOrFiles)) {
    const importantFiles = await identifyImportantFiles(repoUrlOrFiles);
    return { importantFiles };
  }

  const repoData = await getRepoData(repoUrlOrFiles, githubToken);
  const importantFiles = await identifyImportantFiles(repoData);

  return {
    meta: {
      fullName: repoData.fullName,
      owner: repoData.owner,
      repo: repoData.repo,
      url: repoData.url,
      description: repoData.description,
      stars: repoData.stars,
      forks: repoData.forks,
      language: repoData.language,
      topics: repoData.topics,
      defaultBranch: repoData.defaultBranch,
      license: repoData.license,
    },
    importantFiles,
  };
}

module.exports = {
  analyzeProjectSummary,
  analyzeTechStack,
  analyzeFolderStructure,
  analyzeImportantFiles,
  detectTechStack,
  explainFolderStructure,
  identifyImportantFiles,
  getRepoData,
  parseGithubUrl,
  generateProjectSummary,
};
