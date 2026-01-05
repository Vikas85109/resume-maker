import React, { useRef, useState } from 'react';
import { FiLogOut, FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PersonalInfoForm from '@/components/forms/PersonalInfoForm';
import SummaryForm from '@/components/forms/SummaryForm';
import ExperienceForm from '@/components/forms/ExperienceForm';
import EducationForm from '@/components/forms/EducationForm';
import SkillsForm from '@/components/forms/SkillsForm';
import ProjectsForm from '@/components/forms/ProjectsForm';
import { templateComponents } from '@/components/templates';
import { useApp } from '@/context/AppContext';
import { useResume } from '@/context/ResumeContext';
import { useAuth } from '@/context/AuthContext';

const ResumeEditor: React.FC = () => {
  const { selectedTemplate, goToTemplates } = useApp();
  const { resumeData } = useResume();
  const { user, logout } = useAuth();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const TemplateComponent = templateComponents[selectedTemplate];

  // High Quality PDF Download Function
  const handleDownloadPDF = async () => {
    const element = previewRef.current?.querySelector('.a4-page') as HTMLElement;

    if (!element) {
      alert('Resume preview not found. Please try again.');
      return;
    }

    setIsExporting(true);

    try {
      // Create high-quality canvas from element
      const canvas = await html2canvas(element, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
      });

      // A4 dimensions in mm
      const imgWidth = 210; // A4 width in mm
      const imgHeight = 297; // A4 height in mm

      // Create PDF in A4 format
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // Convert canvas to high quality JPEG
      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      // Add image to PDF - full A4 page
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

      // Generate filename
      const filename = resumeData.personalInfo.fullName
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'My_Resume.pdf';

      // Save PDF
      pdf.save(filename);

    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between h-16 px-5">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={goToTemplates}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Templates</span>
            </button>

            <div className="h-6 w-px bg-gray-200" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">
                <span className="capitalize">{selectedTemplate}</span> Template
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* User Info */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
            )}

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isExporting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FiDownload className="w-5 h-5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 font-medium rounded-lg transition-all duration-200"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Left Panel - Forms */}
        <div className="w-[420px] flex-shrink-0 h-[calc(100vh-64px)] overflow-y-auto bg-white border-r border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Edit Your Resume</h2>
            <p className="text-sm text-gray-500 mb-6">Fill in your details below</p>

            <div className="space-y-4">
              <PersonalInfoForm />
              <SummaryForm />
              <ExperienceForm />
              <EducationForm />
              <SkillsForm />
              <ProjectsForm />
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 h-[calc(100vh-64px)] overflow-auto p-8 bg-gray-100">
          <div className="flex justify-center">
            <div ref={previewRef} className="shadow-2xl rounded-lg overflow-hidden">
              <TemplateComponent data={resumeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
