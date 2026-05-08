"use client";

import { useState } from "react";
import { ResumeData } from "@/lib/types";
import { Sparkles, Loader2, X, Plus } from "lucide-react";

interface Props {
  data: ResumeData;
  update: (patch: Partial<ResumeData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const CATEGORIES = [
  { key: "technical" as const, label: "Technical Skills", placeholder: "e.g. React, TypeScript, Python" },
  { key: "tools" as const, label: "Tools & Frameworks", placeholder: "e.g. Docker, AWS, PostgreSQL" },
  { key: "soft" as const, label: "Soft Skills", placeholder: "e.g. Leadership, Communication" },
  { key: "languages" as const, label: "Languages", placeholder: "e.g. English (Native), Spanish (Conversational)" },
];

function TagInput({
  label, placeholder, tags, onChange
}: { label: string; placeholder: string; tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");

  const add = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(input);
    } else if (e.key === "Backspace" && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wide">{label}</label>
      <div className="min-h-[48px] bg-zinc-900 border border-zinc-700 rounded-xl p-2 flex flex-wrap gap-1.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
        {tags.map(t => (
          <span key={t} className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-full">
            {t}
            <button onClick={() => onChange(tags.filter(x => x !== t))} className="hover:text-red-400 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => add(input)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none px-1"
        />
      </div>
      <p className="text-xs text-zinc-600 mt-1">Press Enter or comma to add</p>
    </div>
  );
}

export default function SkillsStep({ data, update, onNext, onPrev }: Props) {
  const [suggesting, setSuggesting] = useState(false);

  const handleSuggest = async () => {
    setSuggesting(true);
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: data.personal.jobTitle,
          experience: data.experience.map(e => ({ title: e.title, company: e.company })),
        }),
      });
      const json = await res.json();
      if (json.skills) {
        update({
          skills: {
            technical: [...new Set([...data.skills.technical, ...(json.skills.technical || [])])],
            tools: [...new Set([...data.skills.tools, ...(json.skills.tools || [])])],
            soft: [...new Set([...data.skills.soft, ...(json.skills.soft || [])])],
            languages: data.skills.languages,
          },
        });
      }
    } catch {
      // silently fail
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">Skills</h2>
        <p className="text-sm text-zinc-500">Add your skills — or let AI suggest based on your experience</p>
      </div>

      <button
        onClick={handleSuggest}
        disabled={suggesting || !data.personal.jobTitle}
        className="mb-6 flex items-center gap-2 bg-indigo-600/15 border border-indigo-500/30 hover:bg-indigo-600/25 disabled:opacity-40 disabled:cursor-not-allowed text-indigo-300 text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
      >
        {suggesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {suggesting ? "Suggesting skills..." : "AI Suggest Skills"}
      </button>

      <div className="space-y-5">
        {CATEGORIES.map(({ key, label, placeholder }) => (
          <TagInput
            key={key}
            label={label}
            placeholder={placeholder}
            tags={data.skills[key]}
            onChange={tags => update({ skills: { ...data.skills, [key]: tags } })}
          />
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={onPrev} className="text-zinc-400 hover:text-white transition-colors px-4 py-2.5 rounded-xl hover:bg-white/5">← Back</button>
        <button onClick={onNext} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition-all">
          Next: Projects →
        </button>
      </div>
    </div>
  );
}
