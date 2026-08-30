import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

const GithubIcon = ({ size = 24, className = "" }) => (
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

export default function RepoInputForm({ onAnalyzeComplete }) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState("");

  const isValidRepoUrl = (value) =>
    /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(value.trim());

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Paste a GitHub repo URL to continue.");
      setStatus("error");
      return;
    }
    if (!isValidRepoUrl(url)) {
      setError("That doesn't look like a valid GitHub repo URL.");
      setStatus("error");
      return;
    }

    setError("");
    setStatus("loading");

    // Replace this with a real API call, e.g.:
    // const res = await fetch("/api/analyze", { method: "POST", body: JSON.stringify({ url }) });
    setTimeout(() => {
      setStatus("idle");
      if (onAnalyzeComplete) onAnalyzeComplete(url);
    }, 1800);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
      <div
        className={`flex flex-col items-stretch gap-2 rounded-2xl border bg-panel/80 p-2 shadow-[0_0_40px_-12px_rgba(217,185,90,0.25)] backdrop-blur sm:flex-row sm:items-center ${
          status === "error" ? "border-red-400/50" : "border-white/10"
        }`}
      >
        <div className="flex flex-1 items-center gap-3 px-3 py-2">
          <GithubIcon size={18} className="shrink-0 text-slate-350" />
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="https://github.com/owner/repo"
            className="w-full bg-transparent font-mono text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            aria-label="GitHub repository URL"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 px-6 py-3 text-sm font-bold text-ink-950 transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
        >
          {status === "loading" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Analyzing
            </>
          ) : (
            <>
              Analyze
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-3 text-center text-sm text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}