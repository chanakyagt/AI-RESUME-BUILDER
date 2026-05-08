"use client";

import { ResumeData, Education } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: ResumeData;
  update: (patch: Partial<ResumeData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

function EducationCard({ edu, onChange, onDelete }: { edu: Education; onChange: (e: Education) => void; onDelete: () => void }) {
  const set = (key: keyof Education) => (val: string) => onChange({ ...edu, [key]: val });

  return (
    <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-medium text-white text-sm">{edu.institution || "New School"}</p>
        <button onClick={onDelete} className="text-zinc-600 hover:text-red-400 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: "institution" as const, label: "Institution", placeholder: "MIT" },
          { key: "degree" as const, label: "Degree", placeholder: "Bachelor of Science" },
          { key: "field" as const, label: "Field of Study", placeholder: "Computer Science" },
          { key: "location" as const, label: "Location", placeholder: "Cambridge, MA" },
          { key: "startDate" as const, label: "Start Date", placeholder: "2018" },
          { key: "endDate" as const, label: "End Date", placeholder: "2022" },
          { key: "gpa" as const, label: "GPA (optional)", placeholder: "3.8" },
          { key: "honors" as const, label: "Honors (optional)", placeholder: "Magna Cum Laude" },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">{label}</label>
            <input
              value={edu[key]}
              onChange={e => set(key)(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EducationStep({ data, update, onNext, onPrev }: Props) {
  const add = () => {
    const newEdu: Education = {
      id: generateId(), institution: "", degree: "", field: "",
      location: "", startDate: "", endDate: "", gpa: "", honors: "",
    };
    update({ education: [...data.education, newEdu] });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">Education</h2>
        <p className="text-sm text-zinc-500">Add your degrees and academic achievements</p>
      </div>

      <div className="space-y-4">
        {data.education.map(edu => (
          <EducationCard
            key={edu.id}
            edu={edu}
            onChange={e => update({ education: data.education.map(x => x.id === edu.id ? e : x) })}
            onDelete={() => update({ education: data.education.filter(x => x.id !== edu.id) })}
          />
        ))}
      </div>

      <button
        onClick={add}
        className="mt-4 w-full flex items-center justify-center gap-2 border border-dashed border-zinc-700 hover:border-indigo-500/50 text-zinc-500 hover:text-indigo-400 text-sm py-3.5 rounded-xl transition-all"
      >
        <Plus className="w-4 h-4" /> Add Education
      </button>

      <div className="flex justify-between mt-8">
        <button onClick={onPrev} className="text-zinc-400 hover:text-white transition-colors px-4 py-2.5 rounded-xl hover:bg-white/5">← Back</button>
        <button onClick={onNext} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition-all">
          Next: Skills →
        </button>
      </div>
    </div>
  );
}
