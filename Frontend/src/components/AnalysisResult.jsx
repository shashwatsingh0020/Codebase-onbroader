import { CheckCircle2, FileCode2, Network, ScrollText, PlayCircle } from "lucide-react";

export default function AnalysisResult({ url }) {
  const repoName = url.split("/").slice(-2).join("/");

  return (
    <div className="mt-16 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="rounded-2xl border border-gold-500/30 bg-panel/40 p-8 shadow-[0_0_40px_-12px_rgba(217,185,90,0.15)] backdrop-blur-xl">
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Analysis Complete</h2>
            <p className="mt-1 text-slate-400">
              Guide generated for <span className="font-mono text-gold-300">{repoName}</span>
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-400">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Architecture Card */}
          <div className="rounded-xl border border-white/5 bg-ink-950/50 p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Network size={20} />
              </span>
              <h3 className="font-display text-lg font-semibold text-white">Architecture</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-350">
              This is a standard React SPA built with Vite. The entry point is <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs text-gold-200">main.jsx</code>, which mounts the <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs text-gold-200">App.jsx</code> router. Global state is minimally managed.
            </p>
          </div>

          {/* Key Workflows */}
          <div className="rounded-xl border border-white/5 bg-ink-950/50 p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <ScrollText size={20} />
              </span>
              <h3 className="font-display text-lg font-semibold text-white">Key Workflows</h3>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-350">
              <li className="flex items-start gap-2">
                <PlayCircle size={14} className="mt-1 shrink-0 text-gold-400" />
                <span><strong>User Auth:</strong> Standard JWT flow via context providers.</span>
              </li>
              <li className="flex items-start gap-2">
                <PlayCircle size={14} className="mt-1 shrink-0 text-gold-400" />
                <span><strong>Data Fetching:</strong> Handled primarily through custom hooks and direct fetch calls.</span>
              </li>
            </ul>
          </div>

          {/* First Tasks */}
          <div className="md:col-span-2 rounded-xl border border-white/5 bg-ink-950/50 p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400">
                <FileCode2 size={20} />
              </span>
              <h3 className="font-display text-lg font-semibold text-white">Recommended First Tasks</h3>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/5 bg-white/5 p-4 transition-colors hover:border-gold-500/30">
                <p className="font-medium text-white">#12: Fix alignment in Navbar</p>
                <p className="mt-1 text-xs text-slate-400">Good first issue. Requires updating flex classes in Navbar.jsx.</p>
              </div>
              <div className="rounded-lg border border-white/5 bg-white/5 p-4 transition-colors hover:border-gold-500/30">
                <p className="font-medium text-white">#18: Add error boundary</p>
                <p className="mt-1 text-xs text-slate-400">Wrap main routes in an ErrorBoundary to catch render exceptions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
