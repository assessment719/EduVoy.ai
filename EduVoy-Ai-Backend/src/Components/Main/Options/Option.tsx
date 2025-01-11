import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { University, BookOpen, Calendar, School } from 'lucide-react';
import { useState } from 'react';
import UkUniversities from './AllOptions/Ukuniversities';
import Boards from './../Options/AllOptions/Boards';
import Universities from './../Options/AllOptions/Universities';
import MoiUniversities from './../Options/AllOptions/Moiuniversities';
import Faculties from './../Options/AllOptions/Faculties';
import Intakes from './../Options/AllOptions/Intakes';

function OptionCentre() {
    const [activeTab, setActiveTab] = useState('ukUniversities');

    return (
        <main className="min-h-screen px-3 ml-2">
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="flex gap-2 space-x-1 bg-gray-200 p-4 rounded-xl shadow-sm mb-8 font-bold w-[1100px]">
                    {[
                        { id: 'ukUniversities', label: 'UK Universies', icon: University },
                        { id: 'board', label: 'Boards', icon: School },
                        { id: 'university', label: 'Universities', icon: University },
                        { id: 'moiuniversity', label: 'MOI Unis', icon: University },
                        { id: 'faculty', label: 'Faculties', icon: BookOpen },
                        { id: 'intakes', label: 'Intakes', icon: Calendar },
                    ].map(({ id, label, icon: Icon }) => (
                        <Tabs.Trigger
                            key={id}
                            value={id}
                            className={`flex-1 shadow-md shadow-black text-lg p-2 flex items-center justify-center space-x-2 rounded-lg transition-colors duration-200 cursor-pointer ${activeTab === id
                                ? 'bg-green-200 text-white'
                                : 'hover:bg-white'
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
                    className='flex justify-center'
                >
                    <Tabs.Content value="ukUniversities">
                        <UkUniversities />
                    </Tabs.Content>

                    <Tabs.Content value="board">
                        <Boards />
                    </Tabs.Content>

                    <Tabs.Content value="university">
                        <Universities />
                    </Tabs.Content>

                    <Tabs.Content value="moiuniversity">
                        <MoiUniversities />
                    </Tabs.Content>

                    <Tabs.Content value="faculty">
                        <Faculties />
                    </Tabs.Content>

                    <Tabs.Content value="intakes">
                        <Intakes />
                    </Tabs.Content>
                </motion.div>
            </Tabs.Root>
        </main>
    );
}

export default OptionCentre