/**
 * AI/index.js
 * Main entry point for AI Module
 */

const { getRepoData, parseGithubUrl } = require("./githubService");
const { generateProjectSummary } = require("./summaryService");

/**
 * Executes Feature 1: Analyzes GitHub Repo and returns structured Project Summary
 */
async function analyzeProjectSummary(repoUrl, githubToken = null) {
  // 1. Fetch GitHub metadata, README, and dependency manifests
  const repoData = await getRepoData(repoUrl, githubToken);

  // 2. Generate Feature 1: Project Summary via AI / fallback engine
  const summary = await generateProjectSummary(repoData);

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
  };
}

module.exports = {
  analyzeProjectSummary,
  getRepoData,
  parseGithubUrl,
  generateProjectSummary,
};
