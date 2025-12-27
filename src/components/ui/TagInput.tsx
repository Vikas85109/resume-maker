import React, { useState, KeyboardEvent } from 'react';

interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
  maxTags?: number;
}

const TagInput: React.FC<TagInputProps> = ({
  label,
  tags,
  onChange,
  placeholder = 'Type and press Enter',
  error,
  maxTags,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (
      trimmedValue &&
      !tags.includes(trimmedValue) &&
      (!maxTags || tags.length < maxTags)
    ) {
      onChange([...tags, trimmedValue]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <div
        className={`
          flex flex-wrap gap-2 p-2 min-h-[42px]
          bg-white border rounded-lg
          focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500
          transition-colors duration-200
          ${error ? 'border-red-500' : 'border-slate-300'}
        `}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-indigo-500 hover:text-indigo-700 focus:outline-none"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ''}
          disabled={maxTags !== undefined && tags.length >= maxTags}
          className="flex-1 min-w-[120px] text-sm text-slate-900 bg-transparent border-none outline-none placeholder:text-slate-400"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {maxTags && (
        <p className="mt-1 text-sm text-slate-500">
          {tags.length}/{maxTags} tags
        </p>
      )}
    </div>
  );
};

export default TagInput;
