import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { CurrentMessages } from './../../../Utils/currentMessages';
import { chatBoxStateAtom } from './../../../Atoms/atoms';
import { useSetRecoilState } from 'recoil';
import { BACKEND_URL } from '../../../config'

function BotChat() {
    const [isTyping, setIsTyping] = useState(false);
    const [message, setMessage] = useState('');
    const [currentMessages, setCurrentMessages] = useState<CurrentMessages[]>([{ role: "bot", message: "Hello! I am EduVoy.ai, an AI Powered study abroad advisor." }, { role: "bot", message: "How can i help you?" }]);
    const setChatBoxState = useSetRecoilState(chatBoxStateAtom);

    async function sendMessage() {
        setIsTyping(true);
        setCurrentMessages(msg => [
            ...msg,
            { role: "user", message: message }
        ]);

        if (message !== '') {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    return;
                }

                const result = await fetch(`${BACKEND_URL}/users/openai/chat`, {
                    method: "POST",
                    headers: {
                        'token': `${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message
                    }),
                });
                const data = await result.json();

                await new Promise((resolve) => setTimeout(resolve, 1500));
                setIsTyping(false);

                setCurrentMessages(msg => [
                    ...msg,
                    { role: "bot", message: data.reply }
                ]);
            } catch (error) {
                console.error("Error analyzing response:", error);

                await new Promise((resolve) => setTimeout(resolve, 1500));
                setIsTyping(false);

                setCurrentMessages(msg => [
                    ...msg,
                    { role: "bot", message: "Sorry there is an error while replying. Please try again" }
                ]);
            }
        }

        setMessage('');
    }

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [currentMessages]);

    return (
        <>
            <div className='fixed bottom-24 right-8'>
                <div className='flex justify-center'>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-100 rounded-xl shadow-3xl border-4 border-black mt-28 w-[450px] h-[450px]"
                    >
                        <div className='flex m-4 justify-between items-center px-6 p-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl top-0'>
                            <h1 className='text-2xl font-bold text-center'>
                                EduVoy.ai Chat Support
                            </h1>
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => setChatBoxState((c) => !c)}
                                className="w-38 btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                            >
                                Exit
                            </motion.button>
                        </div>

                        <div ref={chatContainerRef} className="flex flex-col justify-start space-y-4 h-[258px] m-4 overflow-auto">
                            {currentMessages.map((message) => (
                                <div
                                    className={`${message.role === "bot" ? "text-left" : "text-right"}`}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-gray-200 p-3 font-bold text-lg rounded-xl inline-block max-w-[75%]"
                                    >
                                        {message.message}
                                    </motion.div>
                                </div>
                            ))}
                            {isTyping && <div
                                className="text-left"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex justify-evenly bg-gray-200 p-3 font-bold text-lg rounded-xl w-28"
                                >
                                    <div className='w-3 h-3 bg-black rounded-full animate-pulse-slow'></div>
                                    <div className='w-3 h-3 bg-black rounded-full animate-pulse-slow'></div>
                                    <div className='w-3 h-3 bg-black rounded-full animate-pulse-slow'></div>
                                    <div className='w-3 h-3 bg-black rounded-full animate-pulse-slow'></div>
                                    <div className='w-3 h-3 bg-black rounded-full animate-pulse-slow'></div>
                                </motion.div>
                            </div>}
                        </div>

                        <div className="flex justify-around bg-gradient-to-r from-blue-500 to-purple-600 rounded-br-lg rounded-bl-lg px-6 py-3 mb-8 text-white w-full">
                            <input
                                type="text"
                                id="optionTitle"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter Your Message...."
                                className="p-2 w-full border border-black text-black rounded-lg mr-5"
                            />

                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: message === '' ? 0.5 : 1 }}
                                disabled={message === ''}
                                onClick={sendMessage}
                                className="w-32 btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                            >
                                Send
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    )
}

export default BotChat