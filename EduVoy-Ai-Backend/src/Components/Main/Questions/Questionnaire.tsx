import { LucideMessageCircleQuestion, ArrowRightCircleIcon, ArrowLeftCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Question } from './../../../utils/question';
import { BACKEND_URL } from './../../../config';
import LoaderComponent from '../../loader';

const QuestionCentre: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('all');
    const [expectedKeywords, setExpectedKeywords] = useState('');
    const [evaluationPrompt, setEvaluationPrompt] = useState('');
    const [isFetching, setIsFetching] = useState(false);

    const [interviewQuestions, setInterviewQuestions] = useState<Question[]>([]);
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);
    const [numberOfUpdatingQuestions, setNumberOfUpdatingQuestions] = useState(0);
    const [isQuestionToUpdated, setIsQuestionToUpdated] = useState(false);

    const [prevNum, setPrevNum] = useState(0);
    const [nextNum, setNextNum] = useState(5);

    function increseMapCount() {
        if (numberOfQuestions - 1 >= nextNum) {
            setPrevNum((c) => c + 5);
            setNextNum((c) => c + 5);
        }
    }

    function decreaseMapCount() {
        if (prevNum !== 0) {
            setPrevNum((c) => c - 5);
            setNextNum((c) => c - 5);
        }
    }

    function checkAndDecreaseMapCount(number: any, func: any) {
        const fractionalPart = number % 1;
        const targetFraction = 0.2;
        const precision = 1e-7;

        if (Math.abs(fractionalPart - targetFraction) < precision) {
            func();
        }
    }

    // Get Question
    const fetchQuestions = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            await new Promise((e) => { setTimeout(e, 1200) })
            const response = await fetch(`${BACKEND_URL}/admin/questions`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data: { questions: Question[] } = await response.json();
            setInterviewQuestions(data.questions);
            setNumberOfQuestions(data.questions.length);
            setIsFetching(false);
        } catch (error) {
            console.error('Error fetching questions:', error);
            setIsFetching(false);
        }
    };

    useEffect(() => {
        setIsFetching(true);
        fetchQuestions();
    }, []);

    const resetForm = () => {
        setQuestion('');
        setCategory('');
        setDifficulty('all');
        setExpectedKeywords('');
        setEvaluationPrompt('');
        fetchQuestions();
    }

    // Update Question
    const inputSectionRef = useRef<HTMLDivElement | null>(null);
    const topSectionRef = useRef<HTMLDivElement | null>(null);

    const handleScrollToInputSection = () => {
        inputSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const handleScrollToTopSection = () => {
        topSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const goToUpadteQuestion = (idx: number) => {
        const idOfQuestion = idx - 1;
        setNumberOfUpdatingQuestions(idx);

        handleScrollToInputSection();

        setQuestion(`${interviewQuestions[idOfQuestion].question}`);
        setCategory(`${interviewQuestions[idOfQuestion].category}`);
        setDifficulty(`${interviewQuestions[idOfQuestion].difficulty}`);
        setExpectedKeywords(`${interviewQuestions[idOfQuestion].expectedKeywords}`);
        setEvaluationPrompt(`${interviewQuestions[idOfQuestion].evaluationPrompt}`);
        setIsQuestionToUpdated(true);
    }

    const updateQuestion = () => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        if (question && category && difficulty !== 'all' && expectedKeywords && evaluationPrompt) {
            fetch(`${BACKEND_URL}/admin/questions/update`, {
                method: "PUT",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: numberOfUpdatingQuestions, question, category, difficulty, expectedKeywords, evaluationPrompt }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        setIsFetching(false);
                        throw new Error("Failed to fetch data");
                    }
                    handleScrollToTopSection();
                    resetForm();
                    setIsQuestionToUpdated(false);
                })
                .catch((error) => console.error("Error fetching questions:", error));
        } else {
            alert('Please fill in all fields before submitting.');
            setIsFetching(false);
            return
        }
    }

    // Delete Question
    const deleteQuestion = (idx: number) => {
        setIsFetching(true);
        const token = localStorage.getItem('token');
        const result = numberOfQuestions / 5;

        if (!token) {
            return;
        }

        fetch(`${BACKEND_URL}/admin/questions/delete`, {
            method: "DELETE",
            headers: {
                'token': `${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: idx }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    setIsFetching(false);
                    throw new Error("Failed to fetch data");
                }
                resetForm();
                checkAndDecreaseMapCount(result, decreaseMapCount);
            })
            .catch((error) => console.error("Error fetching questions:", error));
    }

    // Add Question
    const addQuestion = () => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        if (question && category && difficulty !== 'all' && expectedKeywords && evaluationPrompt) {
            let newId = numberOfQuestions + 1;

            fetch(`${BACKEND_URL}/admin/questions/add`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: newId, question, category, difficulty, expectedKeywords, evaluationPrompt }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        setIsFetching(false);
                        throw new Error("Failed to fetch data");
                    }
                    handleScrollToTopSection();
                    resetForm();
                })
                .catch((error) => console.error("Error fetching questions:", error));
        } else {
            alert('Please fill in all fields before submitting.');
            setIsFetching(false);
            return
        }
    }

    return (
        <>
            {isFetching && <div className='fixed w-full h-full'>
                <div className='flex justify-center -mt-20 -ml-80'>
                    <LoaderComponent />
                </div>
            </div>}
            {!isFetching && <div className="max-w-7xl mx-auto p-6 -mt-6">
                <div className="grid grid-cols-1 gap-6 w-[1100px]">
                    {interviewQuestions.slice(prevNum, nextNum).map((question, index) =>
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500"
                        >
                            <div ref={topSectionRef} className="flex items-start space-x-4 mb-5">
                                <div className="p-3 bg-green-200 rounded-lg">
                                    <LucideMessageCircleQuestion className="w-6 h-6 text-black" />
                                </div>
                                <div className="flex-1 mt-3">
                                    <b className="font-bold text-xl mb-2">{question.id}. {question.question}</b><br /><br />
                                    <p className="font-light text-xl mb-2"><b className="font-bold text-lg mb-2">Category Of The Question:</b> {question.category}</p>
                                    <p className="font-light text-xl mb-2"><b className="font-bold text-lg mb-2">Difficulty Level:</b> {question.difficulty}</p>
                                    <p className="font-light text-xl mb-2"><b className="font-bold text-lg mb-2">Expected Keywords:</b> {question.expectedKeywords}</p>
                                    <p className="font-light text-xl mb-2"><b className="font-bold text-lg mb-2">Evaluation Prompt:</b> {question.evaluationPrompt}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => goToUpadteQuestion(question.id)}

                                    className="w-full btn btn-primary"
                                >
                                    Update Question
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => deleteQuestion(question.id)}
                                    className="w-full btn btn-primary"
                                >
                                    Delete Question
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {numberOfQuestions > 5 && <div className="flex justify-center mt-5">
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: prevNum === 0 ? 0.5 : 1 }}
                        disabled={prevNum === 0}
                        onClick={() => decreaseMapCount()}

                        className="w-52 btn btn-primary ml-5 mr-5 flex justify-center items-center"
                    >
                        <ArrowLeftCircleIcon className='mr-1' />
                        <p>Previous Page</p>
                    </motion.button>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: nextNum >= numberOfQuestions ? 0.5 : 1 }}
                        disabled={nextNum >= numberOfQuestions}
                        onClick={() => increseMapCount()}
                        className="w-52 btn btn-primary ml-5 mr-5 flex justify-center items-center"
                    >
                        <p>Next Page</p>
                        <ArrowRightCircleIcon className='ml-1' />
                    </motion.button>
                </div>}

                <div ref={inputSectionRef} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 mt-5 text-white w-[1100px]">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
                        <div className="mb-4 col-span-1 md:col-span-2">
                            <label htmlFor="question" className="block font-bold text-xl text-white mb-1">
                                Question:
                            </label>
                            <input
                                type="text"
                                id="question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Enter Question"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="category" className="block font-bold text-xl text-white mb-1">
                                Category Of The Question:
                            </label>
                            <input
                                type="text"
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Enter Category Of The Question"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="difficulty" className="block font-bold text-xl text-white mb-1">
                                Difficulty Level:
                            </label>
                            <select
                                id="difficulty"
                                value={difficulty}
                                onChange={e => setDifficulty(e.target.value)}
                                className="w-full border border-black text-black rounded-lg h-10"
                            >
                                <option value="all">Select An Option</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="expectedKeywordsID" className="block font-bold text-xl text-white mb-1">
                                Expected Keywords:
                            </label>
                            <input
                                type="text"
                                id="expectedKeywordsID"
                                value={expectedKeywords}
                                onChange={(e) => setExpectedKeywords(e.target.value)}
                                placeholder="Enter Expected Keywords"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="evaluationPromptID" className="block font-bold text-xl text-white mb-1">
                                Evaluation Prompt:
                            </label>
                            <input
                                type="text"
                                id="evaluationPromptID"
                                value={evaluationPrompt}
                                onChange={(e) => setEvaluationPrompt(e.target.value)}
                                placeholder="Enter Evaluation Prompt"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>
                    </div>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={isQuestionToUpdated ? updateQuestion : addQuestion}
                        className="w-full btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                    >
                        {isQuestionToUpdated ? "Update Question" : "Add Question"}
                    </motion.button>
                </div>
            </div>}
        </>
    );
};

export default QuestionCentre;