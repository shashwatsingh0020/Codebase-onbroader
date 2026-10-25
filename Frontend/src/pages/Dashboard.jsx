import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  GitBranch,
  FolderGit2,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Trash2,
  Star,
  RefreshCw,
  FolderOpen,
  Layers,
  FileText,
  FolderTree,
  Code2,
  MessageSquare,
  Plus,
  GitFork,
  Check,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import RepoInputForm from "../components/RepoInputForm.jsx";
import AnalysisResult from "../components/AnalysisResult.jsx";
import TechStackResult from "../components/TechStackResult.jsx";

const API_BASE = "http://localhost:5000/api/analyze";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRepoUrl = searchParams.get("repo") || "";

  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState("summary"); // summary | tech-stack | folder-structure | important-files | ai-chat
  const [savedRepos, setSavedRepos] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showInputForm, setShowInputForm] = useState(false);

  // 1. Fetch user's saved analyses from MongoDB on mount
  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) {
        setLoadingHistory(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.history)) {
            setSavedRepos(data.history);
            // If we don't have an active analysis yet, display the latest one
            if (!activeAnalysis && data.history.length > 0 && !initialRepoUrl) {
              setActiveAnalysis(data.history[0]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load saved repositories:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [token]);

  // If not authenticated, prompt to login
  if (!user) {
    return (
      <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-400">
          <FolderGit2 size={28} />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold text-white">Access Your Dashboard</h2>
        <p className="mt-2 text-sm text-slate-400">
          Please log in or create an account to view your personal onboarding guides and saved repositories.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            to="/login"
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-gradient-to-r from-gold-400 to-gold-300 px-4 py-2 text-sm font-semibold text-ink-950"
          >
            Sign up
          </Link>
        </div>
      </main>
    );
  }

  // Handle newly analyzed repository
  const handleAnalyzeComplete = (analysisData) => {
    setActiveAnalysis(analysisData);
    setShowInputForm(false);
    setActiveTab("summary");

    // Prepend or update in saved repositories list
    setSavedRepos((prev) => {
      const exists = prev.some(
        (item) => item.repoUrl === analysisData.meta?.url || item._id === analysisData.analysisId
      );
      if (exists) {
        return prev.map((item) =>
          item.repoUrl === analysisData.meta?.url ? analysisData : item
        );
      }
      return [analysisData, ...prev];
    });

    window.scrollTo({ top: 220, behavior: "smooth" });
  };

  // Handle on-demand tech stack update
  const handleTechStackUpdated = (newTechStack) => {
    setActiveAnalysis((prev) => {
      if (!prev) return prev;
      return { ...prev, techStack: newTechStack };
    });

    setSavedRepos((prev) =>
      prev.map((item) => {
        if (
          item._id === activeAnalysis?._id ||
          item.repoUrl === (activeAnalysis?.meta?.url || activeAnalysis?.repoUrl)
        ) {
          return { ...item, techStack: newTechStack };
        }
        return item;
      })
    );
  };

  // Delete an analysis from history
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!id || !token) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setSavedRepos((prev) => prev.filter((item) => item._id !== id));
        if (activeAnalysis?._id === id || activeAnalysis?.analysisId === id) {
          const remaining = savedRepos.filter((item) => item._id !== id);
          setActiveAnalysis(remaining.length > 0 ? remaining[0] : null);
        }
      }
    } catch (err) {
      console.error("Failed to delete analysis:", err);
    }
  };

  // Active repo metadata
  const currentFullName =
    activeAnalysis?.meta?.fullName ||
    activeAnalysis?.repoUrl?.split("/").slice(-2).join("/") ||
    activeAnalysis?.repoName ||
    "Repository";
  const currentUrl = activeAnalysis?.meta?.url || activeAnalysis?.repoUrl;
  const currentStars = activeAnalysis?.meta?.stars || 0;
  const currentForks = activeAnalysis?.meta?.forks || 0;
  const currentLang = activeAnalysis?.meta?.language || "Code";

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 py-8">
      {/* Top Welcome & Profile Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-400">
            <Sparkles size={14} />
            <span>Developer Onboarding Workspace</span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-white sm:text-3xl">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
              {user.name.split(" ")[0]}
            </span>{" "}
            👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Explore and navigate repository summaries, tech stacks, file trees, and codebase intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInputForm((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl border border-gold-500/30 bg-gold-500/10 px-3.5 py-2 text-xs font-semibold text-gold-300 transition-all hover:bg-gold-500/20"
          >
            <Plus size={14} />
            <span>Analyze New Repo</span>
          </button>

          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-panel/60 px-3.5 py-2 text-xs font-medium text-slate-300 transition-all hover:border-gold-500/40 hover:text-white"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-[10px] font-bold text-ink-950">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span>Profile</span>
          </Link>
        </div>
      </div>

      {/* Collapsible / Floating New Repo Input Form */}
      {(showInputForm || !activeAnalysis) && (
        <section className="mt-6 rounded-2xl border border-gold-500/20 bg-panel/70 p-6 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-display text-lg font-bold text-white sm:text-xl">
              Analyze a GitHub Codebase
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Enter any public GitHub URL to generate its AI Project Summary & Tech Stack Detection.
            </p>
          </div>

          <div className="mt-5">
            <RepoInputForm
              onAnalyzeComplete={handleAnalyzeComplete}
              initialUrl={initialRepoUrl}
            />
          </div>
        </section>
      )}

      {/* Main Workspace with 5-Feature Sidebar */}
      {activeAnalysis ? (
        <section className="mt-8">
          {/* Active Repository Header Bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0c101c]/90 p-4 sm:flex-row sm:items-center sm:justify-between backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                <FolderGit2 size={20} />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-mono text-sm sm:text-base font-bold text-white">
                    {currentFullName}
                  </h2>
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-gold-300 transition-colors"
                    title="View on GitHub"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <GitBranch size={11} /> {currentLang}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={11} className="text-amber-400 fill-amber-400/20" /> {currentStars.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork size={11} /> {currentForks.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowInputForm(true)}
              className="flex items-center gap-1.5 self-start sm:self-center rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10"
            >
              <RefreshCw size={12} />
              <span>Change Repo</span>
            </button>
          </div>

          {/* 5-Feature Sidebar + Main Result Stage */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Sidebar (Col 3 of 12) */}
            <aside className="lg:col-span-3 flex flex-col gap-5">
              <div className="rounded-2xl border border-white/10 bg-panel/70 p-3.5 backdrop-blur-xl">
                <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Onboarding Features
                </p>

                <nav className="flex flex-col gap-1.5">
                  {/* Feature 1: Project Summary */}
                  <button
                    onClick={() => setActiveTab("summary")}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                      activeTab === "summary"
                        ? "bg-gold-500/15 text-gold-300 border border-gold-500/30 font-semibold shadow-sm"
                        : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText size={16} className={activeTab === "summary" ? "text-gold-400" : "text-slate-400"} />
                      <span>1. Project Summary</span>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-500/20">
                      Ready
                    </span>
                  </button>

                  {/* Feature 2: Tech Stack Detection (NEW) */}
                  <button
                    onClick={() => setActiveTab("tech-stack")}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                      activeTab === "tech-stack"
                        ? "bg-blue-500/15 text-blue-300 border border-blue-500/30 font-semibold shadow-sm"
                        : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers size={16} className={activeTab === "tech-stack" ? "text-blue-400" : "text-slate-400"} />
                      <span>2. Tech Stack</span>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[9px] font-bold text-blue-300 border border-blue-400/30">
                      Active ✨
                    </span>
                  </button>

                  {/* Feature 3: Folder Structure */}
                  <button
                    onClick={() => setActiveTab("folder-structure")}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                      activeTab === "folder-structure"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold shadow-sm"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderTree size={16} className={activeTab === "folder-structure" ? "text-emerald-400" : "text-slate-500"} />
                      <span>3. Folder Structure</span>
                    </div>
                    <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] text-slate-500 font-mono">
                      Soon
                    </span>
                  </button>

                  {/* Feature 4: Important Files */}
                  <button
                    onClick={() => setActiveTab("important-files")}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                      activeTab === "important-files"
                        ? "bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold shadow-sm"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Code2 size={16} className={activeTab === "important-files" ? "text-purple-400" : "text-slate-500"} />
                      <span>4. Important Files</span>
                    </div>
                    {/* <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] text-slate-500 font-mono">
                      Soon
                    </span> */}
                  </button>

                  {/* Feature 5: AI Codebase Chat */}
                  <button
                    onClick={() => setActiveTab("ai-chat")}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                      activeTab === "ai-chat"
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold shadow-sm"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare size={16} className={activeTab === "ai-chat" ? "text-amber-400" : "text-slate-500"} />
                      <span>5. AI Codebase Chat</span>
                    </div>
                    {/* <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] text-slate-500 font-mono">
                      Soon
                    </span> */}
                  </button>
                </nav>
              </div>

              {/* Saved Repos Quick Switcher in Sidebar */}
              {savedRepos.length > 1 && (
                <div className="rounded-2xl border border-white/10 bg-panel/70 p-3.5 backdrop-blur-xl">
                  <div className="flex items-center justify-between px-2 pb-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Switch Repository
                    </p>
                    <span className="rounded-full bg-gold-400/10 px-1.5 py-0.2 text-[10px] font-semibold text-gold-300">
                      {savedRepos.length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1">
                    {savedRepos.map((item) => {
                      const name = item.meta?.fullName || item.repoUrl?.split("/").slice(-2).join("/") || item.repoName;
                      const isCurrent = (activeAnalysis?._id === item._id) || (activeAnalysis?.repoUrl === item.repoUrl);

                      return (
                        <button
                          key={item._id || name}
                          onClick={() => {
                            setActiveAnalysis(item);
                            window.scrollTo({ top: 220, behavior: "smooth" });
                          }}
                          className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                            isCurrent
                              ? "bg-white/10 text-white font-medium border border-white/10"
                              : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                          }`}
                        >
                          <span className="line-clamp-1">{name}</span>
                          {isCurrent && <Check size={12} className="text-gold-400 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </aside>

            {/* Right Main Content Panel (Col 9 of 12) */}
            <div className="lg:col-span-9 flex flex-col gap-6">
              {/* Feature 1 View */}
              {activeTab === "summary" && (
                <div className="w-full">
                  <AnalysisResult
                    data={activeAnalysis}
                    url={activeAnalysis?.meta?.url || activeAnalysis?.repoUrl}
                  />
                </div>
              )}

              {/* Feature 2 View */}
              {activeTab === "tech-stack" && (
                <div className="w-full">
                  <TechStackResult
                    data={activeAnalysis}
                    url={activeAnalysis?.meta?.url || activeAnalysis?.repoUrl}
                    onTechStackUpdated={handleTechStackUpdated}
                  />
                </div>
              )}

              {/* Feature 3 View (Coming Soon) */}
              {activeTab === "folder-structure" && (
                <div className="rounded-2xl border border-dashed border-emerald-500/30 bg-panel/60 p-10 text-center backdrop-blur-xl">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <FolderTree size={28} />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-white">
                    Feature 3: Folder Structure Explanation
                  </h3>
                  <p className="mx-auto mt-2 max-w-lg text-xs sm:text-sm text-slate-400 leading-relaxed">
                    This feature will scan the entire directory tree of <strong className="text-white">{currentFullName}</strong>, identify architectural layers (routes, controllers, models, utils), and explain why each folder exists.
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <button
                      onClick={() => setActiveTab("summary")}
                      className="rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20"
                    >
                      Back to Summary
                    </button>
                    <button
                      onClick={() => setActiveTab("tech-stack")}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                    >
                      View Tech Stack
                    </button>
                  </div>
                </div>
              )}

              {/* Feature 4 View (Coming Soon) */}
              {activeTab === "important-files" && (
                <div className="rounded-2xl border border-dashed border-purple-500/30 bg-panel/60 p-10 text-center backdrop-blur-xl">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                    <Code2 size={28} />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-white">
                    Feature 4: Important Files Detection
                  </h3>
                  <p className="mx-auto mt-2 max-w-lg text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Automatically curates the critical entry files, database configurations, and environment templates of <strong className="text-white">{currentFullName}</strong> so onboarding developers know where to start reading code.
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <button
                      onClick={() => setActiveTab("tech-stack")}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                    >
                      Explore Tech Stack
                    </button>
                  </div>
                </div>
              )}

              {/* Feature 5 View (Coming Soon) */}
              {activeTab === "ai-chat" && (
                <div className="rounded-2xl border border-dashed border-amber-500/30 bg-panel/60 p-10 text-center backdrop-blur-xl">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                    <MessageSquare size={28} />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-white">
                    Feature 5: AI Codebase Chat
                  </h3>
                  <p className="mx-auto mt-2 max-w-lg text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Interactive natural language assistant for <strong className="text-white">{currentFullName}</strong>. Ask questions like <em>"Where is user authentication implemented?"</em> or <em>"How do I set up local development?"</em> and get instant contextual code citations.
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <button
                      onClick={() => setActiveTab("summary")}
                      className="rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20"
                    >
                      Back to Summary
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* Saved Repositories Grid (Shows all repositories) */}
      <section className="mt-16 border-t border-white/10 pt-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-white">Your Saved Repositories</h3>
            <span className="rounded-full bg-gold-400/10 px-2 py-0.5 text-xs font-semibold text-gold-300">
              {savedRepos.length}
            </span>
          </div>
          <span className="text-xs text-slate-400">Saved in your MongoDB account</span>
        </div>

        {loadingHistory ? (
          <div className="mt-6 flex justify-center py-12 text-slate-400 text-sm">
            <RefreshCw size={18} className="animate-spin text-gold-400 mr-2" />
            Loading your saved analyses...
          </div>
        ) : savedRepos.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-panel/20 p-10 text-center">
            <FolderOpen size={36} className="text-slate-500 mb-3" />
            <p className="text-sm font-semibold text-slate-300">No saved repositories yet</p>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              Enter any GitHub URL above to generate your first AI Project Summary and Tech Stack breakdown!
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedRepos.map((item) => {
              const fullName = item.meta?.fullName || item.repoUrl?.split("/").slice(-2).join("/") || item.repoName;
              const headline = item.summary?.headline || item.meta?.description || "Project summary & tech stack ready";
              const language = item.meta?.language || "Code";
              const stars = item.meta?.stars || 0;
              const isSelected = activeAnalysis?.meta?.fullName === fullName || activeAnalysis?.repoUrl === item.repoUrl;
              const hasTechStack = Boolean(item.techStack?.languages?.length || item.techStack?.architecture);

              return (
                <div
                  key={item._id || item.analysisId || fullName}
                  onClick={() => {
                    setActiveAnalysis(item);
                    setActiveTab("summary");
                    window.scrollTo({ top: 220, behavior: "smooth" });
                  }}
                  className={`group relative cursor-pointer rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
                    isSelected
                      ? "border-gold-400 bg-panel/80 shadow-[0_0_25px_-5px_rgba(217,185,90,0.3)]"
                      : "border-white/5 bg-panel/60 hover:border-gold-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400">
                      <FolderGit2 size={18} />
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-400">
                        <CheckCircle2 size={10} />
                        Summary
                      </span>
                      {hasTechStack && (
                        <span className="flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-300">
                          <Layers size={9} />
                          Stack
                        </span>
                      )}
                      {item._id && (
                        <button
                          onClick={(e) => handleDelete(e, item._id)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          title="Delete saved summary"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="mt-4 font-mono text-sm font-semibold text-white group-hover:text-gold-300 transition-colors line-clamp-1">
                    {fullName}
                  </h4>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {headline}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <GitBranch size={12} /> {language}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={11} className="text-amber-400 fill-amber-400/20" /> {stars.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
