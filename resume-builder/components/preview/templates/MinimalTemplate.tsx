import { ResumeData } from "@/lib/types";

interface Props { data: ResumeData }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h2 style={{ fontSize: 10, fontWeight: 700, color: "#000", letterSpacing: "0.15em", textTransform: "uppercase", borderBottom: "1px solid #000", paddingBottom: 3, marginBottom: 10 }}>{title}</h2>
      {children}
    </div>
  );
}

export default function MinimalTemplate({ data }: Props) {
  const { personal, summary, experience, education, skills, projects } = data;
  const allSkills = [...skills.technical, ...skills.tools, ...skills.soft, ...skills.languages];

  return (
    <div style={{ background: "white", width: "100%", fontFamily: "'Times New Roman', Times, serif", fontSize: 11, color: "#000", lineHeight: 1.5, padding: "52px 52px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "0.05em" }}>{personal.name || "YOUR NAME"}</h1>
        {personal.jobTitle && <p style={{ fontSize: 12, margin: "4px 0" }}>{personal.jobTitle}</p>}
        <p style={{ fontSize: 10, color: "#555", margin: "8px 0 0" }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin, personal.github].filter(Boolean).join("  |  ")}
        </p>
      </div>

      {summary && (
        <Section title="Profile">
          <p style={{ textAlign: "justify" }}>{summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((exp, i) => (
            <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? 12 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{exp.title}</strong>
                <span style={{ fontSize: 10 }}>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
              </div>
              <p style={{ fontStyle: "italic", fontSize: 10, color: "#333" }}>{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
              {exp.bullets.length > 0 && (
                <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                  {exp.bullets.map((b, j) => <li key={j} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map(edu => (
            <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div>
                <strong>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</strong>
                <p style={{ fontStyle: "italic", fontSize: 10 }}>{edu.institution}{edu.location ? `, ${edu.location}` : ""}</p>
                {edu.honors && <p style={{ fontSize: 10 }}>{edu.honors}</p>}
              </div>
              <span style={{ fontSize: 10 }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}</span>
            </div>
          ))}
        </Section>
      )}

      {allSkills.length > 0 && (
        <Section title="Skills">
          <p>{allSkills.join("  ·  ")}</p>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <div key={p.id} style={{ marginBottom: i < projects.length - 1 ? 10 : 0 }}>
              <strong>{p.name}</strong>
              {p.technologies.length > 0 && <span style={{ fontSize: 10, fontStyle: "italic" }}> ({p.technologies.join(", ")})</span>}
              {p.bullets.length > 0 ? (
                <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                  {p.bullets.map((b, j) => <li key={j} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              ) : p.description ? <p>{p.description}</p> : null}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}
