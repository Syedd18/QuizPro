import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Settings, History } from 'lucide-react';
import { QuizCard } from '../components/QuizCard';
import { Button } from '../components/Button';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { quizService, questionService } from '../lib/database';

interface QuizDisplay {
  id: string;
  title: string;
  subject: string;
  description: string;
  questionCount: number;
  totalMarks: number;
  timeLimit: number;
  isActive: boolean;
  createdAt: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<QuizDisplay[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Load published quizzes from database
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setPageLoading(true);
      const publishedQuizzes = await quizService.getPublishedQuizzes();
      
      if (!publishedQuizzes || publishedQuizzes.length === 0) {
        console.log('No published quizzes found');
        setQuizzes([]);
        return;
      }
      
      // Get question count for each quiz
      const displayQuizzes = await Promise.all(
        publishedQuizzes.map(async (q) => {
          try {
            const questions = await questionService.getQuestionsByQuizId(q.id);
            return {
              id: q.id,
              title: q.title,
              subject: q.subject || 'General',
              description: q.description || '',
              questionCount: questions?.length || 0,
              totalMarks: q.total_marks,
              timeLimit: q.time_limit,
              isActive: q.is_active,
              createdAt: q.created_at,
            };
          } catch (err) {
            console.error(`Error loading questions for quiz ${q.id}:`, err);
            return {
              id: q.id,
              title: q.title,
              subject: q.subject || 'General',
              description: q.description || '',
              questionCount: 0,
              totalMarks: q.total_marks,
              timeLimit: q.time_limit,
              isActive: q.is_active,
              createdAt: q.created_at,
            };
          }
        })
      );
      
      console.log('Loaded quizzes:', displayQuizzes);
      setQuizzes(displayQuizzes);
    } catch (error) {
      console.error('Failed to load quizzes:', error);
      setQuizzes([]);
    } finally {
      setPageLoading(false);
    }
  };

  const handleStartQuiz = (quizId: string) => {
    setLoading(quizId);
    // Simulate loading
    setTimeout(() => {
      navigate(`/quiz/${quizId}`);
    }, 500);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/40 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-900/20" style={{ backgroundAttachment: 'fixed' }}>
      {/* Header */}
      <header className="glass-effect-strong sticky top-0 z-10 border-b dark:border-neutral-700/30 transition-all duration-300 shadow-sm">
        <div className="container-max py-2.5 sm:py-3 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative w-9 sm:w-10 md:w-11 h-9 sm:h-10 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 animate-float" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl"></div>
              <BookOpen size={18} className="sm:w-5 md:w-6 text-white relative z-10" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg md:text-xl font-bold gradient-text truncate">QuizPro</h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden md:block">Learning Platform</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
            <span className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm font-medium hidden sm:block max-w-[120px] md:max-w-full truncate">
              Welcome, <span className="text-primary-600 dark:text-primary-400 font-semibold">{user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}</span>
            </span>
            <div className="divider h-4 sm:h-5 hidden sm:block"></div>
            <Button
              variant="outline"
              size="sm"
              icon={<History size={16} />}
              onClick={() => navigate('/history')}
              className="hidden sm:flex"
            >
              <span className="hidden md:inline">History</span>
            </Button>
            {user?.role && user.role === 'admin' && (
              <Button
                variant="outline"
                size="sm"
                icon={<Settings size={16} />}
                onClick={() => navigate('/admin')}
                className="hidden sm:flex"
              >
                <span className="hidden md:inline">Admin</span>
              </Button>
            )}
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              icon={<LogOut size={16} />}
              onClick={handleLogout}
              aria-label="Logout"
            >
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-max py-6 sm:py-12 md:py-16">
        {/* Hero Section */}
        <div className="mb-8 sm:mb-12 md:mb-16 animate-fade-in">
          <div className="max-w-3xl">
            <h2 className="text-display text-neutral-900 dark:text-white mb-2 sm:mb-4">
              Available Quizzes
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Challenge yourself with our expertly crafted quizzes. Each quiz is designed to test your knowledge and help you learn effectively.
            </p>
          </div>
        </div>

        {/* Quiz Cards Grid */}
        {pageLoading ? (
          <div className="flex justify-center items-center py-12 sm:py-20">
            <div className="text-center">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full border-4 border-primary-200 dark:border-primary-900/30 border-t-primary-600 dark:border-t-primary-400 animate-spin mx-auto mb-4 sm:mb-6 animate-glow"></div>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-medium">Loading quizzes...</p>
            </div>
          </div>
        ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {quizzes.map((quiz, idx) => (
              <div key={quiz.id} className="animate-scale-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <QuizCard
                  quiz={quiz}
                  onStart={() => handleStartQuiz(quiz.id)}
                  loading={loading === quiz.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="card-elevated p-8 sm:p-12 md:p-16 text-center max-w-md mx-auto animate-scale-in">
            <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-800/50 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <BookOpen size={24} className="sm:w-8 sm:h-8 text-neutral-400 dark:text-neutral-600" />
            </div>
            <h3 className="text-heading text-neutral-900 dark:text-white mb-2">No Quizzes Available Yet</h3>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-6 sm:mb-8">Check back soon for new quizzes to test your knowledge!</p>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Refresh Page
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};
