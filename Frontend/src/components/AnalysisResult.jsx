import { useState } from "react";
import {
  Sparkles,
  Star,
  GitFork,
  Code2,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  Target,
  Users,
  Layers,
  FileText,
  Info,
} from "lucide-react";

export default function AnalysisResult({ data, url }) {
  const [copied, setCopied] = useState(false);

  // Normalize data whether passed as a full analysis object or legacy url
  const meta = data?.meta || {
    fullName: url ? url.split("/").slice(-2).join("/") : "Repository",
    url: url || "#",
    stars: 0,
    forks: 0,
    language: "JavaScript",
    topics: [],
  };

  const summary = data?.summary || {
    headline: "Fast and modular codebase architecture.",
    overview:
      "This project provides a structured implementation designed to solve modern software challenges with clean boundaries and reusable modules.",
    keyObjectives: [
      "Modular components for clean separation of concerns.",
      "Clear entry points and predictable data flow.",
      "Standard development scripts and configuration files.",
    ],
    targetAudience: [
      "Software engineers & system architects",
      "Developers looking for modern best practices",
    ],
    architectureHighlights: [
      "Clean separation of concerns",
      "Standard development workflows",
    ],
    engine: "",
  };

  const handleCopy = () => {
    const textToCopy = `# ${meta.fullName} - Project Summary
${summary.headline}

## Overview
${summary.overview}

## Key Objectives
${(summary.keyObjectives || []).map((o) => `- ${o}`).join("\n")}

## Target Audience
${(summary.targetAudience || []).map((a) => `- ${a}`).join("\n")}

## Architecture Highlights
${(summary.architectureHighlights || []).map((h) => `- ${h}`).join("\n")}
`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-12 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="rounded-2xl border border-gold-500/30 bg-panel/60 p-6 sm:p-8 shadow-[0_0_50px_-15px_rgba(217,185,90,0.2)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-xs font-semibold text-gold-300">
          
                Feature 1: Project Summary
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-mono text-slate-400">
                {summary.engine || "AI Generated"}
              </span>
            </div>

            <h2 className="mt-3 font-display text-2xl font-extrabold text-white sm:text-3xl flex items-center gap-2">
              <span>{meta.fullName}</span>
              <a
                href={meta.url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-gold-300 transition-colors"
                title="Open repository in GitHub"
              >
                <ExternalLink size={18} />
              </a>
            </h2>

            {/* Meta tags: Stars, Forks, Language, License */}
            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              {meta.stars !== undefined && (
                <span className="flex items-center gap-1">
                  <Star size={13} className="text-amber-400 fill-amber-400/20" />
                  <strong className="text-slate-200">{meta.stars.toLocaleString()}</strong> stars
                </span>
              )}
              {meta.forks !== undefined && (
                <span className="flex items-center gap-1">
                  <GitFork size={13} className="text-slate-400" />
                  <strong className="text-slate-200">{meta.forks.toLocaleString()}</strong> forks
                </span>
              )}
              {meta.language && (
                <span className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-blue-300">
                  <Code2 size={11} />
                  {meta.language}
                </span>
              )}
              {meta.license && (
                <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">
                  {meta.license}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-all hover:border-gold-500/40 hover:bg-white/10 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
            <a
              href={meta.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 px-3.5 py-2 text-xs font-bold text-ink-950 transition-all hover:scale-[1.02]"
            >
              <span>GitHub</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Headline Quote Callout */}
        {summary.headline && (
          <div className="mt-6 rounded-xl border border-gold-500/20 bg-gold-500/5 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400">
                <FileText size={16} />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                  Core Mission
                </span>
                <p className="mt-0.5 font-display text-base font-semibold text-slate-100 sm:text-lg">
                  "{summary.headline}"
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Main Sections */}
        <div className="mt-8 space-y-6">
          {/* 1. Project Overview */}
          <div className="rounded-xl border border-white/5 bg-ink-950/60 p-5 sm:p-6">
            <div className="flex items-center gap-2.5 text-gold-400">
              <FileText size={18} />
              <h3 className="font-display text-base font-bold text-white">Project Overview</h3>
            </div>
            <div className="mt-3.5 text-sm leading-relaxed text-slate-300 space-y-3 whitespace-pre-line">
              {summary.overview}
            </div>
          </div>

          {/* 2. Key Objectives & Capabilities */}
          {summary.keyObjectives && summary.keyObjectives.length > 0 && (
            <div className="rounded-xl border border-white/5 bg-ink-950/60 p-5 sm:p-6">
              <div className="flex items-center gap-2.5 text-gold-400">
                <Target size={18} />
                <h3 className="font-display text-base font-bold text-white">
                  Key Objectives & Capabilities
                </h3>
              </div>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {summary.keyObjectives.map((obj, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs leading-relaxed text-slate-300"
                  >
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gold-400" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. Grid: Target Audience + Architecture Highlights */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Target Audience */}
            {summary.targetAudience && summary.targetAudience.length > 0 && (
              <div className="rounded-xl border border-white/5 bg-ink-950/60 p-5 sm:p-6">
                <div className="flex items-center gap-2.5 text-gold-400">
                  <Users size={18} />
                  <h3 className="font-display text-base font-bold text-white">Target Audience</h3>
                </div>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {summary.targetAudience.map((aud, i) => (
                    <span
                      key={i}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300"
                    >
                      {aud}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Architecture Highlights */}
            {summary.architectureHighlights && summary.architectureHighlights.length > 0 && (
              <div className="rounded-xl border border-white/5 bg-ink-950/60 p-5 sm:p-6">
                <div className="flex items-center gap-2.5 text-gold-400">
                  <Layers size={18} />
                  <h3 className="font-display text-base font-bold text-white">
                    Architecture Highlights
                  </h3>
                </div>
                <ul className="mt-3.5 space-y-2 text-xs text-slate-300">
                  {summary.architectureHighlights.map((arch, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                      <span>{arch}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer status notice */}
        {/* <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-400 sm:flex-row">
         
        </div> */}
      </div>
    </div>
  );
}
