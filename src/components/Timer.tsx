import { Clock, AlertCircle } from 'lucide-react';

interface TimerProps {
  minutes: number;
  seconds: number;
  isExpired: boolean;
  variant?: 'default' | 'warning';
}

export const Timer: React.FC<TimerProps> = ({ minutes, seconds, isExpired, variant = 'default' }) => {
  const isWarning = minutes === 0 || (minutes === 1 && seconds < 30);
  const displayVariant = isExpired ? 'warning' : isWarning ? 'warning' : variant;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm border ${
      displayVariant === 'warning'
        ? 'bg-gradient-to-r from-red-100/80 to-red-50/80 dark:from-red-900/30 dark:to-red-900/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700/50 animate-pulse-subtle shadow-md shadow-red-500/20'
        : 'bg-gradient-to-r from-primary-100/80 to-primary-50/80 dark:from-primary-900/30 dark:to-primary-900/20 text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-700/50 shadow-md shadow-primary-500/10'
    }`}>
      <Clock size={18} className={displayVariant === 'warning' ? 'animate-pulse-subtle' : ''} />
      <time dateTime={`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`} className="font-mono">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </time>
      {isExpired && <AlertCircle size={18} className="animate-pulse-subtle" />}
    </div>
  );
};

