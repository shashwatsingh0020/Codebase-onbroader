import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-blue-400 font-semibold" : "text-slate-350 hover:text-white"
    }`;

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    setDropdownOpen(false);
    setOpen(false);
    logout();
    navigate("/");
  };

  const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : "U";

  const handleScrollToFeatures = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById("features");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#090d16]/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-xs font-bold text-blue-400 border border-blue-500/20">
            &lt;/&gt;
          </span>
          <span className="font-display text-base font-bold text-white tracking-tight">
            Codebase Onboarder
          </span>
        </NavLink>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <a
            href="/#features"
            onClick={handleScrollToFeatures}
            className="text-sm font-medium text-slate-350 transition-colors hover:text-white"
          >
            Features
          </a>
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
            /* Circular avatar with 1st letter & dropdown menu */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                title={`Account: ${user.name}`}
                aria-label="User menu"
                aria-expanded={dropdownOpen}
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 font-bold text-white text-sm shadow-md shadow-blue-500/20 ring-2 transition-all hover:scale-105 cursor-pointer ${
                  dropdownOpen ? "ring-blue-400" : "ring-transparent hover:ring-blue-400/60"
                }`}
              >
                {userInitial}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl border border-white/10 bg-[#0c101c]/95 py-2 shadow-2xl backdrop-blur-xl ring-1 ring-black/50 z-50">
                  {/* User details header */}
                  <div className="border-b border-white/10 px-4 pb-2.5 pt-1">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <div className="pt-1.5 pb-1">
                    {/* My Dashboard */}
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/dashboard");
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-blue-300 cursor-pointer"
                    >
                      <LayoutDashboard size={15} className="text-blue-400" />
                      <span>My Dashboard</span>
                    </button>

                    {/* My Profile */}
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/profile");
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-blue-300 cursor-pointer"
                    >
                      <User size={15} className="text-blue-400" />
                      <span>My Profile</span>
                    </button>
                  </div>

                  {/* Divider & Logout */}
                  <div className="border-t border-white/10 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm font-medium text-slate-350 transition-colors hover:text-white"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-500 hover:scale-[1.03]"
              >
                Sign Up
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
        <div className="border-t border-white/5 bg-[#090d16] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink
              to="/"
              className={linkClass}
              end
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>
            <a
              href="/#features"
              className="text-sm font-medium text-slate-350 hover:text-white"
              onClick={(e) => {
                setOpen(false);
                handleScrollToFeatures(e);
              }}
            >
              Features
            </a>
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
              <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#0e1322] p-3">
                {/* User avatar header */}
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 font-bold text-white text-sm">
                    {userInitial}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">{user.name}</span>
                    <span className="text-xs text-slate-400 truncate">{user.email}</span>
                  </div>
                </div>

                {/* My Dashboard */}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate("/dashboard");
                  }}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-xs font-medium text-slate-200 hover:bg-white/5 hover:text-blue-300 transition-colors"
                >
                  <LayoutDashboard size={15} className="text-blue-400" />
                  <span>My Dashboard</span>
                </button>

                {/* My Profile */}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-xs font-medium text-slate-200 hover:bg-white/5 hover:text-blue-300 transition-colors"
                >
                  <User size={15} className="text-blue-400" />
                  <span>My Profile</span>
                </button>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <NavLink to="/login" className="text-sm text-slate-350" onClick={() => setOpen(false)}>
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="w-fit rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}