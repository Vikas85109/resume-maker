import React, { useState, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import { TemplateCard } from '@/components/templates';
import { useApp } from '@/context/AppContext';
import { templates } from '@/data/defaultResume';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

type FilterType = 'all' | 'ats' | 'creative' | 'professional';

const TemplateSelection: React.FC = () => {
  const { selectedTemplate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters: { id: FilterType; label: string; description: string }[] = [
    { id: 'all', label: 'All Templates', description: 'Browse all available templates' },
    { id: 'ats', label: 'ATS-Friendly', description: 'Optimized for tracking systems' },
    { id: 'creative', label: 'Creative', description: 'Stand out from the crowd' },
    { id: 'professional', label: 'Professional', description: 'Classic corporate look' },
  ];

  const filteredTemplates = useMemo(() => {
    let result = templates;

    if (activeFilter === 'ats') {
      result = result.filter((t: { id: string }) => ['ats', 'classic', 'minimal', 'professional'].includes(t.id));
    } else if (activeFilter === 'creative') {
      result = result.filter((t: { id: string }) => ['creative', 'bold', 'tech', 'elegant'].includes(t.id));
    } else if (activeFilter === 'professional') {
      result = result.filter((t: { id: string }) => ['professional', 'executive', 'modern', 'classic'].includes(t.id));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((t: { name: string; description: string }) =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 py-16 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Choose Your Template
            </h1>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-8">
              Select from our collection of professionally designed templates.
              Each one is crafted to help you stand out.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-slate-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="text-sm text-slate-500">
            Showing <span className="font-semibold text-indigo-600">{filteredTemplates.length}</span> templates
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template, index) => (
              <div
                key={template.id}
                className="opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: 'forwards'
                }}
              >
                <TemplateCard
                  template={template}
                  isSelected={selectedTemplate === template.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
              <FiSearch className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No templates found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your search or filter</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">ATS Optimized</h3>
            <p className="text-sm text-slate-600">
              Our templates are designed to pass through Applicant Tracking Systems.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Live Preview</h3>
            <p className="text-sm text-slate-600">
              See your changes in real-time as you fill in your information.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">PDF Export</h3>
            <p className="text-sm text-slate-600">
              Download your resume as a high-quality PDF ready for applications.
            </p>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TemplateSelection;
