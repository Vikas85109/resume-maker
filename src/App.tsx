import React from 'react';
import { useApp } from '@/context/AppContext';
import TemplateSelection from '@/pages/TemplateSelection';
import ResumeEditor from '@/pages/ResumeEditor';

const App: React.FC = () => {
  const { currentStep } = useApp();

  return (
    <div className="min-h-screen bg-slate-50">
      {currentStep === 'templates' && <TemplateSelection />}
      {currentStep === 'editor' && <ResumeEditor />}
    </div>
  );
};

export default App;
