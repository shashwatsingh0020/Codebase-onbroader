import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#070a12] py-9 text-xs text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        {/* Brand & Developer Thought */}
        <div className="flex flex-col items-center gap-1.5 sm:items-start">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-xs font-bold text-blue-400 border border-blue-500/20">
              &lt;/&gt;
            </span>
            <span className="font-display text-sm font-bold text-white tracking-tight">
              Codebase Onboarder
            </span>
          </Link>
          <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Built for developers. Stay curious &amp; keep coding.</span>
          </p>
        </div>

    
        {/* Copyright & Tagline */}
        <div className="flex flex-col items-center text-center sm:items-end sm:text-right">
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} Codebase Onboarder. All rights reserved.
          </p>
          <p className="mt-0.5 text-[10px] text-slate-600">
            Happy coding &amp; clean shipping.
          </p>
        </div>
      </div>
    </footer>
  );
}