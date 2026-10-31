import { useState } from "react";
import {
  Code2,
  FileText,
  FileCode,
  Sparkles,
  Check,
  Copy,
  RefreshCw,
  Search,
  ExternalLink,
  Flame,
  BookOpen,
  Send,
  Layers,
  ArrowRight,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const API_BASE = "http://localhost:5000/api/analyze";

export default function ImportantFilesResult({ data, url, onImportantFilesUpdated }) {
  const { token } = useAuth();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [importanceFilter, setImportanceFilter] = useState("all"); // "all" | "High" | "Medium" | "Low"
  const [customInput, setCustomInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const meta = data?.meta || {
    fullName: url ? url.split("/").slice(-2).join("/") : "Repository",
    url: url || "#",
  };

  const importantFiles = data?.importantFiles;
  const files = importantFiles?.files || [];

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.explanation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesImportance =
      importanceFilter === "all" || file.importance === importanceFilter;

    return matchesSearch && matchesImportance;
  });

  // On-demand fetch if not yet generated
  const handleDetectImportantFiles = async (customFiles = null) => {
    setLoading(true);
    setError("");
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const payload = {
        url: meta.url || url,
        analysisId: data?._id || data?.analysisId,
      };

      if (customFiles && Array.isArray(customFiles) && customFiles.length > 0) {
        payload.files = customFiles;
      }

      const res = await fetch(`${API_BASE}/importantfiles`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.message || "Failed to identify important files.");
      }

      if (onImportantFilesUpdated) {
        onImportantFilesUpdated(resData.importantFiles);
      }
    } catch (err) {
      console.error("Important files fetch error:", err);
      setError(err.message || "Error analyzing important files.");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const fileList = customInput
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (fileList.length > 0) {
      handleDetectImportantFiles(fileList);
    }
  };

  const handleCopy = () => {
    if (!importantFiles) return;

    const listText = files
      .map(
        (f) =>
          `### ${f.name} (${f.path})\n- **Importance:** ${f.importance}\n- **Category:** ${f.category}\n- **Reading Order:** Step #${f.readingOrder}\n- **Why It's Important:** ${f.explanation}\n`
      )
      .join("\n");

    const textToCopy = `# ${meta.fullName} - Important Files Analysis

${importantFiles.summary || "Key files to inspect."}

## Recommended Reading Order:
${(importantFiles.recommendedSequence || []).map((name, i) => `${i + 1}. ${name}`).join("\n")}

${listText}
`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getImportanceBadge = (importance) => {
    if (importance === "High") {
      return {
        pill: "bg-rose-500/15 text-rose-300 border-rose-500/30",
        label: "High Importance",
        icon: Flame,
      };
    }
    if (importance === "Medium") {
      return {
        pill: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
        label: "Medium Importance",
        icon: BookOpen,
      };
    }
    return {
      pill: "bg-slate-500/15 text-slate-300 border-slate-500/30",
      label: "Low Importance",
      icon: FileText,
    };
  };

  // If no data yet, show prompt
  if (!importantFiles) {
    return (
      <div className="w-full rounded-2xl border border-white/10 bg-panel/60 p-8 text-center backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
          <Code2 size={28} />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-white">
          Identify Important Files for {meta.fullName}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed">
          Pinpoints entry points, project manifests, and architectural drivers (e.g. server.js, package.json, App.jsx, README.md) with AI-guided explanations of their importance.
        </p>

        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => handleDetectImportantFiles()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                Scanning repository files...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Analyze Important Files
              </>
            )}
          </button>
        </div>

        {/* Quick test with sample files from prompt */}
        <div className="mt-8 border-t border-white/5 pt-6 text-left max-w-md mx-auto">
          <p className="text-xs font-semibold text-slate-300">
            Or test specific files:
          </p>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="server.js, package.json, App.jsx, README.md"
              className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleCustomSubmit}
              disabled={loading || !customInput.trim()}
              className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 disabled:opacity-40"
            >
              Analyze
            </button>
          </div>
        </div>
      </div>
    );
  }

  const highCount = files.filter((f) => f.importance === "High").length;
  const mediumCount = files.filter((f) => f.importance === "Medium").length;

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-panel/70 p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
            <Code2 size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-bold text-white sm:text-xl">
                Important Files & AI Significance
              </h2>
              <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                Phase 5
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {files.length} key files identified ({highCount} High, {mediumCount} Medium) • Engine:{" "}
              <span className="text-slate-200 font-medium">
                {importantFiles.engine || "Codebase File Inspector"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition-all hover:bg-white/10"
            title="Copy Markdown Guide"
          >
            {copied ? (
              <>
                <Check size={14} className="text-purple-400" />
                <span className="text-purple-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Guide</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleDetectImportantFiles()}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-300 transition-all hover:bg-purple-500/20 disabled:opacity-50"
            title="Refresh Analysis"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {/* Suggested Reading Order Timeline */}
      {importantFiles.recommendedSequence && importantFiles.recommendedSequence.length > 0 && (
        <div className="rounded-2xl border border-purple-500/20 bg-purple-950/20 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300">
            <Compass size={15} />
            <span>Recommended Onboarding Reading Order</span>
          </div>
          <p className="mt-1 text-xs text-slate-300">
            For maximum comprehension with minimum effort, explore these files in chronological sequence:
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {importantFiles.recommendedSequence.map((fileName, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-xl border border-purple-400/30 bg-[#0d121f] px-3 py-1.5 shadow-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 text-[10px] font-bold text-purple-300">
                    {index + 1}
                  </span>
                  <span className="font-mono text-xs font-semibold text-white">
                    {fileName}
                  </span>
                </div>
                {index < importantFiles.recommendedSequence.length - 1 && (
                  <ArrowRight size={13} className="text-purple-400/60 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Importance Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search important files (e.g. server.js, App.jsx)..."
            className="w-full rounded-xl border border-white/10 bg-panel/80 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCustomInput((prev) => !prev)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10"
          >
            {showCustomInput ? "Hide Custom Input" : "+ Test Custom Files"}
          </button>

          {/* Importance Filter Pills */}
          <div className="flex items-center rounded-xl border border-white/10 bg-black/40 p-0.5 text-xs">
            <button
              onClick={() => setImportanceFilter("all")}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                importanceFilter === "all"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All ({files.length})
            </button>
            <button
              onClick={() => setImportanceFilter("High")}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                importanceFilter === "High"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-rose-300"
              }`}
            >
              High ({highCount})
            </button>
            <button
              onClick={() => setImportanceFilter("Medium")}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                importanceFilter === "Medium"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-indigo-300"
              }`}
            >
              Medium ({mediumCount})
            </button>
          </div>
        </div>
      </div>

      {/* Custom Files Input Drawer */}
      {showCustomInput && (
        <form
          onSubmit={handleCustomSubmit}
          className="rounded-2xl border border-purple-500/30 bg-[#0d121f] p-4 text-xs"
        >
          <label className="block font-semibold text-slate-200">
            Analyze custom file list (e.g. server.js, package.json, App.jsx, README.md):
          </label>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="server.js, package.json, App.jsx, README.md"
              className="flex-1 rounded-xl border border-white/10 bg-black/50 px-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={loading || !customInput.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 font-bold text-white hover:bg-purple-500 disabled:opacity-40"
            >
              <Send size={13} />
              <span>Analyze</span>
            </button>
          </div>
        </form>
      )}

      {/* File Cards Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredFiles.map((file, idx) => {
          const badge = getImportanceBadge(file.importance);
          const BadgeIcon = badge.icon;

          return (
            <div
              key={file.path || idx}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0c101c]/90 p-5 backdrop-blur-xl transition-all hover:border-purple-500/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)]"
            >
              <div>
                {/* Header: File Name + Importance Pill */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <FileCode size={20} />
                    </div>
                    <div>
                      <h3 className="font-mono text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                        {file.name}
                      </h3>
                      <p className="font-mono text-[11px] text-slate-400 truncate max-w-[220px] sm:max-w-xs">
                        {file.path}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold shrink-0 ${badge.pill}`}
                  >
                    <BadgeIcon size={12} />
                    <span>{file.importance} importance</span>
                  </span>
                </div>

                {/* Explanation */}
                <p className="mt-3.5 text-xs text-slate-300 leading-relaxed">
                  {file.explanation}
                </p>

                {/* Highlights List */}
                {file.keyHighlights && file.keyHighlights.length > 0 && (
                  <div className="mt-3.5 flex flex-col gap-1 border-t border-white/5 pt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Architectural Responsibilities:
                    </span>
                    <ul className="flex flex-col gap-1 text-[11px] text-slate-400">
                      {file.keyHighlights.map((hl, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-1.5">
                          <span className="text-purple-400 mt-0.5">•</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Card Footer: Category & Reading Step */}
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-slate-400">
                <span className="rounded-md bg-white/5 px-2 py-0.5 font-medium text-slate-300 border border-white/5">
                  {file.category}
                </span>

                {file.readingOrder && (
                  <span className="text-[11px] font-semibold text-purple-300 flex items-center gap-1">
                    <span>Reading Order:</span>
                    <span className="rounded-md bg-purple-500/20 border border-purple-400/30 px-1.5 py-0.2 font-mono text-[10px] text-purple-200">
                      #{file.readingOrder}
                    </span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
