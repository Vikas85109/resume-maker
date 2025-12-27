import React, { useRef, useState } from 'react';
import PersonalInfoForm from '@/components/forms/PersonalInfoForm';
import SummaryForm from '@/components/forms/SummaryForm';
import ExperienceForm from '@/components/forms/ExperienceForm';
import EducationForm from '@/components/forms/EducationForm';
import SkillsForm from '@/components/forms/SkillsForm';
import ProjectsForm from '@/components/forms/ProjectsForm';
import Button from '@/components/ui/Button';
import { templateComponents } from '@/components/templates';
import { useApp } from '@/context/AppContext';
import { useResume } from '@/context/ResumeContext';
import { exportToPdf } from '@/utils/pdfExport';

const ResumeEditor: React.FC = () => {
  const { selectedTemplate, goToTemplates } = useApp();
  const { resumeData } = useResume();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.5);

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
    <div className="min-h-screen bg-slate-100">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={goToTemplates}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Templates</span>
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <span className="text-sm text-slate-500">
              Editing: <span className="font-medium text-slate-700 capitalize">{selectedTemplate}</span> template
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-2 py-1">
              <button
                onClick={() => setPreviewScale((s) => Math.max(0.3, s - 0.1))}
                className="p-1 text-slate-500 hover:text-slate-700"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-xs font-medium text-slate-600 w-10 text-center">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                onClick={() => setPreviewScale((s) => Math.min(1, s + 0.1))}
                className="p-1 text-slate-500 hover:text-slate-700"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <Button
              variant="primary"
              onClick={handleExport}
              isLoading={isExporting}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto flex">
        {/* Left Panel - Form */}
        <div className="w-[420px] flex-shrink-0 h-[calc(100vh-56px)] overflow-y-auto bg-white border-r border-slate-200">
          <div className="p-4 space-y-3">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900">Edit Your Resume</h2>
              <p className="text-sm text-slate-500">Fill in your details below</p>
            </div>

            <PersonalInfoForm />
            <SummaryForm />
            <ExperienceForm />
            <EducationForm />
            <SkillsForm />
            <ProjectsForm />

            <div className="pt-4 pb-8">
              <Button
                variant="ghost"
                onClick={goToTemplates}
                className="w-full"
                leftIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                }
              >
                Change Template
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 h-[calc(100vh-56px)] overflow-auto bg-slate-200 p-8">
          <div className="flex justify-center">
            <div
              className="origin-top transition-transform duration-200"
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
