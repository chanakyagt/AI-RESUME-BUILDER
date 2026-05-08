"use client";

import { CheckCircle2, Circle } from "lucide-react";

interface Step { id: string; label: string; }

interface Props {
  steps: Step[];
  current: number;
  onJump: (i: number) => void;
  horizontal?: boolean;
}

export default function StepIndicator({ steps, current, onJump, horizontal }: Props) {
  if (horizontal) {
    return (
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <button
              key={s.id}
              onClick={() => onJump(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                active ? "bg-indigo-600 text-white" :
                done ? "text-indigo-400 bg-indigo-500/10" :
                "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {done ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
              {s.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <nav className="flex flex-col gap-1">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-3 mb-3">Steps</p>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <button
            key={s.id}
            onClick={() => onJump(i)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full ${
              active ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/25" :
              done ? "text-zinc-400 hover:text-zinc-200 hover:bg-white/4" :
              "text-zinc-600 hover:text-zinc-400 hover:bg-white/3"
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
              active ? "bg-indigo-600 text-white" :
              done ? "bg-indigo-500/20 text-indigo-400" :
              "bg-zinc-800 text-zinc-500"
            }`}>
              {done ? <CheckCircle2 className="w-3 h-3" /> : <span>{i + 1}</span>}
            </span>
            {s.label}
          </button>
        );
      })}
    </nav>
  );
}
