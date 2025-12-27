import React from 'react';
import { ITemplate } from '@/types/resume';
import { sampleResumeData } from '@/data/defaultResume';
import { templateComponents } from './index';

interface TemplateCardProps {
  template: ITemplate;
  isSelected: boolean;
  onSelect: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isSelected, onSelect }) => {
  const TemplateComponent = templateComponents[template.id];
  const scale = 0.32;

  return (
    <div
      className={`
        group bg-white rounded-lg overflow-hidden transition-all duration-200 shadow-md hover:shadow-xl
        ${isSelected ? 'ring-2 ring-purple-600 ring-offset-2' : ''}
      `}
    >
      {/* Template Preview */}
      <div
        className="relative overflow-hidden bg-gray-100 cursor-pointer"
        style={{ height: `${1123 * scale}px` }}
        onClick={onSelect}
      >
        <div
          className="absolute top-0 left-1/2 origin-top"
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
        <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/10 transition-colors duration-200" />
      </div>

      {/* Card Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{template.description}</p>
          </div>
        </div>

        {/* Use Template Button */}
        <button
          onClick={onSelect}
          className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors duration-200"
        >
          Use This Template
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
