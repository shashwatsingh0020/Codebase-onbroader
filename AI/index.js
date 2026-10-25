/**
 * AI/index.js
 * Main entry point for AI Module
 */

const { getRepoData, parseGithubUrl } = require("./githubService");
const { generateProjectSummary } = require("./summaryService");
const { detectTechStack } = require("./techStackService");

/**
 * Executes Feature 1 (Project Summary) & Feature 2 (Tech Stack Detection)
 */
async function analyzeProjectSummary(repoUrl, githubToken = null) {
  // 1. Fetch GitHub metadata, README, languages, and dependency manifests
  const repoData = await getRepoData(repoUrl, githubToken);

  // 2. Generate Feature 1 & Feature 2 concurrently
  const [summary, techStack] = await Promise.all([
    generateProjectSummary(repoData),
    detectTechStack(repoData),
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

module.exports = {
  analyzeProjectSummary,
  analyzeTechStack,
  detectTechStack,
  getRepoData,
  parseGithubUrl,
  generateProjectSummary,
};
