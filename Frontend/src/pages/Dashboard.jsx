import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  GitBranch,
  FolderGit2,
  Sparkles,
  Clock,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Trash2,
  Star,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import RepoInputForm from "../components/RepoInputForm.jsx";
import AnalysisResult from "../components/AnalysisResult.jsx";

const API_BASE = "http://localhost:5000/api/analyze";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const initialRepoUrl = searchParams.get("repo") || "";

  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [savedRepos, setSavedRepos] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

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

    // Prepend to saved repositories list
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

    // Smooth scroll to results
    window.scrollTo({ top: 380, behavior: "smooth" });
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
          setActiveAnalysis(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete analysis:", err);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-400">
            <Sparkles size={14} />
            <span>Personal Workspace</span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-white sm:text-4xl">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
              {user.name.split(" ")[0]}
            </span>{" "}
            👋
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Analyze any GitHub repository to instantly generate AI Project Summaries and guides.
          </p>
        </div>

        <Link
          to="/profile"
          className="flex items-center gap-2.5 self-start rounded-xl border border-white/10 bg-panel/60 px-4 py-2.5 text-xs font-medium text-slate-300 transition-all hover:border-gold-500/40 hover:text-white"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-400 text-[11px] font-bold text-ink-950">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span>View Profile</span>
          <ArrowRight size={13} className="text-slate-500" />
        </Link>
      </div>

      {/* Main Analysis Input Box */}
      <section className="mt-10 flex flex-col items-center text-center">
        <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
          Analyze a New Codebase
        </h2>
        <p className="mt-1 text-xs text-slate-400 sm:text-sm">
          Enter any public GitHub repository URL to generate its comprehensive AI Project Summary.
        </p>

        <div className="mt-6 w-full flex flex-col items-center">
          <RepoInputForm
            onAnalyzeComplete={handleAnalyzeComplete}
            initialUrl={initialRepoUrl}
          />

          {/* Render Active Feature 1 Project Summary */}
          {activeAnalysis && (
            <AnalysisResult
              data={activeAnalysis}
              url={activeAnalysis?.meta?.url || activeAnalysis?.repoUrl}
            />
          )}
        </div>
      </section>

      {/* Saved Repositories from MongoDB */}
      <section className="mt-16">
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
              Enter any GitHub URL above to generate your first AI Project Summary. It will automatically save here so you can access it anytime!
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedRepos.map((item) => {
              const fullName = item.meta?.fullName || item.repoUrl?.split("/").slice(-2).join("/") || item.repoName;
              const headline = item.summary?.headline || item.meta?.description || "Project summary generated";
              const language = item.meta?.language || "Code";
              const stars = item.meta?.stars || 0;
              const isSelected = activeAnalysis?.meta?.fullName === fullName || activeAnalysis?.repoUrl === item.repoUrl;

              return (
                <div
                  key={item._id || item.analysisId || fullName}
                  onClick={() => {
                    setActiveAnalysis(item);
                    window.scrollTo({ top: 380, behavior: "smooth" });
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
                        Summary Ready
                      </span>
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
