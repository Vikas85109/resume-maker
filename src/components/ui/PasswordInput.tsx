import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { PasswordStrength, getPasswordStrength } from '@/types/auth';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  showStrength?: boolean;
}

const strengthColors: Record<PasswordStrength, { bg: string; text: string; label: string }> = {
  weak: { bg: 'bg-red-500', text: 'text-red-600', label: 'Weak' },
  medium: { bg: 'bg-yellow-500', text: 'text-yellow-600', label: 'Medium' },
  strong: { bg: 'bg-green-500', text: 'text-green-600', label: 'Strong' },
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  showStrength = false,
  className = '',
  id,
  value,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const password = typeof value === 'string' ? value : '';
  const strength = password ? getPasswordStrength(password) : null;

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
      <div className="relative">
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          value={value}
          className={`
            w-full px-3 py-2.5 pr-10 text-sm text-gray-900
            bg-white border border-gray-300 rounded-md
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
            disabled:bg-gray-50 disabled:text-gray-400
            transition-all
            ${error ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>

      {showStrength && password && strength && (
        <div className="mt-2">
          <div className="flex gap-1 mb-1">
            {['weak', 'medium', 'strong'].map((level, index) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded-full transition-all ${
                  index <= ['weak', 'medium', 'strong'].indexOf(strength)
                    ? strengthColors[strength].bg
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className={`text-xs ${strengthColors[strength].text}`}>
            {strengthColors[strength].label} password
          </p>
        </div>
      )}

      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default PasswordInput;
