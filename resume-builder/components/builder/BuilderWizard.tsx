"use client";

import { useState, useCallback } from "react";
import { ResumeData, emptyResume } from "@/lib/types";
import StepIndicator from "./StepIndicator";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import ExperienceStep from "./steps/ExperienceStep";
import EducationStep from "./steps/EducationStep";
import SkillsStep from "./steps/SkillsStep";
import ProjectsStep from "./steps/ProjectsStep";
import FinalizeStep from "./steps/FinalizeStep";
import ResumePreview from "@/components/preview/ResumePreview";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { FileText } from "lucide-react";

const STEPS = [
  { id: "personal", label: "Personal" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "finalize", label: "Finalize" },
];

export default function BuilderWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [previewOpen, setPreviewOpen] = useState(false);

  const update = useCallback((patch: Partial<ResumeData>) => {
    setData(prev => ({ ...prev, ...patch }));
  }, []);

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const stepProps = { data, update, onNext: next, onPrev: prev };

  return (
    <div className="min-h-screen bg-[#0f0f11] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-30 bg-[#0f0f11]/90 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-white text-sm">ResumeAI</span>
        </Link>
        <button
          onClick={() => setPreviewOpen(v => !v)}
          className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/8 px-4 py-2 rounded-lg"
        >
          {previewOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {previewOpen ? "Hide Preview" : "Preview Resume"}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 border-r border-white/5 p-4 shrink-0">
          <StepIndicator steps={STEPS} current={step} onJump={setStep} />
        </aside>

        {/* Main form */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-8">
            {/* Mobile step indicator */}
            <div className="lg:hidden mb-6">
              <StepIndicator steps={STEPS} current={step} onJump={setStep} horizontal />
            </div>

            <div className="fade-in-up" key={step}>
              {step === 0 && <PersonalInfoStep {...stepProps} />}
              {step === 1 && <ExperienceStep {...stepProps} />}
              {step === 2 && <EducationStep {...stepProps} />}
              {step === 3 && <SkillsStep {...stepProps} />}
              {step === 4 && <ProjectsStep {...stepProps} />}
              {step === 5 && <FinalizeStep {...stepProps} />}
            </div>
          </div>
        </main>

        {/* Preview panel */}
        {previewOpen && (
          <aside className="hidden xl:block w-[480px] border-l border-white/5 overflow-y-auto bg-zinc-950/50 shrink-0">
            <div className="p-6">
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">Live Preview</h3>
              <div className="scale-[0.65] origin-top-left w-[154%]">
                <ResumePreview data={data} />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
