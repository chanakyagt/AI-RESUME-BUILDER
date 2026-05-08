import { ResumeData } from "@/lib/types";

interface Props { data: ResumeData }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <h2 style={{ fontSize: 11, fontWeight: 700, color: "#4f46e5", letterSpacing: "0.1em", textTransform: "uppercase" }}>{title}</h2>
        <div style={{ flex: 1, height: 1, background: "#e0e7ff" }} />
      </div>
      {children}
    </div>
  );
}

export default function ModernTemplate({ data }: Props) {
  const { personal, summary, experience, education, skills, projects } = data;
  const allSkills = [
    ...skills.technical.map(s => ({ label: s, color: "#4f46e5" })),
    ...skills.tools.map(s => ({ label: s, color: "#7c3aed" })),
    ...skills.soft.map(s => ({ label: s, color: "#0ea5e9" })),
    ...skills.languages.map(s => ({ label: s, color: "#059669" })),
  ];

  return (
    <div style={{ background: "white", width: "100%", fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, color: "#1f2937", lineHeight: 1.5, padding: "48px 48px" }}>
      {/* Header */}
      <div style={{ borderBottom: "3px solid #4f46e5", paddingBottom: 20, marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: 0, letterSpacing: "-0.02em" }}>{personal.name || "Your Name"}</h1>
        {personal.jobTitle && <p style={{ fontSize: 14, color: "#4f46e5", fontWeight: 600, margin: "4px 0 12px" }}>{personal.jobTitle}</p>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: 11, color: "#6b7280" }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github && <span>{personal.github}</span>}
          {personal.portfolio && <span>{personal.portfolio}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <Section title="Summary">
          <p style={{ color: "#374151", lineHeight: 1.7 }}>{summary}</p>
        </Section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((exp, i) => (
            <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? 16 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{exp.title}</p>
                  <p style={{ color: "#4f46e5", fontWeight: 600, fontSize: 11 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                </div>
                <p style={{ fontSize: 10, color: "#9ca3af", whiteSpace: "nowrap" }}>
                  {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                </p>
              </div>
              {exp.bullets.length > 0 && (
                <ul style={{ marginTop: 6, paddingLeft: 16, listStyle: "none" }}>
                  {exp.bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: 3, display: "flex", alignItems: "flex-start", gap: 6 }}>
                      <span style={{ color: "#4f46e5", marginTop: 2, fontSize: 10 }}>▸</span>
                      <span style={{ color: "#374151" }}>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Education">
          {education.map(edu => (
            <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{edu.degree} {edu.field ? `in ${edu.field}` : ""}</p>
                <p style={{ color: "#4f46e5", fontSize: 11 }}>{edu.institution}{edu.location ? ` · ${edu.location}` : ""}</p>
                {(edu.gpa || edu.honors) && <p style={{ fontSize: 10, color: "#6b7280" }}>{[edu.gpa && `GPA: ${edu.gpa}`, edu.honors].filter(Boolean).join(" · ")}</p>}
              </div>
              <p style={{ fontSize: 10, color: "#9ca3af", whiteSpace: "nowrap" }}>{edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ""}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {allSkills.length > 0 && (
        <Section title="Skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {allSkills.map(({ label, color }) => (
              <span key={label} style={{ background: color + "18", border: `1px solid ${color}40`, color, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 500 }}>
                {label}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <div key={p.id} style={{ marginBottom: i < projects.length - 1 ? 12 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>
                  {p.name}
                  {p.technologies.length > 0 && (
                    <span style={{ fontWeight: 400, color: "#6b7280", fontSize: 11 }}> · {p.technologies.join(", ")}</span>
                  )}
                </p>
                {p.link && <span style={{ fontSize: 10, color: "#4f46e5" }}>{p.link}</span>}
              </div>
              {p.bullets.length > 0 ? (
                <ul style={{ marginTop: 4, paddingLeft: 16, listStyle: "none" }}>
                  {p.bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: 3, display: "flex", alignItems: "flex-start", gap: 6 }}>
                      <span style={{ color: "#4f46e5", marginTop: 2, fontSize: 10 }}>▸</span>
                      <span style={{ color: "#374151" }}>{b}</span>
                    </li>
                  ))}
                </ul>
              ) : p.description ? (
                <p style={{ color: "#374151", marginTop: 4 }}>{p.description}</p>
              ) : null}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}
