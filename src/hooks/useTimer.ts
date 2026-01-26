import { useEffect, useState, useRef } from 'react';

export const useTimer = (initialSeconds: number, onComplete?: () => void) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isActive || seconds === 0) return;

    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          setIsActive(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, seconds, onComplete]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = (newSeconds: number = initialSeconds) => {
    setSeconds(newSeconds);
    setIsActive(false);
  };

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  return {
    seconds,
    minutes,
    displaySeconds,
    isActive,
    isExpired: seconds === 0,
    start,
    pause,
    reset,
  };
};
