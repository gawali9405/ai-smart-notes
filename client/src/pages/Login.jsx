import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [dark, setDark] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    if (!form.email) nextErrors.email = "Email is required";
    if (!form.password) nextErrors.password = "Password is required";
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);

      await login({
        email: form.email,
        password: form.password,
      });

      toast.success("Login successful 🎉");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen px-6 py-10 ${
        dark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-white to-indigo-100 text-slate-900"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 text-indigo-300">
            <Sparkles />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              Smart Notes
            </p>
            <h1 className="text-xl font-semibold">AI Lecture Lab</h1>
          </div>
        </Link>

        <DarkModeToggle enabled={dark} onToggle={() => setDark((p) => !p)} />
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-10 lg:grid-cols-2">
        <div className="space-y-6 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.4em] text-white/50">
            Why join?
          </p>
          <h2 className="text-4xl font-semibold leading-tight">
            Summaries, slides & Q&A in minutes.
          </h2>

          {[
            "Upload audio, video, slides, or transcripts with one button.",
            "Generate short, detailed, and bullet summaries simultaneously.",
            "Auto-produce MCQs, short answers, and long answers for exams.",
          ].map((item) => (
            <div key={item} className="flex items-start gap-4">
              <ShieldCheck className="mt-1 text-emerald-300" size={18} />
              <p className="text-white/80">{item}</p>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-panel rounded-[2.5rem] p-8 text-white"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
            Welcome back
          </p>
          <h2 className="mt-3 text-3xl font-semibold">Login to Smart Notes</h2>

          <div className="mt-8 space-y-6">
            <label className="space-y-2">
              <span className="text-sm font-medium text-white/70">
                Email Address
              </span>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-12 py-3 text-white placeholder:text-white/40 focus:border-indigo-300 focus:outline-none"
                  placeholder="you@college.edu"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-rose-300">{errors.email}</p>
              )}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-white/70">
                Password
              </span>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                  size={18}
                />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-12 py-3 text-white placeholder:text-white/40 focus:border-indigo-300 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-rose-300">{errors.password}</p>
              )}
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-2xl bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Continue"}
          </button>

          <p className="mt-4 text-center text-sm text-white/70">
            Don't have an account?{" "}
            <Link to="/register" className="text-white">
              Create free account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
