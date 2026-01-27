import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, ArrowLeft, BarChart3 } from 'lucide-react';
import { Button } from '../components/Button';
import { ThemeToggle } from '../components/ThemeToggle';
import { quizService, attemptService } from '../lib/database';
import type { Quiz } from '../lib/database';

interface StudentResult {
  id: string;
  studentEmail: string;
  studentName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  status: string;
  completedAt: string;
  timeTaken: number;
  attemptId: string;
}

export const AdminQuizResults: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuizResults();
  }, [quizId]);

  const loadQuizResults = async () => {
    try {
      setLoading(true);
      const adminSession = localStorage.getItem('adminSession');
      if (!adminSession) {
        navigate('/admin/login');
        return;
      }

      if (!quizId) return;

      // Load quiz details
      const quizData = await quizService.getQuizById(quizId);
      setQuiz(quizData);

      // Load all attempts for this quiz
      const quizAttempts = await attemptService.getQuizAttempts(quizId);

      // Format results
      const formattedResults: StudentResult[] = (quizAttempts || []).map((attempt: any) => {
        // Get student info from attempt
        const userProfile = attempt.user_profiles;
        return {
          id: attempt.id,
          studentEmail: userProfile?.email || 'Unknown',
          studentName: userProfile?.name || 'Unknown Student',
          score: attempt.score,
          totalMarks: attempt.total_marks || quizData?.total_marks || 0,
          percentage: attempt.percentage,
          status: attempt.status,
          completedAt: attempt.completed_at,
          timeTaken: attempt.time_taken,
          attemptId: attempt.id,
        };
      });

      setResults(formattedResults.sort((a, b) => 
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      ));
    } catch (err) {
      console.error('Failed to load results:', err);
      setError(err instanceof Error ? err.message : 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/admin/login');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/quizzes')}
              icon={<ArrowLeft size={20} />}
            >
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="w-10 h-10 bg-red-600 dark:bg-red-700 rounded-lg flex items-center justify-center">
              <BarChart3 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-white">Quiz Results</h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">{quiz?.title}</p>
            </div>
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
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Mobile results list (visible on phones) */}
        {results.length > 0 && (
        <div className="sm:hidden space-y-3 mb-4">
          {results.map((r) => (
            <div key={r.id} className="card p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{r.studentName}</p>
                  <p className="text-xs text-neutral-600 truncate">{r.studentEmail}</p>
                  <div className="mt-2 text-sm">
                    <span className="font-semibold">{r.score}/{r.totalMarks}</span>
                    <span className="text-neutral-600 ml-2">{Math.round(r.percentage)}%</span>
                  </div>
                  <div className="mt-1 text-xs text-neutral-600">{formatTime(r.timeTaken)} • {formatDate(r.completedAt)}</div>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/results/${quiz?.id}`, { state: { attemptId: r.attemptId, score: r.score, totalMarks: r.totalMarks } })}
                  >
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        )}

        {/* Results Summary (desktop/tablet) */}
        {results.length > 0 && (
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700">
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Attempts</p>
              <p className="text-3xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400">{results.length}</p>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700">
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-1">Average Score</p>
              <p className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)}%
              </p>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700">
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-1">Highest Score</p>
              <p className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400">
                {Math.max(...results.map(r => r.percentage))}%
              </p>
            </div>
          </div>
        )}

        {/* Results Table */}
        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-400">No student results yet for this quiz.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold text-neutral-900 dark:text-white">Student</th>
                  <th className="px-3 sm:px-4 py-3 text-center font-semibold text-neutral-900 dark:text-white">Grade</th>
                  <th className="px-3 sm:px-4 py-3 text-right font-semibold text-neutral-900 dark:text-white">Score</th>
                  <th className="px-3 sm:px-4 py-3 text-right font-semibold text-neutral-900 dark:text-white">Percentage</th>
                  <th className="px-3 sm:px-4 py-3 text-right font-semibold text-neutral-900 dark:text-white hidden sm:table-cell">Time Taken</th>
                  <th className="px-3 sm:px-4 py-3 text-left font-semibold text-neutral-900 dark:text-white hidden md:table-cell">Completed</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr
                    key={result.id}
                    className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-3 sm:px-4 py-3 text-neutral-900 dark:text-white">
                      <div>
                        <p className="font-semibold">{result.studentName}</p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">{result.studentEmail}</p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-center">
                      <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getGradeColor(result.percentage)}`}>
                        {getGradeBadge(result.percentage)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right font-semibold text-neutral-900 dark:text-white">
                      {result.score}/{result.totalMarks}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right">
                      <span className={`font-bold ${
                        result.percentage >= 80 ? 'text-green-600 dark:text-green-400' :
                        result.percentage >= 60 ? 'text-blue-600 dark:text-blue-400' :
                        result.percentage >= 40 ? 'text-amber-600 dark:text-amber-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {Math.round(result.percentage)}%
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right text-neutral-600 dark:text-neutral-400 hidden sm:table-cell">
                      {formatTime(result.timeTaken)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-neutral-600 dark:text-neutral-400 hidden md:table-cell">
                      <span className="text-xs">{formatDate(result.completedAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
