import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  charLimit?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
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
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        value={value}
        className={`
          w-full px-3 py-2 text-sm text-slate-900
          bg-white border rounded-lg
          placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
          transition-colors duration-200 resize-none
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300'}
          ${className}
        `}
        {...props}
      />
      <div className="flex justify-between mt-1">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-slate-500">{helperText}</p>
        )}
        {charLimit && (
          <p
            className={`text-sm ml-auto ${
              charCount > charLimit ? 'text-red-600' : 'text-slate-500'
            }`}
          >
            {charCount}/{charLimit}
          </p>
        )}
      </div>
    </div>
  );
};

export default TextArea;
