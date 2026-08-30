import { useState } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";
import EyebrowBadge from "../components/EyebrowBadge.jsx";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with a real API call to your backend or an email service.
    setSent(true);
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col justify-center px-6 py-12">
      <div className="text-center">
        <EyebrowBadge>Contact</EyebrowBadge>
        <h1 className="mt-6 font-display text-3xl font-extrabold text-white sm:text-5xl">
          Talk to us
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-slate-350">
          Questions, feedback, or a repo that trips up the analyzer? Send it over.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-[1fr_1.3fr]">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="group rounded-2xl border border-white/5 bg-panel/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/30 hover:shadow-[0_8px_30px_-12px_rgba(217,185,90,0.15)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400 transition-colors group-hover:bg-gold-500/20">
              <Mail size={16} />
            </span>
            <p className="mt-3 text-sm font-semibold text-white group-hover:text-gold-300 transition-colors">Email</p>
            <p className="mt-1 text-sm text-slate-350">support@codebaseonboarder.dev</p>
          </div>
          <div className="group rounded-2xl border border-white/5 bg-panel/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/30 hover:shadow-[0_8px_30px_-12px_rgba(217,185,90,0.15)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400 transition-colors group-hover:bg-gold-500/20">
              <MessageSquare size={16} />
            </span>
            <p className="mt-3 text-sm font-semibold text-white group-hover:text-gold-300 transition-colors">Response time</p>
            <p className="mt-1 text-sm text-slate-350">Usually within one business day.</p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-white/5 bg-panel/60 p-6"
        >
          {sent && (
            <p className="rounded-lg border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-sm text-gold-300">
              Message sent. We'll get back to you soon.
            </p>
          )}

          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-slate-350">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-ink-900 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-gold-500/50 focus:outline-none"
              placeholder="Ada Lovelace"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-350">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-ink-900 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-gold-500/50 focus:outline-none"
              placeholder="ada@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-slate-350">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              value={form.message}
              onChange={handleChange}
              className="w-full resize-none rounded-lg border border-white/10 bg-ink-900 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-gold-500/50 focus:outline-none"
              placeholder="How can we help?"
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-300 px-4 py-3 text-sm font-bold text-ink-950 shadow-[0_0_20px_-4px_rgba(217,185,90,0.4)] transition-transform hover:scale-[1.02]"
          >
            <Send size={15} />
            Send message
          </button>
        </form>
      </div>
    </main>
  );
}