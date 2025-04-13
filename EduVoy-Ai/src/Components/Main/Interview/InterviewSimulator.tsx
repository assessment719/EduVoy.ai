import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, UserIcon, AlertCircle, Loader2 } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { motion } from 'framer-motion';
import { analyzeResponse } from './analysation';
import { Question } from './../../../Utils/question';
import { BACKEND_URL } from './../../../config';

const InterviewSimulator: React.FC = () => {
    const [isListening, setIsListening] = useState(false);
    const [feedback, setFeedback] = useState(sessionStorage.getItem('feedback') || '');
    const [sampleAnswer, setSampleAnswer] = useState(sessionStorage.getItem('sampleAnswer') || 0);
    const [currentScore, setCurrentScore] = useState(sessionStorage.getItem('currentScore') || 0);
    const [error, setError] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [interviewQuestions, setInterviewQuestions] = useState<Question[]>([]);

    const [universityName, setUniversityName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [intakeMonth, setIntake] = useState('');
    const [destinationCountry, setDestinationCountry] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable
    } = useSpeechRecognition();

    const currentQuestion = interviewQuestions[currentQuestionIndex];

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => setError(''))
                .catch((err) => {
                    setError('Microphone access denied. Please enable microphone access in your browser settings.');
                    console.error('Microphone access error:', err);
                });
        }
    }, []);

    const fetchQuestions = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/users/questions`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data: { questions: Question[] } = await response.json();
            setInterviewQuestions(data.questions);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    }

    useEffect(() => {
        resetAllFields();
        fetchQuestions();
    }, []);

    const startListening = async () => {
        try {
            setError('');
            setIsListening(true);
            resetTranscript();
            await SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
        } catch (err) {
            console.error('Speech recognition error:', err);
            setError('Failed to start speech recognition. Please try again.');
            setIsListening(false);
        }
    };

    const stopListening = async () => {
        setIsListening(false);
        SpeechRecognition.stopListening();
        if (transcript) {
          await analyzeSpeech(transcript);
        }
    };

    const analyzeSpeech = async (speech: string) => {
        const university = localStorage.getItem('universityName') || '';
        const course = localStorage.getItem('courseName') || '';
        const intake = localStorage.getItem('intakeMonth') || '';
        const destination = localStorage.getItem('destinationCountry') || '';

        setIsAnalyzing(true);
        try {
            const result = await analyzeResponse(
                currentQuestion.question,
                speech,
                currentQuestion.evaluationPrompt,
                currentQuestion.expectedKeywords,
                university,
                course,
                intake,
                destination
            );

            if (!result) {
                console.error('Error analyzing speech:', error);
                setError('Failed to analyze response. Please try again.');
                return
            }

            setCurrentScore(result.score);
            setFeedback(result.feedback);
            setSampleAnswer(result.sampleAnswer);

            setTimeout(ScrollToSimulator, 100);

            sessionStorage.setItem('feedback', result.feedback);
            sessionStorage.setItem('sampleAnswer', result.sampleAnswer);
            sessionStorage.setItem('currentScore', result.score.toString());
        } catch (error) {
            console.error('Error analyzing speech:', error);
            setError('Failed to analyze response. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < interviewQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setFeedback('');
            setCurrentScore(0);
            resetTranscript();
        }
    };

    const simulatorRef = useRef<HTMLButtonElement | null>(null);

    const ScrollToSimulator = () => {
        simulatorRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const submitAllFields = () => {
        if (universityName && courseName && intakeMonth && destinationCountry) {
            localStorage.setItem('universityName', universityName);
            localStorage.setItem('courseName', courseName);
            localStorage.setItem('intakeMonth', intakeMonth);
            localStorage.setItem('destinationCountry', destinationCountry);
            setIsSubmitted(true);
            setTimeout(ScrollToSimulator, 100);
        } else {
            alert('Please fill in all fields before submitting.');
        }
    };

    const resetAllFields = () => {
        localStorage.removeItem('universityName');
        localStorage.removeItem('courseName');
        localStorage.removeItem('intakeMonth');
        localStorage.removeItem('destinationCountry');
        sessionStorage.removeItem('feedback');
        sessionStorage.removeItem('sampleAnswer');
        sessionStorage.removeItem('currentScore');

        setUniversityName('');
        setCourseName('');
        setIntake('');
        setDestinationCountry('');
        setFeedback('');
        setSampleAnswer('');
        setCurrentScore(0);
        setIsSubmitted(false);
        resetTranscript();
    };

    useEffect(() => {
        const handleWindowLoad = () => {
            resetAllFields();
        };

        window.addEventListener('load', handleWindowLoad);

        return () => {
            window.removeEventListener('load', handleWindowLoad);
        };
    }, []);

    if (!browserSupportsSpeechRecognition) {
        return (
            <div className="p-4 bg-yellow-50 rounded-lg text-yellow-800">
                <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-[1000px] mx-auto p-6 bg-white rounded-2xl shadow-xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-3 space-y-3"
            >
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className="mb-4">
                        <label htmlFor="destination" className="block font-bold text-xl text-black mb-1">
                            Study Destination Country:
                        </label>
                        <input
                            type="text"
                            id="destination"
                            value={destinationCountry}
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
                            value={universityName}
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
                            value={courseName}
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
                            value={intakeMonth}
                            onChange={(e) => setIntake(e.target.value)}
                            placeholder="Intake"
                            className="p-2 w-full border text-lg border-black rounded-lg"
                        />
                    </div>
                </div>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={submitAllFields}
                    className="w-full btn btn-primary font-bold"
                >
                    Submit
                </motion.button>
            </motion.div>

            {isSubmitted && (
                <div>
                    <div className="flex items-center justify-between mb-8 mt-5">
                        <h2 className="text-2xl font-bold text-gray-800">Interview Simulation</h2>
                        <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold">Current Score:</span>
                            <span className="font-semibold text-lg">{currentScore}%</span>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 rounded-lg text-red-800">
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="w-5 h-5" />
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <div className="mb-8">
                        <motion.div
                            key={currentQuestion.id}
                            className="flex items-center space-x-4 p-4 bg-gray-200 rounded-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                                <UserIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-xl font-bold">
                                    {currentQuestion.question}
                                </p>
                                <p className="text-lg mt-1 font-medium">
                                    Category: {currentQuestion.category} | Difficulty: {currentQuestion.difficulty}
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col items-center space-y-2">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={isListening ? stopListening : startListening}
                                className={`p-4 rounded-full ${isListening
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-blue-500 hover:bg-blue-600'
                                    } text-white transition-colors cursor-pointer`}
                                disabled={!isMicrophoneAvailable || isAnalyzing}
                            >
                                {isAnalyzing ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : isListening ? (
                                    <MicOff className="w-6 h-6" />
                                ) : (
                                    <Mic className="w-6 h-6" />
                                )}
                            </motion.button>
                            <span className="text-lg font-bold">
                                {isAnalyzing ? 'Analyzing response...' : isListening ? 'Click to stop' : 'Click to start speaking'}
                            </span>
                        </div>

                        <div className="p-4 bg-gray-50 text-lg rounded-lg min-h-[100px]">
                            <p>
                                {isSubmitted && (transcript || "Your response will appear here as you speak...")}
                            </p>
                        </div>

                        {feedback && sampleAnswer && <div className='flex justify-around bg-green-50 rounded-xl'>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 w-[50%] border-r-2 border-black"
                            >
                                <h2 className="font-bold text-xl mb-2">Feedback:</h2>
                                <p className="text-green-700 text-lg">{feedback}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 w-[50%] border-l-2 border-black"
                            >
                                <h2 className="font-bold text-xl mb-2">Sample Answer:</h2>
                                <p className="text-green-700 text-lg">{sampleAnswer}</p>
                            </motion.div>
                        </div>}

                        {feedback && currentQuestionIndex < interviewQuestions.length - 1 && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={nextQuestion}
                                className="w-full btn btn-primary font-bold"
                            >
                                Next Question
                            </motion.button>
                        )}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={resetAllFields}
                            className="w-full btn btn-primary font-bold"
                            ref={simulatorRef}
                        >
                            Reset Details
                        </motion.button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewSimulator;