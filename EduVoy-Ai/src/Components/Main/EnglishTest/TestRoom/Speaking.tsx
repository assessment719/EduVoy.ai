import { motion } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { useState, useEffect, useRef } from 'react';
import { RefreshCw, Mic, MessageCircle, Users, Clock, Volume2, AlertTriangle, CheckCircle, Play, MicOff, Trophy, Target, BookOpen, Zap, Lightbulb, LucideMessageCircleQuestion, Info, Diamond } from 'lucide-react';
import ProgresBar from './../UI/ProgressBar';
import { useTimer } from './../Hooks/useTimer';
import InsideLoader from '../UI/Loader';
import { englishTestsAtom, userDetailsAtom } from './../../../../Atoms/atoms';
import { testNameAtom } from './../atoms';
import { BACKEND_URL } from './../../../../config';
import type { englishTests } from '../../../../Utils/englishTest';

function Speaking() {
    const [isFetching, setIsFetching] = useState(false);
    const [fetchingPrompt, setFetchingPrompt] = useState('');
    const [step, setStep] = useState(0);
    const [testPart, setTestPart] = useState('');
    const setEnglishTest = useSetRecoilState(englishTestsAtom);
    const userDetails = useRecoilValue(userDetailsAtom);
    const testName = useRecoilValue(testNameAtom);

    //Feedback Essentials
    const [feedbackTab, setFeedbackTab] = useState('scores');
    const [marks, setMarks] = useState<{ [key: string]: number }>({ overall: 0, fluencyAndCoherence: 0, lexicalResource: 0, grammarAndAccuracy: 0, pronunciation: 0 });
    const [feedbacks, setFeedbacks] = useState<{ [key: string]: string }>({ overall: '', fluencyAndCoherence: '', lexicalResource: '', grammarAndAccuracy: '', pronunciation: '' });
    const [improvementTips, setImprovementTips] = useState<string[]>([]);

    //Part B - Cue Card
    const [cueCardDetails, setCueCardDetails] = useState<{ [key: string]: any }>({ cueCardTopic: 'Describe a memorable journey you have taken.', instructions: ['Where you went', 'Who you went with', 'What you did there', 'And explain why this journey was memorable for you'] });

    const personalQuestions = [
        "Can you tell me a little bit about yourself?",
        "What do you do for a living?",
        "Where are you from?",
        "How would your friends describe you?",
        "Do you live with your family or alone?",
        "How many people are there in your family?",
        "What does your father/mother do?",
        "Do you have any siblings? What do they do?",
        "What do you like to do in your free time?",
        "Do you enjoy reading books? What kind of books?",
        "Do you play any sports or games regularly?",
        "What is your daily routine like?",
        "What are your strengths and weaknesses?",
        "What is one thing you are very proud of?",
        "What do you usually do on weekends?",
        "Who is the most influential person in your life and why?",
        "What are your hobbies or interests?",
        "How do you usually spend time with your family?",
        "What kind of music do you enjoy?",
        "Do you like cooking or eating out?",
        "Have you traveled to any other places or countries?",
        "Do you enjoy working in a team or alone?",
        "How do you handle stress or pressure?",
        "What is your favorite memory from childhood?",
        "Do you have any pets? Would you like to have one?",
        "What kind of movies or TV shows do you enjoy?",
        "Do you enjoy socializing or prefer staying at home?",
        "What is something new you have learned recently?",
        "What motivates you in life?",
        "If you could change one thing about yourself, what would it be?",
        "What do you usually talk about with your friends?",
        "Do you follow any daily or weekly goals?",
        "How important is family in your life?",
        "What is your dream job and why?",
        "How do you usually celebrate festivals or special occasions?",
        "Do you have any family traditions that are special to you?",
        "Have you ever taken part in any volunteer or community work?",
        "What do you value most in a friendship?",
        "Do you prefer city life or rural life?",
        "How do you stay organized in your daily life?",
        "What are some things that make you happy?",
        "Do you prefer indoor or outdoor activities?",
        "Who do you talk to when you’re feeling down?",
        "What is something you’ve always wanted to learn and why?",
        "Do you consider yourself an introvert or extrovert?",
        "What kind of job would you never want to do and why?",
        "Do you enjoy spending time alone? What do you do?",
        "What is your biggest achievement so far?",
        "Do you like making plans or being spontaneous?",
        "If you could live anywhere in the world, where would it be?"
    ];

    //Part - A & C
    const [isBuffering, setIsBuffering] = useState(false);
    const [currentQuestionNo, setCurrentQuestionNo] = useState(0);
    const [currentQuestions, setCurrentQuestions] = useState<string[]>([]);
    const [discussionDetails, setDiscussionDetails] = useState<{ [key: string]: string }>({ title: 'Exploring the Impact and Future of Global Travel', level: 'Intermediate', topic: 'Travel and Tourism' });

    const addRandomQuestions = () => {
        const shuffledQuestions = [...personalQuestions];

        for (let i = shuffledQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
        }

        return shuffledQuestions.slice(0, 10);
    };

    useEffect(() => {
        speechSynthesis.cancel();
        stopRecording();
        timer.reset();
        normalTimerA.reset();
        normalTimerB.reset();

        if (step === 0) {
            setMicTested(false);
            setIsListening(false);
            resetTranscript();
        } else {
            window.scrollTo({ top: 350, behavior: 'smooth' });
        }

        if (step === 2) {
            resetTranscript();
        }

        if (step === 2 && testPart === 'partA') {
            const newQuestions = addRandomQuestions();
            setCurrentQuestions(newQuestions);
        }

        if (step === 2 && testPart === 'partB') {
            normalTimerA.start();
        }

        if (step === 2 && testPart === 'partC') {
            setCurrentQuestions(['What are the benefits of traveling to different countries?', 'How has tourism changed in your country over the past few decades?', 'Do you think travel will become more or less popular in the future?', 'What impact does tourism have on local communities?', 'How can travelers be more responsible when visiting other countries?']);
        }
    }, [step]);

    // Retake Exercise
    const retakeExercise = () => {
        setStep(0);
    }

    //Start Test
    const startTest = (part: string) => {
        setTestPart(part);
        setStep(1);
    }

    const getAiResponse = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${BACKEND_URL}/users/openai/langaugeTest/speakingTest/${testPart === 'partB' ? 'cueCard' : 'abstractDiscussion'}`, {
                method: "GET",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json"
                }
            });
            const res = await response.json();
            return {
                success: true,
                data: res
            }
        } catch (error) {
            return {
                success: false,
                data: error
            }
        }
    };

    const getAiReview = async (reviewBody: any) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${BACKEND_URL}/users/openai/langaugeTest/speakingTest/${testPart === 'partA' ? 'interviewPart' : testPart === 'partB' ? 'cueCardPart' : 'abstractDiscussionPart'}/evaluation`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reviewBody)
            });
            const res = await response.json();

            if (res?.message) {
                return {
                    success: false,
                    data: res.message
                }
            } else {
                return {
                    success: true,
                    data: res
                }
            }
        } catch (error) {
            return {
                success: false,
                data: error
            }
        }
    };

    const updateEnglishTests = async (updatingField: string, newValue: number | string) => {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        await fetch(`${BACKEND_URL}/users/updateField/${userDetails.id}`, {
            method: "PUT",
            headers: {
                'token': `${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                updatingField: {
                    [`englishTests.${testName}.${updatingField}`]: newValue
                }
            }),
        }).then(async (res) => {
            if (!res.ok) {
                alert('Sorry! Error While Saving. Please Try Again.');
                throw new Error("Failed to fetch data");
            }
        }).catch((error) => console.error("Error fetching questions:", error));
    }

    const submitTranscript = async () => {
        setFetchingPrompt('Examining and Calculating Your Test Marks...');
        setIsFetching(true);
        timer.reset();
        normalTimerA.reset();
        normalTimerB.reset();
        if (testPart === 'partA') {
            const reviewBody = {
                InterviewQuestions: currentQuestions,
                studentTranscript: transcriptRef.current
            }

            const response = await getAiReview(reviewBody);

            if (response?.success && response?.data) {
                setMarks(response.data.marks);
                setFeedbacks(response.data.feedback);
                setImprovementTips(response.data.improvementTips);

                //Atom Save
                setEnglishTest(prev => ({
                    ...prev,
                    [testName]: {
                        ...prev[testName as keyof englishTests],
                        speakingScorePartA: response.data.marks.overall
                    }
                }));

                //Database Save
                updateEnglishTests('speakingScorePartA', response.data.marks.overall);

                await new Promise((e) => { setTimeout(e, 5000) });
                setStep(3);
            } else {
                alert('Sorry! there was an error while examinining your response. Please, try agin!');
            }
            setIsFetching(false);
        } else if (testPart === 'partB') {
            const reviewBody = {
                cueCardDetails: {
                    cueCardTopic: cueCardDetails.cueCardTopic,
                    instructions: cueCardDetails.instructions
                },
                studentTranscript: transcriptRef.current
            }

            const response = await getAiReview(reviewBody);

            if (response?.success && response?.data) {
                setMarks(response.data.marks);
                setFeedbacks(response.data.feedback);
                setImprovementTips(response.data.improvementTips);

                //Atom Save
                setEnglishTest(prev => ({
                    ...prev,
                    [testName]: {
                        ...prev[testName as keyof englishTests],
                        speakingScorePartB: response.data.marks.overall
                    }
                }));

                //Database Save
                updateEnglishTests('speakingScorePartB', response.data.marks.overall);

                await new Promise((e) => { setTimeout(e, 5000) });
                setStep(3);
            } else {
                alert('Sorry! there was an error while examinining your response. Please, try agin!');
            }
            setIsFetching(false);
        } else {
            const reviewBody = {
                abstractDetails: {
                    abstractTopic: discussionDetails.topic,
                    discussionDetails: {
                        title: '',
                        level: ''
                    },
                    questions: currentQuestions
                },
                studentTranscript: transcriptRef.current
            }

            const response = await getAiReview(reviewBody);

            if (response?.success && response?.data) {
                setMarks(response.data.marks);
                setFeedbacks(response.data.feedback);
                setImprovementTips(response.data.improvementTips);

                //Atom Save
                setEnglishTest(prev => ({
                    ...prev,
                    [testName]: {
                        ...prev[testName as keyof englishTests],
                        speakingScorePartC: response.data.marks.overall
                    }
                }));

                //Database Save
                updateEnglishTests('speakingScorePartC', response.data.marks.overall);

                await new Promise((e) => { setTimeout(e, 5000) });
                setStep(3);
            } else {
                alert('Sorry! there was an error while examinining your response. Please, try agin!');
            }
            setIsFetching(false);
        }
    }

    //Shuffle Questions
    const newExercise = async () => {
        setIsFetching(true);
        if (testPart === 'partA') {
            setFetchingPrompt('Shuffeling Questions...');
            const newQuestions = addRandomQuestions();

            setTimeout(() => {
                setCurrentQuestions(newQuestions);
                setIsFetching(false);
            }, 5000)
        } else if (testPart === 'partB') {
            setFetchingPrompt('Generating New Cue Card...');
            const res = await getAiResponse();

            if (res?.success && res?.data?.cueCardTopic && res?.data?.instructions) {
                await new Promise((e) => { setTimeout(e, 5000) });
                setCueCardDetails(res.data);
            } else {
                alert('Sorry! there was an error while generating new cue card. Please, try agin!');
            }
            setIsFetching(false);
            normalTimerA.restart();
        } else {
            setFetchingPrompt('Generating New Discussion Topic...');
            const res = await getAiResponse();

            if (res?.success && res?.data?.discussionDetails && res?.data?.questions) {
                await new Promise((e) => { setTimeout(e, 5000) });
                setDiscussionDetails(res.data.discussionDetails);
                setCurrentQuestions(res.data.questions);
            } else {
                alert('Sorry! there was an error while generating new discussion topic. Please, try agin!');
            }
            setIsFetching(false);
        }
    }

    let testTitle = '';
    let testDescription = '';
    switch (testPart) {
        case 'partA':
            testTitle = 'Part A – Introduction & Interview'
            testDescription = 'Personal questions about yourself, family, work, and hobbies'
            break;
        case 'partB':
            testTitle = 'Part B – Cue Card'
            testDescription = 'Speak about a specific topic with 1 minute preparation time'
            break;
        default:
            testTitle = 'Part C – Discussion'
            testDescription = 'Abstract discussion based on a topic in question-answer pattern'
    }

    // Recording Essentials:
    const [micTested, setMicTested] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const [isListening, setIsListening] = useState(false);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    // Check browser support on component mount
    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            setIsSupported(false);
        }
    }, [browserSupportsSpeechRecognition]);

    // Sync listening state with hook
    useEffect(() => {
        setIsListening(listening);
    }, [listening]);

    const transcriptRef = useRef('');
    useEffect(() => {
        if (transcript.trim().length > 0) {
            setMicTested(true);
            transcriptRef.current = transcript;
        }
    }, [transcript]);

    const startTaskTimer = () => {
        startRecording();
        if (testPart === 'partB') {
            normalTimerB.start()
        } else {
            timer.start();
        }
    }

    const startRecording = () => {
        if (!isSupported) {
            alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        try {
            SpeechRecognition.startListening({
                continuous: true,
                language: 'en-US'
            });
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            alert('Failed to start recording. Please check microphone permissions.');
        }
    };

    const stopRecording = () => {
        try {
            SpeechRecognition.stopListening();
        } catch (error) {
            console.error('Error stopping speech recognition:', error);
            alert('Failed to stop recording.');
        }
    };

    const handleMicTest = () => {
        if (!isSupported) {
            alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        if (isListening) {
            // Stop listening
            SpeechRecognition.stopListening();
        } else {
            // Start listening for test
            setMicTested(false);
            try {
                SpeechRecognition.startListening({
                    continuous: true,
                    language: 'en-US'
                });
            } catch (error) {
                console.error('Failed to start speech recognition:', error);
                alert('Failed to start microphone test. Please check your microphone permissions.');
            }
        }
    };

    const handleBeginTest = () => {
        if (micTested) {
            setStep(2);
        }
    };

    useEffect(() => {
        // Your existing speech recognition setup...

        return () => {
            // Cleanup on component unmount
            SpeechRecognition.stopListening();

            // Reset states if needed
            setIsListening(false);

            console.log('Speech recognition cleaned up on unmount');
        };
    }, []); // Empty array ensures this runs only on mount/unmount

    //Timer With Buffer Logic
    const timer = useTimer({
        initialTime: 300,
        enableBuffer: true,
        testPart: testPart, // 'partA', 'partB', or 'partC'
        onTimeEnd: () => {
            stopRecording();
            submitTranscript();
        },
        onBufferStart: () => {
            stopRecording();
            setIsBuffering(true);
            setCurrentQuestionNo(c => c + 1);
        },
        onBufferEnd: () => {
            setIsBuffering(false);
            startRecording();
        }
    });

    //Timer Logics
    const normalTimerA = useTimer({
        initialTime: 60
    });

    const normalTimerB = useTimer({
        initialTime: 300,
        onTimeEnd: () => {
            stopRecording();
            submitTranscript();
            console.log('end', normalTimerB.isRunning)
        }
    });

    const currentTimmer = normalTimerA.isRunning ? normalTimerA : normalTimerB

    //Feedback Section
    let feedback = '';
    let performanceLevel = '';

    switch (true) {
        case marks.overall >= 80:
            feedback = 'Excellent work! Your writing is clear, well-organized, and effectively addresses the task.';
            performanceLevel = 'Excellent';
            break;
        case marks.overall >= 60:
            feedback = 'Good effort! Focus on refining your grammar and developing ideas more fully.';
            performanceLevel = 'Good';
            break;
        case marks.overall >= 40:
            feedback = 'You are making progress. Work on structuring your essays and supporting your arguments.';
            performanceLevel = 'Fair';
            break;
        default:
            feedback = 'Keep practicing! Focus on grammar, vocabulary, and organizing your thoughts clearly.';
            performanceLevel = 'Needs Improvement';
    }

    return (
        <>
            {/* <h1 className='p-5 bg-green-200'>{transcript}</h1> */}
            {isFetching && <InsideLoader text={fetchingPrompt} />}
            <div className='flex flex-col gap-5'>
                <div className="rounded-xl border-2 border-gray-400 shadow-xl py-2 px-4 flex justify-between items-center">
                    <div className='flex justify-start items-center'>
                        <Mic className='w-7 h-7 mr-3' />
                        <div className='text-start'>
                            <h1 className='text-2xl font-bold'>Speaking Practice</h1>
                            <p className='text-lg'>Practice with AI-generated speaking exercises</p>
                        </div>
                    </div>

                    {step !== 0 && (<button
                        onClick={retakeExercise}
                        className="flex items-center btn btn-primary"
                    >
                        <RefreshCw className='w-6 h-6 mr-2' />
                        {step !== 1 && step !== 3 ? 'Change Part' : 'Retake Exercise'}
                    </button>)}
                </div>

                {step === 0 && (<div>
                    <div className="rounded-xl border-2 border-gray-400 shadow-xl p-4 flex flex-col gap-5">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold mb-4 text-gray-900">Choose a Speaking Test</h2>
                            <p className="text-xl text-gray-600">
                                Select the part of the speaking test you want to begin with and receive instant AI-generated feedback based on your response
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {[
                                {
                                    id: 'partA',
                                    title: 'Part A: Introduction & Interview',
                                    description: 'Personal questions about yourself, family, work, and hobbies',
                                    duration: '4-5 Minutes',
                                    icon: MessageCircle,
                                    questions: '10 Questions'
                                },
                                {
                                    id: 'partB',
                                    title: 'Part B: Cue Card',
                                    description: 'Speak about a specific topic with 1 minute preparation time',
                                    duration: '5-6 Minutes',
                                    icon: Clock,
                                    questions: '1 Topic Card'
                                },
                                {
                                    id: 'partC',
                                    title: 'Part C: Discussion',
                                    description: 'Abstract discussion based on a topic in question-answer pattern',
                                    duration: '4-5 Minutes',
                                    icon: Users,
                                    questions: '5 Questions'
                                }
                            ].map((part, index) => {
                                const Icon = part.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="text-start bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-500 gap-3"
                                    >
                                        <div className={`bg-green-200 p-3 rounded-lg inline-block mb-4`}>
                                            <Icon className="h-7 w-7 text-black" />
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{part.title}</h3>
                                        <p className="mb-4 text-xl">{part.description}</p>

                                        <div className="flex items-center justify-between text-lg mb-4">
                                            <span className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {part.duration}
                                            </span>
                                            <span>{part.questions}</span>
                                        </div>

                                        <button
                                            onClick={() => startTest(part.id)}
                                            className="w-full btn btn-primary font-bold"
                                        >
                                            Start Speaking Test
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-gray-400 shadow-xl py-6 px-6 space-y-4 bg-white mt-5">
                        <h2 className="text-2xl font-semibold text-gray-800">Test Format & Instructions</h2>
                        <p className="text-lg text-gray-700">
                            This AI-powered speaking practice module simulates the English Language Speaking Test and is divided into
                            <span className="font-medium text-green-700"> three parts:</span>
                        </p>

                        <ul className="list-disc pl-6 space-y-3 text-start text-lg text-gray-700">
                            <li>
                                <strong className="text-green-700">Part A – Introduction & Interview:</strong> Answer general questions about yourself, such as your hobbies, studies, or hometown. Speak naturally and confidently.
                                <br />
                                <span>🕒 A 10-second pause will occur automatically every 30 seconds to help you read the question and collect your thoughts.</span>
                            </li>
                            <li>
                                <strong className="text-green-700">Part B – Cue Card:</strong> You’ll be given a topic card and have 1 minute to prepare. Then, speak for up to 5 minutes on the topic. Focus on structure and fluency.
                            </li>
                            <li>
                                <strong className="text-green-700">Part C – Follow-up Questions:</strong> Engage in a deeper discussion related to the cue card topic. Express opinions, analyze, and justify your responses with examples.
                                <br />
                                <span>🕒 In this part, a 10-second buffer will activate every 60 seconds to allow for deeper reflection during your answers.</span>
                            </li>
                        </ul>

                        <p className="text-lg text-gray-700">
                            🎤 Click the record button to start your response for each part. Once completed, click{' '}
                            <span className="font-medium bg-green-100 text-green-800 px-2 py-1 rounded">Submit</span> to receive instant AI-generated feedback on pronunciation, fluency, grammar, and vocabulary, along with a band score estimate.
                        </p>

                        <p className="text-lg italic text-gray-600 bg-green-50 p-4 rounded-lg border-l-4 border-green-200">
                            <span className="font-semibold text-green-700">Tip:</span> Speak clearly, avoid long pauses, and try to extend your answers. Practice daily to improve confidence and natural flow.
                        </p>
                    </div>
                </div>)}

                {step === 1 && (<div className="min-h-screen rounded-xl border-2 border-gray-400 shadow-xl p-4">
                    <div>
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="bg-green-200 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
                                <Mic className="w-10 h-10" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">{testTitle}</h1>
                            <p className="text-2xl">Ready to Start?</p>
                        </div>

                        {/* Precautions */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center mb-6">
                                <AlertTriangle className="w-6 h-6 text-orange-500 mr-3" />
                                <h2 className="text-2xl font-semibold">Before You Begin</h2>
                            </div>

                            <div className="space-y-4">
                                {[
                                    {
                                        icon: <Volume2 className="w-7 h-7 text-blue-600" />,
                                        title: "Quiet Environment",
                                        description: "Ensure you're in a quiet room with minimal background noise"
                                    },
                                    {
                                        icon: <Mic className="w-7 h-7 text-green-600" />,
                                        title: "Test Your Microphone",
                                        description: "Check that your microphone is working properly and speaks clearly"
                                    },
                                    {
                                        icon: <Clock className="w-7 h-7 text-orange-600" />,
                                        title: "Take Your Time",
                                        description: "Think before speaking and don't rush your responses"
                                    },
                                    {
                                        icon: <AlertTriangle className="w-7 h-7 text-red-600" />,
                                        title: "Speak Naturally",
                                        description: "Use your natural speaking voice and maintain good pronunciation"
                                    }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0 mt-1">
                                            {item.icon}
                                        </div>
                                        <div className='text-start'>
                                            <h3 className="font-medium mb-1 text-xl">{item.title}</h3>
                                            <p className="text-lg">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Transcript Section */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-medium text-lg mb-3">Speech Recognition Test</h3>
                                <div className="mb-3">
                                    <div className="min-h-[80px] p-3 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                                        {transcript ? (
                                            <p className="text-gray-800">{transcript}</p>
                                        ) : (
                                            <p className="text-gray-400 italic">
                                                {isListening
                                                    ? "Listening... Start speaking to test your microphone"
                                                    : "Speech transcript will appear here when you start the microphone test"
                                                }
                                            </p>
                                        )}
                                    </div>
                                    {transcript && (
                                        <div className="mt-2 flex justify-center items-center text-lg text-green-600">
                                            <CheckCircle className="w-5 h-5 mr-1" />
                                            Microphone is working properly!
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Microphone Test */}
                            <div className="mt-4 p-4 bg-gray-200 rounded-lg">
                                <h3 className="font-medium text-lg mb-3">Test Your Microphone</h3>
                                {!isSupported ? (
                                    <div className="text-red-600 text-sm mb-3">
                                        Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
                                    </div>
                                ) : null}
                                <button
                                    onClick={(micTested && !isListening) ? handleBeginTest : handleMicTest}
                                    disabled={!isSupported}
                                    className={`w-full btn btn-primary ${!isSupported ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''} ${isListening ? 'bg-red-600 text-white' : ''}`}
                                >
                                    {!isSupported ? (
                                        <span className="flex items-center justify-center">
                                            <MicOff className="w-6 h-6 mr-2" />
                                            Browser Not Supported
                                        </span>
                                    ) : isListening ? (
                                        <span className="flex items-center justify-center">
                                            <div className="w-6 h-6 mr-2 bg-white rounded-full animate-pulse"></div>
                                            Stop Testing (Click to stop)
                                        </span>
                                    ) : micTested ? (
                                        <span className="flex items-center justify-center">
                                            <Play className="w-6 h-6 mr-2" />
                                            Begin Test
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <Mic className="w-6 h-6 mr-2" />
                                            Start Microphone Test
                                        </span>
                                    )}
                                </button>
                                {isSupported && (
                                    <p className="text-lg text-gray-600 mt-2 text-center">
                                        {isListening
                                            ? "Say something like 'Hello, this is a microphone test' and watch the transcript above"
                                            : micTested ? "Microphone is working properly. Click the above button to begin the test" : "Click the button above and speak to test your microphone"
                                        }
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>)}

                {step === 2 && (<div className='rounded-xl border-2 border-gray-400 shadow-xl p-4'>
                    {testPart === 'partA' && (<div className='flex flex-col gap-5'>
                        <div className="flex justify-between items-center">
                            <div className='flex justify-start items-center'>
                                <MessageCircle className='w-7 h-7 mr-3' />
                                <div className='text-start'>
                                    <h1 className='text-2xl font-bold'>{testTitle}</h1>
                                    <p className='text-lg'>{testDescription}</p>
                                </div>
                            </div>

                            <div className='flex justify-between items-center gap-5'>
                                <div className={`flex text-xl bg-gray-200 p-2 rounded-lg items-center ${timer.time && timer.time < 60 ? 'text-red-600' : 'text-black'
                                    }`}>
                                    <Clock className="h-5 w-5 mr-1" />
                                    <span className="font-semibold">{timer.formatTime(timer.time)}</span>
                                </div>
                                <button
                                    disabled={timer.isRunning}
                                    onClick={newExercise}
                                    className={`flex items-center btn btn-primary ${timer.isRunning ? 'opacity-50' : 'opacity-100'}`}
                                >
                                    <RefreshCw className='w-6 h-6 mr-2' />
                                    Shuffle Questions
                                </button>
                            </div>
                        </div>

                        <div className='bg-gray-200 w-50 py-5 px-6 rounded-xl text-xl text-start flex flex-col gap-3'>
                            <div className='flex justify-start items-center'>
                                <LucideMessageCircleQuestion className='w-7 h-7 mr-2' />
                                <p className='font-semibold'>Interactive Question {currentQuestionNo + 1} of {currentQuestions.length}</p>
                            </div>

                            <div className="min-h-[80px] text-xl p-3 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center">
                                {currentQuestions[currentQuestionNo]}
                            </div>
                        </div>

                        <button
                            disabled={isListening}
                            onClick={startTaskTimer}
                            className={`w-full btn btn-primary font-bold ${isListening ? 'bg-red-600 text-white' : isBuffering ? 'bg-blue-500 text-white' : ''}`}
                        >
                            <span className="flex items-center justify-center">
                                {isListening ?
                                    <div className="w-6 h-6 mr-2 bg-white rounded-full animate-pulse"></div> : isBuffering ? <Info className="w-6 h-6 mr-2" /> : <Mic className="w-6 h-6 mr-2" />}
                                {isListening ? 'Recording' : isBuffering ? 'Read The Question' : 'Start Recording'}
                            </span>
                        </button>
                    </div>)}

                    {testPart === 'partB' && (<div>
                        <div className="flex justify-between items-center">
                            <div className='flex justify-start items-center'>
                                <Clock className='w-7 h-7 mr-3' />
                                <div className='text-start'>
                                    <h1 className='text-2xl font-bold'>{testTitle}</h1>
                                    <p className='text-lg'>{testDescription}</p>
                                </div>
                            </div>

                            <div className='flex justify-between items-center gap-5'>
                                <div className={`flex text-xl bg-gray-200 p-2 rounded-lg items-center ${currentTimmer.time && currentTimmer.time < 60 ? 'text-red-600' : 'text-black'
                                    }`}>
                                    <Clock className="h-5 w-5 mr-1" />
                                    <span className="font-semibold">{currentTimmer.formatTime(currentTimmer.time)}</span>
                                </div>
                                <button
                                    disabled={normalTimerB.isRunning}
                                    onClick={newExercise}
                                    className={`flex items-center btn btn-primary ${normalTimerB.isRunning ? 'opacity-50' : 'opacity-100'}`}
                                >
                                    <RefreshCw className='w-6 h-6 mr-2' />
                                    New Card
                                </button>
                            </div>
                        </div>

                        <div className='flex flex-col gap-5 mt-5'>
                            <div className="text-center">
                                <div className="bg-green-200 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
                                    <Mic className="w-10 h-10" />
                                </div>
                                <h1 className="text-4xl font-bold text-gray-800 mb-2">{normalTimerA.isRunning ? 'Ready to Start?' : 'Are you Prepared?'}</h1>
                                <p className="text-xl">{normalTimerA.isRunning ? 'You have 1 Minute to prepare. Use this time to organize your thoughts and plan your response.' : 'Click on Start Recording to record your response.'}</p>
                            </div>

                            <div className='bg-gray-200 w-50 py-5 px-6 rounded-xl text-xl text-start flex flex-col gap-3'>
                                <h2 className="text-2xl font-semibold text-center">Your Cue Card Topic</h2>

                                <span className='flex justify-start gap-2'>
                                    <Diamond className='w-7 h-7' />

                                    <span className='flex flex-col gap-2'>
                                        <p className='text-xl'>{cueCardDetails.cueCardTopic}</p>
                                        <p>You can say:</p>
                                        {cueCardDetails.instructions.map((item: string, index: number) => (
                                            <p key={index}>{index + 1}) {item}</p>
                                        ))}
                                    </span>
                                </span>
                            </div>

                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: normalTimerA.isRunning ? 0.5 : 1 }}
                                disabled={normalTimerA.isRunning || isListening}
                                onClick={startTaskTimer}
                                className={`w-full btn btn-primary font-bold ${isListening ? 'bg-red-600 text-white' : ''}`}
                            >
                                <span className="flex items-center justify-center">
                                    {isListening ?
                                        <div className="w-6 h-6 mr-2 bg-white rounded-full animate-pulse"></div> : <Mic className="w-6 h-6 mr-2" />}
                                    {isListening ? 'Recording' : 'Start Recording'}
                                </span>
                            </motion.button>
                        </div>
                    </div>)}

                    {testPart === 'partC' && (<div className='flex flex-col gap-5'>
                        <div className="flex justify-between items-center">
                            <div className='flex justify-start items-center'>
                                <Users className='w-7 h-7 mr-3' />
                                <div className='text-start'>
                                    <h1 className='text-2xl font-bold'>{testTitle}</h1>
                                    <p className='text-lg'>{testDescription}</p>
                                </div>
                            </div>

                            <div className='flex justify-between items-center gap-5'>
                                <div className={`flex text-xl bg-gray-200 p-2 rounded-lg items-center ${timer.time && timer.time < 60 ? 'text-red-600' : 'text-black'
                                    }`}>
                                    <Clock className="h-5 w-5 mr-1" />
                                    <span className="font-semibold">{timer.formatTime(timer.time)}</span>
                                </div>
                                <button
                                    disabled={timer.isRunning}
                                    onClick={newExercise}
                                    className={`flex items-center btn btn-primary ${timer.isRunning ? 'opacity-50' : 'opacity-100'}`}
                                >
                                    <RefreshCw className='w-6 h-6 mr-2' />
                                    New Topic
                                </button>
                            </div>
                        </div>

                        <div className='bg-gray-200 w-50 py-5 px-6 rounded-xl text-xl text-start flex flex-col gap-3'>
                            <div className='flex justify-between items-center'>
                                <h2 className="text-gray-900"><span className='text-xl font-semibold'>Discussion Title: </span>{discussionDetails.title}</h2>
                                <div className="flex items-center space-x-4">
                                    <span className='text-xl font-semibold'>Level:  <span className="px-3 py-1 bg-green-200 rounded-full text-lg">{discussionDetails.level}</span>
                                    </span>

                                    <span className='text-xl font-semibold'>Topic:  <span className="px-3 py-1 bg-green-200 rounded-full text-lg">{discussionDetails.topic}</span>
                                    </span>
                                </div>
                            </div>

                            <div className='flex justify-start items-center'>
                                <LucideMessageCircleQuestion className='w-7 h-7 mr-2' />
                                <p className='font-semibold'>Discussion Question {currentQuestionNo + 1} of {currentQuestions.length}</p>
                            </div>

                            <div className="min-h-[80px] text-xl p-3 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center">
                                {currentQuestions[currentQuestionNo]}
                            </div>
                        </div>

                        <button
                            disabled={isListening}
                            onClick={startTaskTimer}
                            className={`w-full btn btn-primary font-bold ${isListening ? 'bg-red-600 text-white' : isBuffering ? 'bg-blue-500 text-white' : ''}`}
                        >
                            <span className="flex items-center justify-center">
                                {isListening ?
                                    <div className="w-6 h-6 mr-2 bg-white rounded-full animate-pulse"></div> : isBuffering ? <Info className="w-6 h-6 mr-2" /> : <Mic className="w-6 h-6 mr-2" />}
                                {isListening ? 'Recording' : isBuffering ? 'Read The Question' : 'Start Recording'}
                            </span>
                        </button>
                    </div>)}
                </div>)}

                {step === 3 && (<motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-xl border-2 border-gray-400 shadow-xl p-4 flex flex-col gap-5">
                    <div className="text-center mb-2">
                        <div className="flex items-center justify-center mb-4">
                            <Trophy className="h-8 w-8 text-amber-500 mr-2" />
                            <h2 className="text-2xl font-bold text-gray-900">Exercise Complete!</h2>
                        </div>

                        {/* Score Display */}
                        <div className="inline-flex items-center px-6 py-3 rounded-full bg-green-200 mb-4 shadow-lg shadow-black">
                            <span className="text-xl font-bold">
                                {marks.overall}%
                            </span>
                        </div>

                        <p className="text-xl mb-2">{feedback}</p>
                        <p className="text-lg font-semibold">
                            Performance Level: {performanceLevel}
                        </p>
                    </div>

                    <div className='flex justify-center'>
                        <div className='bg-gray-200 w-[1000px] py-5 px-6 rounded-xl text-xl text-start flex flex-col gap-3'>
                            <span className="text-lg font-medium flex items-center gap-1">
                                <MessageCircle />
                                <h5 className="text-xl font-semibold">Your Response Transcript:</h5>
                            </span>

                            <div className="text-xl p-3 bg-white border-2 border-dashed border-gray-300 rounded-lg flex min-h-52">
                                {transcript}
                            </div>
                        </div>
                    </div>

                    <div className="tabListMain min-h-full">
                        <Tabs.Root value={feedbackTab} onValueChange={setFeedbackTab}>
                            <Tabs.List className="flex gap-2 space-x-1 bg-gray-200 p-4 rounded-xl shadow-sm mb-5 font-bold w-full">
                                {[
                                    { id: 'scores', label: 'Scores' },
                                    { id: 'feedback', label: 'Feedback' },
                                    { id: 'improvementTips', label: 'Improvement Tips' }
                                ].map(({ id, label }) => (
                                    <Tabs.Trigger
                                        key={id}
                                        value={id}
                                        className={`tabs space-x-2
                  ${feedbackTab === id
                                                ? 'activeTab'
                                                : 'inActiveTab'
                                            }
                `}
                                    >
                                        <span>{label}</span>
                                    </Tabs.Trigger>
                                ))}
                            </Tabs.List>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className='text-center'
                            >
                                <Tabs.Content value="scores">
                                    <div className='rounded-xl border-2 border-gray-400 shadow-xl p-4 flex flex-col gap-5'>
                                        {[
                                            { id: 'overall', icon: <Target size={18} />, title: 'Overall' },
                                            { id: 'fluencyAndCoherence', icon: <MessageCircle size={18} />, title: 'Fluency & Coherence' },
                                            { id: 'lexicalResource', icon: <BookOpen size={18} />, title: 'Lexical Resource' },
                                            { id: 'grammarAndAccuracy', icon: <Zap size={18} />, title: 'Grammar & Accuracy' },
                                            { id: 'pronunciation', icon: <Volume2 size={18} />, title: 'Pronunciation' }
                                        ].map((scores, index) => (
                                            <ProgresBar
                                                key={index}
                                                value={marks[scores.id]}
                                                icon={scores.icon}
                                                title={scores.title}
                                            />
                                        ))}
                                    </div>
                                </Tabs.Content>

                                <Tabs.Content value="feedback">
                                    <div className='rounded-xl border-2 border-gray-400 shadow-xl p-4 flex flex-col gap-5'>
                                        {[
                                            { id: 'overall', icon: <Target size={18} />, title: 'Overall', borderColor: 'border-l-blue-500' },
                                            { id: 'fluencyAndCoherence', icon: <MessageCircle size={18} />, title: 'Fluency & Coherence', borderColor: 'border-l-green-500' },
                                            { id: 'lexicalResource', icon: <BookOpen size={18} />, title: 'Lexical Resource', borderColor: 'border-l-purple-500' },
                                            { id: 'grammarAndAccuracy', icon: <Zap size={18} />, title: 'Grammar & Accuracy', borderColor: 'border-l-orange-500' },
                                            { id: 'pronunciation', icon: <Volume2 size={18} />, title: 'Pronunciation', borderColor: 'border-l-red-500' }
                                        ].map((comments, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={`border-l-4 ${comments.borderColor} p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-500`}>
                                                <span className="text-lg font-medium flex items-center gap-2">
                                                    {comments.icon}
                                                    <h5 className="text-xl font-medium text-gray-800">{comments.title}</h5>
                                                </span>
                                                <p className="text-lg text-gray-600 text-start">
                                                    {feedbacks[comments.id]}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </Tabs.Content>

                                <Tabs.Content value="improvementTips">
                                    <div className='rounded-xl border-2 border-gray-400 shadow-xl p-4 flex flex-col gap-5'>
                                        <div className="flex items-center gap-1 text-xl font-semibold">
                                            <Lightbulb className="w-6 h-6" />
                                            <span>Tips for Improvement</span>
                                        </div>
                                        <div className="rounded-2xl p-6 mb-4 bg-gray-200 shadow-md">
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-decimal list-inside text-gray-700 text-base">
                                                {improvementTips.map((item, index) => (
                                                    <li key={index} className="text-lg bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200 hover:bg-gray-50 transition-all">
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </Tabs.Content>
                            </motion.div>
                        </Tabs.Root>
                    </div>
                </motion.div>)}
            </div >
        </>
    )
}

export default Speaking;