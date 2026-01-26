import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required,
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="mb-4 sm:mb-6 group">
      <label htmlFor={name} className="block text-sm sm:text-base font-semibold text-neutral-900 dark:text-white mb-2 sm:mb-3 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors duration-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={isPassword && showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          className={`input-field ${error ? 'input-error' : ''} transition-all duration-200 text-base sm:text-base`}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-all duration-200 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        {focused && !error && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-transparent rounded-b-xl"></div>
        )}
      </div>
      {error && (
        <div id={`${name}-error`} className="flex items-center gap-2 mt-3 text-red-600 dark:text-red-400 text-sm font-medium animate-slide-up">
          <AlertCircle size={16} className="flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
};

