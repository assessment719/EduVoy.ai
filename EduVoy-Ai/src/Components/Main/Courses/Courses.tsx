import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import EligibleCourses from './AllQueries/Eligible';
import AllCourses from './AllQueries/All';
import { userDetailsAtom, dreamCourseAtom } from './../../../Atoms/atoms';
import { BACKEND_URL } from './../../../config';

const Courses = () => {
    const [activeTab, setActiveTab] = useState('eligible');

    // For Dream List
    const userDetails = useRecoilValue(userDetailsAtom);
    const setAddedToList = useSetRecoilState(dreamCourseAtom);

    const fetchDreamCourses = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }

            const response = await fetch(`${BACKEND_URL}/users/getField/dreamCourses/${userDetails.id}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data = await response.json();

            let obj: { [key: string]: boolean } = {};
            data.fieldDetails.dreamCourses.forEach((courseId: number) => {
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
        <main className="tabListMain">
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="tabsList">
                    {[
                        { id: 'eligible', label: 'Find Eligible Courses' },
                        { id: 'all', label: 'Find All Courses' }
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