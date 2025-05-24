import { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, X, MessageSquare, BarChart, RotateCw, Download } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Atoms
import {
    destinationCountryAtom,
    universityNameAtom,
    courseNameAtom,
    intakeMonthAtom,
    interviewerAtom,
    isSubmitedAtom,
    transcriptAtom,
    clarityOfResponsesAtom,
    confidenceLevelAtom,
    questionComprehensionAtom,
    isGivenIntroAtom,
    currentQuestionAtom
} from './atoms';
import { userDetailsAtom } from './../../../../Atoms/atoms';

// Types and Config
import { Question } from './../../../../Utils/question';
import { BACKEND_URL } from './../../../../config';
import { intros, outros, nexts, DoubtSpeech, imageLinks } from './AudioAssets/textAssets';

// Components
import AudioWaveform from './AudioWaveform';
import TranscriptPanel from './TranscriptPanel';

const InterviewRoom: React.FC = () => {
    // Recoil State
    const setIsSubmited = useSetRecoilState(isSubmitedAtom);
    const setTranscript = useSetRecoilState(transcriptAtom);
    const setClarityOfResponses = useSetRecoilState(clarityOfResponsesAtom);
    const setConfidenceLevel = useSetRecoilState(confidenceLevelAtom);
    const setQuestionComprehension = useSetRecoilState(questionComprehensionAtom);
    const setIsGivenIntro = useSetRecoilState(isGivenIntroAtom);
    const setCurrentQuestion = useSetRecoilState(currentQuestionAtom);

    const destinationCountry = useRecoilValue(destinationCountryAtom);
    const universityName = useRecoilValue(universityNameAtom);
    const courseName = useRecoilValue(courseNameAtom);
    const intakeMonth = useRecoilValue(intakeMonthAtom);
    const interviewer = useRecoilValue(interviewerAtom);
    const transcript = useRecoilValue(transcriptAtom);
    const clarityOfResponses = useRecoilValue(clarityOfResponsesAtom);
    const confidenceLevel = useRecoilValue(confidenceLevelAtom);
    const questionComprehension = useRecoilValue(questionComprehensionAtom);
    const isGivenIntro = useRecoilValue(isGivenIntroAtom);
    const currentQuestion = useRecoilValue(currentQuestionAtom);
    const userDetails = useRecoilValue(userDetailsAtom);

    // Component State
    const [currentAIInterval, setCurrentAIInterval] = useState<NodeJS.Timeout | null>(null);
    const [currentAIMessageId, setCurrentAIMessageId] = useState<number | null>(null);
    const [currentRemainingWords, setCurrentRemainingWords] = useState<string[] | null>(null);

    const [showEndDialog, setShowEndDialog] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'stats'>('chat');
    const [interviewQuestions, setInterviewQuestions] = useState<Question[]>([]);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isAIResponding, setIsAIResponding] = useState(false);
    const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
    const [isAskingForDoubt, setIsAskingForDoubt] = useState(false);
    const [isHavingDoudt, setIsHavingDoudt] = useState(false);

    // Refs
    const prevVoiceTranscript = useRef('');
    const activeUserMessageId = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const currentQuestionRef = useRef(currentQuestion);
    const question = useRef('');
    const answer = useRef('');
    const feedback = useRef('');
    const doubt = useRef('');
    const doubtRes = useRef('');

    useEffect(() => {
        currentQuestionRef.current = currentQuestion;
    }, [currentQuestion]);

    // Speech Recognition
    const {
        transcript: voiceTranscript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    // Effects
    useEffect(() => {
        if (listening && voiceTranscript) {
            const newText = voiceTranscript.slice(prevVoiceTranscript.current.length);

            if (newText.trim()) {
                const capitalizedNewText = newText.charAt(0).toUpperCase() + newText.slice(1);

                if (!activeUserMessageId.current) {
                    activeUserMessageId.current = moment().unix() + Math.floor(Math.random() * 1000);
                    addToTranscript(activeUserMessageId.current, 'user', capitalizedNewText);
                } else {
                    setTranscript(prev =>
                        prev.map(msg =>
                            msg.id === activeUserMessageId.current
                                ? {
                                    ...msg,
                                    text: msg.text + (msg.text.length > 0 ? ' ' : '') + capitalizedNewText
                                }
                                : msg
                        )
                    );
                }
            }

            prevVoiceTranscript.current = voiceTranscript;
        }
    }, [voiceTranscript, listening]);

    useEffect(() => {
        fetchQuestions();

        if (!isGivenIntro) {
            handleAIResponse('intro');
            setIsGivenIntro(true);
        } else {
            handleAIResponse('question');
        }
    }, []);

    // Helper Functions
    const handleAIResponse = async (trigger: 'intro' | 'question' | 'feedback' | 'next' | 'doubt' | 'doubtRes' | 'outro') => {

        if (trigger === 'intro') {
            let speech = intros[interviewer as keyof typeof intros];
            speech = speech.replace('{StudentName}', userDetails.fullName.split(" ")[0])
            const res = await getAiResponse('speech', { text: speech, voice: interviewer });

            if (res?.success && res?.data?.audio) {
                setIsAIResponding(true);
                const url = base64ToUrl(res.data.audio);
                setAudioUrl(url);
                aiTextResponse(speech);
            }
        } else if (trigger === 'question') {
            console.log("currentQuestionRef.current", currentQuestionRef.current);
            setIsAIResponding(true);
            playManualAudio('Questions', interviewer, `Question-${currentQuestionRef.current}`);
            aiTextResponse(interviewQuestions[currentQuestionRef.current].question);
            question.current = interviewQuestions[currentQuestionRef.current].question;
        } else if (trigger === 'feedback') {
            setIsAIAnalyzing(true);
            question.current = ''

            const res = await getAiResponse('answerSpeech', { question: interviewQuestions[currentQuestion].question, evaluationPrompt: interviewQuestions[currentQuestion].evaluationPrompt, expectedKeywords: interviewQuestions[currentQuestion].expectedKeywords, response: answer.current, destination: destinationCountry, university: universityName, course: courseName, intake: intakeMonth, voice: interviewer });

            if (res?.success && res?.data?.feedbackAudio) {
                setIsAIAnalyzing(false);
                setIsAIResponding(true);
                const url = base64ToUrl(res.data.feedbackAudio);
                setAudioUrl(url);
                setClarityOfResponses(res.data.clarityOfResponses);
                setConfidenceLevel(res.data.confidenceLevel);
                setQuestionComprehension(res.data.questionComprehension);
                aiTextResponse(res.data.feedbackText);
                feedback.current = res.data.feedbackText;
                setIsAskingForDoubt(true);
            }
        } else if (trigger === 'next') {
            setIsAIResponding(true);
            const randomNo = Math.floor(Math.random() * 4);
            playManualAudio('NextQuestion', interviewer, `Next-${randomNo}`);
            aiTextResponse(nexts[randomNo]);
            setCurrentQuestion(currentQuestion + 1);
        } else if (trigger === 'doubt') {
            setIsAIResponding(true);
            playManualAudio('Doubt', interviewer, `Doubt`);
            aiTextResponse(DoubtSpeech);
        } else if (trigger === 'doubtRes') {
            setIsAIAnalyzing(true);
            const aiResponse = feedback.current;
            const response = answer.current;
            const studentDoubt = doubt.current;
            feedback.current = '';
            answer.current = '';
            doubt.current = '';

            const res = await getAiResponse('doubtSpeech', { question: interviewQuestions[currentQuestion].question, response: response, aiResponse: aiResponse, doubt: studentDoubt, destination: destinationCountry, university: universityName, course: courseName, intake: intakeMonth, voice: interviewer });

            if (res?.success && res?.data?.feedbackAudio) {
                setIsAIAnalyzing(false);
                setIsAIResponding(true);
                const url = base64ToUrl(res.data.feedbackAudio);
                setAudioUrl(url);
                aiTextResponse(res.data.feedbackText);
                doubtRes.current = res.data.feedbackText;
                setCurrentQuestion(currentQuestion + 1);
            }
        } else if (trigger === 'outro') {
            let speech = outros[interviewer as keyof typeof intros];
            speech = speech.replace('{StudentName}', userDetails.fullName.split(" ")[0])
            const res = await getAiResponse('speech', { text: speech, voice: interviewer });

            if (res?.success && res?.data?.audio) {
                setIsAIResponding(true);
                const url = base64ToUrl(res.data.audio);
                setAudioUrl(url);
                aiTextResponse(speech);
            }
        }
    };

    const base64ToUrl = (base64: string, sliceSize: number = 512): string => {
        const byteCharacters = atob(base64);
        const byteArrays: Uint8Array[] = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const audioBlob = new Blob(byteArrays, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        return url
    };

    const aiTextResponse = (text: string) => {
        let displayedText = '';
        const words = text.split(' ');
        const id = moment().unix() + Math.floor(Math.random() * 1000);

        if (isAIResponding && currentAIInterval) {
            const ongoingMessage = transcript.find(msg =>
                msg.speaker === 'ai' && msg.id === currentAIMessageId
            );

            if (ongoingMessage) {
                const remainingText = ongoingMessage.text.split(' ').concat(
                    currentRemainingWords || []
                ).join(' ');

                setTranscript(prev =>
                    prev.map(msg =>
                        msg.id === currentAIMessageId
                            ? { ...msg, text: remainingText.trim() }
                            : msg
                    )
                );

                clearInterval(currentAIInterval);
            }
        }

        setCurrentRemainingWords(words.slice());
        setCurrentAIMessageId(id);
        setIsAIResponding(true);

        const interval = setInterval(() => {
            if (words.length > 0) {
                displayedText += words.shift() + ' ';
                setCurrentRemainingWords(words.slice());

                const currentWords = displayedText.trim().split(' ');

                if (currentWords.length === 1) {
                    setTranscript(prev => [
                        ...prev,
                        {
                            id: id,
                            speaker: 'ai',
                            text: displayedText.trim()
                        }
                    ]);
                } else {
                    setTranscript(prev => prev.map(msg =>
                        msg.id === id
                            ? { ...msg, text: displayedText.trim() }
                            : msg
                    ));
                }
            } else {
                clearInterval(interval);
                setIsAIResponding(false);
                setCurrentAIMessageId(null);
                setCurrentRemainingWords(null);
            }
        }, 350);

        setCurrentAIInterval(interval);
    };

    const addToTranscript = (id: number, speaker: 'ai' | 'user', text: string) => {
        setTranscript(prev => [...prev, { id, speaker, text }]);
    };

    const getAiResponse = async (path: string, input: any) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${BACKEND_URL}/users/openai/interviewPro/${path}`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(input),
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

    const fetchQuestions = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

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
    };

    async function playManualAudio(folder: string, interviewer: string, filename: string) {
        const sound = await import(`./AudioAssets/${folder}/${interviewer}/${filename}.wav`);
        new Audio(sound.default).play();
    }

    const replayAudio = () => {
        if (question.current !== '') {
            handleAIResponse('question');
        } else {
            return
        }
    };

    // Event Handlers
    const handleMicToggle = () => {
        if (listening) {
            SpeechRecognition.stopListening();
            if (voiceTranscript) {
                if (question.current !== '') {
                    answer.current = voiceTranscript;
                    handleAIResponse('feedback');
                } else if (feedback.current !== '') {
                    setIsHavingDoudt(false);
                    doubt.current = voiceTranscript;
                    handleAIResponse('doubtRes');
                }
            }
        } else {
            resetTranscript();
            prevVoiceTranscript.current = '';
            activeUserMessageId.current = null;
            SpeechRecognition.startListening({ continuous: true });
        }
    };

    const handleEndInterview = () => {
        setShowEndDialog(false);
        setTranscript([]);
        setClarityOfResponses(0);
        setConfidenceLevel(0);
        setQuestionComprehension(0);
        setIsGivenIntro(false);
        setCurrentQuestion(0);
        setIsSubmited(false);
    };

    const hanldleAudioEnd = () => {
        setAudioUrl(null);
        if (transcript.length === 1) {
            handleAIResponse('question');
        } else if (currentQuestion === interviewQuestions.length - 1) {
            handleAIResponse('outro');
        } else if (doubtRes.current !== '') {
            doubtRes.current = '';
            handleAIResponse('question');
        } else {
            return
        }
    }

    const havingDoubt = (status: boolean) => {
        setIsAskingForDoubt(false);
        if (status) {
            handleAIResponse('doubt');
            setIsHavingDoudt(true);
        } else {
            if (currentQuestion === interviewQuestions.length - 1) {
                handleAIResponse('outro');
            } else {
                handleAIResponse('next');
                setTimeout(() => {
                    feedback.current = '';
                    handleAIResponse('question');
                }, 10000);
            }
        }
    }

    const downloadTranscriptPDF = (transcript: { id: number, speaker: 'ai' | 'user'; text: string }[]) => {
        const convertedTranscript = transcript.map(item => {
            if (item.speaker === 'ai') {
                return { ...item, speaker: `${interviewer.charAt(0).toUpperCase() + interviewer.slice(1)} (AI Interviewer)` };
            } else if (item.speaker === 'user') {
                return { ...item, speaker: `${userDetails.fullName} (Student)` };
            }
            return item;
        });

        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Interview Transcript', 105, 15, { align: 'center' });

        let yPosition = 30;

        doc.setFontSize(12);

        convertedTranscript.forEach(item => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${item.speaker}:`, 15, yPosition);

            doc.setFont('helvetica', 'normal');
            const splitText = doc.splitTextToSize(item.text, 180);
            doc.text(splitText, 25, yPosition + 7);

            yPosition += 7 + (splitText.length * 7);

            yPosition += 5;

            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        });

        doc.save('Interview_Transcript.pdf');
    };

    // Early Return for Browser Support Check
    if (!browserSupportsSpeechRecognition) {
        return (
            <div className="p-4 text-center">
                Your browser doesn't support speech recognition. Please use Chrome or Edge.
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col mb-20">
            {audioUrl && (<audio ref={audioRef} controls autoPlay onEnded={hanldleAudioEnd} style={{ width: '100%', marginBottom: '10px', display: 'none' }}>
                <source src={audioUrl ?? ""} type={`audio/wav`} />
            </audio>)}

            {/* Interview Header */}
            <div className="bg-white rounded-lg border-2 border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Interview Room</h1>
                        <p className="text-lg text-gray-500">Speak naturally, {interviewer.charAt(0).toUpperCase() + interviewer.slice(1)} will respond.</p>
                    </div>
                    <button
                        onClick={() => setShowEndDialog(true)}
                        className="btn btn-primary"
                    >
                        End Interview
                    </button>
                </div>
            </div>

            {/* Main Interview Area */}
            <div className="flex-1 shadow-xl rounded-lg flex flex-col mt-5 md:flex-row overflow-hidden border-2 border-gray-200">
                {/* Left Panel */}
                <div className="flex-1 flex flex-col bg-white border-r-2 border-gray-200 rounded-l-xl overflow-hidden shadow-2xl">
                    <div className="flex-1 flex flex-col justify-center items-center p-8">
                        <div className="w-full max-w-lg mx-auto flex flex-col items-center">
                            <div className="mb-8 relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-200 shadow-lg">
                                    <img
                                        src={imageLinks[interviewer as keyof typeof imageLinks]}
                                        alt="User avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-200 px-4 py-1 rounded-full shadow-md">
                                    <span className="text-lg font-semibold">Live</span>
                                </div>
                            </div>

                            <motion.div
                                animate={{
                                    scale: isAIResponding || isAIAnalyzing ? [1, 1.05, 1] : 1,
                                    opacity: isAIResponding || isAIAnalyzing ? 1 : 0.8
                                }}
                                transition={{ repeat: isAIResponding || isAIAnalyzing ? Infinity : 0, duration: 1.5 }}
                                className="mb-8 bg-green-200 px-6 py-3 rounded-full flex items-center border-2 border-black"
                            >
                                <Volume2 className="mr-2 h-6 w-6" />
                                <span className="font-semibold text-lg">
                                    {isAIResponding ? `${interviewer.charAt(0).toUpperCase() + interviewer.slice(1)} is speaking...` : isAIAnalyzing ? `${interviewer.charAt(0).toUpperCase() + interviewer.slice(1)} is analyzing...` : `${interviewer.charAt(0).toUpperCase() + interviewer.slice(1)} is listening...`}
                                </span>
                            </motion.div>

                            <div className="w-[400px] h-24 mb-10 bg-green-200 rounded-2xl">
                                <AudioWaveform isActive={listening || isAIResponding} isAI={isAIResponding} />
                            </div>

                            <div className="flex gap-6 items-center justify-center">
                                {/* Replay Button */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={replayAudio}
                                    className={`p-3 rounded-full bg-blue-700 hover:bg-blue-600 ${question.current === '' ? 'cursor-not-allowed' : ''} text-white shadow-md flex items-center justify-center`}
                                >
                                    <RotateCw className="h-6 w-6" />
                                </motion.button>

                                {/* Main Mic Button */}
                                <motion.button
                                    whileHover={{ scale: isAIResponding ? 1 : 1.1 }}
                                    whileTap={{ scale: isAIResponding ? 1 : 0.9 }}
                                    onClick={handleMicToggle}
                                    disabled={isAIResponding}
                                    className={`p-5 rounded-full shadow-lg flex items-center justify-center ${listening
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : question.current === '' && !isHavingDoudt
                                            ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                                            : 'bg-green-222 hover:bg-green-200'
                                        }`}
                                >
                                    {listening ? (
                                        <MicOff className="h-7 w-7" />
                                    ) : (
                                        <Mic className="h-7 w-7" />
                                    )}
                                </motion.button>

                                {/* Mute Button */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => havingDoubt(false)}
                                    className={`p-3 rounded-full bg-red-500 hover:bg-red-600 ${!isHavingDoudt ? 'cursor-not-allowed' : ''} text-white shadow-md flex items-center justify-center`}
                                >
                                    <X className="h- w-6" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="md:w-96 bg-white border-t border-gray-200 md:border-t-0 flex flex-col h-96 md:h-auto">
                    <div className="flex border-b-2 border-gray-200">
                        <button
                            className={`flex-1 py-3 text-lg font-semibold border-b-2 ${activeTab === 'chat'
                                ? 'border-green-200 text-green-200'
                                : 'border-transparent text-gray-500 hover:text-black transition-all duration-300'
                                }`}
                            onClick={() => setActiveTab('chat')}
                        >
                            <div className="flex justify-center items-center">
                                <MessageSquare className="h-5 w-5 mr-2" />
                                Transcript
                            </div>
                        </button>
                        <button
                            className={`flex-1 py-3 text-lg font-semibold border-b-2 ${activeTab === 'stats'
                                ? 'border-green-200 text-green-200'
                                : 'border-transparent text-gray-500 hover:text-black transition-all duration-300'
                                }`}
                            onClick={() => setActiveTab('stats')}
                        >
                            <div className="flex justify-center items-center">
                                <BarChart className="h-5 w-5 mr-2" />
                                Feedback
                            </div>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'chat' ? (
                            <TranscriptPanel transcript={transcript} />
                        ) : (
                            <div className="p-4">
                                <h3 className="font-semibold mb-4 text-xl text-center">Interview Feedback</h3>
                                <p className="text-lg text-gray-600 mb-4">
                                    Complete the interview to see your performance analysis and feedback.
                                </p>
                                <div className="space-y-4">
                                    <FeedbackItem
                                        title="Clarity of Responses"
                                        value={clarityOfResponses}
                                        color="bg-blue-500"
                                    />
                                    <FeedbackItem
                                        title="Confidence Level"
                                        value={confidenceLevel}
                                        color="bg-indigo-500"
                                    />
                                    <FeedbackItem
                                        title="Question Comprehension"
                                        value={questionComprehension}
                                        color="bg-purple-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {activeTab === 'chat' && isAskingForDoubt && (<div className="w-full text-xl font-bold bg-green-200 flex justify-center items-center border-b-2 border-gray-200">
                        <button onClick={() => havingDoubt(true)} className="w-full py-2 border-r-2 border-gray-200">
                            Yes
                        </button>
                        <button onClick={() => havingDoubt(false)} className="w-full py-2">
                            No
                        </button>
                    </div>)}

                    {activeTab === 'chat' && transcript.length > 0 && (
                        <button
                            onClick={() => downloadTranscriptPDF(transcript)}
                            className="w-full text-xl font-bold px-3 py-2 bg-green-200 flex justify-center items-center cursor-pointer">
                            <Download className='mr-2' />
                            Download Transcript
                        </button>
                    )}
                </div>
            </div>

            {/* End Interview Confirmation Dialog */}
            {showEndDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-lg p-6 max-w-md w-full"
                    >
                        <h3 className="text-lg font-medium text-gray-900 mb-2">End Interview?</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to end this interview session? Your progress will not be saved.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowEndDialog(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEndInterview}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                End Interview
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

interface FeedbackItemProps {
    title: string;
    value: number;
    color: string;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ title, value, color }) => {
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-ls font-medium">{title}</span>
                <span className="text-lg font-medium">{value}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
                <div
                    className={`h-2 rounded-full ${color}`}
                    style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    );
};

export default InterviewRoom;