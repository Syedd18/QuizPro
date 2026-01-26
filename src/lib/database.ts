import { supabase } from './supabase';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  created_by: string;
  time_limit: number;
  total_marks: number;
  is_published: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  question_count?: number;
}

export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  marks: number;
  explanation: string;
  question_order: number;
}

export interface QuizAttempt {
  id: string;
  student_id: string;
  quiz_id: string;
  score: number;
  percentage: number;
  status: string;
  started_at: string;
  completed_at: string;
  time_taken: number;
}

export interface Answer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option: string;
  is_correct: boolean;
  marks_obtained: number;
}

// ===== QUIZ OPERATIONS =====

export const quizService = {
  // Create a new quiz
  async createQuiz(quiz: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('quizzes')
      .insert([quiz])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Get all quizzes
  async getAllQuizzes() {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  // Get published quizzes for students
  async getPublishedQuizzes() {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('is_published', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  // Get quiz by ID with questions count
  async getQuizById(quizId: string) {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (error) throw new Error(error.message);

    // Get question count
    const { count } = await supabase
      .from('questions')
      .select('*', { count: 'exact' })
      .eq('quiz_id', quizId);

    return { ...data, question_count: count };
  },

  // Update quiz
  async updateQuiz(quizId: string, updates: Partial<Quiz>) {
    const { data, error } = await supabase
      .from('quizzes')
      .update(updates)
      .eq('id', quizId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Delete quiz
  async deleteQuiz(quizId: string) {
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', quizId);

    if (error) throw new Error(error.message);
  },

  // Toggle quiz publication status
  async toggleQuizPublish(quizId: string, isPublished: boolean) {
    return this.updateQuiz(quizId, { is_published: isPublished });
  },

  // Get quizzes created by admin
  async getAdminQuizzes(adminId: string) {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('created_by', adminId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },
};

// ===== QUESTION OPERATIONS =====

export const questionService = {
  // Create a new question
  async createQuestion(question: Omit<Question, 'id'>) {
    const { data, error } = await supabase
      .from('questions')
      .insert([question])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Get questions for a quiz
  async getQuestionsByQuizId(quizId: string) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('question_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  // Get question by ID
  async getQuestionById(questionId: string) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Update question
  async updateQuestion(questionId: string, updates: Partial<Question>) {
    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', questionId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Delete question
  async deleteQuestion(questionId: string) {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', questionId);

    if (error) throw new Error(error.message);
  },

  // Bulk insert questions
  async bulkCreateQuestions(questions: Omit<Question, 'id'>[]) {
    const { data, error } = await supabase
      .from('questions')
      .insert(questions)
      .select();

    if (error) throw new Error(error.message);
    return data;
  },
};

// ===== QUIZ ATTEMPT OPERATIONS =====

export const attemptService = {
  // Start a quiz attempt
  async startAttempt(studentId: string, quizId: string) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert([
        {
          student_id: studentId,
          quiz_id: quizId,
          status: 'in_progress',
          started_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Get attempt by ID
  async getAttemptById(attemptId: string) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('id', attemptId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Complete attempt and calculate score
  async completeAttempt(attemptId: string, timeTaken: number) {
    const attempt = await this.getAttemptById(attemptId);

    // Get all answers for this attempt
    const { data: answers } = await supabase
      .from('answers')
      .select('*')
      .eq('attempt_id', attemptId);

    // Calculate total score
    const totalScore = answers?.reduce((sum, ans) => sum + (ans.marks_obtained || 0), 0) || 0;

    // Get quiz total marks
    const quiz = await quizService.getQuizById(attempt.quiz_id);
    const percentage = (totalScore / quiz.total_marks) * 100;

    // Update attempt
    const { data, error } = await supabase
      .from('quiz_attempts')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        score: totalScore,
        percentage: Math.round(percentage * 100) / 100,
        time_taken: timeTaken,
      })
      .eq('id', attemptId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Get all attempts for a student
  async getStudentAttempts(studentId: string) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*, quizzes:quiz_id(title, subject)')
      .eq('student_id', studentId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  // Get all attempts for a quiz
  async getQuizAttempts(quizId: string) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*, user_profiles:student_id(name, email)')
      .eq('quiz_id', quizId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  // Get student attempts for a specific quiz
  async getStudentQuizAttempts(studentId: string, quizId: string) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('student_id', studentId)
      .eq('quiz_id', quizId)
      .order('completed_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  // Submit answers and complete attempt
  async submitAnswers(
    attemptId: string,
    answers: Array<{
      attempt_id: string;
      question_id: string;
      selected_option: string;
      is_correct: boolean;
      marks_obtained: number;
    }>,
    score: number
  ) {
    // Save all answers
    const { error: insertError } = await supabase
      .from('answers')
      .insert(answers);

    if (insertError) throw new Error(insertError.message);

    // Get the attempt to find quiz_id
    const attempt = await this.getAttemptById(attemptId);

    // Get quiz to calculate percentage
    const quiz = await quizService.getQuizById(attempt.quiz_id);
    const percentage = (score / quiz.total_marks) * 100;

    // Complete the attempt
    const { data, error } = await supabase
      .from('quiz_attempts')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        score: score,
        percentage: Math.round(percentage * 100) / 100,
      })
      .eq('id', attemptId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};

// ===== ANSWER OPERATIONS =====

export const answerService = {
  // Save an answer
  async saveAnswer(answer: Omit<Answer, 'id'>) {
    const { data, error } = await supabase
      .from('answers')
      .insert([answer])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Update answer
  async updateAnswer(answerId: string, updates: Partial<Answer>) {
    const { data, error } = await supabase
      .from('answers')
      .update(updates)
      .eq('id', answerId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Get answers for an attempt
  async getAttemptAnswers(attemptId: string) {
    const { data, error } = await supabase
      .from('answers')
      .select('*, questions:question_id(*)')
      .eq('attempt_id', attemptId)
      .order('answered_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  // Check or update answer correctness
  async updateAnswerCorrectness(answerId: string, isCorrect: boolean, marksObtained: number) {
    return this.updateAnswer(answerId, {
      is_correct: isCorrect,
      marks_obtained: marksObtained,
    });
  },

  // Bulk save answers
  async bulkSaveAnswers(answers: Omit<Answer, 'id'>[]) {
    const { data, error } = await supabase
      .from('answers')
      .insert(answers)
      .select();

    if (error) throw new Error(error.message);
    return data;
  },
};
