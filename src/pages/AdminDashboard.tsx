import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { ThemeToggle } from '../components/ThemeToggle';
import { quizService } from '../lib/database';

interface QuizStat {
  id: string;
  title: string;
  subject: string;
  total_marks: number;
  time_limit: number;
  is_published: boolean;
  is_active: boolean;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<QuizStat[]>([]);
  const [stats, setStats] = useState({ totalQuizzes: 0, totalStudents: 0, totalAttempts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check admin session
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      navigate('/admin/login');
      return;
    }

    // Load quizzes from database
    loadStats();
  }, [navigate]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const allQuizzes = await quizService.getAllQuizzes() || [];
      setQuizzes(allQuizzes);
      setStats({
        totalQuizzes: allQuizzes.length,
        totalStudents: 0, // Would need to query user_profiles for this
        totalAttempts: 0, // Would need to query quiz_attempts for this
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-red-600 dark:bg-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen size={20} className="sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-2xl font-bold text-neutral-900 dark:text-white truncate">QuizPro Admin</h1>
              <p className="hidden sm:block text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Quiz Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-xs sm:text-sm"
            >
              <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="divider h-6"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-xs sm:text-sm"
            >
              <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-12">
          <div className="bg-white dark:bg-neutral-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-soft dark:shadow-none dark:border dark:border-neutral-700">
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-1 sm:mb-2">Total Quizzes</p>
            <p className="text-3xl sm:text-4xl font-bold text-red-600 dark:text-red-400">{stats.totalQuizzes}</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-soft dark:shadow-none dark:border dark:border-neutral-700">
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-1 sm:mb-2">Registered Students</p>
            <p className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.totalStudents}</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-soft dark:shadow-none dark:border dark:border-neutral-700">
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-1 sm:mb-2">Total Attempts</p>
            <p className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400">{stats.totalAttempts}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-12 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button
            variant="primary"
            icon={<Plus size={16} className="sm:w-[18px] sm:h-[18px]" />}
            onClick={() => navigate('/admin/quiz/create')}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Create New Quiz</span>
            <span className="sm:hidden">New Quiz</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/quizzes')}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            Manage Quizzes
          </Button>
        </div>

        {/* Recent Quizzes */}
        {!loading && quizzes.length > 0 && (
          <div className="bg-white dark:bg-neutral-800 rounded-lg sm:rounded-xl shadow-soft dark:shadow-none dark:border dark:border-neutral-700 overflow-hidden">
            <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-base sm:text-xl font-bold text-neutral-900 dark:text-white">Recent Quizzes</h2>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {quizzes.slice(0, 5).map((quiz) => (
                <div key={quiz.id} className="px-3 sm:px-6 py-3 sm:py-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-xs sm:text-base text-neutral-900 dark:text-white truncate">{quiz.title}</h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{quiz.subject} • {quiz.total_marks} marks • {quiz.time_limit} min</p>
                    </div>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 ${
                      quiz.is_published
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {quiz.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border-4 border-red-200 border-t-red-600 animate-spin mx-auto mb-4"></div>
            <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-400">Loading dashboard...</p>
          </div>
        )}

        {!loading && quizzes.length === 0 && (
          <div className="bg-white dark:bg-neutral-800 rounded-lg sm:rounded-xl p-8 sm:p-12 text-center shadow-soft dark:shadow-none dark:border dark:border-neutral-700">
            <BookOpen size={40} className="sm:w-12 sm:h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
            <h3 className="text-base sm:text-xl font-bold text-neutral-900 dark:text-white mb-2">No Quizzes Created Yet</h3>
            <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 mb-6">Create your first quiz to get started</p>
            <Button
              variant="primary"
              icon={<Plus size={16} className="sm:w-[18px] sm:h-[18px]" />}
              onClick={() => navigate('/admin/quiz/create')}
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Create First Quiz</span>
              <span className="sm:hidden">Create Quiz</span>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};
