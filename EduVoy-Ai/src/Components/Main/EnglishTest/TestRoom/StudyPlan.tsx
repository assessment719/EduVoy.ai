import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, X, Clock, Info, Trophy, Star } from 'lucide-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { englishTests } from './../../../../Utils/englishTest';
import { englishTestsAtom, userDetailsAtom } from './../../../../Atoms/atoms';
import { testNameAtom } from './../atoms';
import { BACKEND_URL } from './../../../../config';

function StudyPlan() {
    const [currentDate, setCurrentDate] = useState(0);
    const [currentTask, setCurrentTask] = useState(0);
    const [currentStudyPlan, setCurrentStudyPlan] = useState<{ day: number, task: string, tips: string, duration: string, status: boolean }[]>([]);

    //For User's Test Data
    const testName = useRecoilValue(testNameAtom);
    const englishTests: englishTests = useRecoilValue(englishTestsAtom);
    const setEnglishTest = useSetRecoilState(englishTestsAtom);
    const userDetails = useRecoilValue(userDetailsAtom);

    useEffect(() => {
        setCurrentDate(englishTests[testName as keyof englishTests].currentDate);
        setCurrentTask(englishTests[testName as keyof englishTests].currentTask);
    }, [])

    let studyPlan = [
        // Day 1
        { day: 1, task: "Listening: Practice 2 Conversations (Note-taking)", tips: "Focus on names, dates, places. Write keywords.", duration: "30 mins", status: false },
        { day: 1, task: "Reading: 1 Academic Passage + MCQs", tips: "Skim first, then scan for answers.", duration: "25 mins", status: false },
        { day: 1, task: "Writing: Opinion Essay (250 words)", tips: "Plan: Intro, 2 Body Paras, Conclusion.", duration: "40 mins", status: false },
        { day: 1, task: "Speaking: Record 2-min Self-Introduction", tips: "Check fluency, grammar, pronunciation.", duration: "15 mins", status: false },

        // Day 2
        { day: 2, task: "Listening: Monologue (Lecture/Podcast)", tips: "Note main ideas & supporting points.", duration: "30 mins", status: false },
        { day: 2, task: "Reading: True/False/Not Given Questions", tips: "Avoid assumptions; stick to the text.", duration: "25 mins", status: false },
        { day: 2, task: "Writing: Formal Letter/Email", tips: "Use formal tone & proper structure.", duration: "30 mins", status: false },
        { day: 2, task: "Speaking: Describe a Photo (1 min prep, 2 mins speak)", tips: "Use present continuous tense.", duration: "15 mins", status: false },

        // Day 3
        { day: 3, task: "Listening: Multiple Speakers (Debate/Discussion)", tips: "Identify opinions & agreements.", duration: "30 mins", status: false },
        { day: 3, task: "Reading: Summarize a Passage in 3 Sentences", tips: "Focus on topic sentences.", duration: "20 mins", status: false },
        { day: 3, task: "Writing: Revise Day 1 Essay (Grammar/Logic)", tips: "Check coherence & linking words.", duration: "20 mins", status: false },
        { day: 3, task: "Speaking: Shadowing Exercise (Repeat Audio)", tips: "Copy native speaker’s rhythm.", duration: "15 mins", status: false },

        // Day 4
        { day: 4, task: "Listening: Map/Diagram Labeling", tips: "Prepositions matter (e.g., next to, behind).", duration: "30 mins", status: false },
        { day: 4, task: "Reading: Matching Headings to Paragraphs", tips: "Look for paraphrased topic sentences.", duration: "25 mins", status: false },
        { day: 4, task: "Writing: Describe a Graph (Trends/Comparisons)", tips: "Use: 'The graph illustrates...'", duration: "30 mins", status: false },
        { day: 4, task: "Speaking: Opinion on a Current Topic", tips: "Use: 'I believe... because...'", duration: "15 mins", status: false },

        // Day 5
        { day: 5, task: "Listening: Fill-in-the-Blanks (Notes)", tips: "Predict word types (noun/verb/adjective).", duration: "30 mins", status: false },
        { day: 5, task: "Reading: Sentence Completion", tips: "Check grammar (singular/plural).", duration: "25 mins", status: false },
        { day: 5, task: "Writing: Problem-Solution Essay", tips: "Structure: Problem → Causes → Solutions.", duration: "40 mins", status: false },
        { day: 5, task: "Speaking: Role-play (e.g., Job Interview)", tips: "Be polite & structured.", duration: "15 mins", status: false },

        // Day 6
        { day: 6, task: "Listening: Practice with Accents (UK/US/AUS)", tips: "Watch TED Talks or news clips.", duration: "30 mins", status: false },
        { day: 6, task: "Reading: Find Synonyms in a Passage", tips: "Underline words with similar meanings.", duration: "20 mins", status: false },
        { day: 6, task: "Writing: Revise Day 4 Graph Description", tips: "Check data accuracy & vocabulary.", duration: "20 mins", status: false },
        { day: 6, task: "Speaking: Talk About a Childhood Memory", tips: "Use past tense & vivid details.", duration: "15 mins", status: false },

        // Day 7
        { day: 7, task: "Listening: Full Section (40 Questions)", tips: "Simulate test conditions. No pauses!", duration: "40 mins", status: false },
        { day: 7, task: "Reading: Timed Practice (3 Passages)", tips: "Strict 60-minute limit.", duration: "60 mins", status: false },
        { day: 7, task: "Writing: Timed Essay (40 mins)", tips: "Plan → Write → Proofread.", duration: "40 mins", status: false },
        { day: 7, task: "Speaking: Mock Interview (All Parts)", tips: "Record & analyze weaknesses.", duration: "20 mins", status: false },

        // Day 8-14: Focus on Weak Areas + Advanced Practice
        { day: 8, task: "Listening: Inference Questions (Tone/Purpose)", tips: "Listen for emotions (sarcasm, excitement).", duration: "30 mins", status: false },
        { day: 8, task: "Reading: Paraphrase Complex Sentences", tips: "Rewrite in simpler words.", duration: "25 mins", status: false },
        { day: 8, task: "Writing: Agree/Disagree Essay", tips: "Take a clear stance.", duration: "40 mins", status: false },
        { day: 8, task: "Speaking: Debate a Controversial Topic", tips: "Use 'However, I disagree because...'", duration: "15 mins", status: false },

        { day: 9, task: "Listening: Inference Questions (Tone/Purpose)", tips: "Listen for emotions (sarcasm, excitement).", duration: "30 mins", status: false },
        { day: 9, task: "Reading: Paraphrase Complex Sentences", tips: "Rewrite in simpler words.", duration: "25 mins", status: false },
        { day: 9, task: "Writing: Agree/Disagree Essay", tips: "Take a clear stance.", duration: "40 mins", status: false },
        { day: 9, task: "Speaking: Debate a Controversial Topic", tips: "Use 'However, I disagree because...'", duration: "15 mins", status: false },

        { day: 10, task: "Listening: Inference Questions (Tone/Purpose)", tips: "Listen for emotions (sarcasm, excitement).", duration: "30 mins", status: false },
        { day: 10, task: "Reading: Paraphrase Complex Sentences", tips: "Rewrite in simpler words.", duration: "25 mins", status: false },
        { day: 10, task: "Writing: Agree/Disagree Essay", tips: "Take a clear stance.", duration: "40 mins", status: false },
        { day: 10, task: "Speaking: Debate a Controversial Topic", tips: "Use 'However, I disagree because...'", duration: "15 mins", status: false },

        { day: 11, task: "Listening: Inference Questions (Tone/Purpose)", tips: "Listen for emotions (sarcasm, excitement).", duration: "30 mins", status: false },
        { day: 11, task: "Reading: Paraphrase Complex Sentences", tips: "Rewrite in simpler words.", duration: "25 mins", status: false },
        { day: 11, task: "Writing: Agree/Disagree Essay", tips: "Take a clear stance.", duration: "40 mins", status: false },
        { day: 11, task: "Speaking: Debate a Controversial Topic", tips: "Use 'However, I disagree because...'", duration: "15 mins", status: false },

        { day: 12, task: "Listening: Inference Questions (Tone/Purpose)", tips: "Listen for emotions (sarcasm, excitement).", duration: "30 mins", status: false },
        { day: 12, task: "Reading: Paraphrase Complex Sentences", tips: "Rewrite in simpler words.", duration: "25 mins", status: false },
        { day: 12, task: "Writing: Agree/Disagree Essay", tips: "Take a clear stance.", duration: "40 mins", status: false },
        { day: 12, task: "Speaking: Debate a Controversial Topic", tips: "Use 'However, I disagree because...'", duration: "15 mins", status: false },

        { day: 13, task: "Listening: Inference Questions (Tone/Purpose)", tips: "Listen for emotions (sarcasm, excitement).", duration: "30 mins", status: false },
        { day: 13, task: "Reading: Paraphrase Complex Sentences", tips: "Rewrite in simpler words.", duration: "25 mins", status: false },
        { day: 13, task: "Writing: Agree/Disagree Essay", tips: "Take a clear stance.", duration: "40 mins", status: false },
        { day: 13, task: "Speaking: Debate a Controversial Topic", tips: "Use 'However, I disagree because...'", duration: "15 mins", status: false },

        { day: 14, task: "Listening: Inference Questions (Tone/Purpose)", tips: "Listen for emotions (sarcasm, excitement).", duration: "30 mins", status: false },
        { day: 14, task: "Reading: Paraphrase Complex Sentences", tips: "Rewrite in simpler words.", duration: "25 mins", status: false },
        { day: 14, task: "Writing: Agree/Disagree Essay", tips: "Take a clear stance.", duration: "40 mins", status: false },
        { day: 14, task: "Speaking: Debate a Controversial Topic", tips: "Use 'However, I disagree because...'", duration: "15 mins", status: false },

        // Day 15: Full Mock Test + Analysis + Targeted Practice
        { day: 15, task: "FULL MOCK TEST (All Sections)", tips: "Strict timing. No distractions. Use a quiet environment.", duration: "3 hours", status: false },
        { day: 15, task: "Review Mock Test Mistakes", tips: "Categorize errors (e.g., listening: missed keywords; writing: grammar).", duration: "60 mins", status: false },
        { day: 15, task: "Focus Practice on Weakest Section", tips: "e.g., If listening was hard, redo missed questions with transcripts.", duration: "45 mins", status: false },
        { day: 15, task: "Relaxation & Vocab Refresh", tips: "Watch an English show/listen to a podcast. Note 5 new words.", duration: "30 mins", status: false },

        // Day 16-29: Advanced Practice + Test Strategies
        { day: 16, task: "Listening: Speed Practice (1.25x Speed)", tips: "Train for fast speakers.", duration: "30 mins", status: false },
        { day: 16, task: "Reading: Skim 3 Passages in 10 Mins", tips: "Focus on main ideas only.", duration: "15 mins", status: false },
        { day: 16, task: "Writing: Combine Graphs + Essays", tips: "e.g., Graph + Opinion.", duration: "50 mins", status: false },
        { day: 16, task: "Speaking: Impromptu Speech (Random Topic)", tips: "Think → Structure → Speak.", duration: "15 mins", status: false },

        { day: 17, task: "Listening: Speed Practice (1.25x Speed)", tips: "Train for fast speakers.", duration: "30 mins", status: false },
        { day: 17, task: "Reading: Skim 3 Passages in 10 Mins", tips: "Focus on main ideas only.", duration: "15 mins", status: false },
        { day: 17, task: "Writing: Combine Graphs + Essays", tips: "e.g., Graph + Opinion.", duration: "50 mins", status: false },
        { day: 17, task: "Speaking: Impromptu Speech (Random Topic)", tips: "Think → Structure → Speak.", duration: "15 mins", status: false },

        { day: 18, task: "Listening: Speed Practice (1.25x Speed)", tips: "Train for fast speakers.", duration: "30 mins", status: false },
        { day: 18, task: "Reading: Skim 3 Passages in 10 Mins", tips: "Focus on main ideas only.", duration: "15 mins", status: false },
        { day: 18, task: "Writing: Combine Graphs + Essays", tips: "e.g., Graph + Opinion.", duration: "50 mins", status: false },
        { day: 18, task: "Speaking: Impromptu Speech (Random Topic)", tips: "Think → Structure → Speak.", duration: "15 mins", status: false },

        { day: 19, task: "Listening: Speed Practice (1.25x Speed)", tips: "Train for fast speakers.", duration: "30 mins", status: false },
        { day: 19, task: "Reading: Skim 3 Passages in 10 Mins", tips: "Focus on main ideas only.", duration: "15 mins", status: false },
        { day: 19, task: "Writing: Combine Graphs + Essays", tips: "e.g., Graph + Opinion.", duration: "50 mins", status: false },
        { day: 19, task: "Speaking: Impromptu Speech (Random Topic)", tips: "Think → Structure → Speak.", duration: "15 mins", status: false },

        { day: 20, task: "Listening: Speed Practice (1.25x Speed)", tips: "Train for fast speakers.", duration: "30 mins", status: false },
        { day: 20, task: "Reading: Skim 3 Passages in 10 Mins", tips: "Focus on main ideas only.", duration: "15 mins", status: false },
        { day: 20, task: "Writing: Combine Graphs + Essays", tips: "e.g., Graph + Opinion.", duration: "50 mins", status: false },
        { day: 20, task: "Speaking: Impromptu Speech (Random Topic)", tips: "Think → Structure → Speak.", duration: "15 mins", status: false },

        { day: 21, task: "Listening: Speed Practice (1.25x Speed)", tips: "Train for fast speakers.", duration: "30 mins", status: false },
        { day: 21, task: "Reading: Skim 3 Passages in 10 Mins", tips: "Focus on main ideas only.", duration: "15 mins", status: false },
        { day: 21, task: "Writing: Combine Graphs + Essays", tips: "e.g., Graph + Opinion.", duration: "50 mins", status: false },
        { day: 21, task: "Speaking: Impromptu Speech (Random Topic)", tips: "Think → Structure → Speak.", duration: "15 mins", status: false },

        { day: 22, task: "Listening: Speed Practice (1.25x Speed)", tips: "Train for fast speakers.", duration: "30 mins", status: false },
        { day: 22, task: "Reading: Skim 3 Passages in 10 Mins", tips: "Focus on main ideas only.", duration: "15 mins", status: false },
        { day: 22, task: "Writing: Combine Graphs + Essays", tips: "e.g., Graph + Opinion.", duration: "50 mins", status: false },
        { day: 22, task: "Speaking: Impromptu Speech (Random Topic)", tips: "Think → Structure → Speak.", duration: "15 mins", status: false },

        { day: 23, task: "Listening: Speed Practice (1.25x Speed)", tips: "Train for fast speakers.", duration: "30 mins", status: false },
        { day: 23, task: "Reading: Skim 3 Passages in 10 Mins", tips: "Focus on main ideas only.", duration: "15 mins", status: false },
        { day: 23, task: "Writing: Combine Graphs + Essays", tips: "e.g., Graph + Opinion.", duration: "50 mins", status: false },
        { day: 23, task: "Speaking: Impromptu Speech (Random Topic)", tips: "Think → Structure → Speak.", duration: "15 mins", status: false },

        { day: 24, task: "Listening: Speed Practice (1.25x Speed)", tips: "Train for fast speakers.", duration: "30 mins", status: false },
        { day: 24, task: "Reading: Skim 3 Passages in 10 Mins", tips: "Focus on main ideas only.", duration: "15 mins", status: false },
        { day: 24, task: "Writing: Combine Graphs + Essays", tips: "e.g., Graph + Opinion.", duration: "50 mins", status: false },
        { day: 24, task: "Speaking: Impromptu Speech (Random Topic)", tips: "Think → Structure → Speak.", duration: "15 mins", status: false },

        { day: 25, task: "Listening: Speed Practice (1.25x Speed)", tips: "Train for fast speakers.", duration: "30 mins", status: false },
        { day: 25, task: "Reading: Skim 3 Passages in 10 Mins", tips: "Focus on main ideas only.", duration: "15 mins", status: false },
        { day: 25, task: "Writing: Combine Graphs + Essays", tips: "e.g., Graph + Opinion.", duration: "50 mins", status: false },
        { day: 25, task: "Speaking: Impromptu Speech (Random Topic)", tips: "Think → Structure → Speak.", duration: "15 mins", status: false },

        { day: 26, task: "Listening: Speed Practice (1.25x Speed)", tips: "Train for fast speakers.", duration: "30 mins", status: false },
        { day: 26, task: "Reading: Skim 3 Passages in 10 Mins", tips: "Focus on main ideas only.", duration: "15 mins", status: false },
        { day: 26, task: "Writing: Combine Graphs + Essays", tips: "e.g., Graph + Opinion.", duration: "50 mins", status: false },
        { day: 26, task: "Speaking: Impromptu Speech (Random Topic)", tips: "Think → Structure → Speak.", duration: "15 mins", status: false },

        { day: 27, task: "Listening: Speed Practice (1.25x Speed)", tips: "Train for fast speakers.", duration: "30 mins", status: false },
        { day: 27, task: "Reading: Skim 3 Passages in 10 Mins", tips: "Focus on main ideas only.", duration: "15 mins", status: false },
        { day: 27, task: "Writing: Combine Graphs + Essays", tips: "e.g., Graph + Opinion.", duration: "50 mins", status: false },
        { day: 27, task: "Speaking: Impromptu Speech (Random Topic)", tips: "Think → Structure → Speak.", duration: "15 mins", status: false },

        { day: 28, task: "Listening: Speed Practice (1.25x Speed)", tips: "Train for fast speakers.", duration: "30 mins", status: false },
        { day: 28, task: "Reading: Skim 3 Passages in 10 Mins", tips: "Focus on main ideas only.", duration: "15 mins", status: false },
        { day: 28, task: "Writing: Combine Graphs + Essays", tips: "e.g., Graph + Opinion.", duration: "50 mins", status: false },
        { day: 28, task: "Speaking: Impromptu Speech (Random Topic)", tips: "Think → Structure → Speak.", duration: "15 mins", status: false },

        { day: 29, task: "Listening: Speed Practice (1.25x Speed)", tips: "Train for fast speakers.", duration: "30 mins", status: false },
        { day: 29, task: "Reading: Skim 3 Passages in 10 Mins", tips: "Focus on main ideas only.", duration: "15 mins", status: false },
        { day: 29, task: "Writing: Combine Graphs + Essays", tips: "e.g., Graph + Opinion.", duration: "50 mins", status: false },
        { day: 29, task: "Speaking: Impromptu Speech (Random Topic)", tips: "Think → Structure → Speak.", duration: "15 mins", status: false },

        // Day 30: Final Mock Test + Relax
        { day: 30, task: "FINAL MOCK TEST (All Sections)", tips: "Like exam day. Stay calm.", duration: "3 hours", status: true },
        { day: 30, task: "Light Review (Only Weak Areas)", tips: "Avoid cramming.", duration: "30 mins", status: false },
        { day: 30, task: "Speaking: Confidence-Building Exercise", tips: "Positive affirmations!", duration: "10 mins", status: false },
        { day: 30, task: "Relax & Visualize Success", tips: "You’re prepared!", duration: "10 mins", status: false },
    ];

    useEffect(() => {
        const filteredStudyPlan = studyPlan.slice(currentDate * 4, (currentDate + 1) * 4);

        for (let i = 0; i < currentTask; i++) {
            filteredStudyPlan[i].status = true;
        }

        setCurrentStudyPlan(filteredStudyPlan);
    }, [currentDate, currentTask])

    function markAsDone(taskIndex: number) {
        let taskComplete = 0;
        const newStudyPlan = [...currentStudyPlan];
        newStudyPlan[taskIndex].status = true;

        //Changing Day If All Task Completed
        newStudyPlan.forEach((plan) => {
            if (plan.status) {
                taskComplete += 1
            }
        });

        if (taskComplete === 4) {
            setCurrentDate(c => c + 1);
            setCurrentTask(0);

            setEnglishTest(prev => ({
                ...prev,
                [testName]: {
                    ...prev[testName as keyof englishTests],
                    currentDate: currentDate + 1
                }
            }));
            setEnglishTest(prev => ({
                ...prev,
                [testName]: {
                    ...prev[testName as keyof englishTests],
                    currentTask: currentTask + 1
                }
            }));

            //Api Calls To Update
            updateEnglishTests('currentDate', currentDate + 1);
            updateEnglishTests('currentTask', 0)
        } else {
            setCurrentStudyPlan(newStudyPlan);
            setCurrentTask(c => c + 1);
            setEnglishTest(prev => ({
                ...prev,
                [testName]: {
                    ...prev[testName as keyof englishTests],
                    currentTask: currentTask + 1
                }
            }));

            //Api Call To Update
            updateEnglishTests('currentTask', currentTask + 1);
        }
    }

    //Funtions To Update Study Plan Date and Task Number
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

    //Time Slot Setting Function
    const [isVisible, setIsVisible] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    const timeSlots = [
        { value: "07:30", label: "8:00 AM" },
        { value: "08:30", label: "9:00 AM" },
        { value: "09:30", label: "10:00 AM" },
        { value: "10:30", label: "11:00 AM" },
        { value: "11:30", label: "12:00 PM" },
        { value: "12:30", label: "1:00 PM" },
        { value: "13:30", label: "2:00 PM" },
        { value: "14:30", label: "3:00 PM" },
        { value: "15:30", label: "4:00 PM" },
        { value: "16:30", label: "5:00 PM" },
        { value: "17:30", label: "6:00 PM" },
        { value: "18:30", label: "7:00 PM" }
    ];

    const hideToaster = () => {
        setIsVisible(false);
        setSelectedSlot('');
        setIsConfirmed(false);
    };

    const handleSlotSelect = (slot: any) => {
        setSelectedSlot(slot.value);
    };

    const handleConfirm = () => {
        if (selectedSlot) {
            setIsConfirmed(true);

            setEnglishTest(prev => ({
                ...prev,
                [testName]: {
                    ...prev[testName as keyof englishTests],
                    studyTiming: selectedSlot
                }
            }));

            //Api Calls To Update
            updateEnglishTests('studyTiming', selectedSlot);

            setTimeout(() => {
                hideToaster();
            }, 2500);
        }
    };

    const showToaster = () => {
        setIsVisible(true);
        setIsConfirmed(false);
        setSelectedSlot('');
    };

    let currentTestName = '';
    switch (testName) {
        case 'ielts':
            currentTestName = 'IELTS'
            break;
        case 'toefl':
            currentTestName = 'TOEFL'
            break;
        case 'pte':
            currentTestName = 'PTE'
            break;
        default:
            currentTestName = 'Duolingo'
    }

    return (
        <>
            {currentDate !== 30 && (<div className='rounded-xl text-start border-2 border-gray-400 shadow-xl py-2 px-4'>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className='text-2xl font-bold'>Today's Plan</h1>
                        <p className='text-lg'>Complete your daily goals to stay on track</p>
                    </div>

                    <div>
                        <button
                            onClick={showToaster}
                            className="flex items-center btn btn-primary"
                        >
                            <Calendar className='w-6 h-6 mr-2' />
                            {englishTests[testName as keyof englishTests].studyTiming !== '00:00' ? 'Reset Study Timing' : 'Set Study Timing'}
                        </button>
                    </div>
                </div>

                {currentStudyPlan.map((plan, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className='grid grid-cols-1 gap-5 my-5'
                    >
                        <div className='flex justify-between items-center rounded-xl text-start shadow-lg hover:shadow-2xl transition-shadow duration-500 border-2 border-gray-400 py-2 px-4'>
                            <div className='flex justify-start items-center gap-5 w-[70%]'>
                                {plan.status ? <CheckCircle className='w-6 h-6' /> : <div className='border-2 border-black p-2 rounded-full mr-1'></div>}

                                <div>
                                    <h1 className='text-xl font-bold'>{plan.task}</h1>
                                    <p className='text-lg'>Tips: {plan.tips}</p>
                                    <p className='text-lg'>Duration: {plan.duration}</p>
                                </div>
                            </div>

                            <div className='w-[30%] flex justify-end'>
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: plan.status ? 0.5 : 1 }}
                                    disabled={currentTask !== index}
                                    onClick={() => markAsDone(index)}
                                    className="flex items-center btn btn-primary"
                                >
                                    <CheckCircle className='w-5 h-5 mr-1' />
                                    Mark As Done
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>)}

            {currentDate === 30 && (<motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border-2 border-gray-400 shadow-xl p-4 flex flex-col gap-5">
                <div className="text-center mb-2">
                    <div className="flex items-center justify-center mb-4">
                        <Trophy className="h-8 w-8 text-amber-500 mr-2" />
                        <h2 className="text-2xl font-bold text-gray-900">Study Plan Completed!</h2>
                    </div>

                    <p className="text-xl mb-2">Amazing work! You've successfully completed your 30-day {currentTestName} Study Plan.</p>
                    <p className="text-lg">
                        You're ready for the next step!
                    </p>
                </div>

                <div className='flex justify-center'>
                    <div className="border border-green-222 bg-green-200 rounded-lg p-4 mb-6 w-[60%]">
                        <div className="flex items-center justify-center gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold">30</div>
                                <div className="text-lg">Days</div>
                            </div>
                            <div className="w-px h-8 bg-green-222"></div>
                            <div className="text-center">
                                <div className="flex justify-center items-end mb-1">
                                    <Star className='w-5 h-5 text-yellow-600 fill-current' />
                                    <Star className='w-7 h-7 text-yellow-600 fill-current' />
                                    <Star className='w-5 h-5 text-yellow-600 fill-current' />
                                </div>
                                <div className="text-lg">Achievement</div>
                            </div>
                            <div className="w-px h-8 bg-green-222"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">100%</div>
                                <div className="text-lg">Complete</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>)}

            {isVisible && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}>

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-200">
                                <Clock className='w-6 h-6' />
                            </div>
                            <h3 className="text-2xl font-semibold">
                                {isConfirmed ? 'Time Slot Confirmed' : 'Select Time Slot'}
                            </h3>
                        </div>
                        <button
                            onClick={hideToaster}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className='w-6 h-6' />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {isConfirmed ? (
                            <div className="text-center py-8">
                                <div className="p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#a8c49d' }}>
                                    <CheckCircle className='w-8 h-8' />
                                </div>
                                <h4 className="text-2xl font-semibold mb-2">
                                    Time Slot Confirmed!
                                </h4>
                                <p className='text-xl'>
                                    Your appointment is scheduled for <span className="font-semibold">{timeSlots.find(slot => slot.value === englishTests[testName as keyof englishTests].studyTiming)?.label}</span>
                                </p>
                            </div>
                        ) : (
                            <>
                                <p className="text-xl mb-4">
                                    Choose your preferred time slot from the available options below:
                                </p>

                                {/* Time Slots Grid */}
                                <div className="grid grid-cols-3 gap-2 mb-6">
                                    {timeSlots.map((slot) => (
                                        <button
                                            key={slot.value}
                                            onClick={() => handleSlotSelect(slot)}
                                            className={`p-3 rounded-lg hover:scale-110 transition-all duration-300 text-lg font-medium ${selectedSlot === slot.value ? 'bg-green-200 text-white scale-[1.25rem]' : 'bg-green-333'}`}
                                        >
                                            {slot.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Selected Time Display */}
                                <div className="border border-green-222 rounded-lg p-4 mb-4 bg-green-333">
                                    <div className="flex items-center gap-2">
                                        <Info className='w-10 h-10' />
                                        <span className="text-lg font-medium text-start">
                                            <span className='font-semibold'>Note:</span> You’ll get a daily reminder email 30 minutes prior to your confirmed time slot.
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <button
                                    disabled={!selectedSlot}
                                    onClick={handleConfirm}
                                    className={`w-full btn btn-primary ${!selectedSlot ? 'opacity-50' : 'opacity-100'} transition-all duration-300`}
                                >
                                    Confirm Slot
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>)}
        </>
    )
}

export default StudyPlan;