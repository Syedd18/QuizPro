import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  const variants = {
    success: {
      bg: 'bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-900/20 dark:to-green-900/10',
      border: 'border-green-200 dark:border-green-800/50',
      icon: 'text-green-600 dark:text-green-400',
      text: 'text-green-800 dark:text-green-200',
      accent: 'bg-green-500',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-900/20 dark:to-red-900/10',
      border: 'border-red-200 dark:border-red-800/50',
      icon: 'text-red-600 dark:text-red-400',
      text: 'text-red-800 dark:text-red-200',
      accent: 'bg-red-500',
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-900/20 dark:to-amber-900/10',
      border: 'border-amber-200 dark:border-amber-800/50',
      icon: 'text-amber-600 dark:text-amber-400',
      text: 'text-amber-800 dark:text-amber-200',
      accent: 'bg-amber-500',
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10',
      border: 'border-blue-200 dark:border-blue-800/50',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-800 dark:text-blue-200',
      accent: 'bg-blue-500',
    },
  };

  const variant = variants[type];

  return (
    <div className={`${variant.bg} ${variant.border} border rounded-xl p-4 animate-slide-up shadow-md backdrop-blur-sm relative overflow-hidden group`}>
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${variant.accent}`}></div>
      <div className="flex items-start gap-3">
        {type === 'success' ? (
          <CheckCircle className={`${variant.icon} flex-shrink-0 mt-0.5 animate-pulse-subtle`} size={20} />
        ) : (
          <AlertCircle className={`${variant.icon} flex-shrink-0 mt-0.5 animate-pulse-subtle`} size={20} />
        )}
        <div className="flex-1">
          <h3 className={`${variant.text} font-semibold mb-1`}>{title}</h3>
          <p className={`${variant.text} text-sm opacity-90`}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${variant.text} hover:opacity-70 transition-all duration-200 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5`}
            aria-label="Close alert"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
