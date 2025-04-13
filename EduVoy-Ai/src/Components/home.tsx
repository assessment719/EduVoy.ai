import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSetRecoilState } from 'recoil';
import { useState } from 'react';
import { signAtom } from '../Atoms/atoms';

function Home() {

    const navigate = useNavigate();
    const setSign = useSetRecoilState(signAtom);
    const [isHover, setIsHover] = useState(0);

    const style = "cursor-pointer border-b-4 px-2 transition-all duration-500";

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
            <header className="bg-gradient-to-b from-green-200 fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <img className="w-36" src="https://i.postimg.cc/G2Gdrhxb/logopng.png" />
                    <ul className='flex gap-14 text-2xl font-bold'>
                        <li onMouseEnter={() => setIsHover(1)} onMouseLeave={() => setIsHover(0)} className={`${isHover === 1 ? 'border-black' : 'border-transparent'} ${style}`}>About Us</li>
                        <li onMouseEnter={() => setIsHover(2)} onMouseLeave={() => setIsHover(0)} className={`${isHover === 2 ? 'border-black' : 'border-transparent'} ${style}`}>Contact Us</li>
                        <li onMouseEnter={() => setIsHover(3)} onMouseLeave={() => setIsHover(0)} className={`${isHover === 3 ? 'border-black' : 'border-transparent'} ${style}`}>Services</li>
                    </ul>
                    <div className='flex gap-4'>
                        <button onClick={signUp} className="text-2xl font-bold px-3 py-2 rounded-2xl bg-transparent border-2 border-black shadow-lg hover:shadow-black transition-shadow duration-300">Sign Up</button>
                        <button onClick={signIn} className="text-2xl font-bold px-3 py-2 rounded-2xl bg-transparent border-2 border-black shadow-lg hover:shadow-black transition-shadow duration-300">Sign In</button>
                    </div>
                </div>
            </header>

            <div>
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

                <img src='https://plus.unsplash.com/premium_photo-1681505336207-cea25b6cf0ea?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3JvdXAlMjBvZiUyMHN0dWRlbnRzfGVufDB8fDB8fHww' className='w-screen h-screen object-cover shadow-2xl shadow-black mb-5' />
            </div>

            <div>
                <h1 className='text-5xl text-center mt-10 font-bold underline underline-offset-4'>About Us</h1>

                <div className='flex justify-between px-10 py-10 items-center'>
                    <div className='mx-10'>
                        <h1 className='my-5 font-bold text-3xl underline underline-offset-8'>EduVoy.ai: Your Gateway to Global Education</h1>
                        <p className='text-xl max-w-[2500px]'>EduVoy.ai is an AI-powered platform designed to transform the study abroad journey for students and consultancies. By integrating advanced technology with user-centric features, we simplify complex processes like university and course selection, SOP creation, and interview preparation. Our goal is to empower students with the tools and guidance they need to make informed decisions and achieve their academic dreams.<br /><br />From personalized university matches to 24/7 AI-driven chat support, EduVoy.ai offers a seamless, end-to-end solution for studying abroad. Whether it’s organizing options with the Dream List or acing interviews with our Simulator, we ensure every step is stress-free and efficient. EduVoy.ai is your trusted partner in navigating the global education landscape with confidence and ease.</p>
                    </div>
                    <div className='mx-10'>
                        <iframe
                            src="https://www.youtube.com/embed/IltsOcCj1Ak?si=HqZra2-moR1UYf88&autoplay=1&mute=1"
                            title="YouTube video player"
                            className="rounded-xl shadow-xl shadow-black object-cover h-96 w-[600px]">
                        </iframe>
                    </div>
                </div>
            </div>

            <div>
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
                        <h1 className='my-5 font-bold text-3xl'>Interview Simulator</h1>
                        <p className='text-xl max-w-[2500px]'>Prepare confidently for university and visa interviews. EduVoy.ai’s Interview Simulator offers realistic practice sessions, instant feedback, and progress tracking, along with curated resources to help students excel in their interviews and boost their confidence.</p>
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
                        <h1 className='my-5 font-bold text-3xl'>Finance Planner</h1>
                        <p className='text-xl max-w-[2500px]'>Plan your study abroad finances effortlessly with EduVoy.ai’s Finance Planner. From tracking expenses and setting budgets to calculating loans and exploring funding options, this feature helps you make informed financial decisions for a stress-free journey.</p>
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
                        <h1 className='my-5 font-bold text-3xl'>Chat Support</h1>
                        <p className='text-xl max-w-[2500px]'>Get 24/7 assistance with EduVoy.ai’s AI-powered Chat Support. From instant responses to common queries to personalized guidance from Study Abroad Specialists, this feature ensures comprehensive support at every step of your study abroad journey.</p>
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
            </div>
        </div>
    )
}

export default Home