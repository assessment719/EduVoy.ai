import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface Stat {
  title: string;
  value: number;
  description: string;
  prefix?: string;
  suffix?: string;
}

interface AnimatedNumberProps {
  stat: Stat;
  index: number;
}

const AnimatedStatCard: React.FC<AnimatedNumberProps> = ({ stat, index }) => {
  const countRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const countValueRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const startCounting = () => {
      if (hasAnimated.current || !countRef.current) return;
      hasAnimated.current = true;

      // Reset to zero
      countValueRef.current = 0;

      // Calculate increment based on value size for consistent animation duration
      const duration = 2000; // ms
      const steps = Math.min(50, Math.max(10, duration / 50)); // Ensure reasonable step count
      const increment = stat.value / steps;

      // Set initial value
      updateDisplay(0);

      intervalRef.current = setInterval(() => {
        countValueRef.current += increment;

        // Make sure we don't exceed the target
        if (countValueRef.current >= stat.value) {
          countValueRef.current = stat.value;
          updateDisplay(countValueRef.current);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return;
        }

        updateDisplay(countValueRef.current);
      }, duration / steps);
    };

    const updateDisplay = (value: number) => {
      if (!countRef.current) return;

      let formattedValue;

      // Handle different number formats
      if (Number.isInteger(stat.value)) {
        formattedValue = Math.floor(value).toLocaleString('en-UK');
      } else {
        // Show decimal only if the original value had one
        formattedValue = stat.value % 1 === 0
          ? Math.floor(value).toLocaleString('en-UK')
          : value.toFixed(1);
      }

      // Handle optional prefix and suffix
      const prefix = stat.prefix || '';
      const suffix = stat.suffix || '';
      countRef.current.textContent = prefix + formattedValue + suffix;
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounting();
          observer.disconnect();
        }
      });
    }, options);

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      observer.disconnect();
    };
  }, [stat]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-6 rounded-lg shadow-xl"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">
        {stat.title}
      </h2>
      <p className="text-3xl font-bold text-gray-900">
        <span ref={countRef}>
          {(stat.prefix || '')}0{(stat.suffix || '')}
        </span>
      </p>
      <p className="text-gray-500 text-lg mt-2">
        {stat.description}
      </p>
    </motion.div >
  );
};

export default AnimatedStatCard;