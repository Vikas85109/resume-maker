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
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const scale = 0.28;

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!previewRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      await exportToPdf(previewRef.current, `${template.name}_Resume_Sample.pdf`);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className={`
        group bg-white rounded-xl overflow-hidden transition-all duration-200 shadow-md hover:shadow-xl
        ${isSelected ? 'ring-2 ring-purple-600 ring-offset-2' : ''}
      `}
    >
      {/* Template Preview */}
      <div
        className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 cursor-pointer"
        style={{ height: `${1123 * scale}px` }}
        onClick={onSelect}
      >
        <div
          ref={previewRef}
          className="absolute top-2 left-1/2 origin-top shadow-lg"
          style={{
            transform: `translateX(-50%) scale(${scale})`,
            width: '794px',
            height: '1123px',
            pointerEvents: 'none'
          }}
        >
          <TemplateComponent data={sampleResumeData} />
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-purple-900/0 group-hover:bg-purple-900/20 transition-colors duration-200 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 rounded-full text-purple-600 font-medium text-sm shadow-lg">
            Click to Edit
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{template.description}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onSelect}
            className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Use Template
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-3 py-2.5 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
            title="Download Sample PDF"
          >
            {isDownloading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
