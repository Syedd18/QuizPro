import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { ThemeToggle } from '../components/ThemeToggle';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../contexts/AuthContext';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, error: authError } = useAuth();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { values, errors, isSubmitting, handleChange, handleSubmit, setFieldError } = useForm(
    { name: '', email: '', password: '', confirmPassword: '' },
    async (values) => {
      // Validate inputs
      let hasErrors = false;

      if (!values.name.trim()) {
        setFieldError('name', 'Name is required');
        hasErrors = true;
      }

      if (!values.email) {
        setFieldError('email', 'Email is required');
        hasErrors = true;
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        setFieldError('email', 'Please enter a valid email address');
        hasErrors = true;
      }

      if (!values.password) {
        setFieldError('password', 'Password is required');
        hasErrors = true;
      } else if (values.password.length < 6) {
        setFieldError('password', 'Password must be at least 6 characters');
        hasErrors = true;
      }

      if (!values.confirmPassword) {
        setFieldError('confirmPassword', 'Please confirm your password');
        hasErrors = true;
      } else if (values.password !== values.confirmPassword) {
        setFieldError('confirmPassword', 'Passwords do not match');
        hasErrors = true;
      }

      if (hasErrors) return;

      try {
        // Sign up with Supabase
        await signUp(values.email, values.password, values.name);
        setAlert({ type: 'success', message: 'Account created successfully! Redirecting to email confirmation...' });
        setTimeout(() => navigate('/confirm-email'), 2000);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
        setAlert({ type: 'error', message });
      }
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50/50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950/50 flex flex-col items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden" style={{ backgroundAttachment: 'fixed' }}>
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary-300/10 dark:bg-primary-500/5 rounded-full blur-3xl opacity-60 animate-float"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300/10 dark:bg-blue-500/5 rounded-full blur-3xl opacity-60 animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Back button - top left */}
      <div className="absolute top-4 left-4 z-50 animate-slide-left">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          icon={<ArrowLeft size={20} />}
        >
          <span className="hidden sm:inline text-xs sm:text-sm">Back</span>
        </Button>
      </div>

      {/* Theme toggle - top right */}
      <div className="absolute top-4 right-4 z-50 animate-slide-right">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 animate-float">
              <BookOpen size={28} className="text-white" />
            </div>
            <span className="text-3xl font-bold gradient-text">QuizPro</span>
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-3">Get Started</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">Create your account to begin taking quizzes</p>
        </div>

        {/* Alert */}
        {alert && (
          <div className="mb-6 animate-scale-in">
            <Alert
              type={alert.type}
              title={alert.type === 'success' ? 'Success' : 'Error'}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="card-elevated p-8 space-y-5 animate-scale-in shadow-xl">
          <FormInput
            label="Full Name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            required
            autoComplete="name"
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoComplete="email"
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            required
            autoComplete="new-password"
          />

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />

          <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
            Create Account
          </Button>

          <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors duration-200 hover:underline">
              Sign in
            </Link>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-500 dark:text-neutral-500 mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          By creating an account, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};
