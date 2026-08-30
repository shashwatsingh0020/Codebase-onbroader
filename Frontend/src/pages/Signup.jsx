import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import AuthCard from "../components/AuthCard.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Fill in every field to create your account.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    // Replace with a real auth call, e.g. POST /api/signup
    navigate("/");
  };

  return (
    <AuthCard
      eyebrow="Get started"
      title="Create your account"
      subtitle="Onboard your first repo in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-gold-400 hover:text-gold-300">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-3.5 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-slate-350">
            Name
          </label>
          <div className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-ink-900 px-3.5 py-2.5 focus-within:border-gold-500/50">
            <User size={16} className="text-slate-500" />
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-350">
            Email
          </label>
          <div className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-ink-900 px-3.5 py-2.5 focus-within:border-gold-500/50">
            <Mail size={16} className="text-slate-500" />
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your E-mail"
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-slate-350">
            Password
          </label>
          <div className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-ink-900 px-3.5 py-2.5 focus-within:border-gold-500/50">
            <Lock size={16} className="text-slate-500" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder=""
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-slate-500 hover:text-slate-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-gold-400 to-gold-300 px-4 py-2.5 text-sm font-bold text-ink-950 transition-transform hover:scale-[1.01]"
        >
          Create account
        </button>

        <p className="text-center text-xs text-slate-500">
          By signing up you agree to our Terms and Privacy Policy.
        </p>
      </form>
    </AuthCard>
  );
}