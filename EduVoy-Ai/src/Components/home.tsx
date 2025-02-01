import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSetRecoilState } from 'recoil';
import { signAtom } from '../Atoms/atoms';

function Home () {

    const navigate = useNavigate();
    const setSign = useSetRecoilState(signAtom);

    function signUp() {
        setSign('up');
        navigate("/sign");
    }

    function signIn() {
        setSign('in');
        navigate("/sign");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-gradient-to-b from-green-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <img className="w-36" src="https://i.postimg.cc/G2Gdrhxb/logopng.png" />
                    <div className='flex gap-4'>
                        <button onClick={signUp} className="text-xl font-bold px-3 py-2 rounded-2xl bg-transparent border-2 border-black shadow-lg hover:shadow-black transition-shadow duration-300">Sign Up</button>
                        <button onClick={signIn} className="text-xl font-bold px-3 py-2 rounded-2xl bg-transparent border-2 border-black shadow-lg hover:shadow-black transition-shadow duration-300">Sign In</button>
                    </div>
                </div>
            </header>
            <div className="flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-r from-red-500 to-green-600 p-6 rounded-2xl shadow-2xl shadow-black text-white fixed mt-44"
                >
                    <h1 className="text-5xl font-bold">Welcome To The World Of EduVoy.ai</h1>
                </motion.div>
            </div>
        </div>
    )
}

export default Home