import React, { useRef, useState } from 'react';
import PersonalInfoForm from '@/components/forms/PersonalInfoForm';
import SummaryForm from '@/components/forms/SummaryForm';
import ExperienceForm from '@/components/forms/ExperienceForm';
import EducationForm from '@/components/forms/EducationForm';
import SkillsForm from '@/components/forms/SkillsForm';
import ProjectsForm from '@/components/forms/ProjectsForm';
import { templateComponents } from '@/components/templates';
import { useApp } from '@/context/AppContext';
import { useResume } from '@/context/ResumeContext';
import { exportToPdf } from '@/utils/pdfExport';

const ResumeEditor: React.FC = () => {
  const { selectedTemplate, goToTemplates } = useApp();
  const { resumeData } = useResume();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const TemplateComponent = templateComponents[selectedTemplate];

  const handleExport = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const filename = resumeData.personalInfo.fullName
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';
      await exportToPdf(previewRef.current, filename);
    } catch (error) {
      console.error('Export failed:', error);
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
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md disabled:opacity-50 transition-colors shadow-sm"
          >
            {isExporting ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
            Download PDF
          </button>
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
            <div ref={previewRef} className="shadow-2xl">
              <TemplateComponent data={resumeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
