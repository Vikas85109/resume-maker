import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import TemplateSelection from '@/pages/TemplateSelection';
import ResumeEditor from '@/pages/ResumeEditor';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

const App: React.FC = () => {
  const { currentStep, setCurrentStep } = useApp();
  const { isAuthenticated } = useAuth();

  // Redirect to templates when authenticated, to login when not
  useEffect(() => {
    if (isAuthenticated && (currentStep === 'login' || currentStep === 'register')) {
      setCurrentStep('templates');
    } else if (!isAuthenticated && currentStep !== 'login' && currentStep !== 'register') {
      setCurrentStep('login');
    }
  }, [isAuthenticated, currentStep, setCurrentStep]);

  // Show auth pages when not authenticated
  if (!isAuthenticated) {
    return (
      <>
        {currentStep === 'login' && <LoginPage />}
        {currentStep === 'register' && <RegisterPage />}
        {currentStep !== 'login' && currentStep !== 'register' && <LoginPage />}
      </>
    );
  }

  // Show app pages when authenticated
  return (
    <div className="min-h-screen bg-slate-50">
      {currentStep === 'templates' && <TemplateSelection />}
      {currentStep === 'editor' && <ResumeEditor />}
    </div>
  );
};

export default App;
