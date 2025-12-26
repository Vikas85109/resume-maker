import React, { useRef, useEffect, useState } from "react";

const A4_HEIGHT_PX = 1123;

const sectionHeaderStyle = {
  fontSize: "1.125rem",
  fontWeight: "600",
  textTransform: "uppercase",
  borderBottom: "1px solid #d1d5db",
  paddingBottom: "0.25rem",
};

const ulStyle = {
  listStyleType: "disc",
  paddingLeft: "1rem",
  fontSize: "0.875rem",
  whiteSpace: "pre-line",
  marginTop: "0.25rem",
};

const pageStyle = {
  backgroundColor: "#ffffff",
  width: "794px", // A4 width at 96 DPI
  height: "1123px", // A4 height at 96 DPI
  padding: "2.5rem",
  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
  marginTop: "1rem",
  borderRadius: "0.5rem",
  color: "#1f2937",
  fontFamily: "sans-serif",
  boxSizing: "border-box",
  overflow: "hidden",
  pageBreakAfter: "always",
  marginLeft: "60px",
  display: "flex",
  flexDirection: "column",
};

export default function TemplateTwo({ data, contentRef }) {
  const [pages, setPages] = useState([]);
  const sectionRefs = useRef([]);
  const hiddenContainerRef = useRef(null);

  const sections = [
    {
      key: "header",
      jsx: (
        <div ref={(el) => (sectionRefs.current[0] = el)}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>{data.name}</h1>
            <p style={{ fontSize: "0.875rem", color: "#4b5563", fontStyle: "italic" }}>{data.jobTitle}</p>
            <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
              {data.email} | {data.phone} | {data.location}
            </p>
            <p style={{ fontSize: "0.875rem" }}>{data.github} | {data.linkedin}</p>
          </div>
        </div>
      ),
    },
    {
      key: "summary",
      jsx: (
        <div ref={(el) => (sectionRefs.current[1] = el)}>
          <h2 style={sectionHeaderStyle}>Summary</h2>
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>{data.summary}</p>
        </div>
      ),
    },
    {
      key: "skills",
      jsx: (
        <div ref={(el) => (sectionRefs.current[2] = el)}>
          <h2 style={sectionHeaderStyle}>Skills</h2>
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
        </div>
      ),
    },
    {
      key: "experience",
      jsx: (
        <div ref={(el) => (sectionRefs.current[3] = el)}>
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
        </div>
      ),
    },
    {
      key: "education",
      jsx: (
        <div ref={(el) => (sectionRefs.current[4] = el)}>
          <h2 style={sectionHeaderStyle}>Education</h2>
          {data.education.map((edu, idx) => (
            <div key={idx} style={{ marginTop: "0.5rem" }}>
              <p style={{ fontWeight: "bold" }}>{edu.degree}</p>
              <p style={{ fontSize: "0.875rem" }}>
                {edu.college} ({edu.duration})
              </p>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "projects",
      jsx: (
        <div ref={(el) => (sectionRefs.current[5] = el)}>
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
        </div>
      ),
    },
    {
      key: "strengths",
      jsx: (
        <div ref={(el) => (sectionRefs.current[6] = el)}>
          <h2 style={sectionHeaderStyle}>Strengths</h2>
          <ul style={ulStyle}>
            {data.strengths?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      key: "certificates",
      jsx: (
        <div ref={(el) => (sectionRefs.current[7] = el)}>
          <h2 style={sectionHeaderStyle}>Certificates</h2>
          <p style={{ fontSize: "0.875rem" }}>{data.certificate}</p>
        </div>
      ),
    },
    {
      key: "languages",
      jsx: (
        <div ref={(el) => (sectionRefs.current[8] = el)}>
          <h2 style={sectionHeaderStyle}>Languages</h2>
          <ul style={ulStyle}>
            {data.languages.map((lang, idx) => (
              <li key={idx}>{lang}</li>
            ))}
          </ul>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      const pages = [];
      let currentHeight = 0;
      let currentPage = [];

      for (let i = 0; i < sections.length; i++) {
        const el = sectionRefs.current[i];
        const height = el?.offsetHeight || 0;

        if (currentHeight + height > A4_HEIGHT_PX) {
          pages.push(currentPage);
          currentPage = [sections[i].jsx];
          currentHeight = height;
        } else {
          currentPage.push(sections[i].jsx);
          currentHeight += height;
        }
      }

      if (currentPage.length > 0) pages.push(currentPage);
      setPages(pages);
    }, 100); // wait for render

    return () => clearTimeout(timeout);
  }, [data]);

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

      {/* Hidden measuring container */}
      <div style={{ visibility: "hidden", position: "absolute", left: "-9999px" }} ref={hiddenContainerRef}>
        {sections.map((section) => section.jsx)}
      </div>

      {/* Final Rendered Pages */}
      <div ref={contentRef}>
        {pages.map((pageContent, idx) => (
          <div key={idx} style={pageStyle} className="a4-page">
            {pageContent}
          </div>
        ))}
      </div>
    </>
  );
}
