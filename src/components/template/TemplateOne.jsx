import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function TemplateOne({ data, contentRef }) {
  // const contentRef = useRef();

  const handleDownload1 = async () => {
    const element = contentRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("resume.pdf");
  };

  return (
    // <div>
    //   <div>
    //     <button
    //       onClick={handleDownload1}
    //       style={{
    //         backgroundColor: "#1D4ED8",
    //         color: "white",
    //         padding: "10px 20px",
    //         border: "none",
    //         borderRadius: "6px",
    //         cursor: "pointer",
    //         marginBottom: "20px",
    //         marginTop: "24px",
    //       }}
    //     >
    //       Download PDF
    //     </button>
    //   </div>
    //   <hr />
      <div
        ref={contentRef}
        id="resume"
        style={{
          width: "850px",
          backgroundColor: "#ffffff",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          marginTop: "1rem",
          fontFamily: "sans-serif",
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          borderRadius: "0.5rem",
          // overflow: "hidden",
          height:"fit-content"
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            backgroundColor: "#f3f4f6",
            width: "33.3333%",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937" }}>{data.name}</h1>
            <p style={{ fontSize: "0.75rem", fontStyle: "italic", color: "#4b5563" }}>{data.jobTitle}</p>
          </div>

          <div style={{ fontSize: "0.875rem", color: "#374151", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <p>📧 {data.email}</p>
            <p>📱 {data.phone}</p>
            <p>📍 {data.location}</p>
            <p>🔗 {data.github}</p>
            <p>🔗 {data.linkedin}</p>
          </div>

          <div>
            <h2 style={{ fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase", borderBottom: "1px solid", paddingBottom: "0.25rem" }}>Skills</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
              {data.skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: "#bfdbfe",
                    color: "#1e40af",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase", borderBottom: "1px solid", paddingBottom: "0.25rem" }}>Languages</h2>
            <ul style={{ listStyleType: "disc", paddingLeft: "1rem", fontSize: "0.75rem", marginTop: "0.25rem" }}>
              {data.languages.map((lang, idx) => (
                <li key={idx}>{lang}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 style={{ fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase", borderBottom: "1px solid", paddingBottom: "0.25rem" }}>Strengths</h2>
            <ul style={{ listStyleType: "disc", paddingLeft: "1rem", fontSize: "0.75rem", marginTop: "0.25rem" }}>
              {data.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 style={{ fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase", borderBottom: "1px solid", paddingBottom: "0.25rem" }}>Certificates</h2>
            <p style={{ fontSize: "0.75rem" }}>{data.certificate}</p>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            width: "66.6667%",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <section>
            <h2 style={{ fontSize: "1.125rem", fontWeight: "600", textTransform: "uppercase", borderBottom: "1px solid", paddingBottom: "0.25rem" }}>Summary</h2>
            <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>{data.summary}</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.125rem", fontWeight: "600", textTransform: "uppercase", borderBottom: "1px solid", paddingBottom: "0.25rem" }}>Experience</h2>
            {data.experience.map((exp, idx) => (
              <div key={idx} style={{ marginTop: "0.5rem" }}>
                <p style={{ fontWeight: "bold" }}>{exp.title} — {exp.company}</p>
                <p style={{ fontSize: "0.75rem", fontStyle: "italic", color: "#4b5563" }}>{exp.duration} | {exp.location}</p>
                <ul style={{ listStyleType: "disc", paddingLeft: "1rem", fontSize: "0.875rem", whiteSpace: "pre-line" }}>
                  {exp.details.split("\n").map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section>
            <h2 style={{ fontSize: "1.125rem", fontWeight: "600", textTransform: "uppercase", borderBottom: "1px solid", paddingBottom: "0.25rem" }}>Education</h2>
            {data.education.map((edu, idx) => (
              <div key={idx} style={{ marginTop: "0.5rem" }}>
                <p style={{ fontWeight: "bold" }}>{edu.degree}</p>
                <p style={{ fontSize: "0.875rem" }}>{edu.college} ({edu.duration})</p>
              </div>
            ))}
          </section>

          <section>
            <h2 style={{ fontSize: "1.125rem", fontWeight: "600", textTransform: "uppercase", borderBottom: "1px solid", paddingBottom: "0.25rem" }}>Projects</h2>
            {data.projects.map((project, idx) => (
              <div key={idx} style={{ marginTop: "0.5rem" }}>
                <p style={{ fontWeight: "600", fontSize: "0.875rem" }}>{project.name}</p>
                <ul style={{  listStyleType: "disc", paddingLeft: "1rem", fontSize: "0.875rem", whiteSpace: "pre-line" }}>
                  {project.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>
      </div>
    // </div>
  );
}
