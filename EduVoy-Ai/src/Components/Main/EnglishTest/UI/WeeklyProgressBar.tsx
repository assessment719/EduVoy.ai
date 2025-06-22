import { useState, useEffect } from 'react';

interface ProgresBarProps {
    weekNo: number;
    topic: string;
    value: number;
    duration?: number;
}

const WeeklyProgresBar: React.FC<ProgresBarProps> = ({ weekNo, topic, value, duration = 2000 }) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const startValue = 0;
        const endValue = Math.min(Math.max(value, 0), 100); // Clamp between 0-100

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (endValue - startValue) * easeOut;

            setAnimatedValue(Math.round(currentValue));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);
    
    return (
        <div className={`rounded-xl text-start border-2 border-gray-400 py-2 px-4 ${weekNo === 5 ? 'col-span-2' : ''}`}>
            <p className="text-xl font-semibold">Week {weekNo}</p>
            <p className="text-ls font-medium">{topic}</p>
            <div className="flex justify-between my-2">
                <span className="text-lg font-medium">Progress</span>
                <span className="text-lg font-medium">{animatedValue}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-2 rounded-full bg-green-200 transition-all duration-75 ease-out"
                    style={{ width: `${animatedValue}%` }}
                ></div>
            </div>
        </div>
    );
};

export default WeeklyProgresBar;