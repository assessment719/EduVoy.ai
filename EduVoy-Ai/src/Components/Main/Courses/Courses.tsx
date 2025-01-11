import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { useState } from 'react';
import EligibleCourses from './AllQueries/Eligible';
import AllCourses from './AllQueries/All';

const Courses = () => {
    const [activeTab, setActiveTab] = useState('eligible');

    return (
        <main className="min-h-screen px-4 sm:px-6 lg:px-8">
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="flex gap-2 space-x-1 -ml-2 bg-gray-200 p-4 rounded-xl shadow-sm mb-8 font-bold w-[1100px]">
                    {[
                        { id: 'eligible', label: 'Find Eligible Courses' },
                        { id: 'all', label: 'Find All Courses' }
                    ].map(({ id, label }) => (
                        <Tabs.Trigger
                            key={id}
                            value={id}
                            className={`flex-1 shadow-md shadow-black text-lg p-2 flex items-center justify-center rounded-lg transition-colors duration-200 cursor-pointer
                                ${activeTab === id
                                    ? 'bg-green-200 text-white'
                                    : 'hover:bg-white'
                                }
                            `}
                        >
                            <span>{label}</span>
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className='flex justify-center'
                >
                    <Tabs.Content value="eligible">
                        <EligibleCourses />
                    </Tabs.Content>

                    <Tabs.Content value="all">
                        <AllCourses />
                    </Tabs.Content>
                </motion.div>
            </Tabs.Root>
        </main>
    )
}

export default Courses