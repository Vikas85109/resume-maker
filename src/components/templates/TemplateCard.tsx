import React from 'react';
import { ITemplate, TemplateId } from '@/types/resume';

// Mini preview components for each template
const MiniClassic: React.FC = () => (
  <div className="flex h-full">
    <div className="w-1/3 bg-slate-700 p-2">
      <div className="h-3 w-10 bg-slate-500 rounded mb-2"></div>
      <div className="space-y-1">
        <div className="h-1 w-full bg-slate-600 rounded"></div>
        <div className="h-1 w-8 bg-slate-600 rounded"></div>
      </div>
    </div>
    <div className="w-2/3 p-2">
      <div className="h-2 w-14 bg-slate-200 rounded mb-2"></div>
      <div className="space-y-1">
        <div className="h-1 w-full bg-slate-100 rounded"></div>
        <div className="h-1 w-16 bg-slate-100 rounded"></div>
      </div>
    </div>
  </div>
);

const MiniModern: React.FC = () => (
  <div className="h-full p-3">
    <div className="text-center mb-3 pb-2 border-b border-slate-100">
      <div className="h-3 w-16 bg-slate-700 rounded mx-auto mb-1"></div>
      <div className="h-1.5 w-10 bg-slate-300 rounded mx-auto"></div>
    </div>
    <div className="space-y-1">
      <div className="h-1 w-full bg-slate-100 rounded"></div>
      <div className="h-1 w-14 bg-slate-100 rounded"></div>
    </div>
  </div>
);

const MiniMinimal: React.FC = () => (
  <div className="h-full p-4">
    <div className="mb-4">
      <div className="h-4 w-20 bg-slate-800 rounded mb-1"></div>
      <div className="h-2 w-12 bg-slate-300 rounded"></div>
    </div>
    <div className="space-y-2">
      <div className="h-1 w-full bg-slate-100 rounded"></div>
      <div className="h-1 w-16 bg-slate-100 rounded"></div>
    </div>
  </div>
);

const MiniProfessional: React.FC = () => (
  <div className="h-full">
    <div className="bg-slate-800 p-2">
      <div className="h-3 w-12 bg-white/30 rounded mb-1"></div>
      <div className="h-1.5 w-8 bg-white/20 rounded"></div>
    </div>
    <div className="p-2 space-y-1">
      <div className="h-1 w-full bg-slate-100 rounded"></div>
      <div className="h-1 w-12 bg-slate-100 rounded"></div>
    </div>
  </div>
);

const MiniCreative: React.FC = () => (
  <div className="h-full flex">
    <div className="w-1/3 bg-gradient-to-b from-slate-600 to-slate-800 p-2">
      <div className="w-6 h-6 bg-white/20 rounded-full mx-auto mb-2"></div>
      <div className="h-1.5 w-8 bg-white/20 rounded mx-auto"></div>
    </div>
    <div className="w-2/3 p-2 space-y-1">
      <div className="h-2 w-12 bg-slate-200 rounded"></div>
      <div className="h-1 w-full bg-slate-100 rounded"></div>
    </div>
  </div>
);

const MiniExecutive: React.FC = () => (
  <div className="h-full border-t-2 border-slate-800">
    <div className="p-3 text-center border-b border-slate-100">
      <div className="h-3 w-16 bg-slate-800 rounded mx-auto mb-1"></div>
      <div className="h-1.5 w-10 bg-slate-300 rounded mx-auto"></div>
    </div>
    <div className="p-2 space-y-1">
      <div className="h-1 w-full bg-slate-100 rounded"></div>
      <div className="h-1 w-12 bg-slate-100 rounded"></div>
    </div>
  </div>
);

const miniPreviews: Record<TemplateId, React.FC> = {
  classic: MiniClassic,
  modern: MiniModern,
  minimal: MiniMinimal,
  professional: MiniProfessional,
  creative: MiniCreative,
  executive: MiniExecutive,
};

interface TemplateCardProps {
  template: ITemplate;
  isSelected: boolean;
  onSelect: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isSelected, onSelect }) => {
  const MiniPreview = miniPreviews[template.id];

  return (
    <button
      onClick={onSelect}
      className={`
        group text-left w-full rounded-xl overflow-hidden transition-all duration-200
        ${isSelected
          ? 'ring-2 ring-slate-900 ring-offset-2'
          : 'hover:ring-2 hover:ring-slate-200 hover:ring-offset-2'
        }
      `}
    >
      {/* Preview */}
      <div className="aspect-[3/4] bg-slate-50 relative">
        <div className="absolute inset-3 bg-white rounded-lg shadow-sm overflow-hidden">
          <MiniPreview />
        </div>
      </div>

      {/* Label */}
      <div className="p-3 bg-white border-t border-slate-100">
        <p className="font-medium text-slate-900 text-sm">{template.name}</p>
        <p className="text-xs text-slate-400 mt-0.5">{template.description}</p>
      </div>
    </button>
  );
};

export default TemplateCard;
