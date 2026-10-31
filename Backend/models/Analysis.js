const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Allows guest/unauthenticated testing as well
    },
    repoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    repoName: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: String,
      required: true,
      trim: true,
    },
    meta: {
      fullName: String,
      description: String,
      stars: Number,
      forks: Number,
      language: String,
      topics: [String],
      defaultBranch: String,
      license: String,
    },
    // Feature 1: Project Summary
    summary: {
      headline: { type: String, required: true },
      overview: { type: String, required: true },
      keyObjectives: [{ type: String }],
      targetAudience: [{ type: String }],
      architectureHighlights: [{ type: String }],
      engine: String,
      note: String,
    },
    // Feature 2: Tech Stack Detection
    techStack: {
      languages: [
        {
          name: String,
          bytes: Number,
          percentage: Number,
          color: String,
        },
      ],
      detectedCount: Number,
      architecture: String,
      categorized: {
        frameworks: [{ name: String, category: String, description: String }],
        databases: [{ name: String, category: String, description: String }],
        styling: [{ name: String, category: String, description: String }],
        devops: [{ name: String, category: String, description: String }],
        tools: [{ name: String, category: String, description: String }],
      },
      summary: String,
      strengths: [String],
      runtime: String,
      engine: String,
    },
    // Feature 3 / Phase 4: Folder Structure Explanation
    folderStructure: {
      overview: String,
      totalFolders: Number,
      engine: String,
      folders: [
        {
          name: String,
          path: String,
          category: String,
          role: String,
          importance: String,
          explanation: String,
          fileCount: Number,
          keyContents: [String],
        },
      ],
    },
    // Feature 4 / Phase 5: Important Files Identification
    importantFiles: {
      summary: String,
      totalIdentified: Number,
      highImportanceCount: Number,
      mediumImportanceCount: Number,
      recommendedSequence: [String],
      engine: String,
      files: [
        {
          name: String,
          path: String,
          importance: String,
          category: String,
          explanation: String,
          readingOrder: Number,
          keyHighlights: [String],
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Analysis", analysisSchema);
