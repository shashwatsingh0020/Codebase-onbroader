import { Compass, Users, Zap } from "lucide-react";
import EyebrowBadge from "../components/EyebrowBadge.jsx";

const values = [
  {
    icon: Zap,
    title: "Fast by default",
    desc: "Most guides generate in under a minute, so onboarding starts the same day someone joins.",
  },
  {
    icon: Compass,
    title: "Context, not just docs",
    desc: "We map how a codebase actually behaves, not just what the README claims.",
  },
  {
    icon: Users,
    title: "Built for teams",
    desc: "Share a guide once and every new engineer starts from the same, up-to-date map.",
  },
];

export default function About() {
  return (
    <main className="mx-auto flex max-w-4xl flex-1 flex-col justify-center px-6 py-12 text-center">
      <EyebrowBadge>About us</EyebrowBadge>

      <h1 className="mt-6 font-display text-3xl font-extrabold text-white sm:text-5xl">
        Onboarding a codebase shouldn't take a week
      </h1>

      <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-350 sm:text-lg">
        Codebase Onboarder reads a repository the way a senior engineer would on their first
        day &mdash; tracing entry points, mapping modules, and surfacing the workflows that
        matter &mdash; then turns that into a guide anyone on the team can follow.
      </p>

      <div className="mt-16 grid gap-6 text-left sm:grid-cols-3">
        {values.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="group rounded-2xl border border-white/5 bg-panel/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/30 hover:shadow-[0_8px_30px_-12px_rgba(217,185,90,0.15)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400 transition-colors group-hover:bg-gold-500/20">
              <Icon size={18} />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold text-white transition-colors group-hover:text-gold-300">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-350">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-gold-500/20 bg-gold-500/5 p-8">
        <p className="font-display text-lg text-white">Our mission</p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-350">
          Give every engineer the context a teammate would give them over coffee &mdash;
          instantly, consistently, and for any repository.
        </p>
      </div>
    </main>
  );
}