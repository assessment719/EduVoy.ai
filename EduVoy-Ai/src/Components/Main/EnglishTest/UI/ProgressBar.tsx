import { useState, useEffect } from 'react';

interface ProgressBarProps {
    value: number;
    duration?: number; // Animation duration in milliseconds
    icon?: React.ReactNode; // Optional icon
    title?: string; // Optional custom title
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
    value, 
    duration = 2000, 
    icon, 
    title = "Progress" 
}) => {
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
        <div>
            <div className="flex justify-between my-2">
                <span className="text-lg font-medium flex items-center">
                    {icon && (
                        <>
                            {icon}
                            <span className="ml-2 text-xl">{title}</span>
                        </>
                    )}
                    {!icon && title}
                </span>
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

export default ProgressBar;