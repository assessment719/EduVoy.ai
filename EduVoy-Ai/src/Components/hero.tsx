import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { University, Book, PenBoxIcon, Laptop, ArrowRight, LucideListPlus } from 'lucide-react';
import { activeTabAtom, userDetailsAtom, currentRoomAtom } from '../Atoms/atoms';
import { useNavigate } from 'react-router-dom';
import Universities from './Main/Universities/Universities';
import Courses from './Main/Courses/Courses';
import SOP from './Main/SOP/SOP';
import Interview from './Main/Interview/Head';
import ChatDashboard from './Main/ChatSupport/ChatDashboard';
import DreamList from './../Components/Main/DreamList/DreamList';


function Hero() {
    const [activeTabTitle, setActiveTabTitle] = useState('');
    const setActiveTab = useSetRecoilState(activeTabAtom);
    const activeTab = useRecoilValue(activeTabAtom);
    const userDetails = useRecoilValue(userDetailsAtom);
    const setUserDetails = useSetRecoilState(userDetailsAtom);
    const setCurrentRoom = useSetRecoilState(currentRoomAtom);
    const navigate = useNavigate();

    useEffect(() => {
        if (activeTab === 'university') {
            setActiveTabTitle("Find Universities");
        } else if (activeTab === 'course') {
            setActiveTabTitle("Find Courses");
        } else if (activeTab === 'sop') {
            setActiveTabTitle("Statement of Purpose Generator");
        } else if (activeTab === 'interview') {
            setActiveTabTitle("Interview Simulator");
        } else {
            setActiveTabTitle("Dream List");
        }
    }, [activeTab]);

    function signOut() {
        localStorage.removeItem('token');
        setUserDetails({});
        setCurrentRoom('');
        navigate('/sign');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-gradient-to-b from-green-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <img className="w-36" src="https://i.postimg.cc/G2Gdrhxb/logopng.png" />
                    <h1 className="text-3xl font-bold">{activeTabTitle}</h1>
                    <div className="flex justify-around w-44 border-2 border-black p-1 rounded-2xl shadow-lg">
                        <img className="w-10 border-2 border-black rounded-xl" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s" />
                        <div>
                            <h4 className="font-bold">{userDetails.fullName}</h4>
                            <button onClick={() => signOut()} className="text-red-500 font-semibold flex justify-center">
                                <p>Sign Out</p>
                                <ArrowRight className="w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <div>
                <Tabs.Root className="flex flex-row justify-start mt-3" value={activeTab} onValueChange={setActiveTab}>
                    <Tabs.List className="bg-gray-200 rounded-r-2xl h-fit mr-5">
                        {[
                            { id: 'university', label: 'Find Universities', icon: University },
                            { id: 'course', label: 'Find Courses', icon: Book },
                            { id: 'dreamlist', label: 'Dream List', icon: LucideListPlus },
                            { id: 'sop', label: 'SOP Generator', icon: PenBoxIcon },
                            { id: 'interview', label: 'Interview Simulator', icon: Laptop }
                        ].map(({ id, label, icon: Icon }) => (
                            <Tabs.Trigger
                                key={id}
                                value={id}
                                className={`
                  w-56 flex-1 px-4 py-2 font-bold flex items-center justify-start space-x-2 
                  rounded-lg transition-colors duration-200 cursor-pointer m-3
                  ${activeTab === id
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
                    >
                        <Tabs.Content value="university">
                            <Universities />
                        </Tabs.Content>

                        <Tabs.Content value="course">
                            <Courses />
                        </Tabs.Content>

                        <Tabs.Content value="dreamlist">
                            <DreamList />
                        </Tabs.Content>

                        <Tabs.Content value="sop">
                            <SOP />
                        </Tabs.Content>

                        <Tabs.Content value="interview">
                            <Interview />
                        </Tabs.Content>
                    </motion.div>
                </Tabs.Root>
            </div>

            <ChatDashboard />
        </div>
    )
}

export default Hero
