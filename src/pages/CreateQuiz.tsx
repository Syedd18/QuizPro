import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Trash2, ChevronUp, ChevronDown, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { FormInput } from '../components/FormInput';
import { ThemeToggle } from '../components/ThemeToggle';
import { quizService, questionService } from '../lib/database';

interface QuestionForm {
  tempId: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  marks: number;
  explanation: string;
}

export const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    subject: '',
    time_limit: 60,
    total_marks: 100,
  });

  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const handleQuizChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuizForm(prev => ({
      ...prev,
      [name]: name === 'time_limit' || name === 'total_marks' ? parseInt(value) : value,
    }));
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      tempId: Date.now().toString(),
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'A',
      marks: 1,
      explanation: '',
    }]);
  };

  const updateQuestion = (tempId: string, field: string, value: string | number) => {
    setQuestions(questions.map(q =>
      q.tempId === tempId ? { ...q, [field]: value } : q
    ));
  };

  const removeQuestion = (tempId: string) => {
    setQuestions(questions.filter(q => q.tempId !== tempId));
  };

  const moveQuestion = (tempId: string, direction: 'up' | 'down') => {
    const index = questions.findIndex(q => q.tempId === tempId);
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < questions.length - 1)) {
      const newQuestions = [...questions];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
      setQuestions(newQuestions);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate
      if (!quizForm.title.trim()) {
        setError('Quiz title is required');
        return;
      }

      if (questions.length === 0) {
        setError('At least one question is required');
        return;
      }

      // Check all questions are valid
      for (const q of questions) {
        if (!q.question_text.trim()) {
          setError('All questions must have text');
          return;
        }
        if (!q.option_a.trim() || !q.option_b.trim() || !q.option_c.trim() || !q.option_d.trim()) {
          setError('All options must be filled');
          return;
        }
      }

      const adminSession = localStorage.getItem('adminSession');
      const session = adminSession ? JSON.parse(adminSession) : null;

      // Create quiz
      const quizData = await quizService.createQuiz({
        title: quizForm.title,
        description: quizForm.description,
        subject: quizForm.subject || 'General',
        created_by: session?.id || '00000000-0000-0000-0000-000000000001',
        time_limit: quizForm.time_limit,
        total_marks: quizForm.total_marks,
        is_published: false,
        is_active: true,
      });

      // Create questions
      const questionsToCreate = questions.map((q, index) => ({
        quiz_id: quizData.id,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: q.correct_option,
        marks: q.marks,
        explanation: q.explanation,
        question_order: index + 1,
      }));

      await questionService.bulkCreateQuestions(questionsToCreate);

      // Redirect to quiz management
      navigate('/admin/quizzes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
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
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Create Quiz</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Details */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft dark:shadow-none dark:border dark:border-neutral-700 p-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Quiz Details</h2>

            <div className="space-y-4">
              <FormInput
                label="Quiz Title"
                name="title"
                value={quizForm.title}
                onChange={handleQuizChange}
                required
              />

              <div>
                <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={quizForm.description}
                  onChange={handleQuizChange}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white resize-none"
                  rows={3}
                  placeholder="Enter quiz description"
                />
              </div>

              <FormInput
                label="Subject"
                name="subject"
                value={quizForm.subject}
                onChange={handleQuizChange}
                placeholder="e.g., Mathematics, Science, Programming"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Time Limit (minutes)"
                  name="time_limit"
                  type="number"
                  value={quizForm.time_limit}
                  onChange={handleQuizChange}
                  min="1"
                  required
                />

                <FormInput
                  label="Total Marks"
                  name="total_marks"
                  type="number"
                  value={quizForm.total_marks}
                  onChange={handleQuizChange}
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft dark:shadow-none dark:border dark:border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Questions</h2>
              <Button
                type="button"
                variant="primary"
                size="sm"
                icon={<Plus size={18} />}
                onClick={addQuestion}
              >
                Add Question
              </Button>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={question.tempId}
                  className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4"
                >
                  {/* Question Header */}
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() =>
                      setExpandedQuestion(
                        expandedQuestion === question.tempId ? null : question.tempId
                      )
                    }
                  >
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      Question {index + 1}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveQuestion(question.tempId, 'up');
                        }}
                        disabled={index === 0}
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded disabled:opacity-50"
                      >
                        <ChevronUp size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveQuestion(question.tempId, 'down');
                        }}
                        disabled={index === questions.length - 1}
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded disabled:opacity-50"
                      >
                        <ChevronDown size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeQuestion(question.tempId);
                        }}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                      >
                        <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Question Details */}
                  {expandedQuestion === question.tempId && (
                    <div className="mt-4 space-y-4">
                      <textarea
                        value={question.question_text}
                        onChange={(e) => updateQuestion(question.tempId, 'question_text', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        placeholder="Enter question text"
                        rows={2}
                        required
                      />

                      <div className="grid grid-cols-2 gap-4">
                        {['option_a', 'option_b', 'option_c', 'option_d'].map((opt) => (
                          <input
                            key={opt}
                            type="text"
                            value={question[opt as keyof QuestionForm]}
                            onChange={(e) => updateQuestion(question.tempId, opt, e.target.value)}
                            placeholder={`Option ${opt.toUpperCase().split('_')[1]}`}
                            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                            required
                          />
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                            Correct Answer
                          </label>
                          <select
                            value={question.correct_option}
                            onChange={(e) => updateQuestion(question.tempId, 'correct_option', e.target.value)}
                            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                          >
                            {['A', 'B', 'C', 'D'].map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>

                        <FormInput
                          label="Marks"
                          type="number"
                          value={question.marks}
                          onChange={(e) => updateQuestion(question.tempId, 'marks', parseInt(e.target.value))}
                          min="1"
                          required
                        />
                      </div>

                      <textarea
                        value={question.explanation}
                        onChange={(e) => updateQuestion(question.tempId, 'explanation', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        placeholder="Enter explanation (optional)"
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/quizzes')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Quiz'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};
