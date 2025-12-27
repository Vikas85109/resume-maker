import React from 'react';
import { TemplateCard } from '@/components/templates';
import { useApp } from '@/context/AppContext';
import { templates } from '@/data/defaultResume';

const TemplateSelection: React.FC = () => {
  const { selectedTemplate, goToEditor } = useApp();

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-slate-900">Resume Builder</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero - Minimal */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-semibold text-slate-900 mb-4">
            Create your resume
          </h1>
          <p className="text-lg text-slate-500 max-w-lg mx-auto">
            Choose a template to get started. You can always change it later.
          </p>
        </div>

        {/* Templates Grid - Clean */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={() => goToEditor(template.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default TemplateSelection;
