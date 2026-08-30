export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-350 sm:flex-row">
        <p>© {new Date().getFullYear()} Codebase Onboarder. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="/about" className="hover:text-slate-100">About</a>
          <a href="/contact" className="hover:text-slate-100">Contact</a>
          <a href="/login" className="hover:text-slate-100">Log in</a>
        </div>
      </div>
    </footer>
  );
}