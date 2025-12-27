import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  badge?: string | number;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  subtitle,
  defaultOpen = false,
  children,
  badge,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 rounded-lg bg-white">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors rounded-lg"
      >
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-slate-900">{title}</h3>
            {badge !== undefined && (typeof badge === 'number' ? badge > 0 : badge) && (
              <span className="px-1.5 py-0.5 text-xs text-slate-500 bg-slate-100 rounded">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-100">{children}</div>
      )}
    </div>
  );
};

export default Accordion;
