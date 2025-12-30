import React, { useState, useMemo } from 'react';
import { TemplateCard } from '@/components/templates';
import { useApp } from '@/context/AppContext';
import { templates } from '@/data/defaultResume';

type FilterType = 'all' | 'ats' | 'creative' | 'professional';

const TemplateSelection: React.FC = () => {
  const { selectedTemplate, goToEditor } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All Templates', count: templates.length },
    { id: 'ats', label: 'ATS-Friendly', count: 4 },
    { id: 'creative', label: 'Creative', count: 4 },
    { id: 'professional', label: 'Professional', count: 4 },
  ];

  const filteredTemplates = useMemo(() => {
    let result = templates;

    if (activeFilter === 'ats') {
      result = result.filter(t => ['ats', 'classic', 'minimal', 'professional'].includes(t.id));
    } else if (activeFilter === 'creative') {
      result = result.filter(t => ['creative', 'bold', 'tech', 'elegant'].includes(t.id));
    } else if (activeFilter === 'professional') {
      result = result.filter(t => ['professional', 'executive', 'modern', 'classic'].includes(t.id));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [activeFilter, searchQuery]);

  return (
    <div className="min-h-screen mesh-gradient">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/50">
        <div className="card-glass rounded-none border-x-0 border-t-0">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-40"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[var(--slate-800)]">ResumeBuilder</h1>
                  <p className="text-xs text-[var(--slate-500)]">Create stunning resumes</p>
                </div>
              </div>

              {/* Search */}
              <div className="hidden md:block relative">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-modern w-72"
                />
                <svg className="w-5 h-5 text-[var(--slate-400)] absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 relative overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span>Free & No Sign-up Required</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-slide-up">
              Build a Resume That
              <span className="block mt-2 bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
                Gets You Hired
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Choose from our collection of professionally designed templates.
              Create a stunning resume in minutes with our intuitive editor.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-center">
                <div className="text-4xl font-bold">10+</div>
                <div className="text-sm text-white/70 mt-1">Templates</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-4xl font-bold">ATS</div>
                <div className="text-sm text-white/70 mt-1">Optimized</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-4xl font-bold">PDF</div>
                <div className="text-sm text-white/70 mt-1">Export</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 -mt-4 relative z-10">
        {/* Filter Section */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[var(--slate-800)]">
                Choose Your Template
              </h2>
              <p className="text-[var(--slate-500)] mt-2">
                Select a template that matches your style and industry
              </p>
            </div>

            {/* Template count */}
            <div className="card-glass px-5 py-3 rounded-2xl">
              <span className="text-sm text-[var(--slate-600)]">
                Showing <span className="font-semibold text-[var(--primary-600)]">{filteredTemplates.length}</span> of {templates.length} templates
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`filter-pill ${activeFilter === filter.id ? 'filter-pill-active' : 'filter-pill-inactive'}`}
              >
                {filter.label}
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  activeFilter === filter.id
                    ? 'bg-white/20'
                    : 'bg-[var(--slate-100)]'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-modern"
              />
              <svg className="w-5 h-5 text-[var(--slate-400)] absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template, index) => (
              <div
                key={template.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TemplateCard
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  onSelect={() => goToEditor(template.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--slate-100)] flex items-center justify-center">
              <svg className="w-12 h-12 text-[var(--slate-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--slate-800)] mb-2">No templates found</h3>
            <p className="text-[var(--slate-500)] mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white/80"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[var(--slate-800)] mb-4">
              Why Choose Our Resume Builder?
            </h2>
            <p className="text-[var(--slate-500)] max-w-2xl mx-auto">
              Create professional resumes that stand out and get you noticed by recruiters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Lightning Fast',
                description: 'Create a professional resume in minutes with our intuitive drag-and-drop editor'
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'ATS Optimized',
                description: 'Our templates are designed to pass through Applicant Tracking Systems'
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Export to PDF',
                description: 'Download your resume as a high-quality PDF file ready for applications'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="card-modern p-8 text-center hover:border-[var(--primary-200)]"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)]">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-[var(--slate-800)] text-lg mb-3">{feature.title}</h3>
                <p className="text-[var(--slate-500)] text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--slate-900)] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-semibold">ResumeBuilder</span>
            </div>
            <p className="text-[var(--slate-400)] text-sm">
              Free to use. No sign up required. Build your career today.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TemplateSelection;
