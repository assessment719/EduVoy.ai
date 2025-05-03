import { useNavigate } from 'react-router-dom';
import { Eye, EyeOffIcon } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { userDetailsAtom, signAtom, activeTabAtom } from '../Atoms/atoms';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { BACKEND_URL } from '../config';
import LoaderComponent from './loader';

function Sign() {
    const firstNameRef = useRef<HTMLInputElement | null>(null);
    const lastNameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const otpRef = useRef<HTMLInputElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPassword, setIsPassword] = useState(true);
    const [isAskedOtp, setIsAskedOtp] = useState(false);
    const setActiveSec = useSetRecoilState(activeTabAtom);

    const navigate = useNavigate();

    const setUserDetails = useSetRecoilState(userDetailsAtom);
    const setActiveTab = useSetRecoilState(signAtom);
    const setSign = useSetRecoilState(signAtom);
    const activeTab = useRecoilValue(signAtom);

    useEffect(() => {
        setIsAskedOtp(false);
    }, [activeTab])

    const EyeIcon = () => {
        setIsPassword((c) => !c);
    };

    const signUp = async () => {
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        const firstName = firstNameRef.current?.value;
        const lastName = lastNameRef.current?.value;

        if (email && password) {
            setIsLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1200));
                await fetch(`${BACKEND_URL}/users/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password, firstName, lastName }),
                });
                setIsLoading(false);
                setIsAskedOtp(false);
                setSign('in');
            } catch (error) {
                console.error('Error during sign-up:', error);
                setIsLoading(false);
                setIsAskedOtp(false);
            }
        } else {
            alert('Please fill all the fields before sign in.');
        }
    };

    const getOtp = async () => {
        setIsLoading(true);
        const email = emailRef.current?.value;

        if (email) {
            fetch(`${BACKEND_URL}/users/sendMail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mailData: { email } }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch data");
                    }
                    setIsLoading(false);
                    setIsAskedOtp(true);
                    alert('An One Time Password Has Been Send To Your Email.');
                })
                .catch((error) => console.error("Error fetching questions:", error));
        } else {
            alert('Please fill in email before submitting.');
            setIsLoading(false);
            return
        }
    }

    const signIn = async () => {
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        const otp = Number(otpRef.current?.value);

        if (email && password) {
            setIsLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1200));
                const response = await fetch(`${BACKEND_URL}/users/signin`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password, otp }),
                });
                const data = await response.json();

                if (data.token) {
                    setIsLoading(false);
                    localStorage.setItem('token', data.token);
                    setUserDetails({ id: data.userId, fullName: `${data.firstName} ${data.lastName}` });
                    setSign('up');
                    setActiveSec('university');
                    navigate("/eduvoytools");
                } else {
                    alert("Sign-in failed. Please check your credentials.");
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error during sign-in:', error);
                setIsLoading(false);
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
                                onClick={() => navigate("/home")}
                                className="text-xl font-bold px-3 py-2 rounded-2xl bg-transparent border-2 border-black shadow-lg hover:shadow-black transition-shadow duration-300"
                            >
                                Home
                            </button>
                        </div>
                    </div>
                </header>
                <div className="mt-5 flex justify-around items-center px-5">
                    <div className='w-[750px] h-[490px] overflow-hidden rounded-2xl shadow-xl shadow-black'>
                        <img src='https://i.postimg.cc/9z3CsGkF/LogIn.jpg' className='w-[750px] h-[490px] object-cover -translate-y-3 translate-x-1 scale-105' />
                    </div>
                    <div className='mt-5 mb-5 h-[460px]'>
                        <Tabs.Root className="flex flex-col justify-start" value={activeTab} onValueChange={setActiveTab}>
                            <Tabs.List className="bg-gray-200 rounded-2xl py-3 px-2">
                                {[
                                    { id: 'up', label: 'Sign Up' },
                                    { id: 'in', label: 'Sign In' }
                                ].map(({ id, label }) => (
                                    <Tabs.Trigger
                                        key={id}
                                        value={id}
                                        className={`w-56 py-2 font-bold text-xl rounded-2xl transition-colors duration-200 cursor-pointer mx-1
                                        ${activeTab === id
                                                ? 'bg-green-200 text-white'
                                                : 'hover:bg-white'
                                            }
                                    `}
                                    >
                                        <span>{label}</span>
                                    </Tabs.Trigger>
                                ))}
                            </Tabs.List>

                            <Tabs.Content value="up">
                                <div className='flex justify-center mt-5'>
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-white p-6 rounded-2xl shadow-2xl shadow-black w-full flex flex-col justify-center"
                                    >
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mb-4">
                                                <label
                                                    htmlFor="email"
                                                    className="block font-bold text-1.2xl text-black mb-1"
                                                >
                                                    First Name:
                                                </label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    ref={firstNameRef}
                                                    placeholder="Enter Your First Name"
                                                    className="p-2 w-full border-2 border-black rounded-lg"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label
                                                    htmlFor="email"
                                                    className="block font-bold text-1.2xl text-black mb-1"
                                                >
                                                    Last Name:
                                                </label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    ref={lastNameRef}
                                                    placeholder="Enter Your Last Name"
                                                    className="p-2 w-full border-2 border-black rounded-lg"
                                                />
                                            </div>

                                            <div className="mb-4 col-span-2">
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

                                            <div className="mb-4 col-span-2">
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
                                                        className="p-2 w-96 -ml-1 border-r-2 border-l-1 border-black rounded-l-lg"
                                                    />
                                                    {isPassword && <Eye className='mt-2 mr-1 cursor-pointer' onClick={() => EyeIcon()} />}
                                                    {!isPassword && <EyeOffIcon className='mt-2 mr-1 cursor-pointer' onClick={() => EyeIcon()} />}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={signUp}
                                            className="w-full btn btn-primary"
                                        >
                                            Sign Up
                                        </button>
                                    </motion.div>
                                </div>
                            </Tabs.Content>

                            <Tabs.Content value="in">
                                <div className='flex justify-center mt-5'>
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-white p-6 rounded-2xl shadow-2xl shadow-black w-full flex flex-col justify-center"
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
                                                        className="p-2 w-96 -ml-1 border-r-2 border-l-1 border-black rounded-l-lg"
                                                    />
                                                    {isPassword && <Eye className='mt-2 mr-1 cursor-pointer' onClick={() => EyeIcon()} />}
                                                    {!isPassword && <EyeOffIcon className='mt-2 mr-1 cursor-pointer' onClick={() => EyeIcon()} />}
                                                </div>
                                            </div>
                                            {isAskedOtp && (<div className="mb-4">
                                                <label
                                                    htmlFor="email"
                                                    className="block font-bold text-1.2xl text-black mb-1"
                                                >
                                                    One Time Password:
                                                </label>
                                                <input
                                                    type="text"
                                                    id="otp"
                                                    ref={otpRef}
                                                    placeholder="Enter Your Email Id"
                                                    className="p-2 w-full border-2 border-black rounded-lg"
                                                />
                                                <div className='flex justify-center items-center gap-3 mt-3'>
                                                    <b className='font-bold'>Didn't Received The OTP?</b>
                                                    <button onClick={getOtp} className='bg-green-200 rounded-lg font-semibold px-2 py-1'>
                                                        Resend!
                                                    </button>
                                                </div>
                                            </div>)}
                                        </div>
                                        <button
                                            onClick={isAskedOtp ? signIn : getOtp}
                                            className="w-full btn btn-primary"
                                        >
                                            {isAskedOtp ? "Sign In" : "Get OTP"}
                                        </button>
                                    </motion.div>
                                </div>
                            </Tabs.Content>
                        </Tabs.Root>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sign;