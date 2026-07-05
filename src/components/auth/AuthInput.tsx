'use client';

import { useState } from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

interface AuthInputProps {
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  icon?: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export default function AuthInput({
  label,
  placeholder,
  type = 'text',
  icon: Icon,
  value,
  onChange,
  error,
  className = '',
  disabled = false,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} dir="rtl">
      <label className="text-sm font-medium text-[var(--primary-color)] text-right">
        {label}
      </label>

      <div className={`
        flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-white transition-all
        ${disabled ? 'opacity-50 bg-gray-50 cursor-not-allowed' : ''}
        ${error
          ? 'border-red-400 focus-within:border-red-500'
          : 'border-gray-200 focus-within:border-[var(--accent-color)]'
        }
      `}>
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="order-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="flex-1 text-sm text-right bg-transparent outline-none text-gray-700 placeholder:text-gray-300 min-w-0 disabled:cursor-not-allowed"
          dir="rtl"
        />

        {Icon && (
          <Icon size={16} className="text-gray-400 flex-shrink-0" />
        )}
      </div>

      {error && (
        <span className="min-h-[1.25rem] text-xs text-red-500 text-right leading-5" aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
}