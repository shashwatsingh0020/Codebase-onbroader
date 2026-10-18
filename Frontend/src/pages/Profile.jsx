import { useNavigate, Link } from "react-router-dom";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  LogOut, 
  Calendar, 
  Key, 
  LayoutDashboard, 
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import EyebrowBadge from "../components/EyebrowBadge.jsx";

export default function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  // If not logged in, prompt to log in
  if (!user) {
    return (
      <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-white">Not Signed In</h2>
        <p className="mt-2 text-sm text-slate-400">
          Please log in to view your profile and manage your account.
        </p>
        <Link
          to="/login"
          className="mt-6 rounded-lg bg-gradient-to-r from-gold-400 to-gold-300 px-5 py-2.5 text-sm font-semibold text-ink-950"
        >
          Go to Login
        </Link>
      </main>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently joined";

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-gold-300 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-panel/70 p-6 sm:p-8 shadow-[0_0_50px_-20px_rgba(217,185,90,0.15)] backdrop-blur-md">
        {/* Header Profile Section */}
        <div className="flex flex-col items-center gap-5 border-b border-white/10 pb-8 text-center sm:flex-row sm:text-left">
          {/* Large Circle with First Letter */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-gold-500 to-gold-300 text-3xl font-extrabold text-ink-950 shadow-lg shadow-gold-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
                {user.name}
              </h1>
              <span className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-400">
                <CheckCircle2 size={12} />
                Active Account
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">{user.email}</p>
          </div>

          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:border-gold-500/40 hover:text-white"
          >
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Account Details Details Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {/* Email Info */}
          <div className="rounded-xl border border-white/5 bg-ink-950/50 p-4">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Mail size={14} className="text-gold-400" /> Email Address
            </span>
            <p className="mt-2 font-mono text-sm font-semibold text-slate-200 truncate">
              {user.email}
            </p>
          </div>

          {/* Member Since */}
          <div className="rounded-xl border border-white/5 bg-ink-950/50 p-4">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Calendar size={14} className="text-gold-400" /> Member Since
            </span>
            <p className="mt-2 text-sm font-semibold text-slate-200">
              {formattedDate}
            </p>
          </div>

          {/* Session Security / WebToken */}
          <div className="rounded-xl border border-white/5 bg-ink-950/50 p-4 sm:col-span-2">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <ShieldCheck size={14} className="text-green-400" /> Authentication Session (JWT)
            </span>
            <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-350">
                Secured via signed JSON Web Token stored in browser memory & verified by MongoDB.
              </p>
              <span className="inline-flex items-center gap-1.5 self-start text-[11px] font-mono text-gold-300">
                <Key size={12} /> Token Valid
              </span>
            </div>
          </div>
        </div>

        {/* Dedicated Logout Action Section */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h3 className="text-sm font-semibold text-white">Sign Out of Session</h3>
            <p className="text-xs text-slate-400">
              This will clear your credentials from this device.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-bold text-red-300 transition-all hover:bg-red-500/20 hover:text-red-200 hover:scale-[1.02]"
          >
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </main>
  );
}
