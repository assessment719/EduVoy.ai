import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { CurrentMessages } from './../../../Utils/currentMessages';
import { chatBoxStateAtom, currentRoomAtom, userDetailsAtom } from './../../../Atoms/atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';

function HumanChat() {
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState<WebSocket>();
    const [currentMessages, setCurrentMessages] = useState<CurrentMessages[]>([{ role: "admin", message: "Hello! I am your personal study abroad advisor." }, { role: "admin", message: "How can i help you?" }]);
    const setChatBoxState = useSetRecoilState(chatBoxStateAtom);
    const currentRoom = useRecoilValue(currentRoomAtom);
    const userDetails = useRecoilValue(userDetailsAtom);

    const room = useRef(currentRoom);

    useEffect(() => {
        room.current = currentRoom;
    }, [currentRoom]);

    function sendMessage() {
        let reply = {
            type: "chat",
            payload: {
                role: "user",
                message: message,
                roomId: currentRoom
            }
        }
        socket?.send(JSON.stringify(reply))
        setMessage('');
    }

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080")
        // Set Websocket
        setSocket(ws);

        // Send Join Mesage
        let joinMessage = {
            type: "join",
            payload: {
                name: userDetails.fullName,
                role: "user",
                roomId: room.current
            }
        }
        setTimeout(() => {
            ws.send(JSON.stringify(joinMessage));
        }, 100)

        ws.onmessage = (message) => {
            let parsedMessage;
            parsedMessage = JSON.parse(message.data.toString());
            setCurrentMessages(message => [
                ...message,
                { role: parsedMessage.role, message: parsedMessage.message }
            ]);
        }

        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };
    }, []);

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
                        className="bg-slate-100 rounded-xl shadow-2xl border-4 border-black mt-28 w-[450px] h-[450px]"
                    >
                        <div className='flex m-4 justify-between items-center px-6 p-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl top-0'>
                            <h1 className='text-2xl font-bold text-center'>
                                Chat Support
                            </h1>
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => setChatBoxState((c) => !c)}
                                className="w-28 btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                            >
                                Exit
                            </motion.button>
                        </div>

                        <div ref={chatContainerRef} className="flex flex-col justify-start space-y-4 h-[258px] m-4 overflow-auto">
                            {currentMessages.map((message) => (
                                <div
                                    className={`${message.role === "admin" ? "text-left" : "text-right"}`}
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

export default HumanChat