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
        <main className="tabListMain">
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="tabsList">
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
                            className={`tabs space-x-2 ${activeTab === id
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