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
  const [previewScale, setPreviewScale] = useState(0.55);

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
    <div className="min-h-screen bg-slate-50">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={goToTemplates}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back</span>
            </button>

            <div className="h-5 w-px bg-slate-200" />

            <span className="text-sm text-slate-600">
              <span className="capitalize">{selectedTemplate}</span> template
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Zoom */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setPreviewScale((s) => Math.max(0.3, s - 0.1))}
                className="p-1.5 hover:text-slate-600 hover:bg-slate-100 rounded"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-xs w-8 text-center">{Math.round(previewScale * 100)}%</span>
              <button
                onClick={() => setPreviewScale((s) => Math.min(1, s + 0.1))}
                className="p-1.5 hover:text-slate-600 hover:bg-slate-100 rounded"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Download */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {isExporting ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Left Panel - Forms */}
        <div className="w-[380px] flex-shrink-0 h-[calc(100vh-56px)] overflow-y-auto bg-white border-r border-slate-200">
          <div className="p-5 space-y-4">
            <PersonalInfoForm />
            <SummaryForm />
            <ExperienceForm />
            <EducationForm />
            <SkillsForm />
            <ProjectsForm />
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 h-[calc(100vh-56px)] overflow-auto p-8">
          <div className="flex justify-center">
            <div
              className="origin-top transition-transform duration-150"
              style={{ transform: `scale(${previewScale})` }}
            >
              <div ref={previewRef}>
                <TemplateComponent data={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
