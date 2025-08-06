export default function TemplateThree({ data, contentRef }) {
  const { personalDetails, profile, education, experience, skills, hobbies } = data;

  return (
    <div
      ref={contentRef}
      style={{
        backgroundColor: "#ffffff",
        width: "850px",
        padding: "2rem",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        fontFamily: "sans-serif",
        marginTop: "1rem",
        color: "#111827",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: "0.375rem",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 3fr",
          gap: "1.5rem",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            backgroundColor: "#f3f4f6",
            padding: "1rem",
            borderRadius: "0.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1e40af" }}>{data.name}</h1>
            <p style={{ fontSize: "0.875rem", fontStyle: "italic" }}>{data.summary}</p>
          </div>

          <div style={{ fontSize: "0.875rem", color: "#374151", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <p>📧 {data.email}</p>
            <p>📱 {data.phone}</p>
            <p>📍 {data.location}</p>
            <p>🔗 {data.github}</p>
            <p>🔗 {data.linkedin}</p>
          </div>

          <section>
            <h2 style={sectionSidebarHeading}>Skills</h2>
            <ul style={ulSmall}>
              {data.skills.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 style={sectionSidebarHeading}>Languages</h2>
            <ul style={ulSmall}>
              {data.languages.map((lang, idx) => (
                <li key={idx}>{lang}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Education */}
          <section>
            <h2 style={sectionMainHeading}>Education</h2>
            {data.education.map((edu, idx) => (
              <div key={idx} style={{ marginTop: "0.25rem" }}>
                <p style={{ fontWeight: "600" }}>{edu.degree}</p>
                <p style={{ fontSize: "0.875rem" }}>{edu.college}</p>
                <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>{edu.duration}</p>
              </div>
            ))}
          </section>

          {/* Work Experience */}
          <section>
            <h2 style={sectionMainHeading}>Work Experience</h2>
            {data.experience.map((exp, idx) => (
              <div key={idx} style={{ marginTop: "0.5rem" }}>
                <p style={{ fontWeight: "600" }}>
                  {exp.title} — {exp.company}
                </p>
                <p style={{ fontSize: "0.75rem", fontStyle: "italic", color: "#6b7280" }}>
                  {exp.duration} | {exp.location}
                </p>
                <ul style={ulDefault}>
                  {exp.details.split("\n").map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Projects */}
          <section>
            <h2 style={sectionMainHeading}>Projects</h2>
            {data.projects.map((project, idx) => (
              <div key={idx} style={{ marginTop: "0.5rem" }}>
                <p style={{ fontWeight: "600" }}>{project.name}</p>
                <ul style={ulDefault}>
                  {project.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Strengths */}
          <section>
            <h2 style={sectionMainHeading}>Strengths</h2>
            <ul style={ulDefault}>
              {data.strengths?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>

          {/* Certificates */}
          <section>
            <h2 style={sectionMainHeading}>Certificates</h2>
            <p style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>{data.certificate}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

// === Reusable Style Blocks ===
const sectionSidebarHeading = {
  fontSize: "1rem",
  fontWeight: "600",
  color: "#1d4ed8",
  borderBottom: "1px solid #d1d5db",
  paddingBottom: "0.25rem",
};

const sectionMainHeading = {
  fontSize: "1.125rem",
  fontWeight: "700",
  textTransform: "uppercase",
  color: "#1e40af",
  borderBottom: "1px solid #1e40af",
  paddingBottom: "0.25rem",
};

const ulSmall = {
  listStyleType: "disc",
  paddingLeft: "1.25rem",
  fontSize: "0.75rem",
  marginTop: "0.25rem",
};

const ulDefault = {
  listStyleType: "disc",
  paddingLeft: "1.25rem",
  fontSize: "0.875rem",
  whiteSpace: "pre-line",
  marginTop: "0.25rem",
};
