import React, { createContext, useContext, useState, useCallback } from 'react';
import { AppStep, TemplateId, IAppContextType } from '@/types/resume';

const AppContext = createContext<IAppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<AppStep>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');

  const goToEditor = useCallback((template: TemplateId) => {
    setSelectedTemplate(template);
    setCurrentStep('editor');
  }, []);

  const goToTemplates = useCallback(() => {
    setCurrentStep('templates');
  }, []);

  const value: IAppContextType = {
    currentStep,
    selectedTemplate,
    setCurrentStep,
    setSelectedTemplate,
    goToEditor,
    goToTemplates,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): IAppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
