const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// AI Engine and MongoDB Models
const Analysis = require("./models/Analysis");
const {
  analyzeProjectSummary,
  analyzeTechStack,
  analyzeFolderStructure,
  analyzeImportantFiles,
  explainFolderStructure,
  identifyImportantFiles,
} = require("../AI/index.js");

// ==============================================================================
// 1. EXPRESS APP INITIALIZATION & MIDDLEWARES
// ==============================================================================
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "codebase_onboarder_secret_key_2026";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/codebase_onboarder";

// Enable CORS so React frontend can talk to this API
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB database successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No authentication token provided in Authorization header.",
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

// Optional token extractor so unauthenticated users can still generate summaries
const optionalVerifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader.trim();
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Invalid/expired token: continue as guest
    }
  }
  next();
};

// ==============================================================================
// 5. AUTHENTICATION ROUTES
// ==============================================================================
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, password) are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: "Account created and saved to MongoDB successfully!",
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error occurred during signup.",
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please check your credentials.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please check your credentials.",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error occurred during login.",
    });
  }
});

app.get("/api/auth/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found in database.",
      });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving user profile.",
    });
  }
});

app.get("/api/auth/users", async (req, res) => {
  try {
    const allUsers = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      totalUsers: allUsers.length,
      users: allUsers.map(sanitizeUser),
    });
  } catch (error) {
    console.error("Users list error:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving users list.",
    });
  }
});

app.post("/api/analyze/summary", optionalVerifyToken, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "A valid GitHub repository URL is required.",
      });
    }

    console.log(`[Backend] Starting Project Summary analysis for: ${url}`);
    const result = await analyzeProjectSummary(url);

    // Save to MongoDB
    let savedAnalysis = null;
    try {
      savedAnalysis = await Analysis.create({
        user: req.user ? req.user.id : null,
        repoUrl: result.meta.url,
        repoName: result.meta.repo,
        owner: result.meta.owner,
        meta: result.meta,
        summary: result.summary,
        techStack: result.techStack,
        folderStructure: result.folderStructure,
        importantFiles: result.importantFiles,
      });
    } catch (saveError) {
      console.error("[Backend] Failed to persist analysis to MongoDB:", saveError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Repository onboarding analysis generated successfully!",
      analysisId: savedAnalysis ? savedAnalysis._id : null,
      meta: result.meta,
      summary: result.summary,
      techStack: result.techStack,
      folderStructure: result.folderStructure,
      importantFiles: result.importantFiles,
    });
  } catch (error) {
    console.error("[Backend] Analysis error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze repository.",
    });
  }
});


app.post("/api/analyze/techstack", optionalVerifyToken, async (req, res) => {
  try {
    const { url, analysisId } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "A valid GitHub repository URL is required.",
      });
    }

    // Check if we already have it in MongoDB with techStack
    let existing = null;
    if (analysisId) {
      existing = await Analysis.findById(analysisId);
    } else {
      existing = await Analysis.findOne({ repoUrl: url.trim() }).sort({ createdAt: -1 });
    }

    if (existing && existing.techStack && existing.techStack.languages && existing.techStack.languages.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Tech stack loaded from saved analysis.",
        analysisId: existing._id,
        meta: existing.meta,
        techStack: existing.techStack,
      });
    }

    console.log(`[Backend] Starting Tech Stack analysis for: ${url}`);
    const result = await analyzeTechStack(url);

    if (existing) {
      existing.techStack = result.techStack;
      if (!existing.meta) existing.meta = result.meta;
      await existing.save();
    } else {
      try {
        existing = await Analysis.create({
          user: req.user ? req.user.id : null,
          repoUrl: result.meta.url,
          repoName: result.meta.repo,
          owner: result.meta.owner,
          meta: result.meta,
          techStack: result.techStack,
        });
      } catch (saveErr) {
        console.error("Save error:", saveErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Tech stack detected successfully!",
      analysisId: existing ? existing._id : null,
      meta: result.meta,
      techStack: result.techStack,
    });
  } catch (error) {
    console.error("[Backend] Tech stack analysis error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to detect tech stack.",
    });
  }
});


app.post("/api/analyze/folderstructure", optionalVerifyToken, async (req, res) => {
  try {
    const { url, analysisId, folders } = req.body;

    // Check if direct folders array is provided
    if (Array.isArray(folders) && folders.length > 0) {
      console.log(`[Backend] Explaining explicit folder structure:`, folders);
      const folderStructure = await explainFolderStructure(folders);
      return res.status(200).json({
        success: true,
        message: "Folder structure explained successfully!",
        folderStructure,
      });
    }

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "A valid GitHub repository URL or folders array is required.",
      });
    }

    // Check if already in MongoDB with folderStructure
    let existing = null;
    if (analysisId) {
      existing = await Analysis.findById(analysisId);
    } else {
      existing = await Analysis.findOne({ repoUrl: url.trim() }).sort({ createdAt: -1 });
    }

    if (existing && existing.folderStructure && existing.folderStructure.folders && existing.folderStructure.folders.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Folder structure loaded from saved analysis.",
        analysisId: existing._id,
        meta: existing.meta,
        folderStructure: existing.folderStructure,
      });
    }

    console.log(`[Backend] Starting Folder Structure analysis for: ${url}`);
    const result = await analyzeFolderStructure(url);

    if (existing) {
      existing.folderStructure = result.folderStructure;
      if (!existing.meta) existing.meta = result.meta;
      await existing.save();
    } else {
      try {
        existing = await Analysis.create({
          user: req.user ? req.user.id : null,
          repoUrl: result.meta.url,
          repoName: result.meta.repo,
          owner: result.meta.owner,
          meta: result.meta,
          folderStructure: result.folderStructure,
        });
      } catch (saveErr) {
        console.error("Save error:", saveErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Folder structure analyzed successfully!",
      analysisId: existing ? existing._id : null,
      meta: result.meta,
      folderStructure: result.folderStructure,
    });
  } catch (error) {
    console.error("[Backend] Folder structure analysis error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze folder structure.",
    });
  }
});


app.post("/api/analyze/importantfiles", optionalVerifyToken, async (req, res) => {
  try {
    const { url, analysisId, files } = req.body;

    // Check if direct files array is provided
    if (Array.isArray(files) && files.length > 0) {
      console.log(`[Backend] Explaining explicit files list:`, files);
      const importantFiles = await identifyImportantFiles(files);
      return res.status(200).json({
        success: true,
        message: "Important files identified successfully!",
        importantFiles,
      });
    }

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "A valid GitHub repository URL or files array is required.",
      });
    }

    // Check if already in MongoDB with importantFiles
    let existing = null;
    if (analysisId) {
      existing = await Analysis.findById(analysisId);
    } else {
      existing = await Analysis.findOne({ repoUrl: url.trim() }).sort({ createdAt: -1 });
    }

    if (existing && existing.importantFiles && existing.importantFiles.files && existing.importantFiles.files.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Important files loaded from saved analysis.",
        analysisId: existing._id,
        meta: existing.meta,
        importantFiles: existing.importantFiles,
      });
    }

    console.log(`[Backend] Starting Important Files analysis for: ${url}`);
    const result = await analyzeImportantFiles(url);

    if (existing) {
      existing.importantFiles = result.importantFiles;
      if (!existing.meta) existing.meta = result.meta;
      await existing.save();
    } else {
      try {
        existing = await Analysis.create({
          user: req.user ? req.user.id : null,
          repoUrl: result.meta.url,
          repoName: result.meta.repo,
          owner: result.meta.owner,
          meta: result.meta,
          importantFiles: result.importantFiles,
        });
      } catch (saveErr) {
        console.error("Save error:", saveErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Important files analyzed successfully!",
      analysisId: existing ? existing._id : null,
      meta: result.meta,
      importantFiles: result.importantFiles,
    });
  } catch (error) {
    console.error("[Backend] Important files analysis error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to identify important files.",
    });
  }
});

/**
 * GET /api/analyze/history
 * Fetches saved analyses for the authenticated user so they see previous results after login.
 */
app.get("/api/analyze/history", verifyToken, async (req, res) => {
  try {
    const history = await Analysis.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    console.error("History fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve analysis history.",
    });
  }
});

/**
 * GET /api/analyze/:id
 * Fetches a single saved analysis by ID.
 */
app.get("/api/analyze/:id", async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis report not found.",
      });
    }
    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching analysis report.",
    });
  }
});

/**
 * DELETE /api/analyze/:id
 * Removes a saved analysis for the authenticated user.
 */
app.delete("/api/analyze/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Analysis.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found or unauthorized.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Analysis deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete analysis.",
    });
  }
});

app.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };

  res.json({
    status: "active",
    name: "Codebase Onboarder API",
    database: {
      status: dbStatusMap[dbState] || "Unknown",
      connected: dbState === 1,
    },
    endpoints: {
      auth: {
        signup: "POST /api/auth/signup",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me",
        users: "GET /api/auth/users",
      },
      aiAnalysis: {
        summary: "POST /api/analyze/summary (All Features: Summary, Tech Stack, Folders, Files)",
        techstack: "POST /api/analyze/techstack (Feature 2: Tech Stack Detection)",
        folderstructure: "POST /api/analyze/folderstructure (Feature 3 / Phase 4: Folder Structure Explanation)",
        importantfiles: "POST /api/analyze/importantfiles (Feature 4 / Phase 5: Important Files Identification)",
        history: "GET /api/analyze/history (User saved reports)",
        getById: "GET /api/analyze/:id",
        delete: "DELETE /api/analyze/:id",
      },
    },
  });
});

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` MongoDB URI: ${MONGODB_URI}`);
    console.log(` Feature 1 (Project Summary) Active!`);
    console.log(` Feature 2 (Tech Stack Detection) Active!`);
    console.log(` Feature 3 / Phase 4 (Folder Structure) Active!`);
    console.log(` Feature 4 / Phase 5 (Important Files) Active!`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
