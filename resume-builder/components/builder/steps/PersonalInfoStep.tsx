"use client";

import { ResumeData } from "@/lib/types";
import { User, Mail, Phone, MapPin, Link2, GitBranch, Globe, Briefcase } from "lucide-react";

interface Props {
  data: ResumeData;
  update: (patch: Partial<ResumeData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

function Field({
  label, icon: Icon, value, onChange, placeholder, type = "text"
}: {
  label: string; icon: React.ElementType; value: string;
  onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
      </div>
    </div>
  );
}

export default function PersonalInfoStep({ data, update, onNext }: Props) {
  const p = data.personal;
  const set = (key: keyof typeof p) => (val: string) =>
    update({ personal: { ...p, [key]: val } });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">Personal Information</h2>
        <p className="text-sm text-zinc-500">Start with your contact details and target role</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <Field label="Full Name" icon={User} value={p.name} onChange={set("name")} placeholder="Jane Doe" />
        </div>
        <div className="sm:col-span-2">
          <Field label="Target Job Title" icon={Briefcase} value={p.jobTitle} onChange={set("jobTitle")} placeholder="Senior Software Engineer" />
        </div>
        <Field label="Email" icon={Mail} value={p.email} onChange={set("email")} placeholder="jane@example.com" type="email" />
        <Field label="Phone" icon={Phone} value={p.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" />
        <Field label="Location" icon={MapPin} value={p.location} onChange={set("location")} placeholder="San Francisco, CA" />
        <Field label="LinkedIn" icon={Link2} value={p.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/janedoe" />
        <Field label="GitHub" icon={GitBranch} value={p.github} onChange={set("github")} placeholder="github.com/janedoe" />
        <Field label="Portfolio" icon={Globe} value={p.portfolio} onChange={set("portfolio")} placeholder="janedoe.dev" />
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={onNext}
          disabled={!p.name || !p.email}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl transition-all"
        >
          Next: Experience →
        </button>
      </div>
    </div>
  );
}
