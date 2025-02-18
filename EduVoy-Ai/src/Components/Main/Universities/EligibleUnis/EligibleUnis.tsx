import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Acads from './AllQueries/Acads';
import Waiver from './AllQueries/Waiver';
import Test from './AllQueries/Tests';
import Math from './AllQueries/Math';
import Moi from './AllQueries/MOI';
import CourseType from './AllQueries/CourseType';
import Fees from './AllQueries/Fees';
import { userDetailsAtom, dreamUniAtom } from'./../../../../Atoms/atoms';
import { BACKEND_URL } from './../../../../config';

const EligibleUniversities = () => {
    const [activeTab, setActiveTab] = useState('acadreq');

    return (
        <main className="min-h-screen">
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="flex gap-2 space-x-1 -ml-2 bg-gray-200 p-4 rounded-xl shadow-sm mb-8 font-bold w-[1100px]">
                    {[
                        { id: 'acadreq', label: 'Academic' },
                        { id: 'engreq', label: 'English Waiver' },
                        { id: 'testreq', label: 'Language Test' },
                        { id: 'mathreq', label: 'Math' },
                        { id: 'moi', label: 'MOI' },
                        { id: 'coursetype', label: 'Course Type' },
                        { id: 'fees', label: 'Fees' },
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
                    <Tabs.Content value="acadreq">
                        <Acads />
                    </Tabs.Content>

                    <Tabs.Content value="engreq">
                        <Waiver />
                    </Tabs.Content>

                    <Tabs.Content value="testreq">
                        <Test />
                    </Tabs.Content>

                    <Tabs.Content value="mathreq">
                        <Math />
                    </Tabs.Content>

                    <Tabs.Content value="moi">
                        <Moi />
                    </Tabs.Content>

                    <Tabs.Content value="coursetype">
                        <CourseType />
                    </Tabs.Content>

                    <Tabs.Content value="fees">
                        <Fees />
                    </Tabs.Content>
                </motion.div>
            </Tabs.Root>
        </main>
    )
}

export default EligibleUniversities