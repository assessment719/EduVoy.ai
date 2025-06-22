import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, Volume2, BookOpen, NotebookPen, Mic } from 'lucide-react';
import { testNameAtom } from './../atoms';
import Dashboard from './Dashboard';
import StudyPlan from './StudyPlan';
import Listning from './Listening';
import Reading from './Reading';
import Writting from './Writting';
import Speaking from './Speaking';

function EnglishTestRoom() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const testName = useRecoilValue(testNameAtom);
    let description = '';
    let gradientColor = '';
    let currentTestName = '';

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, []);

    useEffect(() => {
        speechSynthesis.cancel();
    }, [activeTab]);

    switch (testName) {
        case 'ielts':
            currentTestName = 'IELTS'
            description = 'Master all four skills with personalized study plans and AI-powered feedback'
            gradientColor = 'from-blue-600 via-blue-400 to-blue-200'
            break;
        case 'toefl':
            currentTestName = 'TOEFL'
            description = 'Excel in all four sections with comprehensive practice and expert feedback'
            gradientColor = 'from-green-600 via-green-400 to-green-200'
            break;
        case 'pte':
            currentTestName = 'PTE'
            description = 'Sharpen your English skills with real-time AI feedback and computer-based practice'
            gradientColor = 'from-purple-700 via-purple-500 to-purple-200'
            break;
        default:
            currentTestName = 'Duolingo'
            description = 'Quick, convenient, and comprehensive English proficiency preparation'
            gradientColor = 'from-orange-500 via-orange-400 to-orange-200'
    }

    return (
        <>
            <div className='w-[1150px] mb-24'>
                <div className="text-center mb-8">
                    <h1 className={`text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent`}>
                        {currentTestName} Preparation
                    </h1>
                    <p className="text-2xl">
                        {description}
                    </p>
                </div>

                <div className="tabListMain min-h-full">
                    <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                        <Tabs.List className="tabsList">
                            {[
                                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                                { id: 'studyPlan', label: 'Study Plan', icon: Calendar },
                                { id: 'listening', label: 'Listening Test', icon: Volume2 },
                                { id: 'reading', label: 'Reading Test', icon: BookOpen },
                                { id: 'writing', label: 'Writing Test', icon: NotebookPen },
                                { id: 'speaking', label: 'Speaking Test', icon: Mic },
                            ].map(({ id, label, icon: Icon }) => (
                                <Tabs.Trigger
                                    key={id}
                                    value={id}
                                    className={`tabs space-x-2
                  ${activeTab === id
                                            ? 'activeTab'
                                            : 'inActiveTab'
                                        }
                `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{label}</span>
                                </Tabs.Trigger>
                            ))}
                        </Tabs.List>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className='-ml-2 text-center'
                        >
                            <Tabs.Content value="dashboard">
                                <Dashboard />
                            </Tabs.Content>

                            <Tabs.Content value="studyPlan">
                                <StudyPlan />
                            </Tabs.Content>

                            <Tabs.Content value="listening">
                                <Listning />
                            </Tabs.Content>

                            <Tabs.Content value="reading">
                                <Reading />
                            </Tabs.Content>

                            <Tabs.Content value="writing">
                                <Writting />
                            </Tabs.Content>

                            <Tabs.Content value="speaking">
                                <Speaking />
                            </Tabs.Content>
                        </motion.div>
                    </Tabs.Root>
                </div>
            </div>
        </>
    )
}

export default EnglishTestRoom;