import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import DreamPgCourses from './Courses/PgCourses';
import DreamUgCourses from './Courses/UgCourses';
import { userDetailsAtom, dreamCourseAtom } from './../../../../Atoms/atoms';
import { BACKEND_URL } from './../../../../config';

const DreamList = () => {
    const [activeTab, setActiveTab] = useState('dreamPgCourses');

    // For Dream List
    const userDetails = useRecoilValue(userDetailsAtom);
    const setAddedToList = useSetRecoilState(dreamCourseAtom);

    const fetchDreamCourses = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }

            const response = await fetch(`${BACKEND_URL}/users/dreamCourses?userId=${userDetails.id}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data = await response.json();

            let obj: { [key: string]: boolean } = {};
            data.dreamCourses.forEach((courseId: number) => {
                obj[courseId] = true;
            });
            setAddedToList(obj);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    useEffect(() => {
        fetchDreamCourses();
    }, [])

    return (
        <main className="min-h-screen -ml-2">
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="flex gap-2 space-x-1 bg-gray-200 p-4 rounded-xl shadow-sm mb-8 font-bold w-[1100px]">
                    {[
                        { id: 'dreamPgCourses', label: 'Postgraduate Courses' },
                        { id: 'dreamUgCourses', label: 'Undergraduate Courses' }
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
                    <Tabs.Content value="dreamPgCourses">
                        <DreamPgCourses />
                    </Tabs.Content>

                    <Tabs.Content value="dreamUgCourses">
                        <DreamUgCourses />
                    </Tabs.Content>
                </motion.div>
            </Tabs.Root>
        </main>
    )
}

export default DreamList