import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Lock, Mail, Sparkles, UserRound } from "lucide-react";
import DarkModeToggle from "../components/DarkModeToggle";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "Sandip",
    email: "gawali@gmail.com",
    password: "Pass@123",
    confirmPassword: "Pass@123",
  });

  const [errors, setErrors] = useState({});
  const [dark, setDark] = useState(true);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};

    if (!form.name) nextErrors.name = "Name is required";
    if (!form.email) nextErrors.email = "Email is required";
    if (!form.password) nextErrors.password = "Password is required";
    if (!form.confirmPassword)
      nextErrors.confirmPassword = "Confirm password is required";
    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success("Registration successful 🎉");
      navigate("/login");
    } catch (error) { 
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed"
      );
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

        <DarkModeToggle
          enabled={dark}
          onToggle={() => setDark((prev) => !prev)}
        />
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-10 lg:grid-cols-2">
        {/* LEFT CONTENT */}
        <div className="space-y-6 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
          <GraduationCap size={46} className="text-indigo-200" />
          <h2 className="text-4xl font-semibold leading-tight">
            Students, researchers, and teaching teams ship notes faster here.
          </h2>
          <div className="grid gap-4 text-sm text-white/70">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              Unlimited lecture uploads (audio, video, slides, or raw text).
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              Templates for sprints, revisions, and exam crunch time.
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              Share-ready exports: PDF, Notion, Obsidian, Markdown.
            </div>
          </div>
        </div>

        {/* REGISTER FORM */}
        <form
          onSubmit={handleSubmit}
          className="glass-panel rounded-[2.5rem] p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
            Create account
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            Start summarizing smarter
          </h2>

          <div className="mt-8 space-y-6">
            {/* NAME */}
            <InputField
              label="Full Name"
              icon={<UserRound size={18} />}
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />

            {/* EMAIL */}
            <InputField
              label="Email Address"
              icon={<Mail size={18} />}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />

            {/* PASSWORD */}
            <InputField
              label="Password"
              icon={<Lock size={18} />}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
            />

            {/* CONFIRM PASSWORD */}
            <InputField
              label="Confirm Password"
              icon={<Lock size={18} />}
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </div>

          <button
            type="submit"
            disabled={
              !form.password ||
              !form.confirmPassword ||
              form.password !== form.confirmPassword
            }
            className="mt-8 w-full rounded-2xl bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create free account
          </button>

          <p className="mt-4 text-center text-sm text-white/70">
            Already have an account?{" "}
            <Link to="/login" className="text-white">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

/* REUSABLE INPUT COMPONENT */
const InputField = ({
  label,
  icon,
  name,
  type = "text",
  value,
  onChange,
  error,
}) => (
  <label className="space-y-2">
    <span className="text-sm font-medium text-white/70">{label}</span>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
        {icon}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-12 py-3 text-white placeholder:text-white/40 focus:border-indigo-300 focus:outline-none"
      />
    </div>
    {error && <p className="text-sm text-rose-300">{error}</p>}
  </label>
);

export default Register;
