import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import EligibleUniversities from './EligibleUnis/EligibleUnis';
import AllUnis from './AllUnis/All';
import { userDetailsAtom, dreamUniAtom } from './../../../Atoms/atoms';
import { BACKEND_URL } from './../../../config';

const Universities = () => {
    const [activeTab, setActiveTab] = useState('eligible');

    // For Dream List
    const userDetails = useRecoilValue(userDetailsAtom);
    const setAddedToList = useSetRecoilState(dreamUniAtom);

    const fetchDreamUnis = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }

            const response = await fetch(`${BACKEND_URL}/users/getField/dreamUnis/${userDetails.id}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data = await response.json();

            let obj: { [key: string]: boolean } = {};
            data.fieldDetails.dreamUnis.forEach((courseId: number) => {
                obj[courseId] = true;
            });
            setAddedToList(obj);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    useEffect(() => {
        fetchDreamUnis();
    }, [])

    return (
        <main className="tabListMain">
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="tabsList">
                    {[
                        { id: 'eligible', label: 'Find Eligible Universities' },
                        { id: 'all', label: 'Find All Universities' }
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
                    <Tabs.Content value="eligible">
                        <EligibleUniversities />
                    </Tabs.Content>

                    <Tabs.Content value="all">
                        <AllUnis />
                    </Tabs.Content>
                </motion.div>
            </Tabs.Root>
        </main>
    )
}

export default Universities