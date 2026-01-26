export interface Quiz {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  timeLimit: number; // in minutes
  totalMarks: number;
  isActive: boolean;
  createdAt: string;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  options: string[];
  correctOption: number;
  marks: number;
}

export interface UserAnswer {
  questionId: string;
  selectedOption: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: UserAnswer[];
  score: number;
  totalMarks: number;
  startedAt: string;
  completedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  createdAt: string;
}
