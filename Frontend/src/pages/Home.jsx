import { useState } from "react";
import { FileCode2, GitBranch, ListChecks } from "lucide-react";
import EyebrowBadge from "../components/EyebrowBadge.jsx";
import RepoInputForm from "../components/RepoInputForm.jsx";
import AnalysisResult from "../components/AnalysisResult.jsx";

const highlights = [
  {
    icon: FileCode2,
    title: "Architecture map",
    desc: "See how folders, modules, and entry points fit together before you write a line.",
  },
  {
    icon: GitBranch,
    title: "Key workflows",
    desc: "Follow the paths real PRs take, from routes to services to tests.",
  },
  {
    icon: ListChecks,
    title: "First tasks",
    desc: "Land a starter list of good-first-issue-sized changes to build confidence fast.",
  },
];

export default function Home() {
  const [analyzedUrl, setAnalyzedUrl] = useState(null);

  const handleAnalyzeComplete = (url) => {
    setAnalyzedUrl(url);
  };

  return (
    <main className="flex flex-1 flex-col justify-center py-10 sm:py-16">
      {/* Hero */}
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center">
        <EyebrowBadge>AI-Powered</EyebrowBadge>

        <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-white sm:text-6xl">
          Codebase <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">Onboarder</span>
        </h1>

        <p className="mt-5 max-w-xl text-balance text-base text-slate-350 sm:text-lg">
          Paste a GitHub repo URL and get an onboarding guide instantly.
        </p>

        <div className="mt-10 w-full flex flex-col items-center">
          <RepoInputForm onAnalyzeComplete={handleAnalyzeComplete} />
          {analyzedUrl && <AnalysisResult url={analyzedUrl} />}
        </div>

        {/* <p className="mt-4 text-xs text-slate-500">
          Works with any public repository. No install required.
        </p> */}
      </section>

      {/* Highlights (hide if analyzed) */}
      {!analyzedUrl && (
        <section className="mx-auto mt-20 max-w-6xl w-full px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            {highlights.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/5 bg-panel/60 p-6 transition-colors hover:border-gold-500/30"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-350">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}