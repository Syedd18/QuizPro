import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { FormInput } from '../components/FormInput';
import { Alert } from '../components/Alert';
import { useForm } from '../hooks/useForm';
import { mockQuizzes, mockQuestions } from '../data/mockData';

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState(mockQuizzes);
  const [activeTab, setActiveTab] = useState<'quizzes' | 'scores'>('quizzes');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { values, handleChange, handleSubmit, setValues } = useForm(
    { title: '', description: '', questionCount: '', timeLimit: '', totalMarks: '' },
    async (formValues) => {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (editingId) {
        setQuizzes(quizzes.map(q =>
          q.id === editingId
            ? {
                ...q,
                title: formValues.title,
                description: formValues.description,
                timeLimit: parseInt(formValues.timeLimit),
                totalMarks: parseInt(formValues.totalMarks),
              }
            : q
        ));
        setAlert({ type: 'success', message: 'Quiz updated successfully!' });
      } else {
        const newQuiz = {
          id: Date.now().toString(),
          title: formValues.title,
          description: formValues.description,
          questionCount: parseInt(formValues.questionCount),
          timeLimit: parseInt(formValues.timeLimit),
          totalMarks: parseInt(formValues.totalMarks),
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        setQuizzes([...quizzes, newQuiz]);
        setAlert({ type: 'success', message: 'Quiz created successfully!' });
      }

      setValues({
        title: '',
        description: '',
        questionCount: '',
        timeLimit: '',
        totalMarks: '',
      });
      setEditingId(null);
    }
  );

  const handleEdit = (quiz: typeof quizzes[0]) => {
    setEditingId(quiz.id);
    setValues({
      title: quiz.title,
      description: quiz.description,
      questionCount: quiz.questionCount.toString(),
      timeLimit: quiz.timeLimit.toString(),
      totalMarks: quiz.totalMarks.toString(),
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter(q => q.id !== id));
      setAlert({ type: 'success', message: 'Quiz deleted successfully!' });
    }
  };

  const handleToggleActive = (id: string) => {
    setQuizzes(quizzes.map(q =>
      q.id === id ? { ...q, isActive: !q.isActive } : q
    ));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              icon={<ArrowLeft size={18} />}
              className="p-1.5 sm:p-2"
            >
              <span className="hidden sm:inline text-xs sm:text-sm">Back</span>
            </Button>
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen size={20} className="sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-base sm:text-2xl font-bold text-neutral-900 truncate">Admin Panel</h1>
          </div>

          <Button
            variant="ghost"
            icon={<LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />}
            size="sm"
            onClick={handleLogout}
            className="text-xs sm:text-sm flex-shrink-0"
          >
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {alert && (
          <div className="mb-4 sm:mb-6">
            <Alert
              type={alert.type}
              title={alert.type === 'success' ? 'Success' : 'Error'}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 border-b border-neutral-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'quizzes'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Manage Quizzes
          </button>
          <button
            onClick={() => setActiveTab('scores')}
            className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'scores'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Student Scores
          </button>
        </div>

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Form */}
            <div className="card p-4 sm:p-6">
              <h2 className="text-base sm:text-xl font-semibold text-neutral-900 mb-4 sm:mb-6">
                {editingId ? 'Edit Quiz' : 'Create New Quiz'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                  label="Quiz Title"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  placeholder="Enter quiz title"
                  required
                />

                <FormInput
                  label="Description"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  placeholder="Quiz description"
                  required
                />

                <FormInput
                  label="Number of Questions"
                  name="questionCount"
                  type="number"
                  value={values.questionCount}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Time Limit (minutes)"
                  name="timeLimit"
                  type="number"
                  value={values.timeLimit}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Total Marks"
                  name="totalMarks"
                  type="number"
                  value={values.totalMarks}
                  onChange={handleChange}
                  required
                />

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="submit" variant="primary" className="flex-1 text-sm sm:text-base">
                    {editingId ? 'Update' : 'Create'}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setEditingId(null);
                        setValues({
                          title: '',
                          description: '',
                          questionCount: '',
                          timeLimit: '',
                          totalMarks: '',
                        });
                      }}
                      className="text-sm sm:text-base"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Quiz List */}
            <div className="lg:col-span-2">
              <h2 className="text-base sm:text-xl font-semibold text-neutral-900 mb-4 sm:mb-6">All Quizzes</h2>

              <div className="space-y-3">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="card p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-neutral-900 truncate">{quiz.title}</h3>
                        <p className="text-xs sm:text-sm text-neutral-600 truncate">{quiz.description}</p>
                        <div className="flex items-center gap-2 sm:gap-4 mt-2 text-xs text-neutral-500">
                          <span>{quiz.questionCount} Q</span>
                          <span>{quiz.timeLimit} min</span>
                          <span>{quiz.totalMarks} marks</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleToggleActive(quiz.id)}
                          className="p-1.5 sm:p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                          aria-label={quiz.isActive ? 'Disable quiz' : 'Enable quiz'}
                        >
                          {quiz.isActive ? (
                            <Eye size={16} className="sm:w-[18px] sm:h-[18px] text-green-600" />
                          ) : (
                            <EyeOff size={16} className="sm:w-[18px] sm:h-[18px] text-neutral-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(quiz)}
                          className="p-1.5 sm:p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                          aria-label="Edit quiz"
                        >
                          <Edit size={16} className="sm:w-[18px] sm:h-[18px] text-primary-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(quiz.id)}
                          className="p-1.5 sm:p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                          aria-label="Delete quiz"
                        >
                          <Trash2 size={16} className="sm:w-[18px] sm:h-[18px] text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scores Tab */}
        {activeTab === 'scores' && (
          <div className="card p-4 sm:p-6">
            <h2 className="text-base sm:text-xl font-semibold text-neutral-900 mb-4 sm:mb-6">Student Scores</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-neutral-700">Student</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-neutral-700">Quiz</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-neutral-700">Score</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-neutral-700 hidden sm:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-200 hover:bg-neutral-50">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-neutral-900">John Doe</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-neutral-600 max-w-[120px] sm:max-w-none truncate">Cloud Computing Fundamentals</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4"><span className="text-green-600 font-semibold">85/100</span></td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-neutral-600 hidden sm:table-cell">2024-01-20</td>
                  </tr>
                  <tr className="border-b border-neutral-200 hover:bg-neutral-50">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-neutral-900">Jane Smith</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-neutral-600 max-w-[120px] sm:max-w-none truncate">AWS Services Overview</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4"><span className="text-blue-600 font-semibold">72/150</span></td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-neutral-600 hidden sm:table-cell">2024-01-19</td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-neutral-900">Mike Johnson</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-neutral-600 max-w-[120px] sm:max-w-none truncate">Kubernetes Essentials</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4"><span className="text-green-600 font-semibold">105/120</span></td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-neutral-600 hidden sm:table-cell">2024-01-18</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
