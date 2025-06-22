import { useState, useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { isTestSelecteedAtom, testNameAtom } from './atoms';
import { motion } from 'framer-motion';
import { Star, Target, BookOpen, TrendingUp, Users } from 'lucide-react';
import TestSelector from './UI/TestSelector';

const EnglishTestHome: React.FC = () => {
    const [selectedTest, setSelectedTest] = useState<string | null>(null);
    const setTestName = useSetRecoilState(testNameAtom);
    const setSubmitStatus = useSetRecoilState(isTestSelecteedAtom);

    const handleStartPreparation = () => {
        if (selectedTest) {
            setTestName(selectedTest);
            setSubmitStatus(true);
        }
    };

    const submitBtnRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        submitBtnRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }, [selectedTest]);

    let currentTestName = '';
    switch (selectedTest) {
        case 'ielts':
            currentTestName = 'IELTS'
            break;
        case 'toefl':
            currentTestName = 'TOEFL'
            break;
        case 'pte':
            currentTestName = 'PTE'
            break;
        default:
            currentTestName = 'Duolingo'
    }
    return (
        <>
            <div className='w-[1150px] mb-24'>
                <div className='flex flex-col justify-center items-center gap-10'>
                    <div className='flex justify-center items-center bg-green-100 px-3 py-2 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300'>
                        <Star className="w-4 h-4 mr-1" />
                        Student's #1 Trusted ELT Prep Platform
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 via-green-400 to-green-200 bg-clip-text text-transparent">
                            Master Your
                            <br />
                            Dream Test
                        </h1>

                        <p className="mt-4 text-2xl text-gray-600 max-w-3xl mx-auto">
                            Ace IELTS, TOEFL, PTE, and Duolingo with AI-powered preparation,
                            personalized study plans, and expert feedback.
                        </p>

                        <button
                            onClick={() => window.scrollTo({ top: document.getElementById('test-selection')?.offsetTop || 0, behavior: 'smooth' })}
                            className="btn btn-primary mt-4"
                        >
                            Start Preparation
                        </button>
                    </motion.div>
                </div>

                <div className="py-16 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-4 text-gray-900">Why Choose EduVoy.ai ELT Prep?</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Experience the future of test preparation with our cutting-edge features
                            </p>
                        </div>

                        <div className="mt-12 px-10 w-full grid gap-8 sm:grid-cols-1 lg:grid-cols-2 place-items-center">
                            <FeatureCard
                                icon={<Target className="h-8 w-8 text-black" />}
                                title="AI-Powered Evaluation"
                                description="Get instant feedback on your writing and speaking with advanced AI evaluation"
                            />
                            <FeatureCard
                                icon={<BookOpen className="h-8 w-8 text-black" />}
                                title="Personalized Study Plans"
                                description="Custom 30 day study plans tailored to your chosen test and schedule"
                            />
                            <FeatureCard
                                icon={<TrendingUp className="h-8 w-8 text-black" />}
                                title="Progress Tracking"
                                description="Monitor your improvement with detailed analytics and performance insights"
                            />
                            <FeatureCard
                                icon={<Users className="h-8 w-8 text-black" />}
                                title="Mock Tests & Practice"
                                description="Comprehensive practice tests that simulate real exam conditions"
                            />
                        </div>
                    </div>
                </div>

                <div id="test-selection" className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-gray-900">Choose Your Test</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Select the test you're preparing for and get a customized learning experience
                        </p>
                    </div>

                    <TestSelector selectedTest={selectedTest} onTestSelect={setSelectedTest} />

                    {selectedTest && (
                        <div ref={submitBtnRef} className="my-8 flex justify-center">
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={handleStartPreparation}
                                className="w-[90%] btn btn-primary"
                            >
                                Start {currentTestName} Preparation
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white w-[80%] rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
            <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-200 mb-4">
                    {icon}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
                <p className="text-lg text-gray-600">{description}</p>
            </div>
        </motion.div>
    );
};

export default EnglishTestHome;