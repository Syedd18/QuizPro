import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ConfirmEmail } from './pages/ConfirmEmail';
import { Dashboard } from './pages/Dashboard';
import { QuizHistory } from './pages/QuizHistory';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminQuizManagement } from './pages/AdminQuizManagement';
import { AdminQuizResults } from './pages/AdminQuizResults';
import { CreateQuiz } from './pages/CreateQuiz';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// Lazy load heavy pages
const Quiz = lazy(() => import('./pages/Quiz').then(m => ({ default: m.Quiz })));
const Results = lazy(() => import('./pages/Results').then(m => ({ default: m.Results })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-950">
    <div className="text-center">
      <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-4"></div>
      <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/quizzes" element={<AdminQuizManagement />} />
            <Route path="/admin/quiz/:quizId/results" element={<AdminQuizResults />} />
            <Route path="/admin/quiz/create" element={<CreateQuiz />} />

            {/* Protected Student Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <QuizHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/:quizId"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <Quiz />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/results/:quizId"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <Results />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Suspense fallback={<PageLoader />}>
                    <Admin />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
