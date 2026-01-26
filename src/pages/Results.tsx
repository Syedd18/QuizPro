import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Check, X, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { attemptService, answerService, quizService, questionService } from '../lib/database';
import type { Question } from '../lib/database';

interface AnswerDetail {
  question_id: string;
  selected_option: string;
  is_correct: boolean;
  marks_obtained: number;
}

export const Results: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { attemptId: string; score: number; totalMarks: number } | undefined;

  const [printMode, setPrintMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [answers, setAnswers] = useState<AnswerDetail[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quiz, setQuiz] = useState<any>(null);

  useEffect(() => {
    loadResultsData();
  }, [quizId, state?.attemptId]);

  const loadResultsData = async () => {
    try {
      setLoading(true);
      
      // If no attempt ID in state, redirect
      if (!state?.attemptId || !quizId) {
        navigate('/dashboard');
        return;
      }

      // Load attempt details
      const attemptData = await attemptService.getAttemptById(state.attemptId);
      setAttempt(attemptData);

      // Load quiz details
      const quizData = await quizService.getQuizById(quizId);
      setQuiz(quizData);

      // Load questions
      const questionsData = await questionService.getQuestionsByQuizId(quizId);
      setQuestions(questionsData || []);

      // Load answers for this attempt
      const answersData = await answerService.getAttemptAnswers(state.attemptId);
      setAnswers(answersData || []);
    } catch (err) {
      console.error('Failed to load results:', err);
      setError('Failed to load results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintableView = () => {
    setPrintMode(!printMode);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz || !attempt) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-4">{error || 'Results not found'}</p>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const correctCount = answers.filter(a => a.is_correct).length;
  const wrongCount = answers.length - correctCount;
  const percentage = (state?.score || 0) / (state?.totalMarks || 1) * 100;

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className={`min-h-screen ${printMode ? 'bg-white' : 'bg-neutral-50 dark:bg-neutral-950'}`}>
      {/* Header */}
      {!printMode && (
        <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 transition-colors sticky top-0 z-10">
          <div className="container-max py-2.5 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen size={18} className="sm:w-5 sm:h-5 text-white" />
                </div>
                <h1 className="text-base sm:text-2xl font-bold text-neutral-900 dark:text-white truncate">Results</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrintableView}
                  className="text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Print</span>
                  <span className="sm:hidden">Print</span>
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Print Mode Header */}
      {printMode && (
        <div className="bg-neutral-100 border-b border-neutral-300 p-3 sm:p-4 flex justify-between items-center sticky top-0 z-50">
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900">Print Preview</h2>
          <button
            onClick={() => setPrintMode(false)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-xs sm:text-sm"
          >
            Close
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className={`${printMode ? '' : 'container-max py-4 sm:py-8'}`}>
        <div className={`${printMode ? 'p-4 sm:p-8 max-w-4xl mx-auto' : 'max-w-4xl mx-auto'}`}>
          {!printMode && (
            <Button
              variant="ghost"
              icon={<ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />}
              onClick={() => navigate('/dashboard')}
              className="mb-4 sm:mb-8"
            >
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden text-xs">Back</span>
            </Button>
          )}

          {/* Score Card */}
          <div className={`${printMode ? 'border border-neutral-300' : 'card'} p-4 sm:p-8 mb-4 sm:mb-8`}>
            <div className="text-center mb-4 sm:mb-8">
              <h2 className="text-base sm:text-2xl font-semibold text-neutral-900 dark:text-white mb-1 sm:mb-2">Quiz Completed!</h2>
              <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 truncate">Results for {quiz?.title}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 sm:gap-6 mb-4 sm:mb-8">
              {/* Score */}
              <div className={`p-3 sm:p-6 rounded-lg sm:rounded-xl text-center ${printMode ? 'border border-neutral-300' : 'bg-primary-50 dark:bg-primary-900/20'}`}>
                <div className={`text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 ${getGradeColor(percentage)}`}>
                  {Math.round(percentage)}%
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Your Score</p>
              </div>

              {/* Marks */}
              <div className={`p-3 sm:p-6 rounded-lg sm:rounded-xl text-center ${printMode ? 'border border-neutral-300' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                <div className="text-2xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">
                  {state?.score || 0}/{state?.totalMarks || 0}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Marks</p>
              </div>

              {/* Questions */}
              <div className={`p-3 sm:p-6 rounded-lg sm:rounded-xl text-center ${printMode ? 'border border-neutral-300' : 'bg-green-50 dark:bg-green-900/20'}`}>
                <div className="text-2xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2">
                  {correctCount}/{answers.length}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Correct</p>
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 sm:pt-6">
              <div className="grid grid-cols-3 gap-1 sm:gap-4 text-center">
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400 mb-0.5 sm:mb-1">{correctCount}</div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Correct</p>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400 mb-0.5 sm:mb-1">{wrongCount}</div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Wrong</p>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-neutral-600 dark:text-neutral-400 mb-0.5 sm:mb-1">
                    {(answers.length - correctCount - wrongCount) || 0}
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Unanswered</p>
                </div>
              </div>
            </div>
          </div>

          {/* Answer Review */}
          <div>
            <h3 className="text-base sm:text-xl font-semibold text-neutral-900 dark:text-white mb-3 sm:mb-6">Answer Review</h3>

            <div className="space-y-2 sm:space-y-4">
              {questions.map((question, index) => {
                const answer = answers.find(a => a.question_id === question.id);
                const isCorrect = answer?.is_correct;
                const isAnswered = answer !== undefined;
                const optionMap: { [key: string]: string } = {
                  'A': question.option_a,
                  'B': question.option_b,
                  'C': question.option_c,
                  'D': question.option_d,
                };

                return (
                  <div
                    key={question.id}
                    className={`${printMode ? 'border border-neutral-300' : 'card'} p-3 sm:p-6`}
                  >
                    {/* Question */}
                    <div className="flex items-start gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <div className={`flex-shrink-0 w-5 h-5 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-semibold text-white text-xs sm:text-base ${
                        isCorrect ? 'bg-green-600' : isAnswered ? 'bg-red-600' : 'bg-neutral-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs sm:text-base text-neutral-900 dark:text-white leading-relaxed">{question.question_text}</p>
                        {isCorrect && (
                          <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2 text-green-600 dark:text-green-400">
                            <Check size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="text-xs sm:text-sm">Correct</span>
                          </div>
                        )}
                        {isAnswered && !isCorrect && (
                          <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2 text-red-600 dark:text-red-400">
                            <X size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="text-xs sm:text-sm">Incorrect</span>
                          </div>
                        )}
                        {!isAnswered && (
                          <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2 text-neutral-500 dark:text-neutral-400">
                            <X size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="text-xs sm:text-sm">Not Answered</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Options */}
                    <div className="ml-4 sm:ml-12 space-y-1.5 sm:space-y-2">
                      {['A', 'B', 'C', 'D'].map((key) => {
                        const isCorrectOption = key === question.correct_option;
                        const isSelected = answer?.selected_option === key;

                        return (
                          <div
                            key={key}
                            className={`p-2 sm:p-3 rounded-lg border-2 ${
                              isCorrectOption
                                ? 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/20'
                                : isSelected && !isCorrect
                                ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20'
                                : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                            }`}
                          >
                            <div className="flex items-start gap-1.5 sm:gap-3">
                              {isCorrectOption && (
                                <Check size={14} className="sm:w-4 sm:h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                              )}
                              {isSelected && !isCorrect && (
                                <X size={14} className="sm:w-4 sm:h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                              )}
                              {!isCorrectOption && !isSelected && (
                                <div className="w-4 flex-shrink-0" />
                              )}
                              <span className={`text-xs sm:text-sm leading-relaxed break-words ${
                                isCorrectOption ? 'text-green-900 dark:text-green-100 font-semibold' : 'text-neutral-700 dark:text-neutral-300'
                              }`}>
                                <span className="font-semibold">({key})</span> {optionMap[key]}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Buttons */}
          {!printMode && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6 sm:mt-8 justify-center">
              <Button variant="primary" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto">
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden text-xs">Back to Dashboard</span>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
