import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Plus, Edit2, Trash2, Eye, EyeOff, Loader, ArrowLeft, BarChart3 } from 'lucide-react';
import { Button } from '../components/Button';
import { ThemeToggle } from '../components/ThemeToggle';
import { quizService, Quiz } from '../lib/database';

export const AdminQuizManagement: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const adminSession = localStorage.getItem('adminSession');
      if (!adminSession) {
        navigate('/admin/login');
        return;
      }

      const data = await quizService.getAllQuizzes();
      setQuizzes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/admin/login');
  };

  const togglePublish = async (quizId: string, isPublished: boolean) => {
    try {
      await quizService.toggleQuizPublish(quizId, !isPublished);
      setQuizzes(quizzes.map(q => 
        q.id === quizId ? { ...q, is_published: !isPublished } : q
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quiz');
    }
  };

  const handleDelete = async (quizId: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizService.deleteQuiz(quizId);
        setQuizzes(quizzes.filter(q => q.id !== quizId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete quiz');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/dashboard')}
              icon={<ArrowLeft size={18} className="sm:w-5 sm:h-5" />}
              className="p-1.5 sm:p-2"
            >
              <span className="hidden sm:inline text-xs sm:text-sm">Back</span>
            </Button>
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-red-600 dark:bg-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen size={20} className="sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-base sm:text-2xl font-bold text-neutral-900 dark:text-white truncate">Quiz Management</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs sm:text-sm">
              <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Quiz List Header */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-neutral-900 dark:text-white">Your Quizzes</h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Total: {quizzes.length}</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus size={16} className="sm:w-[18px] sm:h-[18px]" />}
            onClick={() => navigate('/admin/quiz/create')}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Create Quiz</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>

        {/* Quiz Cards */}
        {quizzes.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-400">No quizzes created yet.</p>
            <Button
              variant="primary"
              icon={<Plus size={16} className="sm:w-[18px] sm:h-[18px]" />}
              onClick={() => navigate('/admin/quiz/create')}
              className="mt-4 mx-auto text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Create Your First Quiz</span>
              <span className="sm:hidden">Create Quiz</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft dark:shadow-none dark:border dark:border-neutral-700 p-4 sm:p-6"
              >
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-sm sm:text-lg font-bold text-neutral-900 dark:text-white truncate">{quiz.title}</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 truncate">{quiz.subject}</p>
                </div>

                <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    <strong>Time Limit:</strong> {quiz.time_limit} minutes
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    <strong>Total Marks:</strong> {quiz.total_marks}
                  </p>
                </div>

                <div className="mb-3 sm:mb-4">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                    quiz.is_published
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {quiz.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1 sm:gap-2">
                  <button
                    onClick={() => navigate(`/admin/quiz/${quiz.id}/results`)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition"
                    title="View student results"
                  >
                    <BarChart3 size={16} className="sm:w-[18px] sm:h-[18px] text-purple-600 dark:text-purple-400 mx-auto" />
                  </button>

                  <button
                    onClick={() => togglePublish(quiz.id, quiz.is_published)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition"
                    title={quiz.is_published ? 'Unpublish' : 'Publish'}
                  >
                    {quiz.is_published ? (
                      <Eye size={16} className="sm:w-[18px] sm:h-[18px] text-blue-600 dark:text-blue-400 mx-auto" />
                    ) : (
                      <EyeOff size={16} className="sm:w-[18px] sm:h-[18px] text-gray-400 mx-auto" />
                    )}
                  </button>

                  <button
                    onClick={() => navigate(`/admin/quiz/${quiz.id}/edit`)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition"
                  >
                    <Edit2 size={16} className="sm:w-[18px] sm:h-[18px] text-orange-600 dark:text-orange-400 mx-auto" />
                  </button>

                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition"
                  >
                    <Trash2 size={16} className="sm:w-[18px] sm:h-[18px] text-red-600 dark:text-red-400 mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
