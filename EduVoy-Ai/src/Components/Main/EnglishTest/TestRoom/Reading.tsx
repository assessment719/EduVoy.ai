import { useState, useEffect } from 'react';
import { RefreshCw, BookOpen, Clock, LucideMessageCircleQuestion, Trophy, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTimer } from './../Hooks/useTimer';
import InsideLoader from '../UI/Loader';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { englishTests } from './../../../../Utils/englishTest';
import { englishTestsAtom, userDetailsAtom } from './../../../../Atoms/atoms';
import { testNameAtom } from './../atoms';
import { BACKEND_URL } from './../../../../config';

function Reading() {
    const [isFetching, setIsFetching] = useState(false);
    const [fetchingPrompt, setFetchingPrompt] = useState('');
    const [step, setStep] = useState(0);
    const [passage, setPassage] = useState(`The transition to renewable energy sources has become one of the most significant challenges and opportunities of the 21st century. As concerns about climate change intensify, governments and private organizations worldwide are investing heavily in solar, wind, and hydroelectric power systems.{{paraBreak}}Solar energy technology has experienced remarkable improvements in efficiency and cost reduction over the past decade. Modern photovoltaic panels can now convert over 20% of sunlight into electricity, compared to just 6% in early commercial systems. This advancement, combined with mass production, has reduced the cost of solar power by more than 80% since 2010.{{paraBreak}}Wind energy has similarly benefited from technological innovations. Today's wind turbines are significantly larger and more efficient than their predecessors, capable of generating electricity even in low-wind conditions. Offshore wind farms, in particular, have shown tremendous potential, as ocean winds are typically stronger and more consistent than those on land.{{paraBreak}}However, the transition to renewable energy is not without challenges. One major obstacle is the intermittent nature of solar and wind power, which requires sophisticated energy storage solutions. Battery technology is rapidly advancing, but current systems remain expensive and have limited capacity for large-scale applications.{{paraBreak}}Despite these challenges, many experts believe that renewable energy will dominate the global energy mix within the next three decades. The International Energy Agency predicts that renewable sources could account for 90% of the required reductions in carbon emissions by 2050, making them essential for achieving global climate goals.`);
    const [passageDetails, setPassageDetails] = useState<{ [key: string]: string }>({ title: 'The Rise of Renewable Energy Technologies', level: 'Intermediate', topic: 'Environment' });
    const [marks, setMarks] = useState<number[]>([0, 0, 0]);
    const [isReview, setIsReview] = useState(false);

    // True/False Questions
    const [questionsA, setQuestionsA] = useState<{ id: number, question: string, correctAnswer: string }[]>([
        { id: 1, question: 'Modern photovoltaic panels can convert over 20% of sunlight into electricity', correctAnswer: 'True' },
        { id: 2, question: 'The cost of solar power has reduced by more than 60% since 2010', correctAnswer: 'False' },
        { id: 3, question: 'Offshore wind farms have stronger and more consistent winds than land-based ones', correctAnswer: 'True' },
        { id: 4, question: 'Battery technology has completely solved the energy storage challenges for renewable energy', correctAnswer: 'False' },
        { id: 5, question: 'Early commercial solar systems could convert 6% of sunlight into electricity', correctAnswer: 'True' }
    ]);

    // True/False Answers
    const [answersA, setAnswersA] = useState<string[]>(['', '', '', '', '']);

    // Multiple Choice Questions
    const [questionsB, setQuestionsB] = useState<{ id: number, question: string, options: string[], correctAnswer: string }[]>([
        { id: 1, question: 'What percentage of sunlight could early commercial solar systems convert into electricity?', options: ['4%', '6%', '8%', '10%'], correctAnswer: '6%' },
        { id: 2, question: 'By how much has the cost of solar power reduced since 2010?', options: ['More than 60%', 'More than 70%', 'More than 80%', 'More than 90%'], correctAnswer: 'More than 80%' },
        { id: 3, question: 'What is mentioned as a major obstacle in the transition to renewable energy?', options: ['High installation costs', 'Lack of government support', 'Intermittent nature of solar and wind power', 'Limited land availability'], correctAnswer: 'Intermittent nature of solar and wind power' },
        { id: 4, question: 'According to the International Energy Agency, what percentage of required carbon emission reductions could renewable sources account for by 2050?', options: ['70%', '80%', '90%', '100%'], correctAnswer: '90%' },
        { id: 5, question: 'Which type of wind farms are mentioned as having tremendous potential?', options: ['Mountain wind farms', 'Desert wind farms', 'Offshore wind farms', 'Urban wind farms'], correctAnswer: 'Offshore wind farms' }
    ]);

    // Multiple Choice Answers
    const [answersB, setAnswersB] = useState<string[]>(['', '', '', '', '']);

    // Fill In The Blank Questions
    const [questionsC, setQuestionsC] = useState<{ id: number, question: string, correctAnswer: string }[]>([
        { id: 1, question: 'The transition to renewable energy sources has become one of the most significant challenges and opportunities of the _____ century', correctAnswer: '21st' },
        { id: 2, question: 'Modern photovoltaic panels can now convert over _____% of sunlight into electricity', correctAnswer: '20' },
        { id: 3, question: 'Today\'s wind turbines are capable of generating electricity even in _____-wind conditions', correctAnswer: 'low' },
        { id: 4, question: 'The intermittent nature of renewable energy requires sophisticated energy _____ solutions', correctAnswer: 'storage' },
        { id: 5, question: 'Many experts believe renewable energy will dominate the global energy mix within the next three _____', correctAnswer: 'decades' }
    ]);

    // Fill In The Blank Answers
    const [answersC, setAnswersC] = useState<string[]>(['', '', '', '', '']);

    const handleAnswerChange = (questionType: string, questionIndex: number, answer: string) => {
        if (questionType === 'A') {
            const newAnswers = [...answersA];
            newAnswers[questionIndex] = answer;
            setAnswersA(newAnswers);
        } else if (questionType === 'B') {
            const newAnswers = [...answersB];
            newAnswers[questionIndex] = answer;
            setAnswersB(newAnswers);
        } else {
            const newAnswers = [...answersC];
            newAnswers[questionIndex] = answer;
            setAnswersC(newAnswers);
        }
    };

    useEffect(() => {
        if (step !== 0) {
            window.scrollTo({ top: 350, behavior: 'smooth' });
        }

        if (step === 0) {
            timer.reset();
        }

        if (step === 1) {
            timer.start();
        }

        if (step === 4) {
            timer.stop();
            timer.reset();
        }
    }, [step]);

    // Retake Exercise
    const retakeExercise = () => {
        setAnswersA([]);
        setAnswersB([]);
        setAnswersC([]);
        setStep(0);
    }

    const getAiResponse = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${BACKEND_URL}/users/openai/langaugeTest/readingTest`, {
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

    // New Exercise
    const newExercise = async () => {
        setFetchingPrompt('Generating New Passage...');
        setIsFetching(true);
        setAnswersA([]);
        setAnswersB([]);
        setAnswersC([]);
        setStep(0);

        const res = await getAiResponse();

        if (res?.success && res?.data?.passage) {
            setPassage(res?.data?.passage);
            setPassageDetails(res?.data?.passageDetails);
            setQuestionsA(res?.data?.questions?.trueFalse);
            setQuestionsB(res?.data?.questions?.mcq);
            setQuestionsC(res?.data?.questions?.fillInTheBlanks);
        } else {
            alert('Sorry! there was an error while generating passage. Please, try agin!');
        }
        setIsFetching(false);
    }

    //Timer Logics
    const timer = useTimer({
        initialTime: 300,
        onTimeEnd: () => {
            submitFinalAnswer(); // Your existing logic
        }
    });

    //Calculating Marks
    const calculateMarks = async () => {
        return new Promise((resolve) => {
            const newMarks = [0, 0, 0];

            questionsA.forEach((question, index) => {
                if (question.correctAnswer === answersA[index]) {
                    newMarks[0]++;
                }
            });

            questionsB.forEach((question, index) => {
                if (question.correctAnswer === answersB[index]) {
                    newMarks[1]++;
                }
            });

            questionsC.forEach((question, index) => {
                if (question.correctAnswer.toLowerCase() === answersC[index].toLowerCase()) {
                    newMarks[2]++;
                }
            });

            resolve(newMarks);
        });
    };

    const calculateAndSetMarks = async () => {
        const calculatedMarks: any = await calculateMarks();
        setMarks(calculatedMarks);
        return calculatedMarks;
    };

    //Feedback Section
    let feedback = '';
    let performanceLevel = '';
    const percentage = Math.floor((marks[0] + marks[1] + marks[2]) / 15 * 100);

    //To Update The Listening Test Marks
    const testName = useRecoilValue(testNameAtom);
    const setEnglishTest = useSetRecoilState(englishTestsAtom);
    const userDetails = useRecoilValue(userDetailsAtom);

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

    const submitFinalAnswer = async () => {
        timer.reset();
        const finalMarks = await calculateAndSetMarks();
        setFetchingPrompt('Examining and Calculating Your Test Marks...')
        setIsFetching(true);

        //Atom Update
        setEnglishTest(prev => ({
            ...prev,
            [testName]: {
                ...prev[testName as keyof englishTests],
                readingScore: Math.floor((finalMarks[0] + finalMarks[1] + finalMarks[2]) / 15 * 100)
            }
        }));

        //Database Update
        updateEnglishTests('readingScore', Math.floor((finalMarks[0] + finalMarks[1] + finalMarks[2]) / 15 * 100));

        setTimeout(() => {
            setIsFetching(false);
            setStep(4);
        }, 5000)
    }

    const viewReview = () => {
        setIsReview(true);

        setTimeout(() => {
            window.scrollTo({ top: document.getElementById('reviewSection')?.offsetTop || 0, behavior: 'smooth' })
        }, 100);
    }

    switch (true) {
        case percentage >= 80:
            feedback = 'Excellent work! Your reading comprehension and attention to detail are impressive.';
            performanceLevel = 'Excellent';
            break;
        case percentage >= 60:
            feedback = 'Good job! Focus on skimming and scanning techniques to boost your speed.';
            performanceLevel = 'Good';
            break;
        case percentage >= 40:
            feedback = 'You are improving. Practice locating key information and understanding context.';
            performanceLevel = 'Fair';
            break;
        default:
            feedback = 'Keep practicing! Read actively, underline key points, and manage your time well.';
            performanceLevel = 'Needs Improvement';
    }

    return (
        <>
            {isFetching && <InsideLoader text={fetchingPrompt} />}

            <div className='flex flex-col gap-5'>
                <div className="rounded-xl border-2 border-gray-400 shadow-xl py-2 px-4 flex justify-between items-center">
                    <div className='flex justify-start items-center'>
                        <BookOpen className='w-7 h-7 mr-3' />
                        <div className='text-start'>
                            <h1 className='text-2xl font-bold'>Reading Practice</h1>
                            <p className='text-lg'>Practice with AI-generated reading exercises</p>
                        </div>
                    </div>

                    <div className='flex justify-between items-center gap-5'>
                        {step !== 0 && step !== 4 && (<div className={`flex text-xl bg-gray-200 p-2 rounded-lg items-center ${timer.time && timer.time < 60 ? 'text-red-600' : 'text-black'
                            }`}>
                            <Clock className="h-5 w-5 mr-1" />
                            <span className="font-semibold">{timer.formatTime(timer.time)}</span>
                        </div>)}
                        <button
                            onClick={step === 0 || step === 4 ? newExercise : retakeExercise}
                            className="flex items-center btn btn-primary"
                        >
                            <RefreshCw className='w-6 h-6 mr-2' />
                            {step === 0 || step === 4 ? 'New Passage' : 'Retake Test'}
                        </button>
                    </div>
                </div>

                {step === 0 && (<div>
                    <div className="rounded-xl border-2 border-gray-400 shadow-xl p-4 flex flex-col gap-5">
                        <div className='flex justify-between items-center'>
                            <h2 className="text-xl text-gray-900"><span className='text-2xl font-semibold'>Passage Title: </span>{passageDetails.title}</h2>
                            <div className="flex items-center space-x-4">
                                <span className='text-xl font-semibold'>Level:  <span className="px-3 py-1 bg-green-200 rounded-full text-lg">{passageDetails.level}</span>
                                </span>

                                <span className='text-xl font-semibold'>Topic:  <span className="px-3 py-1 bg-green-200 rounded-full text-lg">{passageDetails.topic}</span>
                                </span>
                            </div>
                        </div>

                        <div className='bg-gray-200 w-50 py-5 px-6 rounded-xl'>
                            {passage.split('{{paraBreak}}').map((paragraph, index) => (
                                <p key={index} className="text-justify py-2 text-xl">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        <div className="text-center">
                            <p className="text-lg">
                                Read the above passage carefully. You can't scroll back to it after the test start.
                            </p>
                        </div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setStep(1)}
                            className="w-full btn btn-primary font-bold"
                        >
                            Start Reading Test
                        </motion.button>
                    </div>

                    <div className="rounded-xl border-2 border-gray-400 shadow-xl py-6 px-6 space-y-4 bg-white mt-5">
                        <h2 className="text-2xl font-semibold text-gray-800">Test Format & Instructions</h2>
                        <p className="text-lg text-gray-700">
                            This AI-powered reading practice module simulates the English Language Reading test and is divided into{' '}
                            <span className="font-medium text-green-700">three interactive sections</span>:
                        </p>

                        <ul className="list-disc pl-6 space-y-3 text-start text-lg text-gray-700">
                            <li>
                                <strong className="text-green-700">Section 1 – True or False:</strong> Read the passage carefully and decide whether the given statements are true or false based on the text.
                            </li>
                            <li>
                                <strong className="text-green-700">Section 2 – Multiple Choice Questions (MCQ):</strong> Answer comprehension questions by selecting the correct option from the provided choices.
                            </li>
                            <li>
                                <strong className="text-green-700">Section 3 – Fill in the Blanks:</strong> Complete sentences using appropriate words found in or inferred from the passage.
                            </li>
                        </ul>

                        <p className="text-lg text-gray-700">
                            📖 Read the passage thoroughly and answer all questions within 5 minutes. Once done, click <span className="font-medium bg-green-100 text-green-800 px-2 py-1 rounded">Submit</span> to receive instant AI-generated feedback, explanations, and your score.
                        </p>

                        <p className="text-lg italic text-gray-600 bg-green-50 p-4 rounded-lg border-l-4 border-green-200">
                            <span className="font-semibold text-green-700">Tip:</span> Skim the passage first, then scan for keywords while answering to improve speed and accuracy.
                        </p>
                    </div>
                </div>)}

                {step === 1 && (<div>
                    <div className="rounded-xl border-2 border-gray-400 shadow-xl p-4 flex flex-col gap-5">
                        <div className='text-start'>
                            <h2 className="text-xl text-gray-900"><span className='font-semibold'>Question Type: </span>True/False</h2>
                            <p className='text-lg'>Read each statement carefully and indicate whether it is True or False by selecting the appropriate option based on the passage</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {questionsA.map((question, questionIndex) =>
                                <motion.div
                                    key={questionIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: questionIndex * 0.1 }}
                                    className="p-6 rounded-xl gap-3 shadow-lg hover:shadow-2xl transition-shadow duration-500 border-2 border-gray-400"
                                >
                                    <div className="flex items-start space-x-4 mb-5">
                                        <div className="p-2 bg-green-200 rounded-lg">
                                            <LucideMessageCircleQuestion className="w-6 h-6 text-black" />
                                        </div>
                                        <div className="flex-1 mt-1 text-start">
                                            <b className="font-bold text-xl mb-3"><span className='text-2xl'>{questionIndex + 1}.</span> {question.question}</b>

                                            <div className="flex mt-3 space-x-4">
                                                {['True', 'False'].map((option) => (
                                                    <label
                                                        key={option}
                                                        className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 cursor-pointer transition-all min-w-[100px] ${answersA[questionIndex] === option
                                                            ? 'border-black bg-green-200 text-gray-333'
                                                            : 'border-gray-300 hover:border-green-222 text-gray-700 hover:bg-green-333/20'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}
                                                            value={option}
                                                            checked={answersA[questionIndex] === option}
                                                            onChange={(e) => handleAnswerChange('A', questionIndex, e.target.value)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${answersA[questionIndex] === option
                                                            ? 'border-black bg-green-200'
                                                            : 'border-gray-400 hover:border-green-222'
                                                            }`}>
                                                            {answersA[questionIndex] === option && (
                                                                <div className="w-4 h-3 rounded-full bg-white"></div>
                                                            )}
                                                        </div>
                                                        <span className={`${answersA[questionIndex] === option ? 'text-white' : ''} text-lg font-semibold`}>{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>)}
                        </div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: answersA.filter(i => i !== '').length === 0 ? 0.5 : 1 }}
                            onClick={() => setStep(2)}
                            disabled={answersA.filter(i => i !== '').length === 0}
                            className="w-full btn btn-primary font-bold"
                        >
                            Submit Answers
                        </motion.button>
                    </div>
                </div>)}

                {step === 2 && (<div>
                    <div className="rounded-xl border-2 border-gray-400 shadow-xl p-4 flex flex-col gap-5">
                        <div className='text-start'>
                            <h2 className="text-xl text-gray-900"><span className='font-semibold'>Question Type: </span>Multiple Choice</h2>
                            <p className='text-lg'>Read each question carefully and choose the correct option from the given choices based on the passage</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {questionsB.map((question, questionIndex) =>
                                <motion.div
                                    key={questionIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: questionIndex * 0.1 }}
                                    className="p-6 rounded-xl gap-3 shadow-lg hover:shadow-2xl transition-shadow duration-500 border-2 border-gray-400"
                                >
                                    <div className="flex items-start space-x-4 mb-5">
                                        <div className="p-2 bg-green-200 rounded-lg">
                                            <LucideMessageCircleQuestion className="w-6 h-6 text-black" />
                                        </div>
                                        <div className="flex-1 mt-1 text-start">
                                            <b className="font-bold text-xl mb-3"><span className='text-2xl'>{questionIndex + 1}.</span> {question.question}</b>

                                            <div className="mt-3 space-y-3">
                                                {question.options?.map((option, index) => (
                                                    <label
                                                        key={index}
                                                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${answersB[questionIndex] === option
                                                            ? 'border-black bg-green-200 text-gray-333'
                                                            : 'border-gray-300 hover:border-green-222 hover:bg-green-333/20'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}
                                                            value={option}
                                                            checked={answersB[questionIndex] === option}
                                                            onChange={(e) => handleAnswerChange('B', questionIndex, e.target.value)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${answersB[questionIndex] === option
                                                            ? 'border-black bg-green-200'
                                                            : 'border-gray-400 hover:border-green-222'
                                                            }`}>
                                                            {answersB[questionIndex] === option && (
                                                                <div className="w-4 h-3 rounded-full bg-white"></div>
                                                            )}
                                                        </div>
                                                        <span className={`${answersB[questionIndex] === option ? 'text-white' : 'text-gray-700'} text-lg font-semibold`}>
                                                            {option}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>)}
                        </div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: answersB.filter(i => i !== '').length === 0 ? 0.5 : 1 }}
                            onClick={() => setStep(3)}
                            disabled={answersB.filter(i => i !== '').length === 0}
                            className="w-full btn btn-primary font-bold"
                        >
                            Submit Answers
                        </motion.button>
                    </div>
                </div>)}

                {step === 3 && (<div>
                    <div className="rounded-xl border-2 border-gray-400 shadow-xl p-4 flex flex-col gap-5">
                        <div className='text-start'>
                            <h2 className="text-xl text-gray-900"><span className='font-semibold'>Question Type: </span>Fill in the Blank</h2>
                            <p className='text-lg'>Complete each sentence by writing the most appropriate word or phrase in the blank space provided based on the passage</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {questionsC.map((question, questionIndex) =>
                                <motion.div
                                    key={questionIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: questionIndex * 0.1 }}
                                    className="p-6 rounded-xl gap-3 shadow-lg hover:shadow-2xl transition-shadow duration-500 border-2 border-gray-400"
                                >
                                    <div className="flex items-start space-x-4 mb-5">
                                        <div className="p-2 bg-green-200 rounded-lg">
                                            <LucideMessageCircleQuestion className="w-6 h-6 text-black" />
                                        </div>
                                        <div className="flex-1 mt-1 text-start">
                                            <b className="font-bold text-xl mb-3"><span className='text-2xl'>{questionIndex + 1}.</span> {question.question}</b>

                                            <div className='mt-3'>
                                                <input
                                                    type="text"
                                                    value={answersC[questionIndex]}
                                                    onChange={(e) => handleAnswerChange('C', questionIndex, e.target.value)}
                                                    placeholder="Type your answer here..."
                                                    className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-200 transition-all border-gray-300 hover:border-green-222 focus:bg-green-333/10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>)}
                        </div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: answersC.filter(i => i !== '').length === 0 ? 0.5 : 1 }}
                            onClick={submitFinalAnswer}
                            disabled={answersC.filter(i => i !== '').length === 0}
                            className="w-full btn btn-primary font-bold"
                        >
                            Submit Answers
                        </motion.button>
                    </div>
                </div>)}

                {step === 4 && (<div>
                    <motion.div
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
                                <span className="text-xl font-bold mr-2">
                                    {Math.floor((marks[0] + marks[1] + marks[2]) / 15 * 100)}%
                                </span>
                                <span>
                                    ({marks[0] + marks[1] + marks[2]}/15)
                                </span>
                            </div>

                            <p className="text-xl mb-2">{feedback}</p>
                            <p className="text-lg font-semibold">
                                Performance Level: {performanceLevel}
                            </p>
                        </div>

                        {/* Tips for Improvement - Full Width */}
                        <div className="rounded-lg p-6 mb-2 bg-green-222">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Tips for Improvement</h3>
                            <div className="grid sm:grid-cols-2 gap-3 ml-24">
                                {[
                                    "Skim the passage to get the general idea first",
                                    "Highlight or underline key words while reading",
                                    "Scan for specific information to answer questions",
                                    "Pay attention to headings and paragraph structure",
                                    "Use context to understand unfamiliar words",
                                    "Practice reading different types of texts regularly"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="w-2 h-2 rounded-full mr-3 bg-black"></div>
                                        <span className='text-lg'>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex justify-center'>
                            <button
                                onClick={viewReview}
                                className="w-[40%] btn btn-primary"
                            >
                                Review Questions
                            </button>
                        </div>
                    </motion.div>

                    {isReview && <div id="reviewSection" className='flex flex-col gap-5 mt-5'>
                        <h1 className='text-4xl text-center m-5 font-bold underline underline-offset-4'>Review Question And Answer</h1>

                        <div className="p-4 rounded-xl gap-3 shadow-lg hover:shadow-2xl transition-shadow duration-500 border-2 border-gray-400">

                            <div className='flex justify-between items-center'>
                                <h2 className="text-xl text-start text-gray-900 mb-4"><span className='font-semibold'>Question Type: </span>True/False</h2>

                                <div className="inline-flex items-center p-3 rounded-full bg-green-200 mb-4">
                                    <span className="text-xl font-bold mr-2">
                                        {(marks[0] / 5) * 100}%
                                    </span>
                                    <span>
                                        ({marks[0]}/5)
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {questionsA.map((question, questionIndex) =>
                                    <motion.div
                                        key={questionIndex}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: questionIndex * 0.1 }}
                                        className="p-6 rounded-xl gap-3 shadow-lg hover:shadow-2xl transition-shadow duration-500 border-2 border-gray-400"
                                    >
                                        <div className="flex items-start space-x-4 mb-5">
                                            <div className={`p-2 ${answersA[questionIndex] === question.correctAnswer ? 'bg-green-200' : 'bg-red-400'} rounded-lg`}>
                                                {answersA[questionIndex] === question.correctAnswer ? <CheckCircle className="w-6 h-6 text-black" /> : <XCircle className="w-6 h-6 text-black" />}
                                            </div>
                                            <div className="flex-1 mt-1 text-start">
                                                <b className="font-bold text-xl"><span className='text-2xl'>{questionIndex + 1}.</span> {question.question}</b>

                                                <h2 className="text-lg text-start text-gray-900 mt-2"><span className='font-semibold'>Your Answer: </span>{answersA[questionIndex]}</h2>

                                                <h2 className="text-lg text-start text-gray-900 mt-2"><span className='font-semibold'>Correct Answer: </span>{question.correctAnswer}</h2>
                                            </div>
                                        </div>
                                    </motion.div>)}
                            </div>
                        </div>

                        <div className="p-4 rounded-xl gap-3 shadow-lg hover:shadow-2xl transition-shadow duration-500 border-2 border-gray-400">

                            <div className='flex justify-between items-center'>
                                <h2 className="text-xl text-start text-gray-900 mb-4"><span className='font-semibold'>Question Type: </span>Multiple Choice</h2>

                                <div className="inline-flex items-center p-3 rounded-full bg-green-200 mb-4">
                                    <span className="text-xl font-bold mr-2">
                                        {(marks[1] / 5) * 100}%
                                    </span>
                                    <span>
                                        ({marks[1]}/5)
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {questionsB.map((question, questionIndex) =>
                                    <motion.div
                                        key={questionIndex}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: questionIndex * 0.1 }}
                                        className="p-6 rounded-xl gap-3 shadow-lg hover:shadow-2xl transition-shadow duration-500 border-2 border-gray-400"
                                    >
                                        <div className="flex items-start space-x-4 mb-5">
                                            <div className={`p-2 ${answersB[questionIndex] === question.correctAnswer ? 'bg-green-200' : 'bg-red-400'} rounded-lg`}>
                                                {answersB[questionIndex] === question.correctAnswer ? <CheckCircle className="w-6 h-6 text-black" /> : <XCircle className="w-6 h-6 text-black" />}
                                            </div>
                                            <div className="flex-1 mt-1 text-start">
                                                <b className="font-bold text-xl"><span className='text-2xl'>{questionIndex + 1}.</span> {question.question}</b>

                                                <h2 className="text-lg text-start text-gray-900 mt-2"><span className='font-semibold'>Your Answer: </span>{answersB[questionIndex]}</h2>

                                                <h2 className="text-lg text-start text-gray-900 mt-2"><span className='font-semibold'>Correct Answer: </span>{question.correctAnswer}</h2>
                                            </div>
                                        </div>
                                    </motion.div>)}
                            </div>
                        </div>

                        <div className="p-4 rounded-xl gap-3 shadow-lg hover:shadow-2xl transition-shadow duration-500 border-2 border-gray-400">

                            <div className='flex justify-between items-center'>
                                <h2 className="text-xl text-start text-gray-900 mb-4"><span className='font-semibold'>Question Type: </span>Fill in the Blank</h2>

                                <div className="inline-flex items-center p-3 rounded-full bg-green-200 mb-4">
                                    <span className="text-xl font-bold mr-2">
                                        {(marks[2] / 5) * 100}%
                                    </span>
                                    <span>
                                        ({marks[2]}/5)
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {questionsC.map((question, questionIndex) =>
                                    <motion.div
                                        key={questionIndex}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: questionIndex * 0.1 }}
                                        className="p-6 rounded-xl gap-3 shadow-lg hover:shadow-2xl transition-shadow duration-500 border-2 border-gray-400"
                                    >
                                        <div className="flex items-start space-x-4 mb-5">
                                            <div className={`p-2 ${answersC[questionIndex].toLowerCase() === question.correctAnswer.toLowerCase() ? 'bg-green-200' : 'bg-red-400'} rounded-lg`}>
                                                {answersC[questionIndex].toLowerCase() === question.correctAnswer.toLowerCase() ? <CheckCircle className="w-6 h-6 text-black" /> : <XCircle className="w-6 h-6 text-black" />}
                                            </div>
                                            <div className="flex-1 mt-1 text-start">
                                                <b className="font-bold text-xl"><span className='text-2xl'>{questionIndex + 1}.</span> {question.question}</b>

                                                <h2 className="text-lg text-start text-gray-900 mt-2"><span className='font-semibold'>Your Answer: </span>{answersC[questionIndex]}</h2>

                                                <h2 className="text-lg text-start text-gray-900 mt-2"><span className='font-semibold'>Correct Answer: </span>{question.correctAnswer}</h2>
                                            </div>
                                        </div>
                                    </motion.div>)}
                            </div>
                        </div>
                    </div>}
                </div>)}
            </div>
        </>
    )
}

export default Reading;