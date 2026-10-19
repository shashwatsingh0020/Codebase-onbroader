import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  FileText,
  Layers,
  FolderTree,
  Folder,
  Code2,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Frown,
  Zap,
  Lightbulb,
  Cpu,
  Send,
  Check,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

function GithubIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [repoUrl, setRepoUrl] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    const targetUrl = repoUrl.trim();
    if (user) {
      navigate(targetUrl ? `/dashboard?repo=${encodeURIComponent(targetUrl)}` : "/dashboard");
    } else {
      navigate(targetUrl ? `/signup?repo=${encodeURIComponent(targetUrl)}` : "/signup");
    }
  };

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden bg-[#090d16] text-slate-100">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[650px] w-[950px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-purple-600/20 blur-[130px]" />
      <div className="pointer-events-none absolute top-[1200px] right-[-10%] -z-10 h-[500px] w-[600px] rounded-full bg-blue-600/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-[2200px] left-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[140px]" />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative mx-auto w-full max-w-7xl px-4 pt-12 pb-20 sm:px-6 lg:px-8 lg:pt-16 lg:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Hero Copy & Quick Input */}
          <div className="flex flex-col items-start text-left lg:col-span-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-medium text-blue-300 backdrop-blur-md">
              <Sparkles size={13} className="text-blue-400" />
              <span>AI-Powered Codebase Understanding</span>
            </div>

            {/* Headline */}
            <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Understand Any Codebase{" "}
              <span className="block mt-1 bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Without the Guesswork.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-350 sm:text-lg">
              Turn unfamiliar repositories into clear project summaries, understandable architecture, and actionable insights — powered by AI.
            </p>

            {/* Input / Get Started Form */}
            <form onSubmit={handleHeroSubmit} className="mt-8 w-full max-w-lg">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl border border-white/10 bg-[#0d121f]/90 p-1.5 shadow-[0_0_35px_-8px_rgba(59,130,246,0.3)] backdrop-blur-xl transition-all focus-within:border-blue-500/60 focus-within:ring-2 focus-within:ring-blue-500/20">
                <div className="flex flex-1 items-center gap-3 px-3 py-2">
                  <GithubIcon size={18} className="shrink-0 text-slate-400" />
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="Paste a GitHub repository URL..."
                    className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 sm:mt-0 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>

            {/* 4 Feature Pills Below Input */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1 text-slate-300">
                <FileText size={13} className="text-cyan-400" />
                Project Summary
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1 text-slate-300">
                <Layers size={13} className="text-blue-400" />
                Tech Stack
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1 text-slate-300">
                <FolderTree size={13} className="text-emerald-400" />
                Folder Structure
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1 text-slate-300">
                <MessageSquare size={13} className="text-purple-400" />
                AI Chat
              </span>
            </div>
          </div>

          {/* Right Column: High-Fidelity Floating Dashboard Preview Card */}
          <div className="relative lg:col-span-6">
            {/* Playful Handwritten Annotation & Arrow */}
            <div className="absolute -top-10 right-4 hidden sm:flex items-center gap-2 text-indigo-300 select-none z-20">
              <span className="font-serif italic text-sm tracking-wide text-indigo-300/90 rotate-[-4deg]">
                From Repository to Understanding ✨
              </span>
              <svg className="w-8 h-8 text-indigo-400 -rotate-12" viewBox="0 0 40 40" fill="none">
                <path d="M5 30 C 15 10, 25 10, 35 25" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                <path d="M30 24 L 35 25 L 34 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* The Main App Mockup Card */}
            <div className="relative rounded-2xl border border-white/10 bg-[#0c101c]/95 p-4 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8),0_0_40px_-5px_rgba(59,130,246,0.25)] backdrop-blur-2xl">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600/20 text-blue-400 font-bold text-xs">
                    &lt;/&gt;
                  </span>
                  <span className="text-xs font-semibold text-slate-200">Codebase Onboarder</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                </div>
              </div>

              {/* Window Body with Sidebar + Main Workspace */}
              <div className="mt-3 grid grid-cols-12 gap-3">
                {/* Mini Sidebar */}
                <div className="col-span-4 flex flex-col gap-1 border-r border-white/5 pr-2 text-[11px]">
                  <button className="flex items-center gap-1.5 rounded-md bg-blue-500/15 px-2 py-1.5 font-medium text-blue-300">
                    <FileText size={12} />
                    <span>Overview</span>
                  </button>
                  <button className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-slate-400 hover:text-slate-200">
                    <Layers size={12} />
                    <span>Tech Stack</span>
                  </button>
                  <button className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-slate-400 hover:text-slate-200">
                    <FolderTree size={12} />
                    <span>Project Structure</span>
                  </button>
                  <button className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-slate-400 hover:text-slate-200">
                    <Code2 size={12} />
                    <span>Important Files</span>
                  </button>
                  <button className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-slate-400 hover:text-slate-200">
                    <MessageSquare size={12} />
                    <span>AI Chat</span>
                  </button>
                  <button className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-slate-400 hover:text-slate-200">
                    <ShieldCheck size={12} />
                    <span>Health Report</span>
                  </button>
                </div>

                {/* Content Area */}
                <div className="col-span-8 flex flex-col gap-3 pl-1">
                  <div>
                    <h4 className="text-xs font-bold text-white">Project Overview</h4>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                      A full-stack web application for managing tasks, users and tracking progress. Built with modern technologies and followed a clean architecture.
                    </p>
                  </div>

                  {/* Framework Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                      React
                    </span>
                    <span className="rounded-md border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-300">
                      Node.js
                    </span>
                    <span className="rounded-md border border-slate-500/30 bg-slate-500/10 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                      Express
                    </span>
                    <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                      MongoDB
                    </span>
                  </div>

                  {/* Split Tech Stack & Project Structure Preview */}
                  <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-2 text-[10px]">
                    <div>
                      <span className="font-semibold text-slate-300">Tech Stack</span>
                      <ul className="mt-1 space-y-1 text-slate-400">
                        <li className="flex items-center gap-1 text-green-400">
                          <Check size={10} /> <span className="text-slate-350">React</span>
                        </li>
                        <li className="flex items-center gap-1 text-green-400">
                          <Check size={10} /> <span className="text-slate-350">Node.js</span>
                        </li>
                        <li className="flex items-center gap-1 text-green-400">
                          <Check size={10} /> <span className="text-slate-350">Express</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-300">Project Structure</span>
                      <ul className="mt-1 space-y-1 font-mono text-slate-400">
                        <li className="text-blue-300">📁 frontend/</li>
                        <li className="text-blue-300">📁 backend/</li>
                        <li className="text-slate-400">📄 package.json</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlapping Floating AI Chat Widget */}
              <div className="mt-3 rounded-xl border border-blue-500/30 bg-[#0f1424]/95 p-3 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5 text-[11px]">
                  <span className="flex items-center gap-1.5 font-semibold text-white">
                    <Sparkles size={12} className="text-blue-400" />
                    Ask your codebase...
                  </span>
                  <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">AI Active</span>
                </div>

                <div className="mt-2 space-y-2 text-[10px]">
                  {/* User query */}
                  <div className="ml-auto w-fit max-w-[85%] rounded-lg bg-blue-600 px-2.5 py-1.5 text-white shadow-sm">
                    What does the backend folder contain?
                  </div>
                  {/* AI Response */}
                  <div className="mr-auto w-fit max-w-[90%] rounded-lg border border-white/5 bg-white/[0.04] p-2 text-slate-300">
                    The backend folder contains the Express server, route handlers, controllers, models and middleware for the API.
                  </div>
                </div>

                {/* Question input bar */}
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-[10px]">
                  <input
                    type="text"
                    disabled
                    placeholder="Ask a question about this repository..."
                    className="w-full bg-transparent text-slate-400 placeholder:text-slate-500 focus:outline-none"
                  />
                  <button className="text-blue-400">
                    <Send size={11} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE PROBLEM: BEFORE & AFTER COMPARISON                                  */}
      {/* ========================================================================= */}
      <section className="relative mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
            The Problem
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl">
            Every Codebase Has a Learning Curve.{" "}
            <span className="block mt-1 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Make Yours Shorter.
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Joining a new team, starting a college project, or exploring open-source repositories shouldn't mean getting lost in hundreds of files.
          </p>
        </div>

        {/* 2 Side-by-Side Comparison Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {/* Card 1: Without Codebase Onboarder */}
          <div className="flex flex-col justify-between rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-500/[0.06] to-transparent p-6 sm:p-8 backdrop-blur-sm">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
                  <Frown size={22} />
                </div>
                <h3 className="font-display text-lg font-bold text-white">Without Codebase Onboarder</h3>
              </div>

              <ul className="mt-6 space-y-3.5 text-sm text-slate-350">
                <li className="flex items-center gap-3">
                  <XCircle size={17} className="shrink-0 text-red-400" />
                  <span>Manually explore folders file by file</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle size={17} className="shrink-0 text-red-400" />
                  <span>Guess which files and entry points matter</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle size={17} className="shrink-0 text-red-400" />
                  <span>Struggle to understand overall architecture</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle size={17} className="shrink-0 text-red-400" />
                  <span>Spend hours searching for answers and context</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: With Codebase Onboarder */}
          <div className="flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/[0.08] to-transparent p-6 sm:p-8 shadow-[0_0_40px_-15px_rgba(16,185,129,0.2)] backdrop-blur-sm">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Zap size={22} />
                </div>
                <h3 className="font-display text-lg font-bold text-white">With Codebase Onboarder</h3>
              </div>

              <ul className="mt-6 space-y-3.5 text-sm text-slate-200">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={17} className="shrink-0 text-emerald-400" />
                  <span>Get an instant structured project overview</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={17} className="shrink-0 text-emerald-400" />
                  <span>Identify important files and core entry routes</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={17} className="shrink-0 text-emerald-400" />
                  <span>Understand the full folder structure with roles</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={17} className="shrink-0 text-emerald-400" />
                  <span>Ask questions and get instant AI-grounded answers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. POWERFUL FEATURES (6-CARD GRID)                                        */}
      {/* ========================================================================= */}
      <section id="features" className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
            Powerful Features
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl">
            Everything You Need to Understand a Codebase
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
            From the first repository scan to your first meaningful contribution.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="group rounded-2xl border border-white/5 bg-[#0e1322]/80 p-6 transition-all hover:border-blue-500/40 hover:bg-[#11172a]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition-transform group-hover:scale-110">
              <FileText size={20} />
            </div>
            <h3 className="mt-5 font-display text-base font-bold text-white">AI Project Summary</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Get a clear explanation of the project's purpose, architecture patterns, and main core functionality.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group rounded-2xl border border-white/5 bg-[#0e1322]/80 p-6 transition-all hover:border-blue-500/40 hover:bg-[#11172a]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-transform group-hover:scale-110">
              <Layers size={20} />
            </div>
            <h3 className="mt-5 font-display text-base font-bold text-white">Smart Tech Stack Detection</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Identify frameworks, libraries, database drivers, and technologies with AI explaining their exact roles.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group rounded-2xl border border-white/5 bg-[#0e1322]/80 p-6 transition-all hover:border-blue-500/40 hover:bg-[#11172a]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 transition-transform group-hover:scale-110">
              <FolderTree size={20} />
            </div>
            <h3 className="mt-5 font-display text-base font-bold text-white">Folder Structure Explained</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Understand the purpose of directories and see how client, server, and shared components fit together.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group rounded-2xl border border-white/5 bg-[#0e1322]/80 p-6 transition-all hover:border-blue-500/40 hover:bg-[#11172a]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 transition-transform group-hover:scale-110">
              <Code2 size={20} />
            </div>
            <h3 className="mt-5 font-display text-base font-bold text-white">Important File Insights</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Highlight key entry points, environment configurations, route declarations, and primary controller files.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="group rounded-2xl border border-white/5 bg-[#0e1322]/80 p-6 transition-all hover:border-blue-500/40 hover:bg-[#11172a]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 transition-transform group-hover:scale-110">
              <MessageSquare size={20} />
            </div>
            <h3 className="mt-5 font-display text-base font-bold text-white">Ask Your Codebase</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Ask specific technical questions about any file or flow and receive answers cited from the project files.
            </p>
          </div>

          {/* Feature 6 (Coming Soon) */}
          <div className="group relative rounded-2xl border border-white/5 bg-[#0e1322]/80 p-6 transition-all hover:border-blue-500/40 hover:bg-[#11172a]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition-transform group-hover:scale-110">
                <ShieldCheck size={20} />
              </div>
              <span className="rounded-full border border-purple-500/30 bg-purple-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-purple-300">
                Coming Soon
              </span>
            </div>
            <h3 className="mt-5 font-display text-base font-bold text-white">Repository Health Report</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Check for potential architectural issues, security vulnerabilities, and receive proactive improvement suggestions.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW IT WORKS (IN 3 STEPS)                                              */}
      {/* ========================================================================= */}
      <section className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0d1322] to-[#090d16] p-8 sm:p-12 shadow-2xl">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Heading */}
            <div className="lg:col-span-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                <Sparkles size={12} />
                <span>How It Works</span>
              </span>
              <h2 className="mt-4 font-display text-2xl font-extrabold text-white sm:text-3xl">
                From Repository to Understanding{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  in 3 Steps
                </span>
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-slate-400 sm:text-sm">
                It's simple. Just connect, analyze, and explore your codebase.
              </p>
            </div>

            {/* Right Column: 3 Horizontal Steps with Connectors */}
            <div className="lg:col-span-8">
              <div className="grid gap-6 sm:grid-cols-3 sm:gap-4 relative">
                {/* Step 1 */}
                <div className="relative flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/30 bg-[#12192e] text-blue-400 shadow-md">
                    <GithubIcon size={24} />
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      01
                    </span>
                  </div>
                  <h4 className="mt-4 font-display text-sm font-bold text-white">Connect</h4>
                  <p className="mt-1.5 text-xs text-slate-400">
                    Provide any supported public GitHub repository URL.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/30 bg-[#16142a] text-purple-400 shadow-md">
                    <Cpu size={24} />
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white">
                      02
                    </span>
                  </div>
                  <h4 className="mt-4 font-display text-sm font-bold text-white">Analyze</h4>
                  <p className="mt-1.5 text-xs text-slate-400">
                    The system examines relevant project files and uses AI to interpret them.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-[#101f23] text-emerald-400 shadow-md">
                    <Lightbulb size={24} />
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                      03
                    </span>
                  </div>
                  <h4 className="mt-4 font-display text-sm font-bold text-white">Understand</h4>
                  <p className="mt-1.5 text-xs text-slate-400">
                    Explore the summary, architecture, technologies, and actionable insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SAMPLE ANALYSIS: SEE THE POWER OF AI IN ACTION                         */}
      {/* ========================================================================= */}
      <section className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          {/* Left Text & CTA */}
          <div className="flex flex-col items-start lg:col-span-5">
            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
              Sample Analysis
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl">
              See the Power of AI in Action
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Here's a preview of what you'll get after analyzing a repository. This is a sample output for demonstration purposes.
            </p>

            <Link
              to={user ? "/dashboard" : "/signup"}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02]"
            >
              <span>Try It Yourself</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Right Live Card Demo */}
          <div className="relative lg:col-span-7">
            {/* Playful Handwritten Annotation */}
            <div className="absolute -top-8 right-2 hidden sm:flex items-center gap-2 text-indigo-300 select-none z-10">
              <span className="font-serif italic text-xs tracking-wide text-indigo-300">
                This is just a sample output! ✨
              </span>
              <svg className="w-6 h-6 text-indigo-400 -rotate-45" viewBox="0 0 30 30" fill="none">
                <path d="M5 5 C 10 20, 20 20, 25 15" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                <path d="M22 10 L 25 15 L 20 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0c101c] p-5 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/20 text-blue-400 text-xs font-bold">
                    &lt;/&gt;
                  </span>
                  <span className="text-xs font-semibold text-white">Task Manager Application</span>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                  Analysis Complete
                </span>
              </div>

              {/* Sub description & badges */}
              <div className="mt-3">
                <p className="text-xs text-slate-400">
                  A web application for organizing tasks, managing users, and tracking project progress.
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-500/20">
                    React
                  </span>
                  <span className="rounded bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-300 border border-green-500/20">
                    Node.js
                  </span>
                  <span className="rounded bg-slate-500/10 px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-slate-500/20">
                    Express
                  </span>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/20">
                    MongoDB
                  </span>
                </div>
              </div>

              {/* Grid with Structure + Important File Card */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {/* Folder Table */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                  <span className="font-semibold text-white">Project Structure</span>
                  <div className="mt-2 space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-300">📁 frontend/</span>
                      <span className="text-slate-500 font-sans text-[10px]">User Interface</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-300">📁 backend/</span>
                      <span className="text-slate-500 font-sans text-[10px]">APIs & Logic</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">📄 package.json</span>
                      <span className="text-slate-500 font-sans text-[10px]">Dependencies</span>
                    </div>
                  </div>
                </div>

                {/* Important File Highlight */}
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">server.js</span>
                    <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold text-blue-300">
                      High Importance
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                    This file initializes the Express server and connects middleware, routes, and database sessions.
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-blue-400">
                    <span>Ask about this file</span>
                    <ArrowRight size={11} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. WHO IS IT FOR? (TARGET AUDIENCES)                                      */}
      {/* ========================================================================= */}
      <section className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
            Who Is It For?
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl">
            Built for Developers at Every Starting Point
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {/* Persona 1: Students & Beginners */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e1322] shadow-lg transition-all hover:border-blue-500/30">
            <div className="h-44 w-full overflow-hidden bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80"
                alt="Students studying"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-base font-bold text-white">Students & Beginners</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Understand unfamiliar projects, explore GitHub repositories, and learn how real production applications are architected.
              </p>
            </div>
          </div>

          {/* Persona 2: Developers Joining a New Project */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e1322] shadow-lg transition-all hover:border-blue-500/30">
            <div className="h-44 w-full overflow-hidden bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=700&q=80"
                alt="Software engineers at work"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-base font-bold text-white">Developers Joining a New Project</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Get oriented quickly with unfamiliar codebases, locate key entry points, and identify where to begin writing code.
              </p>
            </div>
          </div>

          {/* Persona 3: Open-Source Contributors */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e1322] shadow-lg transition-all hover:border-blue-500/30">
            <div className="h-44 w-full overflow-hidden bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=80"
                alt="Developer working on open source"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-base font-bold text-white">Open-Source Contributors</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Explore a repository's structure and isolate relevant files before making your first pull request.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PRE-FOOTER CALL TO ACTION BANNER                                       */}
      {/* ========================================================================= */}
      <section className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950/60 via-indigo-950/50 to-purple-950/60 p-8 sm:p-12 shadow-[0_0_60px_-15px_rgba(59,130,246,0.25)] backdrop-blur-xl">
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex-1">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 sm:justify-start">
                <Sparkles size={14} />
                <span>Instant Codebase Onboarding</span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-white sm:text-3xl">
                Your Next Codebase Shouldn't Feel Like a Mystery.
              </h2>
              <p className="mt-1.5 text-xs text-slate-350 sm:text-sm">
                Start with a repository. Discover how it works. Build with confidence.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 sm:items-end">
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95"
              >
                <span>Get Started for Free</span>
                <ArrowRight size={15} />
              </Link>
              <span className="text-[11px] text-slate-400">
                Use a repository you have permission to access.
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}