"use client";

import { useState, useRef } from "react";
import { ResumeData } from "@/lib/types";
import { resumeToText, calcYearsExperience } from "@/lib/utils";
import { Sparkles, Loader2, Download, CheckCircle2, AlertCircle } from "lucide-react";
import ResumePreview from "@/components/preview/ResumePreview";
import { useReactToPrint } from "react-to-print";

interface Props {
  data: ResumeData;
  update: (patch: Partial<ResumeData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const TEMPLATES: { id: ResumeData["template"]; label: string; desc: string }[] = [
  { id: "modern", label: "Modern", desc: "Clean with indigo accents" },
  { id: "minimal", label: "Minimal", desc: "Pure black & white, classic" },
  { id: "classic", label: "Classic", desc: "Traditional two-column" },
];

export default function FinalizeStep({ data, update, onPrev }: Props) {
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [checkingATS, setCheckingATS] = useState(false);
  const [ats, setAts] = useState<{ score: number; feedback: string[] } | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${data.personal.name || "Resume"} - Resume`,
  });

  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.personal.name,
          jobTitle: data.personal.jobTitle,
          experience: data.experience.map(e => ({ title: e.title, company: e.company, bullets: e.bullets })),
          skills: { technical: data.skills.technical, tools: data.skills.tools },
          yearsOfExperience: calcYearsExperience(data.experience),
        }),
      });
      const json = await res.json();
      if (json.summary) update({ summary: json.summary });
    } catch {
      // silently fail
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleATSCheck = async () => {
    setCheckingATS(true);
    try {
      const res = await fetch("/api/ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: resumeToText(data) }),
      });
      const json = await res.json();
      setAts(json);
    } catch {
      setAts({ score: 0, feedback: ["Unable to analyze resume"] });
    } finally {
      setCheckingATS(false);
    }
  };

  const scoreColor = ats
    ? ats.score >= 80 ? "text-green-400" : ats.score >= 60 ? "text-yellow-400" : "text-red-400"
    : "";

  const scoreBarColor = ats
    ? ats.score >= 80 ? "bg-green-500" : ats.score >= 60 ? "bg-yellow-500" : "bg-red-500"
    : "bg-indigo-500";

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">Finalize Your Resume</h2>
        <p className="text-sm text-zinc-500">Generate your summary, pick a template, and download</p>
      </div>

      {/* Professional Summary */}
      <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white text-sm">Professional Summary</h3>
          <button
            onClick={handleGenerateSummary}
            disabled={generatingSummary}
            className="flex items-center gap-1.5 bg-indigo-600/15 border border-indigo-500/30 hover:bg-indigo-600/25 disabled:opacity-40 text-indigo-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
          >
            {generatingSummary ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {generatingSummary ? "Generating..." : "AI Generate"}
          </button>
        </div>
        <textarea
          value={data.summary}
          onChange={e => update({ summary: e.target.value })}
          rows={4}
          placeholder="Write a 3-4 sentence professional summary, or click AI Generate above..."
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-all resize-none"
        />
      </div>

      {/* Template Selection */}
      <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-2xl p-5 mb-5">
        <h3 className="font-semibold text-white text-sm mb-4">Choose Template</h3>
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => update({ template: t.id })}
              className={`p-3 rounded-xl border text-left transition-all ${
                data.template === t.id
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-zinc-700 hover:border-zinc-500 bg-zinc-900"
              }`}
            >
              <div className={`w-full h-16 rounded-lg mb-2 ${
                t.id === "modern" ? "bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border border-indigo-500/20" :
                t.id === "minimal" ? "bg-zinc-800 border border-zinc-700" :
                "bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-700"
              } flex items-center justify-center`}>
                <div className="space-y-1 w-10">
                  <div className={`h-1 rounded ${t.id === "modern" ? "bg-indigo-500" : "bg-zinc-500"}`} />
                  <div className="h-0.5 rounded bg-zinc-600 w-8" />
                  <div className="h-0.5 rounded bg-zinc-700 w-6" />
                </div>
              </div>
              <p className={`text-xs font-medium ${data.template === t.id ? "text-indigo-300" : "text-zinc-300"}`}>{t.label}</p>
              <p className="text-xs text-zinc-600 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ATS Score */}
      <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white text-sm">ATS Compatibility Score</h3>
          <button
            onClick={handleATSCheck}
            disabled={checkingATS}
            className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
          >
            {checkingATS ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            {checkingATS ? "Analyzing..." : "Check ATS Score"}
          </button>
        </div>
        {ats ? (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-3xl font-bold ${scoreColor}`}>{ats.score}</span>
              <div className="flex-1">
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${scoreBarColor}`} style={{ width: `${ats.score}%` }} />
                </div>
                <p className="text-xs text-zinc-500 mt-1">{ats.score >= 80 ? "Excellent" : ats.score >= 60 ? "Good" : "Needs Improvement"}</p>
              </div>
            </div>
            <div className="space-y-2">
              {ats.feedback.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                  {ats.score >= 80 ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" /> : <AlertCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />}
                  {tip}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-600">Click above to get an ATS compatibility score and improvement tips.</p>
        )}
      </div>

      {/* Download */}
      <div className="bg-gradient-to-br from-indigo-900/20 to-violet-900/20 border border-indigo-500/20 rounded-2xl p-5 mb-8">
        <h3 className="font-semibold text-white text-sm mb-2">Download Your Resume</h3>
        <p className="text-xs text-zinc-500 mb-4">Opens a print dialog — save as PDF for best results</p>
        <button
          onClick={() => handlePrint()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      {/* Hidden print target */}
      <div className="hidden">
        <div ref={printRef}>
          <ResumePreview data={data} forPrint />
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onPrev} className="text-zinc-400 hover:text-white transition-colors px-4 py-2.5 rounded-xl hover:bg-white/5">← Back</button>
      </div>
    </div>
  );
}
