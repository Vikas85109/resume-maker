import React from 'react';
import { TemplateCard } from '@/components/templates';
import { useApp } from '@/context/AppContext';
import { templates } from '@/data/defaultResume';

const TemplateSelection: React.FC = () => {
  const { selectedTemplate, goToEditor } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-900">Resume Builder</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-600 to-purple-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Create Your Professional Resume
          </h1>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            Choose from our professionally designed templates and create a standout resume in minutes.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-5 py-12">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Choose a Template</h2>
          <p className="text-gray-500">Select a template to get started. You can always change it later.</p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-5 text-center text-gray-500 text-sm">
          Build your professional resume with confidence
        </div>
      </footer>
    </div>
  );
};

export default TemplateSelection;
