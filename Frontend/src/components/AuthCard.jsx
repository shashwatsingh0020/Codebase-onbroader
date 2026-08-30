import { Terminal } from "lucide-react";

export default function AuthCard({ eyebrow, title, subtitle, children, footer }) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
      <div className="mb-8 text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950">
          <Terminal size={18} strokeWidth={2.5} />
        </span>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gold-400">{eyebrow}</p>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-white">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-slate-350">{subtitle}</p>}
      </div>

      <div className="rounded-2xl border border-white/5 bg-panel/60 p-6 shadow-[0_0_40px_-16px_rgba(217,185,90,0.25)]">
        {children}
      </div>

      {footer && <p className="mt-6 text-center text-sm text-slate-350">{footer}</p>}
    </main>
  );
}