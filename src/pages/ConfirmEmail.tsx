import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Mail, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { ThemeToggle } from '../components/ThemeToggle';
import { supabase } from '../lib/supabase';

export const ConfirmEmail: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isResent, setIsResent] = useState(false);

  useEffect(() => {
    // Get email from session or redirect
    const checkEmail = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setEmail(session.user.email);
      } else {
        navigate('/register');
      }
    };
    checkEmail();
  }, [navigate]);

  const handleResendEmail = async () => {
    try {
      setResendLoading(true);
      const { error } = await supabase.auth.resendIdentityConfirmationLink({
        email,
        type: 'email_change',
      });

      if (error) throw error;
      setIsResent(true);
      setMessage('Confirmation email resent! Check your inbox.');
      setTimeout(() => setIsResent(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to resend email';
      setMessage(msg);
    } finally {
      setResendLoading(false);
    }
  };

  const handleSkipForNow = async () => {
    // For development: allow skipping email confirmation
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      // Store user data and allow access
      localStorage.setItem('userRole', 'user');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 dark:from-neutral-950 dark:to-neutral-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      {/* Theme toggle - top right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <div className="w-9 sm:w-10 h-9 sm:h-10 bg-primary-600 dark:bg-primary-700 rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">QuizPro</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-1 sm:mb-2">Confirm Your Email</h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">We've sent a confirmation link to your email</p>
        </div>

        {/* Message Box */}
        {message && (
          <div className="mb-4 sm:mb-6">
            <Alert
              type={isResent ? 'success' : 'error'}
              title={isResent ? 'Resent' : 'Info'}
              message={message}
              onClose={() => setMessage('')}
            />
          </div>
        )}

        {/* Content Card */}
        <div className="card p-4 sm:p-8 space-y-4 sm:space-y-6">
          <div className="text-center">
            <div className="w-14 sm:w-16 h-14 sm:h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Mail size={28} className="sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 mb-1 sm:mb-2">
              Check your email at:
            </p>
            <p className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white break-all">
              {email}
            </p>
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 sm:p-4 border border-primary-200 dark:border-primary-800">
            <div className="flex gap-2 sm:gap-3">
              <CheckCircle size={18} className="sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                <p className="font-semibold mb-0.5 sm:mb-1">Click the link in your email to confirm</p>
                <p>Once confirmed, you can log in to your account and start taking quizzes.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={handleResendEmail}
              disabled={resendLoading}
              className="text-sm sm:text-base"
            >
              {resendLoading ? 'Resending...' : 'Resend Confirmation Email'}
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={handleSkipForNow}
              className="text-sm sm:text-base"
            >
              Continue to Dashboard (Dev Mode)
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={handleResendEmail}
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                try again
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
