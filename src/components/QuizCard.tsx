import { Clock, BookOpen, Award, Zap } from 'lucide-react';
import { Quiz } from '../types';

interface QuizCardProps {
  quiz: Quiz;
  onStart: () => void;
  loading?: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStart, loading }) => {
  return (
    <div className="card-elevated p-6 sm:p-8 h-full flex flex-col group cursor-pointer transition-all duration-300 hover-lift hover-glow">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="relative w-12 h-12 rounded-xl flex items-center justify-center group/icon">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 group-hover/icon:opacity-0 transition-opacity duration-300"></div>
          <BookOpen size={24} className="text-primary-600 dark:text-primary-400 group-hover/icon:text-white relative z-10 transition-colors duration-300" />
        </div>
        {!quiz.isActive && (
          <div className="badge-warning animate-pulse-subtle">
            Inactive
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 mb-6">
        <h3 className="text-subheading text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">{quiz.title}</h3>
        <p className="text-caption text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3">{quiz.description || 'No description provided'}</p>
        <div className="inline-flex px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-700/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-600/30">
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent">{quiz.subject}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-6 py-4 border-t border-b border-neutral-200/50 dark:border-neutral-700/30">
        <div className="flex items-center justify-between text-sm group/stat">
          <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2 group-hover/stat:text-primary-600 dark:group-hover/stat:text-primary-400 transition-colors duration-300">
            <BookOpen size={16} className="text-primary-600 dark:text-primary-400" />
            Questions
          </span>
          <span className="font-semibold text-neutral-900 dark:text-white bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">{quiz.questionCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm group/stat">
          <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2 group-hover/stat:text-primary-600 dark:group-hover/stat:text-primary-400 transition-colors duration-300">
            <Clock size={16} className="text-primary-600 dark:text-primary-400" />
            Time Limit
          </span>
          <span className="font-semibold text-neutral-900 dark:text-white bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">{quiz.timeLimit} min</span>
        </div>
        <div className="flex items-center justify-between text-sm group/stat">
          <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2 group-hover/stat:text-primary-600 dark:group-hover/stat:text-primary-400 transition-colors duration-300">
            <Award size={16} className="text-primary-600 dark:text-primary-400" />
            Total Marks
          </span>
          <span className="font-semibold text-neutral-900 dark:text-white bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">{quiz.totalMarks}</span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onStart}
        disabled={!quiz.isActive || loading}
        className="btn-primary w-full relative overflow-hidden group/btn"
        aria-label={`Start ${quiz.title} quiz`}
      >
        <div className="absolute inset-0 bg-white/0 group-hover/btn:bg-white/10 transition-colors duration-300"></div>
        <Zap size={18} className="relative z-10" />
        <span className="relative z-10">{loading ? 'Starting...' : 'Start Quiz'}</span>
      </button>
    </div>
  );
};

