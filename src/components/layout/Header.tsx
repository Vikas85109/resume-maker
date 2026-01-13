import React from 'react';
import StepIndicator from '@/components/ui/StepIndicator';
import Button from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';

interface HeaderProps {
  onDownload?: () => void;
  isDownloading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onDownload, isDownloading }) => {
  const { currentStep, goToTemplates } = useApp();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">
              Resume<span className="text-indigo-600">Builder</span>
            </span>
          </div>

          {/* Step Indicator */}
          <div className="hidden md:block">
            <StepIndicator currentStep={currentStep} onStepClick={goToTemplates} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {currentStep === 'editor' && onDownload && (
              <Button
                variant="primary"
                onClick={onDownload}
                isLoading={isDownloading}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                }
              >
                Download PDF
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
