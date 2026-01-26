import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { Timer } from '../components/Timer';
import { ProgressBar } from '../components/ProgressBar';
import { Alert } from '../components/Alert';
import { useTimer } from '../hooks/useTimer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { quizService, questionService, attemptService } from '../lib/database';
import type { Quiz as QuizType, Question } from '../lib/database';

interface Answer {
  questionId: string;
  selectedOption: string; // 'A', 'B', 'C', 'D'
}

export const Quiz: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useLocalStorage<Answer[]>(`quiz_${quizId}_answers`, []);
  const [submitted, setSubmitted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [timer, setTimer] = useState<ReturnType<typeof useTimer> | null>(null);

  // Load quiz and questions from database
  useEffect(() => {
    loadQuizData();
  }, [quizId]);

  const loadQuizData = async () => {
    if (!quizId) return;
    try {
      setLoading(true);
      const quizData = await quizService.getQuizById(quizId);
      const questionsData = await questionService.getQuestionsByQuizId(quizId);
      
      setQuiz(quizData);
      setQuestions(questionsData || []);

      // Start a quiz attempt
      const studentId = '00000000-0000-0000-0000-000000000002'; // Mock student ID
      const attempt = await attemptService.startAttempt(studentId, quizId);
      setAttemptId(attempt.id);
    } catch (err) {
      console.error('Failed to load quiz:', err);
      setError('Failed to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Only initialize timer after quiz is loaded
  const timerHook = useTimer(
    quiz ? quiz.time_limit * 60 : 3600, // Default to 1 hour if quiz not loaded yet
    () => {
      setSubmitted(true);
      setShowWarning(true);
    }
  );

  useEffect(() => {
    if (quiz && !timer) {
      // Initialize timer only once when quiz loads
      setTimer(timerHook);
      timerHook.reset(quiz.time_limit * 60);
      timerHook.start();
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        timerHook.pause();
      };
    }
  }, [quiz, timer]);

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (!submitted) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  const handleSelectOption = (option: string) => {
    if (submitted) return;

    setAnswers(prevAnswers => {
      const existingAnswer = prevAnswers.find(a => a.questionId === currentQuestion.id);
      if (existingAnswer) {
        return prevAnswers.map(a =>
          a.questionId === currentQuestion.id ? { ...a, selectedOption: option } : a
        );
      }
      return [...prevAnswers, { questionId: currentQuestion.id, selectedOption: option }];
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (timer) {
      timer.pause();
    }
    setSubmitted(true);

    try {
      // Calculate score
      let score = 0;
      const answerResults = answers.map((answer) => {
        const question = questions.find(q => q.id === answer.questionId);
        if (question && answer.selectedOption === question.correct_option) {
          score += question.marks;
          return {
            questionId: answer.questionId,
            isCorrect: true,
            marksObtained: question.marks,
          };
        }
        return {
          questionId: answer.questionId,
          isCorrect: false,
          marksObtained: 0,
        };
      });

      console.log('Submitting with score:', score);
      console.log('Answer records:', answerResults);

      // Save answers to database
      if (attemptId) {
        const answerRecords = answers.map((answer) => {
          const result = answerResults.find(r => r.questionId === answer.questionId);
          return {
            attempt_id: attemptId,
            question_id: answer.questionId,
            selected_option: answer.selectedOption,
            is_correct: result?.isCorrect || false,
            marks_obtained: result?.marksObtained || 0,
          };
        });

        console.log('Saving answers to database:', answerRecords);
        const submitResult = await attemptService.submitAnswers(attemptId, answerRecords, score);
        console.log('Submit result:', submitResult);
      }

      // Navigate to results with data
      setTimeout(() => {
        navigate(`/results/${quizId}`, {
          state: { attemptId, score, totalMarks: quiz?.total_marks },
        });
      }, 800);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      setError('Failed to submit quiz. Please try again.');
      setSubmitted(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz || !currentQuestion) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-4">{error || 'Quiz not found'}</p>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
  const selectedOption = currentAnswer?.selectedOption;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-20 transition-colors duration-300">
        <div className="container-max py-2.5 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />}
                onClick={() => {
                  if (window.confirm('Are you sure? Your progress will be lost.')) {
                    navigate('/dashboard');
                  }
                }}
                aria-label="Back to dashboard"
              >
                <span className="hidden sm:inline text-xs sm:text-sm">Back</span>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="font-semibold text-xs sm:text-base text-neutral-900 dark:text-white truncate">{quiz.title}</h1>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Q {currentQuestionIndex + 1}/{questions.length}</p>
              </div>
            </div>

            <Timer 
              minutes={timer?.minutes ?? 0} 
              seconds={timer?.displaySeconds ?? 0} 
              isExpired={timer?.isExpired ?? false} 
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-max py-3 sm:py-8">
        {showWarning && timer?.isExpired && (
          <Alert
            type="warning"
            title="Time's Up!"
            message="Your quiz time has expired. Your answers will be submitted now."
          />
        )}

        <div className="max-w-3xl mx-auto animate-fade-in">
          {/* Progress */}
          <ProgressBar current={currentQuestionIndex + 1} total={questions.length} className="mb-4 sm:mb-8" />

          {/* Question Card */}
          <div className="card p-4 sm:p-8 mb-4 sm:mb-8">
            <h2 className="text-base sm:text-2xl font-semibold text-neutral-900 dark:text-white mb-4 sm:mb-8 leading-relaxed">
              {currentQuestion.question_text}
            </h2>

            {/* Options */}
            <div className="space-y-2 sm:space-y-3">
              {[
                { key: 'A', text: currentQuestion.option_a },
                { key: 'B', text: currentQuestion.option_b },
                { key: 'C', text: currentQuestion.option_c },
                { key: 'D', text: currentQuestion.option_d },
              ].map(({ key, text }) => (
                <button
                  key={key}
                  onClick={() => handleSelectOption(key)}
                  disabled={submitted}
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left flex items-start sm:items-center gap-2.5 sm:gap-4 min-h-[44px] sm:min-h-auto ${
                    selectedOption === key
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600'
                  } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
                  aria-pressed={selectedOption === key}
                  role="radio"
                >
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 sm:mt-0 ${
                      selectedOption === key
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-neutral-300 dark:border-neutral-600'
                    }`}
                  >
                    {selectedOption === key && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />}
                  </div>
                  <span className="text-xs sm:text-base text-neutral-900 dark:text-neutral-100 line-clamp-3 sm:line-clamp-none">{text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 || submitted}
              className="w-full sm:w-auto"
            >
              <span className="hidden sm:inline">← Previous</span>
              <span className="sm:hidden text-xs">Previous</span>
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={submitted || timer?.isExpired}
                isLoading={submitted}
                className="w-full sm:w-auto"
              >
                <span className="hidden sm:inline">Submit Quiz</span>
                <span className="sm:hidden text-xs">Submit</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={submitted}
                className="w-full sm:w-auto"
              >
                <span className="hidden sm:inline">Next →</span>
                <span className="sm:hidden text-xs">Next</span>
              </Button>
            )}
          </div>

          {/* Question Counter Mobile */}
          <div className="mt-4 sm:mt-6 text-center text-xs text-neutral-600 dark:text-neutral-400 sm:hidden">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
      </main>
    </div>
  );
};
