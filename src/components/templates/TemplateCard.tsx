import React, { useRef, useState } from 'react';
import { ITemplate } from '@/types/resume';
import { sampleResumeData } from '@/data/defaultResume';
import { templateComponents } from './index';
import { exportToPdf } from '@/utils/pdfExport';

interface TemplateCardProps {
  template: ITemplate;
  isSelected: boolean;
  onSelect: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isSelected, onSelect }) => {
  const TemplateComponent = templateComponents[template.id];
  const hiddenRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scale = 0.28;

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hiddenRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      await exportToPdf(hiddenRef.current, `${template.name}_Resume_Sample.pdf`);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const isATSFriendly = ['ats', 'classic', 'minimal', 'professional'].includes(template.id);
  const isPopular = ['modern', 'professional', 'creative'].includes(template.id);
  const isNew = ['tech', 'elegant', 'bold'].includes(template.id);

  return (
    <div
      className={`
        card-modern group relative
        ${isSelected ? 'ring-2 ring-[var(--primary-500)] ring-offset-4' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden full-size template for PDF export */}
      <div
        ref={hiddenRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '794px',
          height: '1123px',
        }}
      >
        <TemplateComponent data={sampleResumeData} />
      </div>

      {/* Template Preview */}
      <div
        className="relative overflow-hidden cursor-pointer"
        style={{
          height: `${1123 * scale + 16}px`,
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)'
        }}
        onClick={onSelect}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full blur-2xl"></div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
          {isATSFriendly && (
            <span className="badge-modern badge-success">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ATS Ready
            </span>
          )}
          {isPopular && (
            <span className="badge-modern badge-primary">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Popular
            </span>
          )}
          {isNew && (
            <span className="badge-modern badge-warning">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              New
            </span>
          )}
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 z-10">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}

        {/* Template Preview */}
        <div
          className="absolute left-1/2 origin-top transition-all duration-500 ease-out"
          style={{
            transform: `translateX(-50%) scale(${scale}) ${isHovered ? 'translateY(-12px)' : 'translateY(8px)'}`,
            width: '794px',
            height: '1123px',
            pointerEvents: 'none',
            filter: isHovered ? 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))' : 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1))'
          }}
        >
          <div className="rounded-lg overflow-hidden">
            <TemplateComponent data={sampleResumeData} />
          </div>
        </div>

        {/* Hover Overlay */}
        <div
          className={`
            absolute inset-0 flex items-center justify-center
            transition-all duration-300 ease-out
            ${isHovered ? 'bg-gradient-to-t from-slate-900/60 via-slate-900/30 to-transparent' : 'bg-transparent'}
          `}
        >
          <div className={`
            flex flex-col items-center gap-3
            transition-all duration-300 ease-out
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}>
            <button
              onClick={onSelect}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Use Template
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="btn-ghost text-white text-sm flex items-center gap-2 hover:bg-white/20"
            >
              {isDownloading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Preview PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="font-semibold text-[var(--slate-800)] text-lg mb-1 group-hover:text-[var(--primary-600)] transition-colors">
            {template.name}
          </h3>
          <p className="text-sm text-[var(--slate-500)] line-clamp-2 leading-relaxed">
            {template.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onSelect}
            className="flex-1 btn-primary text-sm py-2.5"
          >
            Select
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="btn-secondary px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download Sample PDF"
          >
            {isDownloading ? (
              <svg className="w-5 h-5 animate-spin text-[var(--primary-500)]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-[var(--slate-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
