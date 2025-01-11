import { useNavigate } from 'react-router-dom';
import { Eye, EyeOffIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { fullNameAtom } from '../Atoms/atoms';
import { useSetRecoilState } from 'recoil';
import { BACKEND_URL } from '../config';
import LoaderComponent from './loader';

function SignIn() {
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPassword, setIsPassword] = useState(true);

    const navigate = useNavigate();

    const setFullName = useSetRecoilState(fullNameAtom);

    const EyeIcon = () => {
        setIsPassword((c) => !c);
    };

    const signIn = async () => {
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        if (email && password) {
            setIsLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1200));
                const response = await fetch(`${BACKEND_URL}/admin/signin`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });
                const data = await response.json();

                if (data.token) {
                    setIsLoading(false);
                    localStorage.setItem('token', data.token);
                    setFullName(`${data.firstName} ${data.lastName}`);
                    navigate("/admin/eduvoytools");
                } else {
                    setIsLoading(false);
                    alert("Sign-in failed. Please check your credentials.");
                }
            } catch (error) {
                console.error('Error during sign-in:', error);
            }
        } else {
            alert('Please fill all the fields before sign in.');
        }
    };

    return (
        <>
            {isLoading && <div className='fixed bg-opacity-50 bg-gray-100 w-screen h-screen z-50'>
                <div className='flex justify-center'>
                    <LoaderComponent />
                </div>
            </div>}

            <div className="min-h-screen bg-gray-50">
                <header className="bg-gradient-to-b from-green-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                        <img className="w-36" src="https://i.postimg.cc/G2Gdrhxb/logopng.png" alt="Logo" />
                        <div>
                            <button
                                onClick={() => navigate("/admin/home")}
                                className="text-xl font-bold px-3 py-2 rounded-2xl bg-transparent border-2 border-black shadow-lg hover:shadow-black transition-shadow duration-300"
                            >
                                Home
                            </button>
                        </div>
                    </div>
                </header>
                <div className="mt-28 flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-2xl shadow-2xl shadow-black w-96 flex flex-col justify-center"
                    >
                        <div className="grid grid-cols-1 gap-2">
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block font-bold text-1.2xl text-black mb-1"
                                >
                                    Email Id:
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    ref={emailRef}
                                    placeholder="Enter Your Email Id"
                                    className="p-2 w-full border-2 border-black rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="password"
                                    className="block font-bold text-1.2xl text-black mb-1"
                                >
                                    Password:
                                </label>
                                <div className="w-full border-2 border-black rounded-lg flex justify-around bg-gray-200">
                                    <input
                                        type={isPassword ? "password" : "text"}
                                        id="password"
                                        ref={passwordRef}
                                        placeholder="Enter Your Password"
                                        className="p-2 w-72 -ml-1 border-r-2 border-black rounded-l-lg"
                                    />
                                    {isPassword && <Eye className='mt-2 mr-1 cursor-pointer' onClick={() => EyeIcon()} />}
                                    {!isPassword && <EyeOffIcon className='mt-2 mr-1 cursor-pointer' onClick={() => EyeIcon()} />}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={signIn}
                            className="w-full btn btn-primary"
                        >
                            Sign In
                        </button>
                    </motion.div>
                </div>
            </div>
        </>
    );
}

export default SignIn;