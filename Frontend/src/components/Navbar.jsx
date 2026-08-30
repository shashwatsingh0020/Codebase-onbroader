import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Terminal, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-gold-400" : "text-slate-350 hover:text-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950">
            <Terminal size={16} strokeWidth={2.5} />
          </span>
          <span className="font-display text-base font-bold text-white">
            Codebase<span className="text-gold-400">Onboarder</span>
          </span>
        </NavLink>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === "/"}>
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <NavLink
            to="/login"
            className="text-sm font-medium text-slate-350 transition-colors hover:text-slate-100"
          >
            Log in
          </NavLink>
          <NavLink
            to="/signup"
            className="rounded-lg bg-gradient-to-r from-gold-400 to-gold-300 px-4 py-2 text-sm font-semibold text-ink-950 shadow-[0_0_20px_-4px_rgba(217,185,90,0.6)] transition-transform hover:scale-[1.03]"
          >
            Sign up
          </NavLink>
        </div>

        {/* Mobile toggle */}
        <button
          className="text-slate-200 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/5 bg-ink-950 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={linkClass}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <hr className="border-white/10" />
            <NavLink to="/login" className="text-sm text-slate-350" onClick={() => setOpen(false)}>
              Log in
            </NavLink>
            <NavLink
              to="/signup"
              className="w-fit rounded-lg bg-gradient-to-r from-gold-400 to-gold-300 px-4 py-2 text-sm font-semibold text-ink-950"
              onClick={() => setOpen(false)}
            >
              Sign up
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}