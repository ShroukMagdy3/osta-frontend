import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'outline'; 
}

export default function Button({
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  variant = 'primary',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        py-2 px-10 rounded-full font-bold text-sm sm:text-base transition-all
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${disabled
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : variant === 'outline'
            ? 'border-2 border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-gray-50 cursor-pointer'
            : 'bg-[var(--accent-color)] text-[var(--primary-color)] hover:bg-[var(--accent-hover)] cursor-pointer'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}