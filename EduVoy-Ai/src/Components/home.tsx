import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSetRecoilState } from 'recoil';
import { useState, useRef, useEffect, RefObject } from 'react';
import { signAtom } from '../Atoms/atoms';
import { ChevronLeft, ChevronRight, Play, ArrowBigUpDash } from 'lucide-react';
import { FaFacebookSquare, FaInstagram, FaLinkedin, FaYoutube, FaEnvelope, FaPhone, FaCheckCircle } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Review } from './../Utils/reviews';
import YouTube from 'react-youtube';
import { BACKEND_URL } from '../config';

const videos: Review[] = [
    {
        id: 'student1',
        category: 'students',
        userName: 'Arjun Patel',
        address: 'Delhi, India',
        thumbnailUrl: 'https://i.postimg.cc/KY6bCcV5/Student1.jpg',
        videoUrl: 'https://youtu.be/XVEVM-K98To?si=PJv_2iEJXi5PjNal'
    },
    {
        id: 'student2',
        category: 'students',
        userName: 'Priya Sharma',
        address: 'Mumbai, India',
        thumbnailUrl: 'https://i.postimg.cc/qqYxxYgg/Student2.jpg',
        videoUrl: 'https://youtu.be/ubJa33xxwEU?si=NDz1vKRMdVTzNWDd'
    },
    {
        id: 'student3',
        category: 'students',
        userName: 'Rohan Desai',
        address: 'Bengaluru, India',
        thumbnailUrl: 'https://i.postimg.cc/0yG7zrGz/Student3.jpg',
        videoUrl: 'https://youtu.be/RSZodw38Ems?si=sKH-jlRFQ65pC0Ae'
    },
    {
        id: 'recruiter1',
        category: 'recruiters',
        userName: 'Nandini Mehta',
        address: 'GlobalEd Pathways, Bengaluru, India',
        thumbnailUrl: 'https://i.postimg.cc/Xvd2sV0F/Recruiter1.jpg',
        videoUrl: 'https://youtu.be/FWuEGWeTRu8?si=3-yOuZcj8yKCqa7G'
    },
    {
        id: 'recruiter2',
        category: 'recruiters',
        userName: 'Vikram Adani',
        address: 'Dream Horizon Consultants, New Delhi, India',
        thumbnailUrl: 'https://i.postimg.cc/kgtw5nGZ/Recruiter2.jpg',
        videoUrl: 'https://youtu.be/XTp5jaRU3Ws?si=H1UCSjsMRYt7HCjG'
    },
    {
        id: 'recruiter3',
        category: 'recruiters',
        userName: 'Rajeev Malhotra',
        address: 'Aarna International Education, Ahmedabad, India',
        thumbnailUrl: 'https://i.postimg.cc/fyJmgK0F/Recruiter3.jpg',
        videoUrl: 'https://youtu.be/WZjqblzUIXE?si=lDS90h_RLatn71GR'
    }
];

function Home() {
    const navigate = useNavigate();
    const setSign = useSetRecoilState(signAtom);
    const [isHover, setIsHover] = useState(0);
    const [isSendMsg, setIsSendMsg] = useState(false);
    const [isAboutPlaying, setIsAboutPlaying] = useState(false);


    const topSection = useRef<HTMLDivElement | null>(null);
    const aboutSection = useRef<HTMLDivElement | null>(null);
    const serviceSection = useRef<HTMLDivElement | null>(null);
    const reviewsSection = useRef<HTMLDivElement | null>(null);
    const contactSection = useRef<HTMLDivElement | null>(null);

    const [activeCategory, setActiveCategory] = useState('students');

    const handleScrollToSection = (section: RefObject<HTMLDivElement>) => {
        section.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    function signUp() {
        setSign('up');
        navigate("/sign");
    }

    function signIn() {
        setSign('in');
        navigate("/sign");
    }

    //For Review Section
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const filteredVideos = videos.filter(video => video.category === activeCategory);

    useEffect(() => {
        setCurrentIndex(0);
        setIsPlaying(false);
    }, [activeCategory]);

    const handlePrev = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setIsPlaying(false);
        setCurrentIndex(prev =>
            prev === 0 ? filteredVideos.length - 1 : prev - 1
        );

        setTimeout(() => {
            setIsTransitioning(false);
        }, 300);
    };

    const handleNext = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setIsPlaying(false);
        setCurrentIndex(prev =>
            prev === filteredVideos.length - 1 ? 0 : prev + 1
        );

        setTimeout(() => {
            setIsTransitioning(false);
        }, 300);
    };

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handleVideoEnd = () => {
        setIsPlaying(false);
    };

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    if (filteredVideos.length === 0) {
        return <div className="text-center py-12">No videos available for this category.</div>;
    }

    const getVideoIndex = (index: number) => {
        const len = filteredVideos.length;
        return ((index % len) + len) % len;
    };

    const prevIndex = getVideoIndex(currentIndex - 1);
    const nextIndex = getVideoIndex(currentIndex + 1);

    //For Contact Us Section
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [subject, setSubject] = useState('General Inquiry');
    const [message, setMessage] = useState('');

    async function sendQuery() {
        if (fullName && email && phoneNo && subject && message) {
            try {
                await fetch(`${BACKEND_URL}/users/querries`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ fullName, email, phoneNo, subject, message }),
                });
                setIsSendMsg(true);
            } catch (error) {
                console.error('Error during sign-up:', error);
            }

            //Reset Form
            setFullName('');
            setEmail('');
            setPhoneNo('');
            setSubject('General Inquiry');
            setMessage('');
        } else {
            alert('Please Fill The Contact Form.')
        }
    }

    return (
        <>
            <div className='fixed top-[87vh] left-8 z-50'>
                <div onClick={() => handleScrollToSection(topSection)} className="h-16 w-16 rounded-full bg-green-200 flex justify-center items-center shadow-black shadow-lg cursor-pointer">
                    <ArrowBigUpDash className='h-12 w-12' />
                </div>
            </div>
            <div className="min-h-screen bg-gray-50">
                <header className="bg-gradient-to-b from-green-200 fixed w-full z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                        <img className="w-36" src="https://i.postimg.cc/G2Gdrhxb/logopng.png" />
                        <ul className='flex gap-14 text-2xl font-bold'>
                            <li onClick={() => handleScrollToSection(aboutSection)} onMouseEnter={() => setIsHover(1)} onMouseLeave={() => setIsHover(0)} className={`${isHover === 1 ? 'border-black' : 'border-transparent'} headerList`}>About Us</li>
                            <li onClick={() => handleScrollToSection(serviceSection)} onMouseEnter={() => setIsHover(2)} onMouseLeave={() => setIsHover(0)} className={`${isHover === 2 ? 'border-black' : 'border-transparent'} headerList`}>Services</li>
                            <li onClick={() => handleScrollToSection(reviewsSection)} onMouseEnter={() => setIsHover(3)} onMouseLeave={() => setIsHover(0)} className={`${isHover === 3 ? 'border-black' : 'border-transparent'} headerList`}>Reviews</li>
                            <li onClick={() => handleScrollToSection(contactSection)} onMouseEnter={() => setIsHover(4)} onMouseLeave={() => setIsHover(0)} className={`${isHover === 4 ? 'border-black' : 'border-transparent'} headerList`}>Contact Us</li>
                        </ul>
                        <div className='flex gap-4'>
                            <button onClick={signUp} className="text-2xl font-bold px-3 py-2 rounded-2xl bg-transparent border-2 border-black shadow-lg hover:shadow-black hover:bg-black hover:text-green-200 transition-all duration-300">Sign Up</button>
                            <button onClick={signIn} className="text-2xl font-bold px-3 py-2 rounded-2xl bg-transparent border-2 border-black shadow-lg hover:shadow-black hover:bg-black hover:text-green-200 transition-all duration-700">Sign In</button>
                        </div>
                    </div>
                </header>

                <div ref={topSection}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className='text-white text-left mt-10 font-bold absolute top-56 left-10 z-10'
                    >
                        <h1 className='mb-5 text-7xl'>Welcome To The<br />World Of EduVoy.ai</h1>
                        <p className='text-5xl'>- Bridging Dreams with Global Opportunities</p>
                    </motion.div>

                    <div className='w-full h-screen bg-gradient-to-tr from-black opacity-60 absolute'></div>

                    <img src='https://i.postimg.cc/wjLPwCY5/pexels-olly-3762800.jpg' className='w-screen h-screen object-cover shadow-2xl shadow-black mb-5' />
                </div>

                <div ref={aboutSection}>
                    <h1 className='text-5xl text-center mt-10 font-bold underline underline-offset-4'>About Us</h1>

                    <div className='flex justify-between px-10 py-10 items-center'>
                        <div className='mx-10'>
                            <h1 className='my-5 font-bold text-3xl underline underline-offset-8'>EduVoy.ai: Your Gateway to Global Education</h1>
                            <p className='text-xl max-w-[2500px]'>EduVoy.ai is an AI-powered platform designed to transform the study abroad journey for students and consultancies. By integrating advanced technology with user-centric features, we simplify complex processes like university and course selection, SOP creation, and interview preparation. Our goal is to empower students with the tools and guidance they need to make informed decisions and achieve their academic dreams.<br /><br />From personalized university matches to 24/7 AI-driven chat support, EduVoy.ai offers a seamless, end-to-end solution for studying abroad. Whether it’s organizing options with the Dream List or acing interviews with our Simulator, we ensure every step is stress-free and efficient. EduVoy.ai is your trusted partner in navigating the global education landscape with confidence and ease.</p>
                        </div>
                        <div className='mx-10'>
                            {isAboutPlaying ? (
                                <div className="h-96 w-[600px] rounded-xl shadow-xl shadow-black overflow-hidden">
                                    <YouTube
                                        videoId={getYouTubeId('https://youtu.be/WgGV5EE-8Co?si=lWshLb-v-i-lWXgf') || ''}
                                        opts={{
                                            width: '100%',
                                            height: '100%',
                                            playerVars: {
                                                autoplay: 1,
                                                controls: 1,
                                            },
                                        }}
                                        onEnd={() => setIsAboutPlaying(false)}
                                        className="h-full w-full"
                                        iframeClassName="h-full w-full"
                                    />
                                </div>
                            ) : (
                                <div
                                    className="relative h-96 w-[600px] rounded-xl shadow-xl shadow-black overflow-hidden"
                                    style={{
                                        backgroundImage: `url(https://i.postimg.cc/9MnR0157/Generated-Image.avif)`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center">
                                        <button
                                            onClick={() => setIsAboutPlaying(true)}
                                            className="play-button flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-90 shadow-lg hover:bg-opacity-100 transition-all duration-300 transform hover:scale-110"
                                        >
                                            <Play className="h-8 w-8 text-green-200 ml-1" />
                                        </button>
                                        <div className="mt-4 text-center px-4">
                                            <h3 className="text-white text-3xl font-bold">Piyobroto Das</h3>
                                            <p className="text-gray-200 text-2xl mt-2">CEO & Founder of EduVoy.ai</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div ref={serviceSection}>
                    <h1 className='text-5xl text-center mt-10 font-bold underline underline-offset-4'>Our Services</h1>

                    <div className='flex justify-between px-28 py-10 items-center'>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -15% 0px",
                            }}
                            className='mx-10'
                        >
                            <h1 className='my-5 font-bold text-3xl'>Find Universities</h1>
                            <p className='text-xl max-w-[2500px]'>EduVoy.ai’s University Finder matches students with ideal universities by analyzing their academic profile, preferences, and goals. It simplifies the search process, offering tailored recommendations based on rankings, location, and eligibility, ensuring students find the best-fit institutions for their study abroad journey.</p>
                            <button className='my-5 btn btn-primary'>Try Once!</button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -20% 0px",
                            }}
                            className='mx-10'
                        >
                            <img className='rounded-xl shadow-xl shadow-black object-cover h-96 w-[3000px]' src="https://plus.unsplash.com/premium_photo-1681505336207-cea25b6cf0ea?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3JvdXAlMjBvZiUyMHN0dWRlbnRzfGVufDB8fDB8fHww" />
                        </motion.div>
                    </div>

                    <div className='flex justify-between px-28 py-10 items-center'>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -20% 0px",
                            }}
                            className='mx-10'
                        >
                            <img className='rounded-xl shadow-xl shadow-black object-cover h-96 w-[3000px]' src="https://plus.unsplash.com/premium_photo-1681505336207-cea25b6cf0ea?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3JvdXAlMjBvZiUyMHN0dWRlbnRzfGVufDB8fDB8fHww" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -15% 0px",
                            }}
                            className='mx-10'
                        >
                            <h1 className='my-5 font-bold text-3xl'>Find Courses</h1>
                            <p className='text-xl max-w-[2500px]'>Explore courses aligned with your interests and career aspirations. EduVoy.ai’s Course Finder provides detailed insights into programs, specializations, and prerequisites, helping students make informed decisions about their academic future while considering factors like curriculum, duration, and career outcomes.</p>
                            <button className='my-5 btn btn-primary'>Try Once!</button>
                        </motion.div>
                    </div>

                    <div className='flex justify-between px-28 py-10 items-center'>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -15% 0px",
                            }}
                            className='mx-10'
                        >
                            <h1 className='my-5 font-bold text-3xl'>Dream List</h1>
                            <p className='text-xl max-w-[2500px]'>Save, organize, and compare universities and courses effortlessly. EduVoy.ai’s Dream List feature allows students to evaluate options based on tuition fees, location, rankings, and more, offering an intuitive interface for streamlined decision-making and planning.</p>
                            <button className='my-5 btn btn-primary'>Try Once!</button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -20% 0px",
                            }}
                            className='mx-10'
                        >
                            <img className='rounded-xl shadow-xl shadow-black object-cover h-96 w-[3000px]' src="https://plus.unsplash.com/premium_photo-1681505336207-cea25b6cf0ea?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3JvdXAlMjBvZiUyMHN0dWRlbnRzfGVufDB8fDB8fHww" />
                        </motion.div>
                    </div>

                    <div className='flex justify-between px-28 py-10 items-center'>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -20% 0px",
                            }}
                            className='mx-10'
                        >
                            <img className='rounded-xl shadow-xl shadow-black object-cover h-96 w-[3000px]' src="https://plus.unsplash.com/premium_photo-1681505336207-cea25b6cf0ea?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3JvdXAlMjBvZiUyMHN0dWRlbnRzfGVufDB8fDB8fHww" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -15% 0px",
                            }}
                            className='mx-10'
                        >
                            <h1 className='my-5 font-bold text-3xl'>SOP Generator</h1>
                            <p className='text-xl max-w-[2500px]'>Craft personalized, plagiarism-free Statements of Purpose with ease. EduVoy.ai’s SOP Generator uses AI to create compelling, tailored essays that highlight your strengths, ensuring your application stands out to universities and admissions committees.</p>
                            <button className='my-5 btn btn-primary'>Try Once!</button>
                        </motion.div>
                    </div>

                    <div className='flex justify-between px-28 py-10 items-center'>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -15% 0px",
                            }}
                            className='mx-10'
                        >
                            <h1 className='my-5 font-bold text-3xl'>English Language Test Preparation (PrepELT+)</h1>
                            <p className='text-xl max-w-[2500px]'>Prepare effectively for English proficiency exams with PrepELT+. This all-in-one feature offers a 30-day study plan, smart tracking dashboard, and AI-powered exercises across Listening, Reading, Writing, and Speaking. Get real-time feedback, score insights, and targeted practice to boost your performance and confidence.</p>
                            <button className='my-5 btn btn-primary'>Try Once!</button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -20% 0px",
                            }}
                            className='mx-10'
                        >
                            <img className='rounded-xl shadow-xl shadow-black object-cover h-96 w-[3000px]' src="https://plus.unsplash.com/premium_photo-1681505336207-cea25b6cf0ea?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3JvdXAlMjBvZiUyMHN0dWRlbnRzfGVufDB8fDB8fHww" />
                        </motion.div>
                    </div>

                    <div className='flex justify-between px-28 py-10 items-center'>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -20% 0px",
                            }}
                            className='mx-10'
                        >
                            <img className='rounded-xl shadow-xl shadow-black object-cover h-96 w-[3000px]' src="https://plus.unsplash.com/premium_photo-1681505336207-cea25b6cf0ea?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3JvdXAlMjBvZiUyMHN0dWRlbnRzfGVufDB8fDB8fHww" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -15% 0px",
                            }}
                            className='mx-10'
                        >
                            <h1 className='my-5 font-bold text-3xl'>Interview Simulator</h1>
                            <p className='text-xl max-w-[2500px]'>Prepare confidently for university and visa interviews. EduVoy.ai’s Interview Simulator offers realistic practice sessions, instant feedback, and progress tracking, along with curated resources to help students excel in their interviews and boost their confidence.</p>
                            <button className='my-5 btn btn-primary'>Try Once!</button>
                        </motion.div>
                    </div>

                    <div className='flex justify-between px-28 py-10 items-center'>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -15% 0px",
                            }}
                            className='mx-10'
                        >
                            <h1 className='my-5 font-bold text-3xl'>Finance Planner</h1>
                            <p className='text-xl max-w-[2500px]'>Plan your study abroad finances effortlessly with EduVoy.ai’s Finance Planner. From tracking expenses and setting budgets to calculating loans and exploring funding options, this feature helps you make informed financial decisions for a stress-free journey.</p>
                            <button className='my-5 btn btn-primary'>Try Once!</button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -20% 0px",
                            }}
                            className='mx-10'
                        >
                            <img className='rounded-xl shadow-xl shadow-black object-cover h-96 w-[3000px]' src="https://plus.unsplash.com/premium_photo-1681505336207-cea25b6cf0ea?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3JvdXAlMjBvZiUyMHN0dWRlbnRzfGVufDB8fDB8fHww" />
                        </motion.div>
                    </div>

                    <div className='flex justify-between px-28 py-10 items-center'>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -20% 0px",
                            }}
                            className='mx-10'
                        >
                            <img className='rounded-xl shadow-xl shadow-black object-cover h-96 w-[3000px]' src="https://plus.unsplash.com/premium_photo-1681505336207-cea25b6cf0ea?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3JvdXAlMjBvZiUyMHN0dWRlbnRzfGVufDB8fDB8fHww" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -15% 0px",
                            }}
                            className='mx-10'
                        >
                            <h1 className='my-5 font-bold text-3xl'>Chat Support</h1>
                            <p className='text-xl max-w-[2500px]'>Get 24/7 assistance with EduVoy.ai’s AI-powered Chat Support. From instant responses to common queries to personalized guidance from Study Abroad Specialists, this feature ensures comprehensive support at every step of your study abroad journey.</p>
                            <button className='my-5 btn btn-primary'>Try Once!</button>
                        </motion.div>
                    </div>
                </div>

                <div ref={reviewsSection}>
                    <h1 className='text-5xl text-center mt-10 font-bold underline underline-offset-4'>Reviews and Success Stories</h1>

                    <div className='flex justify-center mt-10'>
                        <div className="tabsList w-[50%]">
                            <button
                                key='students'
                                className={`tabs ${activeCategory === 'students'
                                    ? 'activeTab'
                                    : 'inActiveTab'
                                    }`}
                                onClick={() => setActiveCategory('students')}
                            >
                                STUDENTS
                            </button>

                            <button
                                key='recruiters'
                                className={`tabs ${activeCategory === 'recruiters'
                                    ? 'activeTab'
                                    : 'inActiveTab'
                                    }`}
                                onClick={() => setActiveCategory('recruiters')}
                            >
                                RECRUITMENT PARTNERS
                            </button>
                        </div>
                    </div>

                    <div className="relative w-full max-w-8xl mx-auto px-4 md:px-8 mb-10">
                        <div className="absolute top-[46%] -left-4 md:left-4 transform -translate-y-[46%] z-20">
                            <button
                                onClick={handlePrev}
                                className={`flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-black transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-200`}
                                aria-label='Previous video'
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </button>
                        </div>

                        <div className="absolute top-[46%] -right-4 md:right-4 transform -translate-y-[46%] z-20">
                            <button
                                onClick={handleNext}
                                className={`flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-black transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-200`}
                                aria-label='Next video'
                            >
                                <ChevronRight className="h-8 w-8" />
                            </button>
                        </div>

                        <div className="relative flex items-center justify-center gap-4 overflow-hidden">
                            <div className="hidden md:block w-1/4 aspect-video opacity-50 transition-all duration-300">
                                <div
                                    className="w-full h-full rounded-lg overflow-hidden"
                                    style={{
                                        backgroundImage: `url(${filteredVideos[prevIndex].thumbnailUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                />
                            </div>

                            <div className="w-full md:w-1/2 aspect-video rounded-xl overflow-hidden shadow-xl bg-gray-900 z-10">
                                {isPlaying ? (
                                    <div className="w-full h-full">
                                        <YouTube
                                            videoId={getYouTubeId(filteredVideos[currentIndex].videoUrl) || ''}
                                            opts={{
                                                width: '100%',
                                                height: '100%',
                                                playerVars: {
                                                    autoplay: 1,
                                                    controls: 1,
                                                },
                                            }}
                                            onEnd={handleVideoEnd}
                                            className="w-full h-full"
                                            iframeClassName="w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className={`relative w-full h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-40' : 'opacity-100'}`}
                                        style={{
                                            backgroundImage: `url(${filteredVideos[currentIndex].thumbnailUrl})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center">
                                            <button
                                                onClick={handlePlay}
                                                className="play-button flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-90 shadow-lg hover:bg-opacity-100 transition-all duration-300 transform hover:scale-110"
                                            >
                                                <Play className="h-8 w-8 text-green-200 ml-1" />
                                            </button>
                                            <div className="mt-4 text-center px-4">
                                                <h3 className="text-white text-3xl font-bold">{filteredVideos[currentIndex].userName}</h3>
                                                <p className="text-gray-200 text-2xl mt-2">{filteredVideos[currentIndex].address}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="hidden md:block w-1/4 aspect-video opacity-50 transition-all duration-300">
                                <div
                                    className="w-full h-full rounded-lg overflow-hidden"
                                    style={{
                                        backgroundImage: `url(${filteredVideos[nextIndex].thumbnailUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex justify-center mt-6 gap-2">
                            {filteredVideos.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-green-200 w-6' : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    onClick={() => {
                                        setCurrentIndex(index);
                                        setIsPlaying(false);
                                    }}
                                    aria-label={`Go to video ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div ref={contactSection}>
                    <h1 className='text-5xl text-center my-10 font-bold underline underline-offset-4'>Contact Us</h1>

                    <h1 className='text-2xl text-center my-5 font-bold'>We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.</h1>

                    <div className="flex justify-center items-center mb-5">
                        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-6xl border border-black mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex flex-col">
                                    <label htmlFor="name" className="mb-2 font-semibold text-xl">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Your name"
                                        required
                                        className="p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="email" className="mb-2 font-semibold text-xl">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Your email"
                                        required
                                        className="p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                <div className="flex flex-col">
                                    <label htmlFor="phone" className="mb-2 font-semibold text-xl">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        placeholder="Your phone number"
                                        className="p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={phoneNo}
                                        onChange={(e) => setPhoneNo(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="subject" className="mb-2 font-semibold text-xl">Subject</label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        className="p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    >
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Technical Support">Technical Support</option>
                                        <option value="Partnership Opportunity">Partnership Opportunity</option>
                                        <option value="Feedback">Feedback</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col mt-5">
                                <label htmlFor="message" className="mb-2 font-semibold text-xl">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Your message"
                                    rows={5}
                                    required
                                    className="p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full mt-5"
                                onClick={sendQuery}
                            >
                                Send Message
                            </button>
                        </div>
                    </div>

                    {isSendMsg && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white p-8 rounded-2xl shadow-lg text-center relative w-full max-w-md">
                            <button
                                onClick={() => setIsSendMsg(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                            >
                                &times;
                            </button>

                            <div className="flex justify-center mb-4 text-green-200 text-6xl">
                                <FaCheckCircle />
                            </div>

                            <h3 className="text-3xl font-bold text-gray-800 mb-2">Thank You!</h3>
                            <p className="text-gray-600 mb-6 text-xl">
                                Your message has been submitted successfully. We'll get back to you shortly.
                            </p>

                            <button
                                onClick={() => setIsSendMsg(false)}
                                className="btn btn-primary"
                            >
                                Close
                            </button>
                        </motion.div>
                    </div>}
                </div>

                <div className='bg-green-333'>
                    <div className='grid grid-cols-4 mx-5'>
                        <div className='footerColumn'>
                            <img className="w-36" src="https://i.postimg.cc/G2Gdrhxb/logopng.png" />
                            <p className='my-5'>
                                EduVoy.ai is an AI-powered platform simplifying study abroad journeys. From university matching to SOP creation and interview prep, we offer 24/7 AI support for a seamless, stress-free experience. Your trusted global education partner.
                            </p>
                        </div>

                        <div className='footerColumn'>
                            <h4 className='footerHeading'>Address & Contact Details</h4>
                            <p className='mt-5'>
                                India Hub, 20<sup>th</sup> floor, Amrendra Bahubali Street, Chennai - 100678, Tamilnadu

                            </p>

                            <p className='mt-5 flex items-center cursor-pointer'>
                                <FaEnvelope className='mr-2' />info@eduvoy.ai
                            </p>

                            <p className='mt-2 flex items-center cursor-pointer'>
                                <FaPhone className='mr-2' />+910987654321
                            </p>
                        </div>

                        <div className='footerColumn'>
                            <h4 className='footerHeading'>Subscribe To Our Newsletter</h4>
                            <input type='email' placeholder='Enter Your Email Id' className='p-2 w-full mt-3 rounded-lg border border-gray-333'></input>
                            <button className='btn btn-primary mt-3 bg-gray-333 text-white'>Submit</button>
                        </div>

                        <div className='footerColumn'>
                            <h4 className='footerHeading'>Follow Us</h4>
                            <div className='grid grid-cols-5 gap-1 -ml-2 mt-2'>
                                <FaFacebookSquare className='socialMedia' />
                                <FaInstagram className='socialMedia' />
                                <FaLinkedin className='socialMedia' />
                                <FaXTwitter className='socialMedia' />
                                <FaYoutube className='socialMedia' />
                            </div>
                        </div>
                    </div>
                    <div className='text-center text-lg mt-5 py-2 border-t border-gray-333'>
                        <p>&copy; 2025 EduVoy.ai | All rights reserved.</p>
                        <a href="#" className='footerLink'>Terms of Use</a> | <a href="#" className='footerLink'>Privacy Policy</a> | <a href="#" className='footerLink'>Refund Policy</a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home