import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { FormInput } from '../components/FormInput';
import { ThemeToggle } from '../components/ThemeToggle';
import { Alert } from '../components/Alert';

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      if (
        formData.username === ADMIN_CREDENTIALS.username &&
        formData.password === ADMIN_CREDENTIALS.password
      ) {
        // Store admin session with a fixed UUID (must match what's in user_profiles table)
        const adminUUID = '00000000-0000-0000-0000-000000000001';
        localStorage.setItem(
          'adminSession',
          JSON.stringify({
            id: adminUUID,
            username: 'admin',
            role: 'admin',
            loginTime: new Date().toISOString(),
          })
        );
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-neutral-50 dark:from-neutral-950 dark:to-neutral-900 flex flex-col items-center justify-center px-3 py-8 sm:p-4 transition-colors duration-300">
      {/* Top controls (back + theme) - placed inside container so visible on mobile */}

      <div className="w-full max-w-sm sm:max-w-md">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            icon={<ArrowLeft size={20} />}
            className="px-2 py-1"
          >
            <span className="hidden sm:inline text-xs sm:text-sm">Back</span>
          </Button>
          <ThemeToggle />
        </div>
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-red-600 dark:bg-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen size={20} className="sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-white truncate">QuizPro</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-1">Admin Portal</h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Manage quizzes and results</p>
        </div>

        {/* Alert */}
        {error && (
          <div className="mb-3 sm:mb-6">
            <Alert
              type="error"
              title="Authentication Error"
              message={error}
              onClose={() => setError(null)}
            />
          </div>
        )}

        {/* Demo credentials removed for security */}

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-3 sm:p-8 space-y-3 sm:space-y-6">
          <FormInput
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter admin username"
            required
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter admin password"
            required
          />

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            size="md"
            className="w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-3 sm:mt-6 text-center">
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">
            Student?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
