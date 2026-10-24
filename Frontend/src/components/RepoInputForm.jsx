import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const GithubIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.3 5.3 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.3 5 1.7 5 1.7a5.3 5.3 0 0 0-.1 3.8A5.4 5.4 0 0 0 3 9.3c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
);

const API_BASE = "http://localhost:5000/api/analyze";

export default function RepoInputForm({ onAnalyzeComplete, initialUrl = "" }) {
  const { token } = useAuth();
  const [url, setUrl] = useState(initialUrl);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState("");

  const isValidRepoUrl = (value) => {
    const val = value.trim();
    return (
      /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?$/i.test(val) ||
      /^[\w.-]+\/[\w.-]+$/.test(val)
    );
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!url.trim()) {
      setError("Please paste a GitHub repo URL (e.g., https://github.com/expressjs/express)");
      setStatus("error");
      return;
    }
    if (!isValidRepoUrl(url)) {
      setError("Please provide a valid GitHub repository URL or 'owner/repo' format.");
      setStatus("error");
      return;
    }

    setError("");
    setStatus("loading");
    setLoadingStep("Fetching repository from GitHub & generating AI Project Summary...");

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/summary`, {
        method: "POST",
        headers,
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to analyze repository.");
      }

      setStatus("idle");
      setLoadingStep("");
      if (onAnalyzeComplete) {
        onAnalyzeComplete(data);
      }
    } catch (err) {
      console.error("Analysis request error:", err);
      setStatus("error");
      setError(err.message || "Server error while analyzing repository. Is the backend running?");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
      <div
        className={`flex flex-col items-stretch gap-2 rounded-2xl border bg-panel/80 p-2 shadow-[0_0_40px_-12px_rgba(217,185,90,0.25)] backdrop-blur sm:flex-row sm:items-center ${
          status === "error" ? "border-red-400/50" : "border-white/10"
        }`}
      >
        <div className="flex flex-1 items-center gap-3 px-3 py-2">
          <GithubIcon size={18} className="shrink-0 text-slate-400" />
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="https://github.com/expressjs/express"
            className="w-full bg-transparent font-mono text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            aria-label="GitHub repository URL"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 px-6 py-3 text-sm font-bold text-ink-950 transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
        >
          {status === "loading" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Generate Summary</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>

      {status === "loading" && (
        <p className="mt-3 text-center text-xs text-gold-400 animate-pulse flex items-center justify-center gap-1.5">
          <Loader2 size={13} className="animate-spin" />
          {loadingStep}
        </p>
      )}

      {status === "error" && (
        <p role="alert" className="mt-3 text-center text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3">
          {error}
        </p>
      )}
    </form>
  );
}
