import React, { useState, KeyboardEvent } from 'react';

interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  label,
  tags,
  onChange,
  placeholder = 'Type and press Enter',
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
    if (trimmedValue && !tags.includes(trimmedValue)) {
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
        <label className="block text-xs font-medium text-slate-600 mb-1.5">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-1.5 p-2 min-h-[42px] bg-white border border-slate-200 rounded-lg focus-within:border-slate-400 transition-colors">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-slate-700 bg-slate-100 rounded"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-slate-400 hover:text-slate-600"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
          className="flex-1 min-w-[100px] text-sm bg-transparent border-none outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
};

export default TagInput;
