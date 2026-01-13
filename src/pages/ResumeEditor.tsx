import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiArrowLeft, FiUser, FiFileText, FiBriefcase, FiBookOpen, FiCode, FiFolder, FiCheck } from 'react-icons/fi';
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

type StepId = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects';

interface Step {
  id: StepId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

const ResumeEditor: React.FC = () => {
  const { selectedTemplate } = useApp();
  const { resumeData } = useResume();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [activeStep, setActiveStep] = useState<StepId>('personal');

  const TemplateComponent = templateComponents[selectedTemplate];

  const steps: Step[] = [
    { id: 'personal', label: 'Personal Info', icon: FiUser, component: PersonalInfoForm },
    { id: 'summary', label: 'Summary', icon: FiFileText, component: SummaryForm },
    { id: 'experience', label: 'Experience', icon: FiBriefcase, component: ExperienceForm },
    { id: 'education', label: 'Education', icon: FiBookOpen, component: EducationForm },
    { id: 'skills', label: 'Skills', icon: FiCode, component: SkillsForm },
    { id: 'projects', label: 'Projects', icon: FiFolder, component: ProjectsForm },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === activeStep);
  const ActiveComponent = steps[currentStepIndex].component;

  const handleDownloadPDF = async () => {
    const element = previewRef.current?.querySelector('.a4-page') as HTMLElement;

    if (!element) {
      alert('Resume preview not found. Please try again.');
      return;
    }

    setIsExporting(true);

    try {
      // Clone the element to avoid affecting the preview
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.transform = 'none';
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '794px';
      clone.style.height = '1123px';
      document.body.appendChild(clone);

      // Wait for fonts and styles to apply
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794,
        height: 1123,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.body.querySelector('.a4-page') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.margin = '0';
            clonedElement.style.boxShadow = 'none';
          }
        }
      });

      // Remove the clone
      document.body.removeChild(clone);

      const imgWidth = 210;
      const imgHeight = 297;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      const filename = resumeData.personalInfo.fullName
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'My_Resume.pdf';

      pdf.save(filename);
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setActiveStep(steps[currentStepIndex + 1].id);
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setActiveStep(steps[currentStepIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left */}
            <div className="flex items-center gap-4">
              <Link
                to="/templates"
                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span className="font-medium hidden sm:block">Back</span>
              </Link>

              <div className="h-6 w-px bg-slate-200 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-900 hidden sm:block">
                  <span className="capitalize">{selectedTemplate}</span> Template
                </span>
              </div>
            </div>

            {/* Right */}
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isExporting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="hidden sm:block">Generating...</span>
                </>
              ) : (
                <>
                  <FiDownload className="w-5 h-5" />
                  <span className="hidden sm:block">Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Panel - Form */}
        <div className="w-full lg:w-[480px] flex-shrink-0 bg-white border-r border-slate-200">
          {/* Step Navigation */}
          <div className="p-4 border-b border-slate-200 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === activeStep;
                const isCompleted = index < currentStepIndex;

                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : isCompleted
                        ? 'bg-green-50 text-green-700'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isCompleted ? <FiCheck className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                    </div>
                    <span className="hidden md:block">{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="h-[calc(100vh-140px)] lg:h-[calc(100vh-128px)] overflow-y-auto p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {steps[currentStepIndex].label}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Step {currentStepIndex + 1} of {steps.length}
              </p>
            </div>

            <ActiveComponent />

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
              <button
                onClick={goToPrevStep}
                disabled={currentStepIndex === 0}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  currentStepIndex === 0
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FiArrowLeft className="w-4 h-4" />
                Previous
              </button>

              {currentStepIndex < steps.length - 1 ? (
                <button
                  onClick={goToNextStep}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleDownloadPDF}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
                >
                  <FiDownload className="w-4 h-4" />
                  Download PDF
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 h-[calc(100vh-64px)] overflow-auto p-4 lg:p-8 bg-slate-100">
          <div className="flex justify-center">
            <div className="relative">
              {/* Preview Label */}
              <div className="absolute -top-3 left-4 z-10">
                <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full">
                  Live Preview
                </span>
              </div>

              {/* Resume Preview */}
              <div
                ref={previewRef}
                className="shadow-2xl rounded-lg overflow-hidden ring-1 ring-slate-200"
                style={{ transform: 'scale(0.75)', transformOrigin: 'top center' }}
              >
                <TemplateComponent data={resumeData} />
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">Tips for a Great Resume</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Keep it concise - aim for 1-2 pages maximum</li>
              <li>• Use action verbs to describe your achievements</li>
              <li>• Quantify your accomplishments with numbers when possible</li>
              <li>• Tailor your resume for each job application</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
