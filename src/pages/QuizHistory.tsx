import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Eye, Calendar, Clock, Award } from 'lucide-react';
import { Button } from '../components/Button';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { attemptService, quizService } from '../lib/database';

interface AttemptWithQuiz {
  id: string;
  quiz_id: string;
  quiz_title: string;
  score: number;
  percentage: number;
  status: string;
  completed_at: string;
  time_taken: number;
}

export const QuizHistory: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [attempts, setAttempts] = useState<AttemptWithQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadAttempts();
    }
  }, [user?.id]);

  const loadAttempts = async () => {
    try {
      setLoading(true);
      // Fetch attempts for the current logged-in user
      if (!user?.id) {
        setError('User not authenticated');
        return;
      }

      const attemptsData = await attemptService.getStudentAttempts(user.id);

      if (!attemptsData || attemptsData.length === 0) {
        setAttempts([]);
        return;
      }

      // Get quiz titles for each attempt
      const attemptsWithQuizzes = await Promise.all(
        attemptsData.map(async (attempt: any) => {
          try {
            const quiz = await quizService.getQuizById(attempt.quiz_id);
            return {
              id: attempt.id,
              quiz_id: attempt.quiz_id,
              quiz_title: quiz.title,
              score: attempt.score,
              percentage: attempt.percentage,
              status: attempt.status,
              completed_at: attempt.completed_at,
              time_taken: attempt.time_taken,
            };
          } catch (err) {
            return {
              id: attempt.id,
              quiz_id: attempt.quiz_id,
              quiz_title: 'Unknown Quiz',
              score: attempt.score,
              percentage: attempt.percentage,
              status: attempt.status,
              completed_at: attempt.completed_at,
              time_taken: attempt.time_taken,
            };
          }
        })
      );

      setAttempts(attemptsWithQuizzes);
    } catch (err) {
      console.error('Failed to load attempts:', err);
      setError('Failed to load quiz history');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    if (percentage >= 60) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
    if (percentage >= 40) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
  };

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 80) return 'A';
    if (percentage >= 60) return 'B';
    if (percentage >= 40) return 'C';
    return 'F';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return '-';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/40 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-900/20" style={{ backgroundAttachment: 'fixed' }}>
      {/* Header */}
      <header className="glass-effect-strong sticky top-0 z-10 border-b dark:border-neutral-700/30 transition-all duration-300 shadow-sm">
        <div className="container-max py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowLeft size={20} />}
              onClick={() => navigate('/dashboard')}
              aria-label="Back to dashboard"
            >
              <span className="hidden sm:inline text-xs sm:text-sm">Back</span>
            </Button>
            <div className="relative w-10 sm:w-11 h-10 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 animate-float" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl"></div>
              <BookOpen size={20} className="sm:w-6 sm:h-6 text-white relative z-10" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold gradient-text truncate">Quiz History</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <span className="hidden sm:inline text-xs sm:text-sm">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-max py-6 sm:py-12 md:py-16">
        {/* Page Title */}
        <div className="mb-8 sm:mb-12 animate-fade-in">
          <h2 className="text-display text-neutral-900 dark:text-white mb-2 sm:mb-3">Your Quiz Attempts</h2>
          <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400">Review your past quiz attempts and track your progress over time.</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12 sm:py-20">
            <div className="text-center">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full border-4 border-primary-200 dark:border-primary-900/30 border-t-primary-600 dark:border-t-primary-400 animate-spin mx-auto mb-4 sm:mb-6 animate-glow"></div>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-medium">Loading your history...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="card-elevated p-6 border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-transparent dark:from-red-900/20 dark:to-transparent animate-scale-in">
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && attempts.length === 0 && (
          <div className="card-elevated p-12 sm:p-16 text-center max-w-md mx-auto animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-800/50 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <BookOpen size={32} className="text-neutral-400 dark:text-neutral-600" />
            </div>
            <h3 className="text-heading text-neutral-900 dark:text-white mb-2">No Quiz Attempts Yet</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">Start taking quizzes to see your history here!</p>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Go to Quizzes
            </Button>
          </div>
        )}

        {/* Stats Overview */}
        {!loading && !error && attempts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {/* Total Attempts */}
              <div 
                className="card-elevated p-4 sm:p-6 hover-glow animate-scale-in"
                style={{ animationDelay: '0s' }}
              >
                <div className="relative">
                  <div className="absolute -top-2 -right-2 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-br from-primary-500/10 to-transparent dark:from-primary-400/5 blur-xl"></div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
                    <div>
                      <p className="text-xs sm:text-caption mb-0.5 sm:mb-1">Total Attempts</p>
                      <p className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent">{attempts.length}</p>
                    </div>
                    <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 dark:from-primary-500/10 dark:to-primary-600/5 flex items-center justify-center border border-primary-200/50 dark:border-primary-700/30 flex-shrink-0">
                      <BookOpen size={20} className="sm:w-7 sm:h-7 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Average Score */}
              <div 
                className="card-elevated p-4 sm:p-6 hover-glow animate-scale-in"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="relative">
                  <div className="absolute -top-2 -right-2 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent dark:from-blue-400/5 blur-xl"></div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
                    <div>
                      <p className="text-xs sm:text-caption mb-0.5 sm:mb-1">Average Score</p>
                      <p className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">{Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)}%</p>
                    </div>
                    <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 dark:from-blue-500/10 dark:to-blue-600/5 flex items-center justify-center border border-blue-200/50 dark:border-blue-700/30 flex-shrink-0">
                      <Award size={20} className="sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Score */}
              <div 
                className="card-elevated p-4 sm:p-6 hover-glow animate-scale-in"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="relative">
                  <div className="absolute -top-2 -right-2 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-br from-green-500/10 to-transparent dark:from-green-400/5 blur-xl"></div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
                    <div>
                      <p className="text-xs sm:text-caption mb-0.5 sm:mb-1">Best Score</p>
                      <p className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-green-700 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent">{Math.max(...attempts.map(a => a.percentage))}%</p>
                    </div>
                    <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 dark:from-green-500/10 dark:to-green-600/5 flex items-center justify-center border border-green-200/50 dark:border-green-700/30 flex-shrink-0">
                      <Award size={20} className="sm:w-7 sm:h-7 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz History List */}
            <div>
              <h3 className="text-heading text-neutral-900 dark:text-white mb-6 animate-fade-in">Recent Attempts</h3>
              <div className="space-y-3 sm:space-y-4">
                {attempts.map((attempt, index) => (
                  <div
                    key={attempt.id}
                    className="card-elevated p-4 sm:p-6 hover-lift transition-all duration-300 animate-scale-in group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      {/* Left Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-base sm:text-lg shadow-md transition-all duration-300 ${getGradeColor(attempt.percentage)} group-hover:scale-110 group-hover:shadow-lg`}>
                            {getGradeBadge(attempt.percentage)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-lg mb-1 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                              {attempt.quiz_title}
                            </h4>
                            <div className="flex flex-col sm:flex-row sm:gap-4 gap-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                              <div className="flex items-center gap-1 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 transition-colors duration-300">
                                <Calendar size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">{formatDate(attempt.completed_at)}</span>
                              </div>
                              <div className="flex items-center gap-1 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 transition-colors duration-300">
                                <Clock size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                                {formatTime(attempt.time_taken)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Content */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200 dark:border-neutral-700/30">
                        {/* Score Display */}
                        <div className="text-right">
                          <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">Score</div>
                          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent">{attempt.score}</div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">{Math.round(attempt.percentage)}%</div>
                        </div>

                        {/* View Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Eye size={16} className="sm:w-[18px] sm:h-[18px]" />}
                          onClick={() =>
                            navigate(`/results/${attempt.quiz_id}`, {
                              state: {
                                attemptId: attempt.id,
                                score: attempt.score,
                                totalMarks: Math.round(attempt.score / (attempt.percentage / 100)),
                              },
                            })
                          }
                          aria-label={`View results for ${attempt.quiz_title}`}
                        >
                          <span className="hidden sm:inline text-xs sm:text-sm">View</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
