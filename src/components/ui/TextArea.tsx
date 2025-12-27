import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  charLimit?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  charLimit,
  className = '',
  value,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-slate-600 mb-1.5"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        value={value}
        className={`
          w-full px-3 py-2 text-sm text-slate-900
          bg-white border border-slate-200 rounded-lg
          placeholder:text-slate-400
          focus:outline-none focus:border-slate-400
          disabled:bg-slate-50 disabled:text-slate-400
          transition-colors resize-none
          ${error ? 'border-red-400' : ''}
          ${className}
        `}
        {...props}
      />
      <div className="flex justify-between mt-1">
        {error && <p className="text-xs text-red-500">{error}</p>}
        {charLimit && (
          <p className={`text-xs ml-auto ${charCount > charLimit ? 'text-red-500' : 'text-slate-400'}`}>
            {charCount}/{charLimit}
          </p>
        )}
      </div>
    </div>
  );
};

export default TextArea;
