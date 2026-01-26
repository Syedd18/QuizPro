interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, className = '' }) => {
  const percentage = (current / total) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Question <span className="text-primary-600 dark:text-primary-400 font-bold">{current}</span> of <span className="text-neutral-900 dark:text-white font-bold">{total}</span>
        </span>
        <span className="text-sm font-bold text-transparent bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 bg-clip-text">{Math.round(percentage)}%</span>
      </div>
      <div className="relative w-full h-3 bg-neutral-200 dark:bg-neutral-700/50 rounded-full overflow-hidden shadow-sm">
        <div
          className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 dark:from-primary-400 dark:via-primary-500 dark:to-primary-600 rounded-full transition-all duration-500 ease-out shadow-lg shadow-primary-500/30"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={1}
          aria-valuemax={total}
        />
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      {/* Milestone indicators */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: Math.min(total, 5) }).map((_, i) => {
          const milestonePercent = ((i + 1) / Math.min(total, 5)) * 100;
          return (
            <div
              key={i}
              className={`h-1 w-0.5 rounded-full transition-colors duration-300 ${
                percentage >= milestonePercent
                  ? 'bg-primary-600 dark:bg-primary-400'
                  : 'bg-neutral-300 dark:bg-neutral-600'
              }`}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

