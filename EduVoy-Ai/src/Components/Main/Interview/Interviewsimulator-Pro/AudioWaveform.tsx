import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AudioWaveformProps {
  isActive: boolean;
  isAI: boolean;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ isActive, isAI }) => {
  const [barHeights, setBarHeights] = useState<number[]>(Array(40).fill(10));
  
  useEffect(() => {
    if (!isActive) {
      setBarHeights(Array(40).fill(5));
      return;
    }

    const interval = setInterval(() => {
      const newHeights = barHeights.map(() => {
        const randomValue = Math.random();
        // Create more dynamic heights when active
        return isActive ? Math.floor(randomValue * 30) + 5 : 5;
      });
      setBarHeights(newHeights);
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isAI]);

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex items-center justify-center space-x-1 h-full w-full">
        {barHeights.map((height, index) => (
          <motion.div
            key={index}
            animate={{ height: `${height}px` }}
            transition={{ duration: 0.1 }}
            className={`w-1 rounded-full ${
              isAI ? 'bg-white' : 'bg-black'
            } ${isActive ? 'opacity-100' : 'opacity-40'}`}
          ></motion.div>
        ))}
      </div>
    </div>
  );
};

export default AudioWaveform;