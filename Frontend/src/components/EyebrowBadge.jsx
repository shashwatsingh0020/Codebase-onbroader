import { Sparkles } from "lucide-react";

export default function EyebrowBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-400">
      <Sparkles size={12} />
      {children}
    </span>
  );
}