import { useRecoilValue, useSetRecoilState } from 'recoil';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { CurrentMessages } from '../../../utils/currentMessages';
import { isChatingAtom, currentRoomAtom, currentUserNameAtom, pendingMessagesAtom } from '../../../Atoms/atoms';

const ChatBox = () => {
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState<WebSocket>();
    const [currentMessages, setCurrentMessages] = useState<CurrentMessages[]>([]);

    const setIsChating = useSetRecoilState(isChatingAtom);
    const setCurrentRoom = useSetRecoilState(currentRoomAtom);
    const setCurrentUserName = useSetRecoilState(currentUserNameAtom);
    const currentUserName = useRecoilValue(currentUserNameAtom);
    const currentRoom = useRecoilValue(currentRoomAtom);
    const PendingChats = useRecoilValue(pendingMessagesAtom);

    const PendingMessages = useRef(PendingChats);

    useEffect(() => {
        PendingMessages.current = PendingChats;
    }, [PendingChats]);

    function sendMessage() {
        let reply = {
            type: "chat",
            payload: {
                role: "admin",
                message: message,
                roomId: currentRoom
            }
        }
        socket?.send(JSON.stringify(reply))
        setMessage('');
    }

    function closeChatBox() {
        setIsChating(false);
        setCurrentRoom('');
        setCurrentUserName('');
        setCurrentMessages([]);
    }

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080")
        // Set Websocket
        setSocket(ws);

        // Send Join Mesage
        let joinMessage = {
            type: "join",
            payload: {
                role: "admin",
                roomId: currentRoom
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

    useEffect(() => {
        if (PendingMessages.current.length > 0) {
            PendingMessages.current.forEach((msg) => {
                if (msg.roomId === currentRoom) {
                    setCurrentMessages(message => [
                        ...message,
                        { role: "user", message: msg.message }
                    ]);
                }
            })
        }
    }, [])

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [currentMessages]);

    return (
        <>
            <div className='fixed bg-opacity-50 bg-gray-100 h-screen w-screen top-0 left-0'>
                <div className='flex justify-center'>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-100 rounded-xl shadow-2xl border-4 border-black mt-28 w-[600px] h-[500px]"
                    >
                        <div className='flex m-4 justify-between items-center px-6 p-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl top-0'>
                            <h1 className='text-2xl font-bold text-center'>
                                {`${currentUserName}'s Chat Room`}
                            </h1>
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={closeChatBox}
                                className="w-28 btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                            >
                                Exit
                            </motion.button>
                        </div>

                        <div ref={chatContainerRef} className="flex flex-col justify-start space-y-4 h-[308px] m-4 overflow-auto">
                            {currentMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`${message.role === "user" ? "text-left" : "text-right"}`}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
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

export default ChatBox