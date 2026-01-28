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
        <div className="container-max py-3 sm:py-4 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 sm:w-10 h-9 sm:h-10 bg-primary-600 dark:bg-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-white">QuizPro</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-4">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="hidden sm:flex"
            >
              Login
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/register')}
              className="hidden md:flex"
            >
              SignUp
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/register')}
              className="md:hidden"
            >
              Start
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/login')}
              className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20 flex-shrink-0"
            >
              <span className="hidden sm:inline">Admin</span>
              <span className="sm:hidden">👤</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container-max px-3 sm:px-6 py-8 sm:py-16 md:py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center mb-12 sm:mb-20">
          <div className="animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
              Take Control of Your Learning
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-4 sm:mb-6 md:mb-8 leading-relaxed max-w-xl">
              QuizPro is a modern, intuitive quiz platform designed for educational excellence. 
              Create, manage, and take quizzes with an industry-grade user experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto"
              >
                Start Learning
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto"
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
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-500 dark:to-blue-600 rounded-2xl p-8 sm:p-12 text-center text-white shadow-medium dark:shadow-lg dark:shadow-primary-900/40 transition-colors duration-300">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-primary-100 dark:text-primary-100 mb-6 sm:mb-8 text-lg max-w-2xl mx-auto px-4">
            Join thousands of students taking quizzes on QuizPro. Sign up today and start your learning journey.
          </p>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-white dark:bg-white text-primary-600 dark:text-primary-700 hover:bg-neutral-100 dark:hover:bg-neutral-50 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 min-h-[56px]"
          >
            Create Your Account <ArrowRight size={22} />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-700 mt-16 sm:mt-20 bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
        <div className="container-max py-8 text-center text-neutral-600 dark:text-neutral-400 text-sm">
          <p>© 2026 QuizPro. Made by Anany Singh</p>
        </div>
      </footer>
    </div>
  );
};
