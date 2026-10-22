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
    summary: {
      headline: { type: String, required: true },
      overview: { type: String, required: true },
      keyObjectives: [{ type: String }],
      targetAudience: [{ type: String }],
      architectureHighlights: [{ type: String }],
      engine: String,
      note: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Analysis", analysisSchema);
