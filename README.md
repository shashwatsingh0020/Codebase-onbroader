# 🚀 Codebase Onboarder

**Codebase Onboarder** is an AI-powered tool that helps developers quickly understand unfamiliar GitHub repositories.

Instead of manually exploring a large codebase, developers can provide a GitHub repository and get an AI-generated overview of its **purpose, technology stack, folder structure, important files, and codebase insights**.

---

## 🎯 Problem

Understanding an unfamiliar codebase can take a lot of time. Developers often need to go through hundreds of files, understand dependencies, identify the main components, and figure out how different parts of the project work together.

**Codebase Onboarder reduces this onboarding effort by using AI to analyze and explain the repository.**

---

## 💡 Key Features

* 📋 **Project Summary**
  Get a quick overview of what the repository does.

* 🛠️ **Tech Stack Detection**
  Identify programming languages, frameworks, libraries, and tools used in the project.

* 📁 **Folder Structure Explanation**
  Understand the purpose of important folders and files.

* ⭐ **Important Files**
  Identify key files such as entry points, configuration files, routes, models, and core logic.

* 💬 **AI Codebase Chat**
  Ask questions about the repository using natural language.

* 📊 **Repository Insights**
  Get useful information about project organization, documentation, dependencies, and maintainability.

---

## 🏗️ Architecture

```text
                    GitHub Repository
                           │
                           ▼
                    GitHub API
                           │
                           ▼
                  Repository Analyzer
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
        File Structure              Source Code
              │                         │
              └────────────┬────────────┘
                           ▼
                       AI / LLM
                           │
                           ▼
                  Generated Insights
                           │
                           ▼
                    Developer Dashboard
```

---

## 📂 Project Structure

```text
Codebase-Onboarder/
│
├── Frontend/        # React-based user interface
│
├── Backend/         # Node.js & Express server
│
├── AI/              # AI analysis and LLM integration
│
├── README.md
└── .gitignore
```

---

## 🧰 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* MongoDB Atlas

### AI

* LLM / AI API
* AI-powered repository analysis

### Tools & Services

* Git & GitHub
* GitHub API
* Postman

---

## 🔄 How It Works

```text
1. User provides a GitHub repository
                ↓
2. Repository data is fetched
                ↓
3. Files and folders are analyzed
                ↓
4. Relevant code is processed
                ↓
5. AI generates repository insights
                ↓
6. Results are displayed on the dashboard
                ↓
7. User can interact with the AI
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git
* MongoDB / MongoDB Atlas
* Required AI API credentials

### Clone the Repository

```bash
git clone https://github.com/<your-username>/Codebase-Onboarder.git

cd Codebase-Onboarder
```

### Install Frontend

```bash
cd Frontend
npm install
npm run dev
```

### Install Backend

Open another terminal:

```bash
cd Backend
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in the backend:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GITHUB_TOKEN=your_github_token
AI_API_KEY=your_ai_api_key
```

> Never commit your `.env` file to GitHub.

---

## 🌱 Git Workflow

We use feature branches for development instead of directly working on `main`.

```text
main
 ├── feature/frontend
 ├── feature/backend
 └── feature/ai
```

Example:

```bash
git checkout -b feature/frontend

git add .
git commit -m "feat: implement frontend dashboard"

git push origin feature/frontend
```

After completing and testing a feature, the branch can be merged into `main`.

---

## 🚀 Future Improvements

* Repository architecture visualization
* Advanced code search
* Repository-specific RAG
* Automatic documentation generation
* Code quality and security analysis
* Improved AI-powered code explanations

---

## 👨‍💻 Developers

**Developed by:**

* **Vishal Kumar**
* **Shashwat Singh**

Built as a collaborative project using **React, Node.js, MongoDB, GitHub APIs, and AI**.

---

## ⭐ Vision

> **Understand any codebase before you start coding.**

Codebase Onboarder aims to make developer onboarding **faster, simpler, and more intelligent**.
