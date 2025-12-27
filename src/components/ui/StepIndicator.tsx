import React from 'react';
import { AppStep } from '@/types/resume';

interface Step {
  id: AppStep;
  label: string;
  icon: React.ReactNode;
}

interface StepIndicatorProps {
  currentStep: AppStep;
  onStepClick?: (step: AppStep) => void;
}

const steps: Step[] = [
  {
    id: 'templates',
    label: 'Choose Template',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
        />
      </svg>
    ),
  },
  {
    id: 'editor',
    label: 'Edit Resume',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
  },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onStepClick }) => {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = index < currentIndex;
        const isClickable = onStepClick && (isCompleted || isActive);

        return (
          <React.Fragment key={step.id}>
            <button
              onClick={() => isClickable && onStepClick?.(step.id)}
              disabled={!isClickable}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
                ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : isCompleted
                    ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              <span
                className={`
                  flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium
                  ${isActive ? 'bg-white/20' : isCompleted ? 'bg-indigo-200' : 'bg-slate-200'}
                `}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
            </button>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 ${
                  isCompleted ? 'bg-indigo-400' : 'bg-slate-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
