-- Create users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  created_by UUID NOT NULL,
  time_limit INTEGER NOT NULL DEFAULT 60,
  total_marks INTEGER NOT NULL DEFAULT 100,
  is_published BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  marks INTEGER NOT NULL DEFAULT 1,
  explanation TEXT,
  question_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create quiz attempts table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  percentage DECIMAL(5, 2) DEFAULT 0,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('completed', 'in_progress', 'abandoned')),
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  time_taken INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create answers table
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option CHAR(1) CHECK (selected_option IN ('A', 'B', 'C', 'D', NULL)),
  is_correct BOOLEAN DEFAULT FALSE,
  marks_obtained INTEGER DEFAULT 0,
  answered_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_quizzes_created_by ON public.quizzes(created_by);
CREATE INDEX idx_quizzes_published ON public.quizzes(is_published);
CREATE INDEX idx_questions_quiz_id ON public.questions(quiz_id);
CREATE INDEX idx_quiz_attempts_student_id ON public.quiz_attempts(student_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX idx_answers_attempt_id ON public.answers(attempt_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Permissive for development/mock auth
-- Allow all operations for development purposes
CREATE POLICY "Allow all operations on user_profiles" ON public.user_profiles
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on quizzes" ON public.quizzes
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on questions" ON public.questions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on quiz_attempts" ON public.quiz_attempts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on answers" ON public.answers
  FOR ALL USING (true) WITH CHECK (true);
