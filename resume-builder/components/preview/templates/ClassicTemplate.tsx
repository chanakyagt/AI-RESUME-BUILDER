import { ResumeData } from "@/lib/types";

interface Props { data: ResumeData }

export default function ClassicTemplate({ data }: Props) {
  const { personal, summary, experience, education, skills, projects } = data;
  const allSkillGroups = [
    { label: "Technical", items: skills.technical },
    { label: "Tools", items: skills.tools },
    { label: "Soft Skills", items: skills.soft },
    { label: "Languages", items: skills.languages },
  ].filter(g => g.items.length > 0);

  return (
    <div style={{ background: "white", width: "100%", fontFamily: "'Calibri', 'Arial', sans-serif", fontSize: 11, color: "#1a1a1a", lineHeight: 1.5, display: "flex" }}>
      {/* Left sidebar */}
      <div style={{ width: "34%", background: "#1e293b", color: "#f1f5f9", padding: "40px 24px", minHeight: "100%" }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 4px", wordBreak: "break-word" }}>{personal.name || "Your Name"}</h1>
        {personal.jobTitle && <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 20 }}>{personal.jobTitle}</p>}

        {/* Contact */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 9, fontWeight: 700, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Contact</h2>
          {[personal.email, personal.phone, personal.location, personal.linkedin, personal.github, personal.portfolio]
            .filter(Boolean).map((v, i) => (
              <p key={i} style={{ fontSize: 10, color: "#cbd5e1", marginBottom: 4, wordBreak: "break-word" }}>{v}</p>
            ))}
        </div>

        {/* Skills in sidebar */}
        {allSkillGroups.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 9, fontWeight: 700, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Skills</h2>
            {allSkillGroups.map(({ label, items }) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>{label}</p>
                {items.map(s => (
                  <p key={s} style={{ fontSize: 10, color: "#cbd5e1", marginBottom: 2 }}>• {s}</p>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Education in sidebar */}
        {education.length > 0 && (
          <div>
            <h2 style={{ fontSize: 9, fontWeight: 700, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Education</h2>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#f1f5f9" }}>{edu.degree}</p>
                {edu.field && <p style={{ fontSize: 10, color: "#94a3b8" }}>{edu.field}</p>}
                <p style={{ fontSize: 9, color: "#64748b" }}>{edu.institution}</p>
                <p style={{ fontSize: 9, color: "#64748b" }}>{edu.endDate || edu.startDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right content */}
      <div style={{ flex: 1, padding: "40px 32px" }}>
        {summary && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 10, fontWeight: 700, color: "#1e293b", letterSpacing: "0.12em", textTransform: "uppercase", borderBottom: "2px solid #1e293b", paddingBottom: 4, marginBottom: 10 }}>Profile</h2>
            <p style={{ color: "#374151", lineHeight: 1.7 }}>{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 10, fontWeight: 700, color: "#1e293b", letterSpacing: "0.12em", textTransform: "uppercase", borderBottom: "2px solid #1e293b", paddingBottom: 4, marginBottom: 12 }}>Experience</h2>
            {experience.map((exp, i) => (
              <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? 16 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 12, color: "#0f172a" }}>{exp.title}</p>
                    <p style={{ fontSize: 11, color: "#475569", fontStyle: "italic" }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  </div>
                  <p style={{ fontSize: 10, color: "#94a3b8", whiteSpace: "nowrap" }}>
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </p>
                </div>
                {exp.bullets.length > 0 && (
                  <ul style={{ marginTop: 6, paddingLeft: 0, listStyle: "none" }}>
                    {exp.bullets.map((b, j) => (
                      <li key={j} style={{ marginBottom: 3, display: "flex", alignItems: "flex-start", gap: 6 }}>
                        <span style={{ color: "#1e293b", fontWeight: 700, marginTop: 1 }}>—</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <h2 style={{ fontSize: 10, fontWeight: 700, color: "#1e293b", letterSpacing: "0.12em", textTransform: "uppercase", borderBottom: "2px solid #1e293b", paddingBottom: 4, marginBottom: 12 }}>Projects</h2>
            {projects.map((p, i) => (
              <div key={p.id} style={{ marginBottom: i < projects.length - 1 ? 12 : 0 }}>
                <p style={{ fontWeight: 700, fontSize: 12 }}>{p.name}
                  {p.technologies.length > 0 && <span style={{ fontWeight: 400, fontSize: 10, color: "#64748b" }}> · {p.technologies.join(", ")}</span>}
                </p>
                {p.bullets.length > 0 ? (
                  <ul style={{ marginTop: 4, paddingLeft: 0, listStyle: "none" }}>
                    {p.bullets.map((b, j) => (
                      <li key={j} style={{ marginBottom: 3, display: "flex", gap: 6 }}>
                        <span style={{ fontWeight: 700 }}>—</span><span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : p.description ? <p style={{ marginTop: 4 }}>{p.description}</p> : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
