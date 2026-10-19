
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ==============================================================================
// 2. EXPRESS APP INITIALIZATION & MIDDLEWARES
// ==============================================================================
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "codebase_onboarder_secret_key_2026";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/codebase_onboarder";

// Enable CORS so our React frontend (running on Vite, e.g., localhost:5173) can talk to this API
app.use(
  cors({
    origin: "*", // Allows any origin or specify frontend URL: "http://localhost:5173"
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Built-in middleware to parse incoming JSON request bodies (req.body)
app.use(express.json());

// ==============================================================================
// 3. MONGODB DATABASE CONNECTION
// ==============================================================================
// Connect to MongoDB using Mongoose. Supports local MongoDB or MongoDB Atlas via MONGODB_URI in .env
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB database successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.log("Tip: If running locally, make sure MongoDB is started. For cloud, add your MongoDB Atlas URI in .env");
  });

// ==============================================================================
// 4. MONGOOSE USER SCHEMA & MODEL
// ==============================================================================
// Define schema for storing registered user information in MongoDB
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
    timestamps: true, // Automatically manages createdAt and updatedAt in MongoDB
  }
);

// Create Mongoose model for the "users" collection
const User = mongoose.model("User", userSchema);

// ==============================================================================
// 5. HELPER UTILITIES
// ==============================================================================
// Helper to generate a signed JSON Web Token (JWT)
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" } // Token is valid for 7 days
  );
};

// Helper to sanitize user object (never expose hashed password to client)
const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// ==============================================================================
// 6. AUTHENTICATION MIDDLEWARE (Protected Routes Guard)
// ==============================================================================
// This middleware verifies the JWT token from the Authorization header
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No authentication token provided in Authorization header.",
    });
  }

  // Expecting format: "Bearer <token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded payload { id, email, name } to req.user
    next(); // Pass control to the next handler
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

// ==============================================================================
// 7. AUTHENTICATION ROUTES (MongoDB Operations)
// ==============================================================================

// ------------------------------------------------------------------------------
// Route 1: User Signup (Save user to MongoDB)
// Method: POST /api/auth/signup
// Body: { name, email, password }
// ------------------------------------------------------------------------------
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, password) are required.",
      });
    }

    // 2. Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 3. Check if user already exists in MongoDB
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in.",
      });
    }

    // 4. Hash password with bcrypt (salt rounds = 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create and save new user into MongoDB
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    // 6. Generate JWT token
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
      message: error.message || "Server error occurred during signup. Please try again.",
    });
  }
});

// ------------------------------------------------------------------------------
// Route 2: User Login (Verify credentials from MongoDB)
// Method: POST /api/auth/login
// Body: { email, password }
// ------------------------------------------------------------------------------
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Find user in MongoDB by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please check your credentials.",
      });
    }

    // 3. Compare entered password with hashed password stored in MongoDB
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please check your credentials.",
      });
    }

    // 4. Generate JWT token
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
      message: error.message || "Server error occurred during login. Please try again.",
    });
  }
});

// ------------------------------------------------------------------------------
// Route 3: Get Current User Profile (Protected Route from MongoDB)
// Method: GET /api/auth/me
// Headers: Authorization: Bearer <token>
// ------------------------------------------------------------------------------
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

// ------------------------------------------------------------------------------
// Route 4: Get All Registered Users from MongoDB
// Method: GET /api/auth/users
// ------------------------------------------------------------------------------
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
      message: "Error retrieving users list from database.",
    });
  }
});

// ==============================================================================
// 8. HEALTH CHECK & WELCOME ROUTE
// ==============================================================================
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
    name: "Codebase Onboarder Authentication API with MongoDB",
    database: {
      status: dbStatusMap[dbState] || "Unknown",
      connected: dbState === 1,
    },
    endpoints: {
      signup: "POST /api/auth/signup",
      login: "POST /api/auth/login",
      profile: "GET /api/auth/me (requires Bearer token)",
      users: "GET /api/auth/users",
    },
  });
});

// Fallback 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
  });
});

// ==============================================================================
// 9. SERVER START
// ==============================================================================
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` Auth Server running on http://localhost:${PORT}`);
    console.log(` MongoDB URI: ${MONGODB_URI}`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
