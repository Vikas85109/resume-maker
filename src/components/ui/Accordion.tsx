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
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3.5 flex items-center justify-between text-left transition-colors ${
          isOpen ? 'bg-purple-50 border-b border-purple-100' : 'hover:bg-gray-50'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`font-medium ${isOpen ? 'text-purple-700' : 'text-gray-900'}`}>{title}</h3>
            {badge !== undefined && (typeof badge === 'number' ? badge > 0 : badge) && (
              <span className="px-2 py-0.5 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          isOpen ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
        }`}>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="px-4 py-4 bg-white">{children}</div>
      )}
    </div>
  );
};

export default Accordion;
