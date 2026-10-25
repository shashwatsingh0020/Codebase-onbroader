import { useState } from "react";
import {
  Layers,
  Code2,
  Database,
  Palette,
  Terminal,
  Cpu,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Box,
  Server,
  Wrench,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const API_BASE = "http://localhost:5000/api/analyze";

export default function TechStackResult({ data, url, onTechStackUpdated }) {
  const { token } = useAuth();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const meta = data?.meta || {
    fullName: url ? url.split("/").slice(-2).join("/") : "Repository",
    url: url || "#",
    language: "JavaScript",
  };

  const techStack = data?.techStack;

  // On-demand fetch if tech stack was not yet generated (e.g., older saved item)
  const handleDetectTechStack = async () => {
    setLoading(true);
    setError("");
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/techstack`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          url: meta.url || url,
          analysisId: data?._id || data?.analysisId,
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.message || "Failed to detect tech stack.");
      }

      if (onTechStackUpdated) {
        onTechStackUpdated(resData.techStack);
      }
    } catch (err) {
      console.error("Tech stack fetch error:", err);
      setError(err.message || "Error detecting tech stack.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!techStack) return;

    const languagesText = (techStack.languages || [])
      .map((l) => `- ${l.name}: ${l.percentage}%`)
      .join("\n");

    const frameworksText = (techStack.categorized?.frameworks || [])
      .map((f) => `- ${f.name} (${f.description})`)
      .join("\n");

    const databasesText = (techStack.categorized?.databases || [])
      .map((d) => `- ${d.name} (${d.description})`)
      .join("\n");

    const stylingText = (techStack.categorized?.styling || [])
      .map((s) => `- ${s.name} (${s.description})`)
      .join("\n");

    const textToCopy = `# ${meta.fullName} - Tech Stack Analysis
Architecture: ${techStack.architecture || "Modern Software Stack"}
Target Runtime: ${techStack.runtime || "Node.js (LTS)"}

## Languages
${languagesText || "- " + meta.language}

## Frameworks & APIs
${frameworksText || "Standard runtime"}

## Databases & Storage
${databasesText || "None detected"}

## Styling & UI Systems
${stylingText || "Standard CSS"}

## Architectural Summary
${techStack.summary}
`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If no tech stack data yet, display the activation prompt
  if (!techStack) {
    return (
      <div className="w-full rounded-2xl border border-white/10 bg-panel/60 p-8 text-center backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
          <Layers size={28} />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-white">
          Detect Tech Stack for {meta.fullName}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-slate-400">
          Extract language byte breakdowns, framework detection, databases, styling solutions, and architectural patterns.
        </p>

        {error && (
          <p className="mt-3 text-xs text-red-400">{error}</p>
        )}

        <button
          onClick={handleDetectTechStack}
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw size={15} className="animate-spin" />
              Scanning manifests & code...
            </>
          ) : (
            <>
              <Sparkles size={15} />
              Run Tech Stack Detection
            </>
          )}
        </button>
      </div>
    );
  }

  const { languages = [], categorized = {}, architecture, summary, strengths = [], runtime, engine } = techStack;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="rounded-2xl border border-blue-500/30 bg-panel/70 p-6 sm:p-8 shadow-[0_0_50px_-15px_rgba(59,130,246,0.2)] backdrop-blur-xl">
        {/* Header with Feature Badge & Copy button */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                <Layers size={13} />
                Feature 2: Tech Stack Detection
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-mono text-slate-400">
                {engine || "Automated Scanner"}
              </span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-extrabold text-white sm:text-3xl flex items-center gap-2">
              <span>{meta.fullName}</span>
              <a
                href={meta.url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-blue-300 transition-colors"
                title="Open repository in GitHub"
              >
                <ExternalLink size={18} />
              </a>
            </h2>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 self-start rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-300 transition-all hover:border-blue-400/40 hover:bg-white/10 hover:text-white"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="text-emerald-400">Copied Stack!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Tech Stack</span>
              </>
            )}
          </button>
        </div>

        {/* High-Level Architecture Banner */}
        <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-950/20 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                <Cpu size={18} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
                  Architecture Pattern
                </p>
                <h3 className="font-display text-base font-bold text-white sm:text-lg">
                  {architecture || "Modular Application Architecture"}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-slate-300">
                Runtime: <span className="font-semibold text-white">{runtime || "Node.js"}</span>
              </span>
            </div>
          </div>

          {/* AI / Heuristic Summary */}
          {summary && (
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-300">
              {summary}
            </p>
          )}

          {/* Key Strengths */}
          {strengths && strengths.length > 0 && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 pt-3 border-t border-white/5">
              {strengths.map((s, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 size={13} className="shrink-0 text-emerald-400 mt-0.5" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Language Distribution Breakdown Bar */}
        {languages && languages.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Code2 size={14} className="text-blue-400" />
                Language Distribution
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">
                {languages.length} detected
              </span>
            </div>

            {/* Segmented Color Bar */}
            <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-white/5 p-0.5">
              {languages.map((lang, idx) => (
                <div
                  key={idx}
                  style={{
                    width: `${Math.max(lang.percentage, 1)}%`,
                    backgroundColor: lang.color || "#3b82f6",
                  }}
                  title={`${lang.name}: ${lang.percentage}%`}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
                />
              ))}
            </div>

            {/* Language Legend */}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {languages.map((lang, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: lang.color || "#3b82f6" }}
                  />
                  <span className="font-medium text-slate-200">{lang.name}</span>
                  <span className="font-mono text-slate-500">{lang.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categorized Tech Cards Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* 1. Frameworks & APIs */}
          <div className="rounded-xl border border-white/5 bg-panel/50 p-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <Box size={15} />
              </span>
              <h4 className="text-sm font-bold text-white">Frameworks & Core APIs</h4>
              <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                {categorized.frameworks?.length || 0}
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {categorized.frameworks && categorized.frameworks.length > 0 ? (
                categorized.frameworks.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col rounded-lg border border-white/5 bg-white/[0.02] p-2.5 transition-colors hover:border-indigo-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">{item.name}</span>
                      <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-300 capitalize">
                        {item.category}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">{item.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic py-2">
                  No major external application framework detected; standard language libraries in use.
                </p>
              )}
            </div>
          </div>

          {/* 2. Databases & Storage */}
          <div className="rounded-xl border border-white/5 bg-panel/50 p-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Database size={15} />
              </span>
              <h4 className="text-sm font-bold text-white">Databases & Storage</h4>
              <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                {categorized.databases?.length || 0}
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {categorized.databases && categorized.databases.length > 0 ? (
                categorized.databases.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col rounded-lg border border-white/5 bg-white/[0.02] p-2.5 transition-colors hover:border-emerald-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">{item.name}</span>
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300 capitalize">
                        {item.category}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">{item.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic py-2">
                  No database drivers or ORMs detected in root manifests.
                </p>
              )}
            </div>
          </div>

          {/* 3. Styling & UI Systems */}
          <div className="rounded-xl border border-white/5 bg-panel/50 p-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400">
                <Palette size={15} />
              </span>
              <h4 className="text-sm font-bold text-white">Styling & UI Systems</h4>
              <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                {categorized.styling?.length || 0}
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {categorized.styling && categorized.styling.length > 0 ? (
                categorized.styling.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col rounded-lg border border-white/5 bg-white/[0.02] p-2.5 transition-colors hover:border-pink-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">{item.name}</span>
                      <span className="rounded bg-pink-500/10 px-1.5 py-0.5 text-[10px] font-medium text-pink-300 capitalize">
                        {item.category}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">{item.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic py-2">
                  Standard stylesheets or native platform styling.
                </p>
              )}
            </div>
          </div>

          {/* 4. DevOps, Bundlers & Tooling */}
          <div className="rounded-xl border border-white/5 bg-panel/50 p-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <Wrench size={15} />
              </span>
              <h4 className="text-sm font-bold text-white">DevOps, Bundlers & Tools</h4>
              <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                {((categorized.devops?.length || 0) + (categorized.tools?.length || 0))}
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {[...(categorized.devops || []), ...(categorized.tools || [])].length > 0 ? (
                [...(categorized.devops || []), ...(categorized.tools || [])].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col rounded-lg border border-white/5 bg-white/[0.02] p-2.5 transition-colors hover:border-amber-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">{item.name}</span>
                      <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-300 capitalize">
                        {item.category}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">{item.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic py-2">
                  Standard compiler/interpreter workflow.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
