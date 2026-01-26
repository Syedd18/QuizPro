import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { ThemeToggle } from '../components/ThemeToggle';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 transition-colors duration-300">
      {/* Navigation */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-700 transition-colors duration-300">
        <div className="container-max py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 dark:bg-primary-700 rounded-lg flex items-center justify-center">
              <BookOpen size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">QuizPro</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Student Login
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/register')}
            >
              Student SignUp
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/admin/login')}
              className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400"
            >
              Admin Portal
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container-max py-16 sm:py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-20">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Take Control of Your Learning
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 mb-6 sm:mb-8 leading-relaxed max-w-xl">
              QuizPro is a modern, intuitive quiz platform designed for educational excellence. 
              Create, manage, and take quizzes with an industry-grade user experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/register')}
              >
                Start Learning Today
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden lg:block animate-slide-up">
            <div className="bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 rounded-2xl p-8 shadow-medium dark:shadow-none dark:border dark:border-neutral-700 transition-colors duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-subtle dark:shadow-none dark:border dark:border-neutral-700">
                  <div className="h-4 bg-primary-200 dark:bg-primary-800 rounded mb-3"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                </div>
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-subtle dark:shadow-none dark:border dark:border-neutral-700">
                  <div className="h-4 bg-primary-200 dark:bg-primary-800 rounded mb-3"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                </div>
                <div className="col-span-2 bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-subtle dark:shadow-none dark:border dark:border-neutral-700">
                  <div className="h-4 bg-primary-200 dark:bg-primary-800 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Professional Features
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto px-4">
              Everything you need for a seamless quiz experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Real-time Timer',
                description: 'Keep track of time with a visible countdown timer during quizzes',
              },
              {
                title: 'Instant Results',
                description: 'Get immediate feedback on your performance with detailed score breakdowns',
              },
              {
                title: 'Admin Panel',
                description: 'Easily create, edit, and manage quizzes and student scores',
              },
              {
                title: 'Responsive Design',
                description: 'Perfect experience on desktop, tablet, and mobile devices',
              },
              {
                title: 'Secure Authentication',
                description: 'Protect your quiz attempts with a secure login system',
              },
              {
                title: 'Detailed Analytics',
                description: 'Review answers, correct solutions, and track your progress',
              },
            ].map((feature, index) => (
              <div key={index} className="card p-6 hover:shadow-medium dark:hover:shadow-primary-900/20 transition-all duration-200">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-2xl p-8 sm:p-12 text-center text-white shadow-medium dark:shadow-lg dark:shadow-primary-900/30 transition-colors duration-300">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-primary-100 dark:text-primary-200 mb-6 sm:mb-8 text-lg max-w-2xl mx-auto px-4">
            Join thousands of students taking quizzes on QuizPro. Sign up today and start your learning journey.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-white text-primary-600 hover:bg-primary-50"
          >
            Create Your Account <ArrowRight size={20} />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-700 mt-16 sm:mt-20 bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
        <div className="container-max py-8 text-center text-neutral-600 dark:text-neutral-400 text-sm">
          <p>© 2024 QuizPro. Built for educational excellence. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
