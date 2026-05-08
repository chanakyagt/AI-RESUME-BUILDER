"use client";

import { useState } from "react";
import { ResumeData, WorkExperience } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { Plus, Trash2, Sparkles, Loader2, ChevronDown, ChevronUp, X } from "lucide-react";

interface Props {
  data: ResumeData;
  update: (patch: Partial<ResumeData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

function BulletList({ bullets, onChange }: { bullets: string[]; onChange: (b: string[]) => void }) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onChange([...bullets, trimmed]);
    setInput("");
  };

  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wide">Bullet Points</label>
      <div className="space-y-2 mb-2">
        {bullets.map((b, i) => (
          <div key={i} className="flex items-start gap-2 bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 group">
            <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
            <span className="flex-1 text-sm text-zinc-200">{b}</span>
            <button onClick={() => onChange(bullets.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Add a bullet point (or use AI below)"
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-all"
        />
        <button onClick={add} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2 rounded-lg text-sm transition-all">
          Add
        </button>
      </div>
    </div>
  );
}

function ExperienceCard({
  exp, onChange, onDelete
}: { exp: WorkExperience; onChange: (e: WorkExperience) => void; onDelete: () => void }) {
  const [open, setOpen] = useState(true);
  const [enhancing, setEnhancing] = useState(false);

  const set = (key: keyof WorkExperience) => (val: string | boolean | string[]) =>
    onChange({ ...exp, [key]: val });

  const handleEnhance = async () => {
    setEnhancing(true);
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: exp.title,
          company: exp.company,
          rawDescription: exp.rawDescription,
          existingBullets: exp.bullets,
        }),
      });
      const json = await res.json();
      if (json.bullets) onChange({ ...exp, bullets: json.bullets });
    } catch {
      // silently fail
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/2 transition-colors" onClick={() => setOpen(v => !v)}>
        <div className="flex-1">
          <p className="font-medium text-white text-sm">{exp.title || "New Position"}</p>
          <p className="text-xs text-zinc-500">{exp.company || "Company"}{exp.location ? ` · ${exp.location}` : ""}</p>
        </div>
        <button onClick={e => { e.stopPropagation(); onDelete(); }} className="text-zinc-600 hover:text-red-400 transition-colors p-1">
          <Trash2 className="w-4 h-4" />
        </button>
        {open ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
      </div>

      {open && (
        <div className="border-t border-zinc-700/50 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["title", "company", "location"] as const).map(k => (
              <div key={k}>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">{k}</label>
                <input
                  value={exp[k] as string}
                  onChange={e => set(k)(e.target.value)}
                  placeholder={k === "title" ? "Software Engineer" : k === "company" ? "Acme Corp" : "New York, NY"}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Start Date</label>
              <input type="month" value={exp.startDate} onChange={e => set("startDate")(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">End Date</label>
              <div className="flex items-center gap-2">
                {!exp.current && (
                  <input type="month" value={exp.endDate} onChange={e => set("endDate")(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-all" />
                )}
                <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer whitespace-nowrap">
                  <input type="checkbox" checked={exp.current} onChange={e => set("current")(e.target.checked)}
                    className="rounded border-zinc-600 bg-zinc-800 text-indigo-600 focus:ring-indigo-500" />
                  Current
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Raw Description (for AI)</label>
            <textarea
              value={exp.rawDescription}
              onChange={e => set("rawDescription")(e.target.value)}
              placeholder="Paste your job duties or description here. AI will turn it into polished bullet points."
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          <button
            onClick={handleEnhance}
            disabled={enhancing || (!exp.rawDescription && !exp.bullets.length)}
            className="flex items-center gap-2 bg-indigo-600/15 border border-indigo-500/30 hover:bg-indigo-600/25 disabled:opacity-40 disabled:cursor-not-allowed text-indigo-300 text-sm font-medium px-4 py-2 rounded-lg transition-all"
          >
            {enhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {enhancing ? "Enhancing with AI..." : "AI Enhance Bullets"}
          </button>

          <BulletList bullets={exp.bullets} onChange={b => set("bullets")(b)} />
        </div>
      )}
    </div>
  );
}

export default function ExperienceStep({ data, update, onNext, onPrev }: Props) {
  const addExp = () => {
    const newExp: WorkExperience = {
      id: generateId(), company: "", title: "", location: "",
      startDate: "", endDate: "", current: false, bullets: [], rawDescription: "",
    };
    update({ experience: [...data.experience, newExp] });
  };

  const updateExp = (id: string, exp: WorkExperience) =>
    update({ experience: data.experience.map(e => e.id === id ? exp : e) });

  const deleteExp = (id: string) =>
    update({ experience: data.experience.filter(e => e.id !== id) });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">Work Experience</h2>
        <p className="text-sm text-zinc-500">Add your roles. Use AI to generate polished bullet points.</p>
      </div>

      <div className="space-y-4">
        {data.experience.map(exp => (
          <ExperienceCard key={exp.id} exp={exp} onChange={e => updateExp(exp.id, e)} onDelete={() => deleteExp(exp.id)} />
        ))}
      </div>

      <button
        onClick={addExp}
        className="mt-4 w-full flex items-center justify-center gap-2 border border-dashed border-zinc-700 hover:border-indigo-500/50 text-zinc-500 hover:text-indigo-400 text-sm py-3.5 rounded-xl transition-all"
      >
        <Plus className="w-4 h-4" /> Add Work Experience
      </button>

      <div className="flex justify-between mt-8">
        <button onClick={onPrev} className="text-zinc-400 hover:text-white transition-colors px-4 py-2.5 rounded-xl hover:bg-white/5">← Back</button>
        <button onClick={onNext} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition-all">
          Next: Education →
        </button>
      </div>
    </div>
  );
}
