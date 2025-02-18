import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { useState } from 'react';
import DreamUniversities from './DreamLists/Universities';
import DreamCourses from './DreamLists/Courses';

const DreamList = () => {
    const [activeTab, setActiveTab] = useState('dreamUniversities');

    return (
        <main className="min-h-screen px-4 sm:px-6 lg:px-8">
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="flex gap-2 space-x-1 -ml-2 bg-gray-200 p-4 rounded-xl shadow-sm mb-8 font-bold w-[1100px]">
                    {[
                        { id: 'dreamUniversities', label: 'Dream Universities' },
                        { id: 'dreamCourses', label: 'Dream Courses' }
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
                    className='flex justify-center'
                >
                    <Tabs.Content value="dreamUniversities">
                        <DreamUniversities />
                    </Tabs.Content>

                    <Tabs.Content value="dreamCourses">
                        <DreamCourses />
                    </Tabs.Content>
                </motion.div>
            </Tabs.Root>
        </main>
    )
}

export default DreamList