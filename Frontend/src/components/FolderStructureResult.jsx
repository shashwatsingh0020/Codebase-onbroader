import { useState } from "react";
import {
  FolderTree,
  Folder,
  FolderOpen,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Search,
  ExternalLink,
  Layers,
  Code2,
  Cpu,
  Database,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  Terminal,
  Send,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const API_BASE = "http://localhost:5000/api/analyze";

export default function FolderStructureResult({ data, url, onFolderStructureUpdated }) {
  const { token } = useAuth();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("cards"); // "cards" | "tree"
  const [customInput, setCustomInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const meta = data?.meta || {
    fullName: url ? url.split("/").slice(-2).join("/") : "Repository",
    url: url || "#",
  };

  const folderStructure = data?.folderStructure;
  const folders = folderStructure?.folders || [];

  // Filter folders
  const categories = [
    "all",
    ...Array.from(new Set(folders.map((f) => f.category).filter(Boolean))),
  ];

  const filteredFolders = folders.filter((folder) => {
    const matchesSearch =
      folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.explanation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || folder.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // On-demand fetch if not already generated
  const handleDetectFolderStructure = async (customFolders = null) => {
    setLoading(true);
    setError("");
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const payload = {
        url: meta.url || url,
        analysisId: data?._id || data?.analysisId,
      };

      if (customFolders && Array.isArray(customFolders) && customFolders.length > 0) {
        payload.folders = customFolders;
      }

      const res = await fetch(`${API_BASE}/folderstructure`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.message || "Failed to analyze folder structure.");
      }

      if (onFolderStructureUpdated) {
        onFolderStructureUpdated(resData.folderStructure);
      }
    } catch (err) {
      console.error("Folder structure fetch error:", err);
      setError(err.message || "Error analyzing folder structure.");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const folderList = customInput
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (folderList.length > 0) {
      handleDetectFolderStructure(folderList);
    }
  };

  const handleCopy = () => {
    if (!folderStructure) return;

    const listText = folders
      .map(
        (f) =>
          `### ${f.path}/\n- **Role:** ${f.role}\n- **Category:** ${f.category}\n- **Importance:** ${f.importance}\n- **Explanation:** ${f.explanation}\n`
      )
      .join("\n");

    const textToCopy = `# ${meta.fullName} - Folder Structure Explanation

${folderStructure.overview || "Overview of directory structure."}

${listText}
`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper color tags based on category
  const getCategoryTheme = (category) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("frontend") || cat.includes("ui")) {
      return {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        text: "text-emerald-400",
        badge: "bg-emerald-500/20 text-emerald-300",
        icon: Code2,
      };
    }
    if (cat.includes("backend") || cat.includes("server") || cat.includes("api")) {
      return {
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        text: "text-blue-400",
        badge: "bg-blue-500/20 text-blue-300",
        icon: Terminal,
      };
    }
    if (cat.includes("ai") || cat.includes("ml") || cat.includes("intelligence")) {
      return {
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        text: "text-purple-400",
        badge: "bg-purple-500/20 text-purple-300",
        icon: Cpu,
      };
    }
    if (cat.includes("database") || cat.includes("model")) {
      return {
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        text: "text-amber-400",
        badge: "bg-amber-500/20 text-amber-300",
        icon: Database,
      };
    }
    return {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      text: "text-cyan-400",
      badge: "bg-cyan-500/20 text-cyan-300",
      icon: Layers,
    };
  };

  // If no folder structure data yet, show activation prompt
  if (!folderStructure) {
    return (
      <div className="w-full rounded-2xl border border-white/10 bg-panel/60 p-8 text-center backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
          <FolderTree size={28} />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-white">
          Explain Folder Structure for {meta.fullName}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed">
          Scans all top-level and architectural subdirectories (e.g., Frontend/, Backend/, AI/) and explains the exact role and responsibility of each folder in the codebase.
        </p>

        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => handleDetectFolderStructure()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                Scanning repository tree...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Generate Folder Structure Analysis
              </>
            )}
          </button>
        </div>

        {/* Quick input for explicit custom folders */}
        <div className="mt-8 border-t border-white/5 pt-6 text-left max-w-md mx-auto">
          <p className="text-xs font-semibold text-slate-300">
            Or test specific folder inputs:
          </p>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Frontend/, Backend/, AI/"
              className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
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

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      {/* Top Banner & Actions */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-panel/70 p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <FolderTree size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-bold text-white sm:text-xl">
                Folder Structure Explanation
              </h2>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                Phase 4
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {folders.length} directories analyzed • Engine:{" "}
              <span className="text-slate-200 font-medium">
                {folderStructure.engine || "Codebase Structure Analyzer"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition-all hover:bg-white/10"
            title="Copy Markdown"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleDetectFolderStructure()}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20 disabled:opacity-50"
            title="Refresh Analysis"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {/* Architecture Overview Banner */}
      {folderStructure.overview && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 sm:p-5 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Architectural Organization
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-slate-200 leading-relaxed">
                {folderStructure.overview}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter & View Mode Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search folders (e.g. Frontend, Backend, models)..."
            className="w-full rounded-xl border border-white/10 bg-panel/80 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* View Switcher & Custom Input Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCustomInput((prev) => !prev)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10"
          >
            {showCustomInput ? "Hide Custom Input" : "+ Test Custom Folders"}
          </button>

          <div className="flex items-center rounded-xl border border-white/10 bg-black/40 p-0.5 text-xs">
            <button
              onClick={() => setViewMode("cards")}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                viewMode === "cards"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Cards View
            </button>
            <button
              onClick={() => setViewMode("tree")}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                viewMode === "tree"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Hierarchy Tree
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Custom Input Box */}
      {showCustomInput && (
        <form
          onSubmit={handleCustomSubmit}
          className="rounded-2xl border border-emerald-500/30 bg-[#0d121f] p-4 text-xs"
        >
          <label className="block font-semibold text-slate-200">
            Explain custom folder list (separate with commas or newlines):
          </label>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Frontend/, Backend/, AI/, src/components/"
              className="flex-1 rounded-xl border border-white/10 bg-black/50 px-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !customInput.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-500 disabled:opacity-40"
            >
              <Send size={13} />
              <span>Explain</span>
            </button>
          </div>
        </form>
      )}

      {/* Category Pills */}
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1 font-medium capitalize transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "border border-white/5 bg-white/[0.03] text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat === "all" ? "All Folders" : cat}
            </button>
          ))}
        </div>
      )}

      {/* CARDS VIEW */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredFolders.map((folder, idx) => {
            const theme = getCategoryTheme(folder.category);
            const IconComponent = theme.icon;

            return (
              <div
                key={folder.path || idx}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0c101c]/90 p-5 backdrop-blur-xl transition-all hover:border-emerald-500/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
              >
                <div>
                  {/* Top Bar: Icon + Name + Importance */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.bg} ${theme.text} border ${theme.border}`}
                      >
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <h3 className="font-mono text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {folder.path}/
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {folder.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          folder.importance === "High"
                            ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                            : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        {folder.importance} Importance
                      </span>
                    </div>
                  </div>

                  {/* AI Explanation Paragraph */}
                  <p className="mt-3.5 text-xs text-slate-300 leading-relaxed">
                    {folder.explanation}
                  </p>

                  {/* Key Contents Tags */}
                  {folder.keyContents && folder.keyContents.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500">
                        Contains:
                      </span>
                      {folder.keyContents.map((child, cIdx) => (
                        <span
                          key={cIdx}
                          className="rounded-md border border-white/5 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-slate-300"
                        >
                          {child}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Tag: Category & File count */}
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-slate-400">
                  <span className={`rounded-md px-2 py-0.5 font-medium ${theme.badge}`}>
                    {folder.category}
                  </span>
                  {folder.fileCount > 0 && (
                    <span className="font-mono text-[10px] text-slate-400">
                      {folder.fileCount} file{folder.fileCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TREE HIERARCHY VIEW */}
      {viewMode === "tree" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Tree Explorer */}
          <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0c101c]/90 p-4 font-mono text-xs backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <span className="text-slate-400 text-[11px] font-sans font-semibold uppercase">
                Directory Tree
              </span>
              <span className="text-slate-500 text-[10px]">Click to inspect</span>
            </div>

            <div className="flex flex-col gap-1">
              {filteredFolders.map((folder) => {
                const depth = folder.path.split("/").length - 1;
                const isSelected = selectedFolder?.path === folder.path;

                return (
                  <button
                    key={folder.path}
                    onClick={() => setSelectedFolder(folder)}
                    style={{ paddingLeft: `${depth * 16 + 8}px` }}
                    className={`flex items-center justify-between rounded-lg py-1.5 pr-2 text-left transition-colors ${
                      isSelected
                        ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <Folder size={14} className={isSelected ? "text-emerald-400" : "text-slate-400"} />
                      <span className="truncate">{folder.name}/</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{folder.category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Folder Explanation Stage */}
          <div className="lg:col-span-7">
            {selectedFolder ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-[#0c101c] p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-mono text-lg font-bold text-white">
                      {selectedFolder.path}/
                    </h3>
                    <p className="text-xs text-emerald-400 font-medium mt-0.5">
                      {selectedFolder.role}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-300">
                    {selectedFolder.importance} Importance
                  </span>
                </div>

                <div className="mt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    AI Purpose & Functionality
                  </h4>
                  <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                    {selectedFolder.explanation}
                  </p>
                </div>

                {selectedFolder.keyContents && selectedFolder.keyContents.length > 0 && (
                  <div className="mt-6 border-t border-white/5 pt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Child Files & Directories
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedFolder.keyContents.map((item, i) => (
                        <span
                          key={i}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-panel/40 p-6 text-center text-slate-400">
                <FolderOpen size={36} className="text-slate-500 mb-2" />
                <p className="text-xs">
                  Select a directory on the left to see its AI architectural role and contents.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
