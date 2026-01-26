import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Plus, Edit2, Trash2, Eye, EyeOff, Loader, ArrowLeft } from 'lucide-react';
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/dashboard')}
              icon={<ArrowLeft size={20} />}
            >
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="w-10 h-10 bg-red-600 dark:bg-red-700 rounded-lg flex items-center justify-center">
              <BookOpen size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Quiz Management</h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Quiz List Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Your Quizzes</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Total: {quizzes.length}</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            onClick={() => navigate('/admin/quiz/create')}
          >
            Create Quiz
          </Button>
        </div>

        {/* Quiz Cards */}
        {quizzes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-400">No quizzes created yet.</p>
            <Button
              variant="primary"
              icon={<Plus size={18} />}
              onClick={() => navigate('/admin/quiz/create')}
              className="mt-4 mx-auto"
            >
              Create Your First Quiz
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft dark:shadow-none dark:border dark:border-neutral-700 p-6"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{quiz.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{quiz.subject}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    <strong>Time Limit:</strong> {quiz.time_limit} minutes
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    <strong>Total Marks:</strong> {quiz.total_marks}
                  </p>
                </div>

                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    quiz.is_published
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {quiz.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => togglePublish(quiz.id, quiz.is_published)}
                    className="flex-1 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition"
                    title={quiz.is_published ? 'Unpublish' : 'Publish'}
                  >
                    {quiz.is_published ? (
                      <Eye size={18} className="text-blue-600 dark:text-blue-400 mx-auto" />
                    ) : (
                      <EyeOff size={18} className="text-gray-400 mx-auto" />
                    )}
                  </button>

                  <button
                    onClick={() => navigate(`/admin/quiz/${quiz.id}/edit`)}
                    className="flex-1 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition"
                  >
                    <Edit2 size={18} className="text-orange-600 dark:text-orange-400 mx-auto" />
                  </button>

                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="flex-1 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition"
                  >
                    <Trash2 size={18} className="text-red-600 dark:text-red-400 mx-auto" />
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
