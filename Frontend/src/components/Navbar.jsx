import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Terminal, Menu, X, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

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

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          )}
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            /* Circle avatar with first letter only - links to Profile */
            <NavLink
              to="/profile"
              title={`View Profile (${user.name})`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-gold-500 to-gold-300 font-bold text-ink-950 text-sm shadow-md shadow-gold-500/20 ring-2 ring-transparent transition-all hover:ring-gold-400 hover:scale-105"
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </NavLink>
          ) : (
            <>
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
            </>
          )}
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
            <NavLink
              to="/"
              className={linkClass}
              end
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>
            {user && (
              <NavLink
                to="/dashboard"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Dashboard
              </NavLink>
            )}
            <NavLink
              to="/about"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Contact
            </NavLink>

            <hr className="border-white/10" />

            {user ? (
              <NavLink
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-panel/70 p-3 text-slate-200 transition-colors hover:border-gold-500/40"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-gold-500 to-gold-300 font-bold text-ink-950 text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">My Profile</span>
                  <span className="text-xs text-slate-400">View account & settings</span>
                </div>
              </NavLink>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}