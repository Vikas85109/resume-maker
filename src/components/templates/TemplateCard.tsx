import React, { useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiDownload, FiEdit3, FiEye, FiStar, FiZap } from 'react-icons/fi';
import { ITemplate } from '@/types/resume';
import { sampleResumeData } from '@/data/defaultResume';
import { templateComponents } from './index';
import { useApp } from '@/context/AppContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TemplateCardProps {
  template: ITemplate;
  isSelected: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isSelected }) => {
  const TemplateComponent = templateComponents[template.id];
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showPdfRender, setShowPdfRender] = useState(false);
  const pdfRenderRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setSelectedTemplate, setCurrentStep } = useApp();

  const scale = 0.28;

  const handleUseTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTemplate(template.id);
    setCurrentStep('editor');
    navigate('/editor');
  };

  const handleDownload = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloading) return;

    setIsDownloading(true);
    setShowPdfRender(true);

    // Wait for the portal to render
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const element = pdfRenderRef.current?.querySelector('.a4-page') as HTMLElement;

      if (!element) {
        throw new Error('Template element not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('.a4-page') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.margin = '0';
            clonedElement.style.padding = '0';
          }
        }
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
      pdf.save(`${template.name}_Sample_Resume.pdf`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setShowPdfRender(false);
      setIsDownloading(false);
    }
  }, [isDownloading, template.name]);

  const isATSFriendly = ['ats', 'classic', 'minimal', 'professional'].includes(template.id);
  const isPopular = ['modern', 'professional', 'creative'].includes(template.id);
  const isNew = ['tech', 'elegant', 'bold'].includes(template.id);

  // PDF Render Portal - renders full-size template for PDF capture
  const PdfRenderPortal = showPdfRender ? createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {/* Loading indicator */}
      <div className="mb-6 text-white text-center">
        <svg className="w-12 h-12 animate-spin mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-lg font-medium">Generating PDF...</p>
        <p className="text-sm text-slate-400 mt-1">Please wait while we capture your resume</p>
      </div>

      {/* Full-size template for PDF capture */}
      <div
        ref={pdfRenderRef}
        style={{
          width: '794px',
          height: '1123px',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
        }}
      >
        <TemplateComponent data={sampleResumeData} />
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div
        className={`
          relative bg-white rounded-2xl overflow-hidden
          transition-all duration-300 ease-out
          border-2 group
          ${isSelected
            ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-xl shadow-indigo-500/10'
            : 'border-slate-200 hover:border-indigo-300 hover:shadow-xl'
          }
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Template Preview Area */}
        <div
          className="relative cursor-pointer bg-gradient-to-b from-slate-50 to-slate-100"
          style={{ height: `${1123 * scale + 20}px` }}
          onClick={handleUseTemplate}
        >
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
            {isATSFriendly && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                <FiCheck className="w-3 h-3" />
                ATS Ready
              </span>
            )}
            {isPopular && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                <FiStar className="w-3 h-3" />
                Popular
              </span>
            )}
            {isNew && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
                <FiZap className="w-3 h-3" />
                New
              </span>
            )}
          </div>

          {/* Selected Indicator */}
          {isSelected && (
            <div className="absolute top-3 right-3 z-10">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg">
                <FiCheck className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
            </div>
          )}

          {/* Template Preview */}
          <div
            ref={previewRef}
            className="absolute left-1/2 transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-50%) scale(${scale}) ${isHovered ? 'translateY(-8px)' : 'translateY(10px)'}`,
              transformOrigin: 'top center',
              width: '794px',
              height: '1123px',
              pointerEvents: 'none',
            }}
          >
            <div className={`
              rounded-lg overflow-hidden shadow-2xl transition-shadow duration-300
              ${isHovered ? 'shadow-2xl shadow-slate-400/30' : 'shadow-xl shadow-slate-300/20'}
            `}>
              <TemplateComponent data={sampleResumeData} />
            </div>
          </div>

          {/* Hover Overlay */}
          <div
            className={`
              absolute inset-0 flex items-center justify-center gap-3
              transition-all duration-300 ease-out
              ${isHovered ? 'bg-slate-900/50 backdrop-blur-sm opacity-100' : 'opacity-0 pointer-events-none'}
            `}
          >
            <button
              onClick={handleUseTemplate}
              className="flex items-center gap-2 px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <FiEdit3 className="w-4 h-4" />
              Use Template
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPreview(true);
              }}
              className="flex items-center gap-2 px-5 py-3 bg-white/90 hover:bg-white text-slate-800 font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <FiEye className="w-4 h-4" />
              Preview
            </button>
          </div>
        </div>

        {/* Card Footer */}
        <div className="p-5 border-t border-slate-100">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-indigo-600 transition-colors">
              {template.name}
            </h3>
            <p className="text-sm text-slate-500 line-clamp-2">
              {template.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleUseTemplate}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <FiEdit3 className="w-4 h-4" />
              Use Template
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center justify-center px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download Sample PDF"
            >
              {isDownloading ? (
                <svg className="w-5 h-5 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <FiDownload className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Preview Modal */}
      {showPreview && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{template.name}</h3>
                <p className="text-sm text-slate-500">Preview with sample data</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {isDownloading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <FiDownload className="w-4 h-4" />
                  )}
                  Download PDF
                </button>
                <button
                  onClick={handleUseTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors"
                >
                  <FiEdit3 className="w-4 h-4" />
                  Use This Template
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Template Preview - This is what you see, this is what you get in PDF */}
            <div className="p-8 bg-slate-100 flex justify-center">
              <div
                className="shadow-2xl rounded-lg overflow-hidden bg-white"
                style={{
                  width: '794px',
                  height: '1123px',
                  transform: 'scale(0.75)',
                  transformOrigin: 'top center'
                }}
              >
                <TemplateComponent data={sampleResumeData} />
              </div>
            </div>

            {/* Info Banner */}
            <div className="sticky bottom-0 p-4 bg-green-50 border-t border-green-200">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <FiCheck className="w-5 h-5" />
                <span className="font-medium">What you see is what you get - PDF will match this preview exactly</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* PDF Render Portal */}
      {PdfRenderPortal}
    </>
  );
};

export default TemplateCard;
