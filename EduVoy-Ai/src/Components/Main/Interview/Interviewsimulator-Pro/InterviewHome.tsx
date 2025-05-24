import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { universityNameAtom, courseNameAtom, intakeMonthAtom, destinationCountryAtom, interviewerAtom, isSubmitedAtom } from './atoms';
import { motion } from 'framer-motion';
import { Mic, BookOpen, School, Award, GraduationCap } from 'lucide-react';

const InterviewHome: React.FC = () => {
    const [isDetails, setIsDetails] = useState(false);

    const destinationCountry = useRecoilValue(destinationCountryAtom);
    const universityName = useRecoilValue(universityNameAtom);
    const courseName = useRecoilValue(courseNameAtom);
    const intake = useRecoilValue(intakeMonthAtom);

    const setDestinationCountry = useSetRecoilState(destinationCountryAtom);
    const setUniversityName = useSetRecoilState(universityNameAtom);
    const setCourseName = useSetRecoilState(courseNameAtom);
    const setIntake = useSetRecoilState(intakeMonthAtom);
    const setInterviewer = useSetRecoilState(interviewerAtom);
    const setIsSubmited = useSetRecoilState(isSubmitedAtom);

    const interviewSection = useRef<HTMLDivElement | null>(null);

    const handleScrollToSection = () => {
        interviewSection.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    function submitDetails() {
        if (destinationCountry !== '' && universityName !== '' && courseName !== '' && intake !== '') {
            setIsDetails(true);
            setTimeout(() => {
                handleScrollToSection();
            }, 500);
        } else {
            alert("Kindly fill all details before submitting!");
        }
    }

    function submitInterviewerDetails() {
        setInterviewer(videos[currentIndex].interviewerName.toLowerCase());
        setIsSubmited(true);
    }

    //Choose Interviewer Section
    const videos = [
        {
            interviewerName: "Nova",
            videoUrl: "https://youtu.be/3l_KWu5BAMI"
        },
        {
            interviewerName: "Ash",
            videoUrl: "https://youtu.be/HOMiL_a-oBo"
        },
        {
            interviewerName: "Shimmer",
            videoUrl: "https://youtu.be/xi4q0gsggHo"
        },
        {
            interviewerName: "Alloy",
            videoUrl: "https://youtu.be/7zJ0RUwalaU"
        },
        {
            interviewerName: "Coral",
            videoUrl: "https://youtu.be/34qdCCj7WKg"
        },
        {
            interviewerName: "Onyx",
            videoUrl: "https://youtu.be/ZTPeK7YPZRc"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [swiping, setSwiping] = useState(false);
    const videoContainerRef = useRef(null);

    // Function to extract YouTube video ID
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Handle navigation
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
    };

    // Touch handlers for swipe functionality
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchStart(e.targetTouches[0].clientX);
        setSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (swiping) {
            setTouchEnd(e.targetTouches[0].clientX);
        }
    };

    const handleTouchEnd = () => {
        setSwiping(false);

        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isSwipeSignificant = Math.abs(distance) > 50;

        if (isSwipeSignificant) {
            if (distance > 0) {
                // Swiped left - go next
                handleNext();
            } else {
                // Swiped right - go previous
                handlePrev();
            }
        }

        setTouchStart(null);
        setTouchEnd(null);
    };

    return (
        <div className="bg-white mb-24">
            <div className="relative overflow-hidden">
                <div className="absolute rounded-lg inset-0 bg-gradient-to-r from-green-222 to-green-50 z-0"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="py-12 md:py-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
                                Ace Your <span className="text-green-200">International</span> Interview
                            </h1>
                            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                                Real-time AI-powered interview simulation for Indian students preparing for international university and visa interviews.
                            </p>
                            <div className="mt-8 flex justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <button
                                        onClick={() => window.scrollTo({ top: document.getElementById('interview-data')?.offsetTop || 0, behavior: 'smooth' })}
                                        className="btn btn-primary"
                                    >
                                        Start Practicing
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Why Interview Simulator Pro?</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Practice with our AI interviewer that simulates real international interview scenarios
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <FeatureCard
                            icon={<Mic className="h-8 w-8 text-black" />}
                            title="Real-time Conversation"
                            description="Natural conversation with an AI interviewer that responds to your voice and adapts to your answers."
                        />
                        <FeatureCard
                            icon={<BookOpen className="h-8 w-8 text-black" />}
                            title="Personalized Feedback"
                            description="Get feedback on your performance, including suggested improvements for your responses."
                        />
                        <FeatureCard
                            icon={<School className="h-8 w-8 text-black" />}
                            title="Build Confidence"
                            description="Practice in a low-pressure environment to build confidence for your actual interview."
                        />
                    </div>
                    <div className="mt-12 grid gap-8 grid-cols-2">
                        <FeatureCard
                            icon={<GraduationCap className="h-8 w-8 text-black" />}
                            title="University-Specific Prep"
                            description="Prepare for questions related to your specific university and program of study."
                        />
                        <FeatureCard
                            icon={<Award className="h-8 w-8 text-black" />}
                            title="Improve Success Rate"
                            description="Increase your chances of visa approval and university admission with targeted practice."
                        />
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                id="interview-data"
                className="mb-10 space-y-3 p-5 rounded-lg shadow-xl"
            >
                <h1 className='text-center text-3xl font-bold underline underline-offset-4 mb-5'>Submit Your Study Abroad Details</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className="mb-4">
                        <label htmlFor="destination" className="block font-bold text-xl text-black mb-1">
                            Study Destination Country:
                        </label>
                        <input
                            type="text"
                            id="destination"
                            onChange={(e) => setDestinationCountry(e.target.value)}
                            placeholder="Study Destination Country"
                            className="p-2 w-full border text-lg border-black rounded-lg"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="universityName" className="block font-bold text-xl text-black mb-1">
                            University Name:
                        </label>
                        <input
                            type="text"
                            id="universityName"
                            onChange={(e) => setUniversityName(e.target.value)}
                            placeholder="University Name"
                            className="p-2 w-full border text-lg border-black rounded-lg"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="courseName" className="block font-bold text-xl text-black mb-1">
                            Course Name:
                        </label>
                        <input
                            type="text"
                            id="courseName"
                            onChange={(e) => setCourseName(e.target.value)}
                            placeholder="Course Name"
                            className="p-2 w-full border text-lg border-black rounded-lg"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="intakeMonth" className="block font-bold text-xl text-black mb-1">
                            Intake:
                        </label>
                        <input
                            type="text"
                            id="intakeMonth"
                            onChange={(e) => setIntake(e.target.value)}
                            placeholder="Intake"
                            className="p-2 w-full border text-lg border-black rounded-lg"
                        />
                    </div>
                </div>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={submitDetails}
                    className="w-full btn btn-primary font-bold"
                >
                    Submit
                </motion.button>

                {isDetails && (<div ref={interviewSection} className="w-full py-5 bg-gray-50 rounded-xl">
                    <h1 className="text-4xl text-center font-bold underline underline-offset-4 mb-12">
                        Choose Your Interviewer
                    </h1>

                    {/* Video Carousel */}
                    <div className="relative w-full max-w-4xl mx-auto px-4">
                        {/* Navigation Buttons */}
                        <div className="absolute top-60 left-0 transform -translate-y-1/2 z-20">
                            <button
                                onClick={handlePrev}
                                className="flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-green-200"
                                aria-label="Previous video"
                            >
                                <ChevronLeft className="h-10 w-10 text-gray-700" />
                            </button>
                        </div>

                        <div className="absolute top-60 right-0 transform -translate-y-1/2 z-20">
                            <button
                                onClick={handleNext}
                                className="flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-green-200"
                                aria-label="Next video"
                            >
                                <ChevronRight className="h-10 w-10 text-gray-700" />
                            </button>
                        </div>

                        {/* Main Video Container with Swipe Support */}
                        <div
                            ref={videoContainerRef}
                            className="w-full aspect-video rounded-xl overflow-hidden shadow-xl"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <div className="relative w-full h-full">
                                <div className="w-full h-full">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getYouTubeId(videos[currentIndex].videoUrl)}?autoplay=1&controls=0&loop=1&playlist=${getYouTubeId(videos[currentIndex].videoUrl)}`}
                                        title={`${videos[currentIndex].interviewerName} video`}
                                        className="w-full h-full"
                                        allow="autoplay; encrypted-media; fullscreen"
                                        allowFullScreen
                                    />
                                </div>

                                {/* Name and address always visible */}
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 py-5 z-10 text-center">
                                    <h3 className="text-white text-3xl font-bold">{videos[currentIndex].interviewerName}</h3>
                                </div>
                            </div>
                        </div>
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={submitInterviewerDetails}
                            className="w-full btn btn-primary font-bold mt-10"
                        >
                            Choose {videos[currentIndex].interviewerName} As Your Interviewer
                        </motion.button>
                    </div>
                </div>)}
            </motion.div>
        </div>
    );
};

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
            <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-200 mb-4">
                    {icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
                <p className="text-base text-gray-600">{description}</p>
            </div>
        </motion.div>
    );
};

export default InterviewHome;