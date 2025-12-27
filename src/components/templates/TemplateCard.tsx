import React from 'react';
import Button from '@/components/ui/Button';
import { ITemplate, TemplateId } from '@/types/resume';

// Mini preview components for each template
const MiniClassic: React.FC = () => (
  <div className="flex h-full text-[4px] leading-tight">
    <div className="w-1/3 bg-slate-700 p-1.5 text-white">
      <div className="h-2 w-8 bg-slate-500 rounded mb-1"></div>
      <div className="h-1 w-6 bg-slate-600 rounded mb-2"></div>
      <div className="space-y-0.5">
        <div className="h-0.5 w-full bg-slate-600 rounded"></div>
        <div className="h-0.5 w-10 bg-slate-600 rounded"></div>
      </div>
    </div>
    <div className="w-2/3 p-1.5">
      <div className="h-1 w-12 bg-slate-300 rounded mb-1"></div>
      <div className="h-0.5 w-full bg-slate-200 rounded mb-0.5"></div>
      <div className="h-0.5 w-14 bg-slate-200 rounded mb-1.5"></div>
      <div className="h-1 w-10 bg-slate-300 rounded mb-0.5"></div>
      <div className="h-0.5 w-full bg-slate-200 rounded"></div>
    </div>
  </div>
);

const MiniModern: React.FC = () => (
  <div className="h-full p-1.5 text-[4px] leading-tight">
    <div className="text-center mb-1.5">
      <div className="h-2 w-12 bg-slate-700 rounded mx-auto mb-0.5"></div>
      <div className="h-1 w-8 bg-slate-400 rounded mx-auto"></div>
    </div>
    <div className="h-0.5 w-full bg-slate-200 rounded mb-1"></div>
    <div className="grid grid-cols-2 gap-1">
      <div className="space-y-0.5">
        <div className="h-1 w-8 bg-slate-300 rounded"></div>
        <div className="h-0.5 w-full bg-slate-200 rounded"></div>
        <div className="h-0.5 w-10 bg-slate-200 rounded"></div>
      </div>
      <div className="space-y-0.5">
        <div className="h-1 w-6 bg-slate-300 rounded"></div>
        <div className="h-0.5 w-full bg-slate-200 rounded"></div>
      </div>
    </div>
  </div>
);

const MiniMinimal: React.FC = () => (
  <div className="h-full p-2 text-[4px] leading-tight">
    <div className="mb-2">
      <div className="h-2 w-14 bg-slate-800 rounded mb-0.5"></div>
      <div className="h-1 w-10 bg-slate-400 rounded"></div>
    </div>
    <div className="space-y-1.5">
      <div className="h-0.5 w-full bg-slate-200 rounded"></div>
      <div className="h-0.5 w-14 bg-slate-200 rounded"></div>
      <div className="h-0.5 w-12 bg-slate-200 rounded"></div>
    </div>
  </div>
);

const MiniProfessional: React.FC = () => (
  <div className="h-full text-[4px] leading-tight">
    <div className="bg-indigo-600 p-1.5 text-white">
      <div className="h-2 w-10 bg-white/30 rounded mb-0.5"></div>
      <div className="h-1 w-8 bg-white/20 rounded"></div>
    </div>
    <div className="p-1.5">
      <div className="h-1 w-8 bg-slate-300 rounded mb-0.5"></div>
      <div className="h-0.5 w-full bg-slate-200 rounded mb-0.5"></div>
      <div className="h-0.5 w-12 bg-slate-200 rounded"></div>
    </div>
  </div>
);

const MiniCreative: React.FC = () => (
  <div className="h-full flex text-[4px] leading-tight">
    <div className="w-1/3 bg-gradient-to-b from-purple-500 to-indigo-600 p-1.5">
      <div className="w-4 h-4 bg-white/30 rounded-full mx-auto mb-1"></div>
      <div className="h-1 w-8 bg-white/30 rounded mx-auto"></div>
    </div>
    <div className="w-2/3 p-1.5">
      <div className="h-1 w-10 bg-slate-300 rounded mb-0.5"></div>
      <div className="h-0.5 w-full bg-slate-200 rounded mb-0.5"></div>
      <div className="h-0.5 w-12 bg-slate-200 rounded"></div>
    </div>
  </div>
);

const MiniExecutive: React.FC = () => (
  <div className="h-full p-1.5 text-[4px] leading-tight border-t-2 border-slate-800">
    <div className="text-center mb-1.5 pb-1 border-b border-slate-200">
      <div className="h-2 w-14 bg-slate-800 rounded mx-auto mb-0.5"></div>
      <div className="h-1 w-10 bg-slate-400 rounded mx-auto"></div>
    </div>
    <div className="grid grid-cols-2 gap-1">
      <div className="space-y-0.5">
        <div className="h-1 w-6 bg-slate-300 rounded"></div>
        <div className="h-0.5 w-full bg-slate-200 rounded"></div>
      </div>
      <div className="space-y-0.5">
        <div className="h-1 w-6 bg-slate-300 rounded"></div>
        <div className="h-0.5 w-full bg-slate-200 rounded"></div>
      </div>
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
    <div
      className={`
        group relative bg-white rounded-xl border-2 overflow-hidden transition-all duration-200
        ${isSelected ? 'border-indigo-600 shadow-lg shadow-indigo-100' : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'}
      `}
    >
      {/* Preview Thumbnail */}
      <div className="aspect-[3/4] bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-2 bg-white rounded shadow-sm overflow-hidden">
          <MiniPreview />
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />

        {/* Selected badge */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
        <p className="text-sm text-slate-500 mb-3">{template.description}</p>
        <Button
          variant={isSelected ? 'primary' : 'secondary'}
          size="sm"
          onClick={onSelect}
          className="w-full"
        >
          {isSelected ? 'Selected' : 'Use Template'}
        </Button>
      </div>
    </div>
  );
};

export default TemplateCard;
