import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { useState } from 'react';
import DreamUniversities from './DreamLists/Universities';
import DreamCourses from './DreamLists/Courses';

const DreamList = () => {
    const [activeTab, setActiveTab] = useState('dreamUniversities');

    return (
        <main className="tabListMain">
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="tabsList">
                    {[
                        { id: 'dreamUniversities', label: 'Dream Universities' },
                        { id: 'dreamCourses', label: 'Dream Courses' }
                    ].map(({ id, label }) => (
                        <Tabs.Trigger
                            key={id}
                            value={id}
                            className={`tabs
                                ${activeTab === id
                                    ? 'activeTab'
                                    : 'inActiveTab'
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