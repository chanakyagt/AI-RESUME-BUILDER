"use client";

import { useState } from "react";
import { ResumeData, Project } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { Plus, Trash2, Sparkles, Loader2, X } from "lucide-react";

interface Props {
  data: ResumeData;
  update: (patch: Partial<ResumeData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

function ProjectCard({ project, onChange, onDelete }: { project: Project; onChange: (p: Project) => void; onDelete: () => void }) {
  const [enhancing, setEnhancing] = useState(false);
  const [techInput, setTechInput] = useState("");

  const set = (key: keyof Project) => (val: string | string[]) => onChange({ ...project, [key]: val });

  const addTech = (val: string) => {
    const t = val.trim();
    if (!t || project.technologies.includes(t)) return;
    onChange({ ...project, technologies: [...project.technologies, t] });
    setTechInput("");
  };

  const handleEnhance = async () => {
    setEnhancing(true);
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "project", name: project.name, description: project.description, technologies: project.technologies }),
      });
      const json = await res.json();
      if (json.bullets) onChange({ ...project, bullets: json.bullets });
    } catch {
      // silently fail
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-medium text-white text-sm">{project.name || "New Project"}</p>
        <button onClick={onDelete} className="text-zinc-600 hover:text-red-400 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Project Name</label>
          <input value={project.name} onChange={e => set("name")(e.target.value)} placeholder="My Awesome Project"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Link (optional)</label>
          <input value={project.link} onChange={e => set("link")(e.target.value)} placeholder="github.com/user/project"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-all" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Description</label>
        <textarea value={project.description} onChange={e => set("description")(e.target.value)} rows={2}
          placeholder="Briefly describe what this project does and your role..."
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-all resize-none" />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wide">Technologies</label>
        <div className="min-h-[40px] bg-zinc-900 border border-zinc-700 rounded-lg p-2 flex flex-wrap gap-1.5">
          {project.technologies.map(t => (
            <span key={t} className="flex items-center gap-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs px-2.5 py-0.5 rounded-full">
              {t}
              <button onClick={() => onChange({ ...project, technologies: project.technologies.filter(x => x !== t) })}>
                <X className="w-3 h-3 hover:text-red-400" />
              </button>
            </span>
          ))}
          <input value={techInput} onChange={e => setTechInput(e.target.value)}
            onKeyDown={e => (e.key === "Enter" || e.key === ",") && (e.preventDefault(), addTech(techInput))}
            onBlur={() => addTech(techInput)}
            placeholder="Add tech..."
            className="flex-1 min-w-[80px] bg-transparent text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none px-1" />
        </div>
      </div>

      <button onClick={handleEnhance} disabled={enhancing || !project.description}
        className="flex items-center gap-2 bg-indigo-600/15 border border-indigo-500/30 hover:bg-indigo-600/25 disabled:opacity-40 disabled:cursor-not-allowed text-indigo-300 text-sm font-medium px-4 py-2 rounded-lg transition-all">
        {enhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {enhancing ? "Enhancing..." : "AI Enhance Bullets"}
      </button>

      {project.bullets.length > 0 && (
        <div className="space-y-2">
          {project.bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-2 bg-zinc-900 border border-zinc-700/50 rounded-lg p-2.5 group">
              <span className="text-indigo-400 mt-0.5">•</span>
              <span className="flex-1 text-sm text-zinc-200">{b}</span>
              <button onClick={() => onChange({ ...project, bullets: project.bullets.filter((_, j) => j !== i) })}
                className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectsStep({ data, update, onNext, onPrev }: Props) {
  const add = () => {
    const p: Project = { id: generateId(), name: "", description: "", technologies: [], link: "", bullets: [] };
    update({ projects: [...data.projects, p] });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">Projects</h2>
        <p className="text-sm text-zinc-500">Showcase your notable projects (optional but recommended)</p>
      </div>

      <div className="space-y-4">
        {data.projects.map(p => (
          <ProjectCard key={p.id} project={p}
            onChange={proj => update({ projects: data.projects.map(x => x.id === proj.id ? proj : x) })}
            onDelete={() => update({ projects: data.projects.filter(x => x.id !== p.id) })} />
        ))}
      </div>

      <button onClick={add}
        className="mt-4 w-full flex items-center justify-center gap-2 border border-dashed border-zinc-700 hover:border-indigo-500/50 text-zinc-500 hover:text-indigo-400 text-sm py-3.5 rounded-xl transition-all">
        <Plus className="w-4 h-4" /> Add Project
      </button>

      <div className="flex justify-between mt-8">
        <button onClick={onPrev} className="text-zinc-400 hover:text-white transition-colors px-4 py-2.5 rounded-xl hover:bg-white/5">← Back</button>
        <button onClick={onNext} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition-all">
          Next: Finalize →
        </button>
      </div>
    </div>
  );
}
