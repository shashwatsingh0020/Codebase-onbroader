import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  GitBranch, 
  FolderGit2, 
  Sparkles, 
  Clock, 
  ExternalLink, 
  User, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import RepoInputForm from "../components/RepoInputForm.jsx";
import AnalysisResult from "../components/AnalysisResult.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analyzedUrl, setAnalyzedUrl] = useState(null);

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

  const handleAnalyzeComplete = (url) => {
    setAnalyzedUrl(url);
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
            Welcome back, <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">{user.name.split(" ")[0]}</span> 👋
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your analyzed repositories and generate instant onboarding guides.
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
          Enter any public GitHub repository URL to trace its architecture, key workflows, and starter tasks.
        </p>

        <div className="mt-6 w-full flex flex-col items-center">
          <RepoInputForm onAnalyzeComplete={handleAnalyzeComplete} />
          {analyzedUrl && <AnalysisResult url={analyzedUrl} />}
        </div>
      </section>

      {/* Saved / Recent Repositories Grid */}
      <section className="mt-16">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">Your Saved Repositories</h3>
          <span className="text-xs text-slate-400">Saved in your account</span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="group rounded-2xl border border-white/5 bg-panel/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/30">
            <div className="flex items-start justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400">
                <FolderGit2 size={18} />
              </span>
              <span className="flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-400">
                <CheckCircle2 size={10} />
                Ready
              </span>
            </div>
            <h4 className="mt-4 font-mono text-sm font-semibold text-white group-hover:text-gold-300 transition-colors">
              expressjs / express
            </h4>
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">
              Fast, unopinionated, minimalist web framework for Node.js.
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <GitBranch size={12} /> master
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> Analyzed today
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group rounded-2xl border border-white/5 bg-panel/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/30">
            <div className="flex items-start justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <FolderGit2 size={18} />
              </span>
              <span className="flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-400">
                <CheckCircle2 size={10} />
                Ready
              </span>
            </div>
            <h4 className="mt-4 font-mono text-sm font-semibold text-white group-hover:text-gold-300 transition-colors">
              facebook / react
            </h4>
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">
              The library for web and native user interfaces.
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <GitBranch size={12} /> main
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> Analyzed recently
              </span>
            </div>
          </div>

          {/* Empty / Add slot */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-panel/20 p-6 text-center">
            <p className="text-xs font-semibold text-slate-350">Analyze more repositories</p>
            <p className="mt-1 text-[11px] text-slate-500">
              Every guide you generate is automatically saved to your account.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
