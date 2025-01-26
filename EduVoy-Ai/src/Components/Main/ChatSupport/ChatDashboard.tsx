import { MessageSquareTextIcon, Cross, BotMessageSquare, UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import BotChat from './BotChatBox';
import HumanChat from './HumanChatBox';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentRoomAtom, chatBoxStateAtom } from './../../../Atoms/atoms';

function ChatDashboard() {
    const [isNeedHelp, setIsNeedHelp] = useState(true);
    const [isOptionOpen, setIsOptionOpen] = useState(false);
    const [isHoverBot, setIsHoverBot] = useState(false);
    const [isHoverHuman, setIsHoverHuman] = useState(false);
    const [isBotChating, setIsBotChating] = useState(false);
    const [isHumanChating, setIsHumanChating] = useState(false);
    const chatBoxStatus = useRecoilValue(chatBoxStateAtom);
    const setCurrentRoom = useSetRecoilState(currentRoomAtom);

    useEffect(() => {
        setIsHumanChating(false);
        setIsBotChating(false);
        setIsNeedHelp(true);
        setIsOptionOpen(false);

        //Set New Room Id
        const roomId = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        setCurrentRoom(roomId);
    }, [chatBoxStatus])

    useEffect(() => {
        const roomId = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        setCurrentRoom(roomId);
    }, [])

    function changeChatingStage() {
        if (isOptionOpen) {
            setIsNeedHelp(true);
            setIsHumanChating(false);
            setIsBotChating(false);
        }
        if (isNeedHelp) {
            setIsNeedHelp((c) => !c);
        }
        setIsOptionOpen((c) => !c);
        
        //Set New Room Id
        const roomId = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        setCurrentRoom(roomId);
    }

    useEffect(() => {
        if (isHumanChating || isBotChating) {
            setIsHoverBot(false);
            setIsHoverHuman(false);
        }
    }, [isHumanChating, isBotChating])

    return (
        <>
            {isNeedHelp && <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                onClick={() => setIsNeedHelp(false)}
                className='fixed top-[83vh] right-72 mr-5 cursor-pointer'>
                <Cross className='h-6 w-6 rotate-45' />
            </motion.div>}

            {!isOptionOpen && isNeedHelp && <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className='fixed top-[85vh] right-28'>
                <div className='h-10 flex justify-center items-center text-xl bg-blue-100 p-4 rounded-xl shadow-lg shadow-black'>
                    <h1>Do You Need Help?</h1>
                </div>
            </motion.div>}

            <div className='fixed top-[87vh] right-8'>
                <div onClick={changeChatingStage} className="h-16 w-16 rounded-full bg-green-200 flex justify-center items-center shadow-black shadow-lg cursor-pointer">
                    {!isOptionOpen && <MessageSquareTextIcon className='h-8 w-8' />}
                    {isOptionOpen && <Cross className='h-9 w-9 rotate-45' />}
                </div>
            </div>

            {!isHumanChating && !isBotChating && <div>
                {isOptionOpen && isHoverBot && <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className='fixed top-[63vh] right-28'>
                    <div className='h-10 flex justify-center items-center text-xl bg-blue-100 p-4 rounded-xl shadow-lg shadow-black'>
                        <h1>Talk To EduVoy.ai</h1>
                    </div>
                </motion.div>}

                {isOptionOpen && isHoverHuman && <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className='fixed top-[75vh] right-28'>
                    <div className='h-10 flex justify-center items-center text-xl bg-blue-100 p-4 rounded-xl shadow-lg shadow-black'>
                        <h1>Talk To A Study Abroad Specialist</h1>
                    </div>
                </motion.div>}
            </div>}

            {!isHumanChating && !isBotChating && <div>
                {isOptionOpen && <div
                    onMouseEnter={() => setIsHoverBot(true)}
                    onMouseLeave={() => setIsHoverBot(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className='fixed top-[63vh] right-8'>
                        <div onClick={() => setIsBotChating((c) => !c)} className="h-16 w-16 rounded-full bg-green-200 flex justify-center items-center cursor-pointer">
                            <BotMessageSquare className='h-8 w-8' />
                        </div>
                    </motion.div>
                </div>
                }

                {isOptionOpen &&
                    <div
                        onMouseEnter={() => setIsHoverHuman(true)}
                        onMouseLeave={() => setIsHoverHuman(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className='fixed top-[75vh] right-8'>
                            <div onClick={() => setIsHumanChating((c) => !c)} className="h-16 w-16 rounded-full bg-green-200 flex justify-center items-center cursor-pointer">
                                <UserIcon className='h-8 w-8' />
                            </div>
                        </motion.div>
                    </div>
                }
            </div>}

            {isBotChating && <BotChat />}

            {isHumanChating && <HumanChat />}
        </>
    )
}

export default ChatDashboard