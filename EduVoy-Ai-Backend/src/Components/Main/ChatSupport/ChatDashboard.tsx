import { motion } from 'framer-motion';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isChatingAtom, allConnectedUsersAtom, currentRoomAtom, currentUserNameAtom } from '../../../Atoms/atoms';
import { UserIcon } from 'lucide-react';
import ChatBox from './ChatBox';

const ChatDashboard = () => {
    const setCurrentUserName = useSetRecoilState(currentUserNameAtom);
    const setIsChating = useSetRecoilState(isChatingAtom);
    const isChating = useRecoilValue(isChatingAtom);
    const setCurrentRoom = useSetRecoilState(currentRoomAtom);
    const allConnectedUsers = useRecoilValue(allConnectedUsersAtom);

    function openChatBox(userName: string, room: string) {
        setCurrentRoom(room);
        setCurrentUserName(userName);
        setIsChating(true);
    }

    return (
        <>
            <div className='w-[1100px] ml-5'>
                <div className='p-2 bg-gray-200 rounded-2xl mb-8'>
                    <h1 className='text-3xl font-bold text-center'>Active Users</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {allConnectedUsers.map((connectedUser, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col justify-between bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500"
                        >
                            <div className="flex items-start space-x-4 mb-5">
                                <div className="p-3 bg-green-200 rounded-lg">
                                    <UserIcon className="w-6 h-6 text-black" />
                                </div>
                                <div className="flex-1 mt-3">
                                    <b className="font-bold text-xl mb-2">{connectedUser.userName}</b><br /><br />
                                </div>
                            </div>
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() =>
                                    openChatBox(connectedUser.userName, connectedUser.roomId)
                                }
                                className="w-full btn btn-primary"
                            >
                                Join Chat Room
                            </motion.button>
                        </motion.div>
                    ))}
                </div>

                {isChating && <ChatBox />}
            </div>
        </>
    )
}

export default ChatDashboard