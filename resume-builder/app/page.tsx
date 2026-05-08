import Link from "next/link";
import { Sparkles, FileText, Zap, Download, CheckCircle, ArrowRight } from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI-Powered Content", desc: "Generate professional bullet points and summaries with DeepSeek AI" },
  { icon: Zap, title: "ATS Optimization", desc: "Get a real-time ATS score and tips to pass applicant tracking systems" },
  { icon: FileText, title: "3 Premium Templates", desc: "Modern, Minimal, and Classic layouts — all print-ready" },
  { icon: Download, title: "PDF Export", desc: "Download your resume as a clean, formatted PDF instantly" },
];

const steps = [
  { n: "1", label: "Fill in your info", desc: "Personal details, experience, education, skills, and projects" },
  { n: "2", label: "AI Enhancement", desc: "Click to generate polished bullet points and summary with one tap" },
  { n: "3", label: "Preview & Export", desc: "See your resume live, pick a template, and download as PDF" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f11] flex flex-col">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white">ResumeAI</span>
        </div>
        <Link
          href="/builder"
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Open Builder →
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium px-4 py-1.5 rounded-full mb-8">
          <Sparkles className="w-3 h-3" />
          Powered by DeepSeek AI
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-3xl">
          Build your{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            perfect resume
          </span>{" "}
          with AI
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mb-10 leading-relaxed">
          Fill in your experience, let AI craft compelling bullet points and summaries, then download a polished, ATS-ready resume in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/builder"
            className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20"
          >
            Build My Resume
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <span className="text-sm text-zinc-500">Free — no account needed</span>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-6 mt-12 text-sm text-zinc-500">
          {["ATS-Friendly", "PDF Export", "3 Templates", "AI Bullet Points"].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto w-full px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-indigo-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-white mb-2 text-sm">{title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/5 max-w-6xl mx-auto w-full px-6 py-20">
        <h2 className="text-2xl font-bold text-white text-center mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ n, label, desc }) => (
            <div key={n} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg mb-4">
                {n}
              </div>
              <h3 className="font-semibold text-white mb-2">{label}</h3>
              <p className="text-sm text-zinc-500">{desc}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Link
            href="/builder"
            className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-6 text-center text-xs text-zinc-600">
        ResumeAI — Built with Next.js & DeepSeek AI
      </footer>
    </main>
  );
}
