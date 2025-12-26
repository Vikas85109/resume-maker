import React, { useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import ResumePreview from './components/ResumePreview';
import initialData from './data/initialData';
import TemplateSelector from './components/TemplateSelector';
import TemplateOne from './components/template/TemplateOne';
import TemplateTwo from './components/template/TemplateTwo';
import TemplateThree from './components/template/TemplateThree';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function App() {
  const contentRef = useRef();
  const [resumeData, setResumeData] = useState(initialData);
  // const [selected, setSelected] = useState("templateOne");
  const [selected, setSelected] = useState("templateTwo");
  
  const updateSection = (section, data) => {
    setResumeData(prev => ({ ...prev, [section]: data }));
  };
  
  // const handleClick = async () => {
  //   const element = contentRef.current;
  //   const canvas = await html2canvas(element, {
  //     scale: 2,
  //     useCORS: true,
  //   });
    
  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF("p", "pt", "a4");

  //   const imgProps = pdf.getImageProperties(imgData);
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //   pdf.save("resume.pdf");
  // };

  const handleClick = async () => {
    const pages = contentRef.current.querySelectorAll(".a4-page");

    const pdf = new jsPDF("p", "pt", "a4");
    let firstPage = true;

    for (let page of pages) {
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        windowWidth: 794,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (!firstPage) {
        pdf.addPage();
      }
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      firstPage = false;
    }

    pdf.save("resume.pdf");
  };


  return (
    <>
      <div className="flex h-screen ">
        <Sidebar handleClick={handleClick} selected={selected} setSelected={setSelected} data={resumeData} updateSection={updateSection} />
        {/* <ResumePreview data={resumeData} /> */}
        {
          selected == "templateOne" ? <TemplateOne data={resumeData} contentRef={contentRef} />
            : selected == "templateTwo" ? <TemplateTwo data={resumeData} contentRef={contentRef}/>
              : selected == "templateThree" ? <TemplateThree data={resumeData} contentRef={contentRef}/>
                : ""
        }
        {/* <TemplateOne data={resumeData} /> */}
      </div>
    </>
  );
}
