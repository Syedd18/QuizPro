import React from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  showAuthButtons?: boolean;
  onSignIn?: () => void;
  onSignUp?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  showAuthButtons = true,
  onSignIn,
  onSignUp,
  onLogout,
  isAuthenticated = false,
}) => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-700 transition-colors duration-300">
      <div className="container-max py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 dark:bg-primary-700 rounded-lg flex items-center justify-center">
            <BookOpen size={24} className="text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">QuizPro</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {showAuthButtons && (
            <>
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  onClick={onLogout}
                  className="text-sm sm:text-base"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={onSignIn}
                    className="text-sm sm:text-base"
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    onClick={onSignUp}
                    className="text-sm sm:text-base"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
