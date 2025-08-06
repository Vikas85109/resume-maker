export default function TemplateFour({ data, contentRef }) {
  const { personalDetails, profile, education, experience, skills, hobbies } = data;

  const pageStyle = {
    backgroundColor: "#ffffff",
    width: "794px",
    height: "fit-content",
    padding: "2.5rem",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
    marginTop: "1rem",
    borderRadius: "0.5rem",
    color: "#1f2937",
    fontFamily: "sans-serif",
    // marginLeft: "auto",
    // marginRight: "auto",
    boxSizing: "border-box",
    overflow: "hidden",
    pageBreakAfter: "always",
    marginLeft:"60px",
  };

  return (
    <>
      <style>
        {`
          @media print {
            .page-break {
              display: block;
              page-break-before: always;
            }
          }
        `}
      </style>

      <div ref={contentRef}>
        {/* Page 1 */}
        <div className="a4-page" style={pageStyle}>
          {/* Header */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>{data.name}</h1>
            <p style={{ fontSize: "0.875rem", color: "#4b5563", fontStyle: "italic" }}>{data.jobTitle}</p>
            <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
              {data.email} | {data.phone} | {data.location}
            </p>
            <p style={{ fontSize: "0.875rem" }}>{data.github} | {data.linkedin}</p>
          </div>

           {/* Summary */}
          <section style={{ marginBottom: "1.5rem" }}>
            <h2 style={sectionHeaderStyle}>Summary</h2>
            <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>{data.summary}</p>
          </section>

           {/* Skills */}
          <section style={{ marginBottom: "1.5rem" }}>
            <h2 style={sectionHeaderStyle}>Technical Skills</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
              {data.skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: "#f3f4f6",
                    color: "#1f2937",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
          
          {/* Experience */}
          <section style={{ marginBottom: "1.5rem" }}>
            <h2 style={sectionHeaderStyle}>Experience</h2>
            {data.experience.map((exp, idx) => (
              <div key={idx} style={{ marginTop: "0.5rem" }}>
                <p style={{ fontWeight: "bold" }}>{exp.title} — {exp.company}</p>
                <p style={{ fontSize: "0.75rem", fontStyle: "italic" }}>
                  {exp.duration} | {exp.location}
                </p>
                <ul style={ulStyle}>
                  {exp.details.split("\n").map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>
        {/* Page 2 */}
        <div className="a4-page" style={pageStyle}>
          {/* Education */}
          <section style={{ marginBottom: "1.5rem" }}>
            <h2 style={sectionHeaderStyle}>Education</h2>
            {data.education.map((edu, idx) => (
              <div key={idx} style={{ marginTop: "0.5rem" }}>
                <p style={{ fontWeight: "bold" }}>{edu.degree}</p>
                <p style={{ fontSize: "0.875rem" }}>
                  {edu.college} ({edu.duration})
                </p>
              </div>
            ))}
          </section>

           {/* Projects */}
          <section style={{ marginBottom: "1.5rem" }}>
            <h2 style={sectionHeaderStyle}>Projects</h2>
            {data.projects?.map((project, idx) => (
              <div key={idx} style={{ marginTop: "0.5rem" }}>
                <p style={{ fontWeight: "600", fontSize: "0.875rem" }}>{project.name}</p>
                <ul style={ulStyle}>
                  {project.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
          
        </div>
       
      </div>
    </>
  );
}

// Common styles
const sectionHeaderStyle = {
  fontSize: "1.125rem",
  fontWeight: "600",
  textTransform: "uppercase",
  // borderBottom: "1px solid #d1d5db",
  paddingBottom: "0.25rem",
  backgroundColor: '#d9d6d6',
  padding: '5px 10px',
  borderRadius: '15px'
};

const ulStyle = {
  listStyleType: "disc",
  paddingLeft: "1rem",
  fontSize: "0.875rem",
  whiteSpace: "pre-line",
  marginTop: "0.25rem",
};
