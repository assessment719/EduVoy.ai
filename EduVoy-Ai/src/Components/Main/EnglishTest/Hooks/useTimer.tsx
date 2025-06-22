import { useState, useRef, useEffect, useCallback } from 'react';

export interface TimerConfig {
  initialTime: number;
  onTimeEnd?: () => void;
  enableBuffer?: boolean;
  bufferDuration?: number; // default 10 seconds
  onBufferStart?: () => void;
  onBufferEnd?: () => void;
  testPart?: string;
}

export interface TimerState {
  time: number;
  isRunning: boolean;
  isBufferActive: boolean;
  bufferCountdown: number;
}

export interface TimerControls {
  start: () => void;
  stop: () => void;
  reset: () => void;
  restart: () => void;
  formatTime: (time: number) => string;
}

export const useTimer = (config: TimerConfig): TimerState & TimerControls => {
  const {
    initialTime,
    onTimeEnd,
    enableBuffer = false,
    bufferDuration = 10,
    onBufferStart,
    onBufferEnd,
    testPart = 'partA'
  } = config;

  const [time, setTime] = useState(() => {
    // Ensure initialTime is a valid number
    if (typeof initialTime !== 'number' || isNaN(initialTime) || initialTime < 0) {
      console.warn('Invalid initialTime provided to useTimer:', initialTime);
      return 0;
    }
    return initialTime;
  });
  const [isRunning, setIsRunning] = useState(false);
  const [isBufferActive, setIsBufferActive] = useState(false);
  const [bufferCountdown, setBufferCountdown] = useState(0);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const bufferIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const nextBufferTimeRef = useRef<number>(0);

  // Calculate buffer trigger interval based on test part
  const getBufferTriggerInterval = useCallback(() => {
    if (!enableBuffer) return 0;
    return testPart === 'partC' ? 60 : 30;
  }, [enableBuffer, testPart]);

  // Format time helper
  const formatTime = useCallback((timeInSeconds: number) => {
    // Handle edge cases
    if (typeof timeInSeconds !== 'number' || isNaN(timeInSeconds) || timeInSeconds < 0) {
      return '0:00';
    }
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Stop all timers
  const stopAllTimers = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (bufferIntervalRef.current) {
      clearInterval(bufferIntervalRef.current);
      bufferIntervalRef.current = null;
    }
    setIsRunning(false);
    setIsBufferActive(false);
  }, []);

  // Trigger buffer countdown
  const triggerBuffer = useCallback(() => {
    onBufferStart?.();
    setIsBufferActive(true);
    setBufferCountdown(bufferDuration);

    let countdown = bufferDuration;
    bufferIntervalRef.current = setInterval(() => {
      countdown -= 1;
      setBufferCountdown(countdown);

      if (countdown <= 0) {
        clearInterval(bufferIntervalRef.current!);
        bufferIntervalRef.current = null;
        setIsBufferActive(false);
        onBufferEnd?.();
        
        // Resume main timer and calculate next buffer time
        const triggerInterval = getBufferTriggerInterval();
        nextBufferTimeRef.current = Math.max(0, nextBufferTimeRef.current - triggerInterval);
        startMainTimer();
      }
    }, 1000);
  }, [bufferDuration, onBufferStart, onBufferEnd, getBufferTriggerInterval]);

  // Start main timer
  const startMainTimer = useCallback(() => {
    timerIntervalRef.current = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          stopAllTimers();
          onTimeEnd?.();
          return 0;
        }

        const newTime = prevTime - 1;

        // Check if buffer should be triggered
        if (enableBuffer && !isBufferActive && newTime <= nextBufferTimeRef.current && nextBufferTimeRef.current > 0) {
          clearInterval(timerIntervalRef.current!);
          timerIntervalRef.current = null;
          triggerBuffer();
          return newTime;
        }

        return newTime;
      });
    }, 1000);
  }, [enableBuffer, isBufferActive, onTimeEnd, stopAllTimers, triggerBuffer]);

  // Start timer
  const start = useCallback(() => {
    if (isRunning || time <= 0) return;

    setIsRunning(true);

    if (enableBuffer) {
      // Set initial buffer trigger time if not already set
      if (nextBufferTimeRef.current === 0) {
        const triggerInterval = getBufferTriggerInterval();
        nextBufferTimeRef.current = time - triggerInterval;
      }
    }

    startMainTimer();
  }, [isRunning, time, enableBuffer, getBufferTriggerInterval, startMainTimer]);

  // Stop timer
  const stop = useCallback(() => {
    stopAllTimers();
  }, [stopAllTimers]);

  // Reset timer
  const reset = useCallback(() => {
    stopAllTimers();
    
    // Ensure initialTime is valid when resetting
    const validInitialTime = typeof initialTime === 'number' && !isNaN(initialTime) && initialTime >= 0 
      ? initialTime 
      : 0;
    
    setTime(validInitialTime);
    setBufferCountdown(0);
    setIsBufferActive(false);
    
    if (enableBuffer && validInitialTime > 0) {
      const triggerInterval = getBufferTriggerInterval();
      nextBufferTimeRef.current = validInitialTime - triggerInterval;
    } else {
      nextBufferTimeRef.current = 0;
    }
  }, [initialTime, enableBuffer, getBufferTriggerInterval, stopAllTimers]);

  // Restart timer (reset + start)
  const restart = useCallback(() => {
    stopAllTimers();
    
    // Ensure initialTime is valid when restarting
    const validInitialTime = typeof initialTime === 'number' && !isNaN(initialTime) && initialTime >= 0 
      ? initialTime 
      : 0;
    
    if (validInitialTime <= 0) return;
    
    setTime(validInitialTime);
    setBufferCountdown(0);
    setIsBufferActive(false);
    setIsRunning(true);
    
    if (enableBuffer) {
      const triggerInterval = getBufferTriggerInterval();
      nextBufferTimeRef.current = validInitialTime - triggerInterval;
    } else {
      nextBufferTimeRef.current = 0;
    }

    // Start the main timer
    timerIntervalRef.current = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          stopAllTimers();
          onTimeEnd?.();
          return 0;
        }

        const newTime = prevTime - 1;

        // Check if buffer should be triggered
        if (enableBuffer && !isBufferActive && newTime <= nextBufferTimeRef.current && nextBufferTimeRef.current > 0) {
          clearInterval(timerIntervalRef.current!);
          timerIntervalRef.current = null;
          triggerBuffer();
          return newTime;
        }

        return newTime;
      });
    }, 1000);
  }, [initialTime, enableBuffer, getBufferTriggerInterval, stopAllTimers, onTimeEnd, isBufferActive, triggerBuffer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllTimers();
    };
  }, [stopAllTimers]);

  return {
    time,
    isRunning,
    isBufferActive,
    bufferCountdown,
    start,
    stop,
    reset,
    restart,
    formatTime
  };
};