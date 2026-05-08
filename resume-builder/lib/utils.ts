import { ResumeData } from "./types";

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function resumeToText(data: ResumeData): string {
  const lines: string[] = [];

  lines.push(data.personal.name);
  lines.push(data.personal.jobTitle);
  lines.push([data.personal.email, data.personal.phone, data.personal.location].filter(Boolean).join(" | "));

  if (data.summary) {
    lines.push("SUMMARY");
    lines.push(data.summary);
  }

  if (data.experience.length) {
    lines.push("EXPERIENCE");
    data.experience.forEach(e => {
      lines.push(`${e.title} at ${e.company} (${e.startDate} - ${e.current ? "Present" : e.endDate})`);
      e.bullets.forEach(b => lines.push(`• ${b}`));
    });
  }

  if (data.education.length) {
    lines.push("EDUCATION");
    data.education.forEach(e => {
      lines.push(`${e.degree} in ${e.field} - ${e.institution}`);
    });
  }

  const allSkills = [
    ...data.skills.technical,
    ...data.skills.tools,
    ...data.skills.soft,
    ...data.skills.languages,
  ];
  if (allSkills.length) {
    lines.push("SKILLS");
    lines.push(allSkills.join(", "));
  }

  if (data.projects.length) {
    lines.push("PROJECTS");
    data.projects.forEach(p => {
      lines.push(`${p.name}: ${p.description}`);
    });
  }

  return lines.join("\n");
}

export function calcYearsExperience(experience: ResumeData["experience"]): number {
  if (!experience.length) return 0;
  const earliest = experience.reduce((min, e) => {
    const year = parseInt(e.startDate?.split("-")[0] || "9999");
    return year < min ? year : min;
  }, 9999);
  return new Date().getFullYear() - earliest;
}
