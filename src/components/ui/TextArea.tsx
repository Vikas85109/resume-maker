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
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        value={value}
        className={`
          w-full px-3 py-2.5 text-sm text-gray-900
          bg-white border border-gray-300 rounded-md
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
          disabled:bg-gray-50 disabled:text-gray-400
          transition-all resize-none
          ${error ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      <div className="flex justify-between mt-1.5">
        {error && <p className="text-sm text-red-500">{error}</p>}
        {charLimit && (
          <p className={`text-sm ml-auto ${charCount > charLimit ? 'text-red-500' : 'text-gray-400'}`}>
            {charCount}/{charLimit}
          </p>
        )}
      </div>
    </div>
  );
};

export default TextArea;
