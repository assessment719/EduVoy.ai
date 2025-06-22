import { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { RefreshCw, Image, SquarePen, NotebookPen, Clock, CheckCircle, FileText, Send, Trophy, Target, CheckSquare, Link, BookOpen, Zap, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import ProgresBar from './../UI/ProgressBar';
import { useTimer } from './../Hooks/useTimer';
import { englishTestsAtom, userDetailsAtom } from './../../../../Atoms/atoms';
import { testNameAtom } from './../atoms';
import InsideLoader from '../UI/Loader';
import { BACKEND_URL } from './../../../../config';
import type { englishTests } from '../../../../Utils/englishTest';

function Writting() {
    const [isFetching, setIsFetching] = useState(false);
    const [fetchingPrompt, setFetchingPrompt] = useState('');
    const [step, setStep] = useState(0);
    const [selectedTask, setSelecetedTask] = useState('');
    const [essayDetails, setEssayDetails] = useState<{ [key: string]: string }>({ title: 'The Rise of Renewable Energy Technologies', level: 'Intermediate', topic: 'Environment' });
    const [prompt, setPrompt] = useState(`Some people believe that the government should invest more in public transportation systems to reduce traffic congestion and pollution. Others think that building more roads and expanding infrastructure is a better solution to accommodate the growing number of vehicles. Discuss both views and give your own opinion. Support your answer with relevant examples and reasons.`);
    const [essay, setEssay] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [imageData, setImageData] = useState<{ [key: string]: string }>({});

    //Feedback Essentials
    const [feedbackTab, setFeedbackTab] = useState('scores');
    const [marks, setMarks] = useState<{ [key: string]: number }>({ overall: 0, taskResponse: 0, coherenceAndCohesion: 0, lexicalResource: 0, grammarAndAccuracy: 0 });
    const [feedbacks, setFeedbacks] = useState<{ [key: string]: string }>({ overall: '', taskResponse: '', coherenceAndCohesion: '', lexicalResource: '', grammarAndAccuracy: '' });
    const [sampleAnswer, setSampleAnswer] = useState('');

    const images = [
        { imageUrl: 'https://i.postimg.cc/8k4cRm2B/5-DBCBAA2-0491-4264-A612-15287791-D137.png', imagePrompt: 'A skyline photo of Dubai at sunset with the Burj Khalifa and other skyscrapers glowing under golden light. The foreground includes palm trees and a few yachts on the water', imageDescription: 'This sunset scene shows a mix of natural and architectural beauty. The reflection of buildings in the water enhances the cinematic effect.' },
        { imageUrl: 'https://i.postimg.cc/3RJCWK4Q/4-A775-F3-E-9-D84-400-F-ADBF-9-BB3-B51-CD169.png', imagePrompt: 'A scenic countryside village with people working in terraced rice fields, mountains in the background, and water buffalo nearby', imageDescription: 'The image shows a rural setting with farmers wearing traditional hats, cloudy skies, and green fields filled with water, representing a typical agricultural scene in Southeast Asia.' },
        { imageUrl: 'https://i.postimg.cc/NF8HxSrk/1-EC35-EF6-DA45-4725-A1-F0-EF1-E098911-DA.png', imagePrompt: 'A beach cleanup activity with volunteers collecting plastic waste, wearing gloves and sorting recyclables into bins. The background shows ocean waves and a rising sun', imageDescription: `Children, adults, and seniors are participating in an organized cleanup. Banners display environmental messages like 'Protect Our Planet'.` },
        { imageUrl: 'https://i.postimg.cc/R0nQHPGX/CEED764-E-E226-4352-896-B-1518-DB37-F7-AF.png', imagePrompt: 'A Thai night market with food stalls selling grilled seafood, fruits, and handmade items. Neon lights, paper lanterns, and a crowded walkway create a festive vibe', imageDescription: 'The scene is vibrant, filled with tourists and locals enjoying the food, some seated on low stools eating hot meals. Street musicians add to the atmosphere.' },
        { imageUrl: 'https://i.postimg.cc/FKZcc23b/6-CDD5064-DEB4-4506-B97-B-F448-D5-E94299.png', imagePrompt: 'A cozy bakery interior with bakers decorating cakes, glass displays with pastries, a coffee counter, and customers in a queue', imageDescription: 'The image shows a warm setting with wooden decor, pendant lighting, and a family-friendly environment. Smiling staff in aprons are engaging with customers.' }
    ]

    useEffect(() => {
        if (step === 0) {
            setSelecetedTask('');
            setEssay('');
        } else {
            window.scrollTo({ top: 350, behavior: 'smooth' });
        }

        if (step === 1 && selectedTask === 'image-description') {
            const randomNo = Math.floor(Math.random() * images.length);
            setImageData(images[randomNo]);
        }

        if (step === 2) {
            timer.reset();
        }
    }, [step])

    // Retake Exercise
    const retakeExercise = () => {
        setStep(0);
    }

    // New Exercise
    const newExercise = async () => {
        setFetchingPrompt(selectedTask === 'image-description' ? 'Generating New Image...' : 'Generating New Essay Writting Prompt...')
        setEssay('');
        setIsFetching(true);
        timer.reset();
        if (selectedTask === 'image-description') {
            const randomNo = Math.floor(Math.random() * images.length);
            setTimeout(() => {
                setImageData(images[randomNo]);
                setIsFetching(false);
            }, 5000)
        } else {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch(`${BACKEND_URL}/users/openai/langaugeTest/writingTest`, {
                    method: "GET",
                    headers: {
                        'token': `${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const res = await response.json();
                await new Promise((e) => { setTimeout(e, 5000) });
                setPrompt(res.writingTopic);
                setEssayDetails(res.essayTopicDetails);
            } catch (error) {
                console.log(`Error While Generating New Essay Prompt: ${error}`);
            }
            setIsFetching(false);
        }
    }

    //To Update The Marks In Database and Atom
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

    const getAiReview = async (reviewBody: any) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${BACKEND_URL}/users/openai/langaugeTest/writingTest/${selectedTask === 'image-description' ? 'imageDescription' : 'essayWriting'}/evaluation`, {
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
    }

    //Review Studen's Response
    const review = async () => {
        setFetchingPrompt('Examining and Calculating Your Test Marks...');
        setIsFetching(true);
        timer.reset();

        if (selectedTask === 'image-description') {
            const reviewBody = {
                imageDetails: {
                    imagePrompt: imageData.imagePrompt,
                    imageDescription: imageData.imageDescription
                },
                studentDescription: essay
            }

            const response = await getAiReview(reviewBody);

            if (response?.success && response?.data) {
                setMarks(response.data.marks);
                setFeedbacks(response.data.feedback);
                setSampleAnswer(response.data.sampleDescription);

                //Atom Save
                setEnglishTest(prev => ({
                    ...prev,
                    [testName]: {
                        ...prev[testName as keyof englishTests],
                        writingScoreTaskA: response.data.marks.overall
                    }
                }));

                //Database Save
                updateEnglishTests('writingScoreTaskA', response.data.marks.overall);

                await new Promise((e) => { setTimeout(e, 5000) });
                setStep(2);
            } else {
                alert('Sorry! there was an error while examinining your response. Please, try agin!');
            }
        } else {
            const reviewBody = {
                essayDetails: {
                    essayTopic: prompt,
                    title: essayDetails.title,
                    level: essayDetails.level,
                    topic: essayDetails.topic
                },
                studentEssay: essay
            }

            const response = await getAiReview(reviewBody);

            if (response?.success && response?.data) {
                setMarks(response.data.marks);
                setFeedbacks(response.data.feedback);
                setSampleAnswer(response.data.sampleDescription);

                //Atom Save
                setEnglishTest(prev => ({
                    ...prev,
                    [testName]: {
                        ...prev[testName as keyof englishTests],
                        writingScoreTaskB: response.data.marks.overall
                    }
                }));

                //Database Save
                updateEnglishTests('writingScoreTaskB', response.data.marks.overall);

                await new Promise((e) => { setTimeout(e, 5000) });
                setStep(2);
            } else {
                alert('Sorry! there was an error while examinining your response. Please, try agin!');
            }
        }
        setIsFetching(false);
    }

    //Word Count
    useEffect(() => {
        const words = essay.trim().split(/\s+/).filter(word => word.length > 0);
        setWordCount(words.length);
    }, [essay]);

    //Timer Logic
    const timer = useTimer({
        initialTime: selectedTask === 'image-description' ? 300 : 600,
        onTimeEnd: () => {
            review(); // Your existing logic
        }
    });


    useEffect(() => {
        timer.reset();
        setEssay('');
    }, [selectedTask]);

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
            {isFetching && <InsideLoader text={fetchingPrompt} />}

            <div className='flex flex-col gap-5'>
                <div className="rounded-xl border-2 border-gray-400 shadow-xl py-2 px-4 flex justify-between items-center">
                    <div className='flex justify-start items-center'>
                        <NotebookPen className='w-7 h-7 mr-3' />
                        <div className='text-start'>
                            <h1 className='text-2xl font-bold'>Writing Practice</h1>
                            <p className='text-lg'>Practice with AI-generated writing exercises</p>
                        </div>
                    </div>

                    {step !== 0 && (<button
                        onClick={retakeExercise}
                        className="flex items-center btn btn-primary"
                    >
                        <RefreshCw className='w-6 h-6 mr-2' />
                        {step === 1 ? 'Change Task' : 'Retake Exercise'}
                    </button>)}
                </div>

                {step === 0 && (<div>
                    <div className="rounded-xl border-2 border-gray-400 shadow-xl p-4 flex flex-col gap-5">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold mb-4 text-gray-900">Choose a Writing Task</h2>
                            <p className="text-xl text-gray-600">
                                Select the writing task you want to practice and receive instant AI-generated feedback based on your response
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-10 px-6 py-10 bg-gray-200 rounded-xl">
                            {[
                                {
                                    id: 'image-description',
                                    icon: Image,
                                    title: 'Task A - Describe The Image',
                                    description: 'Write a brief description of the given image, highlighting key features, trends, or patterns',
                                    time: '5 Minutes',
                                    words: '200+ Words'
                                },
                                {
                                    id: 'essay-writing',
                                    icon: SquarePen,
                                    title: 'Task B - Essay Writing',
                                    description: 'Write an organized essay on a given topic, stating your opinion and supporting it with examples',
                                    time: '10 Minutes',
                                    words: '250+ Words'
                                }
                            ].map((task, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelecetedTask(task.id)}
                                    className={`bg-white rounded-xl border-2 border-black p-6 shadow-lg flex flex-col items-center text-center cursor-pointer transition-alL duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105 relative ${selectedTask === task.id ? 'border-green-200' : 'border-black'}`}
                                >
                                    {selectedTask === task.id && (
                                        <div className="absolute top-4 right-4">
                                            <CheckCircle className="w-7 h-7 text-green-200" />
                                        </div>
                                    )}

                                    <div className="bg-green-200 p-4 rounded-full mb-4">
                                        <task.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                                    <p className="text-gray-700 mb-4">{task.description}</p>
                                    <div className="flex gap-3">
                                        {task.id === 'image-description' && (< span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold text-gray-800">20+ Images</span>)}
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold text-gray-800">{task.time}</span>
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold text-gray-800">{task.words}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: selectedTask === '' ? 0.5 : 1 }}
                            disabled={selectedTask === ''}
                            onClick={() => setStep(1)}
                            className="w-full btn btn-primary font-bold"
                        >
                            Start Writing Test
                        </motion.button>
                    </div>

                    <div className="rounded-xl border-2 border-gray-400 shadow-xl py-6 px-6 space-y-4 bg-white mt-5">
                        <h2 className="text-2xl font-semibold text-gray-800">Test Format & Instructions</h2>
                        <p className="text-lg text-gray-700">
                            This AI-powered writing practice module simulates the English Language Writing test and is divided into{' '}
                            <span className="font-medium text-green-700">two interactive tasks</span>:
                        </p>

                        <ul className="list-disc pl-6 space-y-3 text-start text-lg text-gray-700">
                            <li>
                                <strong className="text-green-700">Task A – Describe the Image:</strong> Observe the given image and write a clear and concise description based on what you see. Focus on key features, trends, or patterns if it's a graph or chart.
                            </li>
                            <li>
                                <strong className="text-green-700">Task B – Essay Writing:</strong> Respond to a given topic by writing an organized and well-reasoned essay. Make sure to state your opinion, support it with examples, and maintain proper grammar and structure.
                            </li>
                        </ul>

                        <p className="text-lg text-gray-700">
                            ✍️ Complete both writing tasks within the allotted time. Once finished, click <span className="font-medium bg-green-100 text-green-800 px-2 py-1 rounded">Submit</span> to receive instant AI-generated feedback on structure, grammar, coherence, and overall quality.
                        </p>

                        <p className="text-lg italic text-gray-600 bg-green-50 p-4 rounded-lg border-l-4 border-green-200">
                            <span className="font-semibold text-green-700">Tip:</span> Plan your writing before you start. Use paragraphs, stay relevant to the task, and review your answer for grammatical accuracy before submitting.
                        </p>
                    </div>
                </div>)}

                {step === 1 && (<div>
                    {selectedTask === 'image-description' && (<div className='rounded-xl border-2 border-gray-400 shadow-xl p-4 flex flex-col gap-5'>
                        <div className="flex justify-between items-center">
                            <div className='flex justify-start items-center'>
                                <Image className='w-7 h-7 mr-3' />
                                <div className='text-start'>
                                    <h1 className='text-2xl font-bold'>Image & Instructions</h1>
                                    <p className='text-lg'><span className='font-semibold'>Task A - </span>Describe The Image
                                    </p>
                                </div>
                            </div>

                            <button
                                disabled={timer.isRunning}
                                onClick={newExercise}
                                className={`flex items-center btn btn-primary ${timer.isRunning ? 'opacity-50' : 'opacity-100'}`}
                            >
                                <RefreshCw className='w-6 h-6 mr-2' />
                                New Image
                            </button>
                        </div>

                        <div className="w-full max-w-lg mx-auto rounded-xl border-2 border-gray-400 p-3">
                            <img
                                src={imageData.imageUrl}
                                alt="Image to describe"
                                className="rounded-lg"
                            />
                        </div>

                        <div className='bg-gray-200 w-50 py-5 px-6 rounded-xl text-xl text-start'>
                            Look at the image carefully and write a detailed description of what you see. Your description should be approximately 200 words and completed within 5 minutes. Focus on describing the people, objects, setting, colors, and any activities or emotions you observe. Use descriptive language and organize your thoughts clearly.
                        </div>
                    </div>)}

                    {selectedTask === 'essay-writing' && (<div className='rounded-xl border-2 border-gray-400 shadow-xl p-4 flex flex-col gap-5'>
                        <div className="flex justify-between items-center">
                            <div className='flex justify-start items-center'>
                                <SquarePen className='w-7 h-7 mr-3' />
                                <div className='text-start'>
                                    <h1 className='text-2xl font-bold'>Writing Prompt</h1>
                                    <p className='text-lg'><span className='font-semibold'>Task B - </span>Essay Writing
                                    </p>
                                </div>
                            </div>

                            <button
                                disabled={timer.isRunning}
                                onClick={newExercise}
                                className={`flex items-center btn btn-primary ${timer.isRunning ? 'opacity-50' : 'opacity-100'}`}
                            >
                                <RefreshCw className='w-6 h-6 mr-2' />
                                New Prompt
                            </button>
                        </div>

                        <div className='bg-gray-200 w-50 py-5 px-6 rounded-xl text-xl text-start'>
                            <div className='flex justify-between items-center mb-5'>
                                <h2 className="text-xl text-gray-900"><span className='text-2xl font-semibold'>Essay Title: </span>{essayDetails.title}</h2>
                                <div className="flex items-center space-x-4">
                                    <span className='text-xl font-semibold'>Level:  <span className="px-3 py-1 bg-green-200 rounded-full text-lg">{essayDetails.level}</span>
                                    </span>

                                    <span className='text-xl font-semibold'>Topic:  <span className="px-3 py-1 bg-green-200 rounded-full text-lg">{essayDetails.topic}</span>
                                    </span>
                                </div>
                            </div>

                            {prompt}
                        </div>

                        <div className="flex justify-center">
                            <p className="text-lg max-w-[80%]">
                                Based on the above prompt write a well-structured essay in response to the question. Express your ideas clearly, support them with relevant examples, and use proper grammar and vocabulary.
                            </p>
                        </div>
                    </div>)}

                    <div className='rounded-xl border-2 border-gray-400 shadow-xl p-4 flex flex-col gap-5 mt-5'>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText size={30} />
                                <h2 className="text-2xl font-semibold text-gray-800">Your {selectedTask === 'image-description' ? 'Description' : 'Essay'}</h2>
                            </div>
                            <div className="flex items-center gap-4 text-lg">
                                <div className={`flex text-xl bg-gray-200 p-2 rounded-lg items-center ${timer.time && timer.time < 60 ? 'text-red-600' : 'text-black'
                                    }`}>
                                    <Clock className="h-5 w-5 mr-1" />
                                    <span className="font-semibold">{timer.formatTime(timer.time)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                    <FileText size={20} />
                                    <span>{wordCount} Words</span>
                                </div>
                            </div>
                        </div>

                        <textarea
                            value={essay}
                            onChange={(e) => setEssay(e.target.value)}
                            onFocus={timer.start}
                            placeholder={selectedTask === 'image-description' ? 'Describe what you see in the image...' : 'Start typing your essay here...'}
                            className="w-full h-96 p-4 border-2 border-gray-200 text-lg rounded-lg resize-none focus:ring-2 focus:ring-green-200 focus:border-transparent"
                        />

                        <div className="flex justify-between items-center">
                            <div className="text-lg">
                                {selectedTask === 'image-description' ? 'Target: 200 words in 5 minutes' : 'Recommended: 250+ words'}
                            </div>
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: essay === '' ? 0.5 : 1 }}
                                disabled={essay === ''}
                                onClick={review}
                                className="flex items-center btn btn-primary"
                            >
                                <Send className='w-6 h-6 mr-2' />
                                Submit for Review
                            </motion.button>
                        </div>
                    </div>
                </div>)}

                {step === 2 && (
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
                                <span className="text-xl font-bold">
                                    {marks.overall}%
                                </span>
                            </div>

                            <p className="text-xl mb-2">{feedback}</p>
                            <p className="text-lg font-semibold">
                                Performance Level: {performanceLevel}
                            </p>
                        </div>

                        <div className="tabListMain min-h-full">
                            <Tabs.Root value={feedbackTab} onValueChange={setFeedbackTab}>
                                <Tabs.List className="flex gap-2 space-x-1 bg-gray-200 p-4 rounded-xl shadow-sm mb-5 font-bold w-full">
                                    {[
                                        { id: 'scores', label: 'Scores' },
                                        { id: 'feedback', label: 'Feedback' },
                                        { id: 'sample', label: 'Sample' }
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
                                                { id: 'taskResponse', icon: <CheckSquare size={18} />, title: 'Task Response' },
                                                { id: 'coherenceAndCohesion', icon: <Link size={18} />, title: 'Coherence & Cohesion' },
                                                { id: 'lexicalResource', icon: <BookOpen size={18} />, title: 'Lexical Resource' },
                                                { id: 'grammarAndAccuracy', icon: <Zap size={18} />, title: 'Grammar & Accuracy' }
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
                                                { id: 'taskResponse', icon: <CheckSquare size={18} />, title: 'Task Response', borderColor: 'border-l-green-500' },
                                                { id: 'coherenceAndCohesion', icon: <Link size={18} />, title: 'Coherence & Cohesion', borderColor: 'border-l-purple-500' },
                                                { id: 'lexicalResource', icon: <BookOpen size={18} />, title: 'Lexical Resource', borderColor: 'border-l-orange-500' },
                                                { id: 'grammarAndAccuracy', icon: <Zap size={18} />, title: 'Grammar & Accuracy', borderColor: 'border-l-red-500' }
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

                                    <Tabs.Content value="sample">
                                        <div className='rounded-xl border-2 border-gray-400 shadow-xl p-4 flex flex-col gap-5'>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-1 text-xl font-semibold">
                                                    <Lightbulb className="w-6 h-6" />
                                                    <span>Suggested Improvement Example</span>
                                                </div>
                                                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-200">
                                                    <p className="text-lg text-start leading-relaxed">
                                                        {sampleAnswer}
                                                    </p>
                                                </div>
                                                <p className="text-lg">
                                                    This is a sample rewrite showing how your essay could be improved.
                                                    Use it as inspiration for your own writing style.
                                                </p>
                                            </div>
                                        </div>
                                    </Tabs.Content>
                                </motion.div>
                            </Tabs.Root>
                        </div>

                    </motion.div>
                )}
            </div>
        </>
    )
}

export default Writting;