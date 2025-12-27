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
  // A4: 794 x 1123, scale to fit card width (~280px in 3-col grid)
  const scale = 0.35;

  return (
    <button
      onClick={onSelect}
      className={`
        group text-left w-full rounded-xl overflow-hidden transition-all duration-200 bg-white shadow-sm
        ${isSelected
          ? 'ring-2 ring-slate-900 ring-offset-2'
          : 'hover:ring-2 hover:ring-slate-300 hover:ring-offset-2 hover:shadow-md'
        }
      `}
    >
      {/* Full A4 Template Preview */}
      <div
        className="relative overflow-hidden bg-slate-50"
        style={{
          width: '100%',
          height: `${1123 * scale}px`
        }}
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
      </div>

      {/* Label */}
      <div className="p-3 border-t border-slate-100">
        <p className="font-medium text-slate-900 text-sm">{template.name}</p>
        <p className="text-xs text-slate-400 mt-0.5">{template.description}</p>
      </div>
    </button>
  );
};

export default TemplateCard;
