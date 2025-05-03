import { motion } from 'framer-motion';
import Select from 'react-dropdown-select';
import { MailQuestion } from "lucide-react";
import { useEffect, useState } from 'react';
import { Querry } from './../../../utils/querries';
import { BACKEND_URL } from './../../../config';
import LoaderComponent from '../../loader';

const QuerriesCentre: React.FC = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [filter, setFilter] = useState('');

    const [answers, setAnswers] = useState<{ [key: number]: string }>({});

    const [querries, setQuerries] = useState<Querry[]>([]);

    const fetchQuerries = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            await new Promise((e) => { setTimeout(e, 1200) })
            const response = await fetch(`${BACKEND_URL}/admin/querries`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const res = await response.json();
            setQuerries(res.data.querries);
            setIsFetching(false);
        } catch (error) {
            console.error('Error fetching resources:', error);
            setIsFetching(false);
        }
    }

    const updateAnswer = (id: number) => {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        if (id && answers[id]) {
            fetch(`${BACKEND_URL}/admin/querries/update`, {
                method: "PUT",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id, answer: answers[id] }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        setIsFetching(false);
                        throw new Error("Failed to fetch data");
                    }
                    fetchQuerries();
                })
                .catch((error) => console.error("Error fetching course:", error));
        } else {
            alert('Please fill in all fields before submitting.');
            return "Answer Did Not Updated Due To Error"
        }
    }

    const answerquery = async (userData: Querry) => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        if (userData && answers[userData.id]) {
            userData.answer = answers[userData.id];

            fetch(`${BACKEND_URL}/admin/sendMail`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mailData: userData }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        setIsFetching(false);
                        throw new Error("Failed to fetch data");
                    }
                    updateAnswer(userData.id);
                })
                .catch((error) => console.error("Error fetching questions:", error));
        } else {
            alert('Please fill in all fields before submitting.');
            setIsFetching(false);
            return
        }
    }

    useEffect(() => {
        if (filter === 'true') {
            const filteredResult = querries.filter(query =>
                query.status === 'notAnswered'
            );
            setQuerries(filteredResult);
        } else {
            setIsFetching(true);
            fetchQuerries();
        }
    }, [filter])

    return (
        <>
            {isFetching && <div className='fixed w-full h-full'>
                <div className='flex justify-center -mt-20 -ml-80'>
                    <LoaderComponent />
                </div>
            </div>}

            {!isFetching && <div className="max-w-7xl mx-auto p-6 -mt-6">
                <div className='mb-10 flex justify-end items-center gap-4'>
                    <h1 className='text-2xl font-bold'>Filter:</h1>
                    <div className='border border-black'>
                        <Select
                            style={{ width: '300px' }}
                            className='bg-white text-black h-10 text-2xl'
                            name='university'
                            color='#8bb87b'
                            searchable={false}
                            placeholder='Select An Option'
                            closeOnClickInput
                            values={[{ value: 'false', label: 'All Querries' }]}
                            options={[{ value: 'false', label: 'All Querries' }, { value: 'true', label: 'Not Yet Answered' }]}
                            onChange={(value): void => { setFilter(value[0].value) }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 w-[1100px]">
                    {querries.map((query, index) =>
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500"
                        >
                            <div className="flex items-start space-x-4 mb-5">
                                <div className="p-3 bg-green-200 rounded-lg">
                                    <MailQuestion className="w-6 h-6 text-black" />
                                </div>
                                <div className="flex-1 mt-3">
                                    <b className="font-bold text-xl mb-2">{index + 1}. {query.message}</b><br /><br />

                                    <div className='grid grid-cols-2'>
                                        <p className="font-light text-xl mb-2">
                                            <b className="font-bold text-lg mb-3">Name:</b> {query.fullName}
                                        </p>

                                        <p className="font-light text-xl mb-2">
                                            <b className="font-bold text-lg mb-3">Email:</b> {query.email}
                                        </p>
                                    </div>

                                    <div className='grid grid-cols-2'>
                                        <p className="font-light text-xl mb-2">
                                            <b className="font-bold text-lg mb-3">Phone Number:</b> {query.phoneNo}
                                        </p>

                                        <p className="font-light text-xl mb-2">
                                            <b className="font-bold text-lg mb-3">Subject:</b> {query.subject}
                                        </p>
                                    </div>

                                    {query.status === 'notAnswered' && (
                                        <div className="flex flex-col">
                                            <label htmlFor={`answer-${query.id}`} className="mb-2 font-semibold text-xl mt-2">
                                                Enter Your Answer To This Query:
                                            </label>
                                            <textarea
                                                id={`answer-${query.id}`}
                                                name={`answer-${query.id}`}
                                                placeholder="Your Answer"
                                                className="p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                                value={answers[query.id] || ''}
                                                onChange={(e) => setAnswers({
                                                    ...answers,
                                                    [query.id]: e.target.value
                                                })}
                                            />
                                        </div>
                                    )}

                                    {query.status === 'answered' && (<p className="font-light text-xl mb-2">
                                        <b className="font-bold text-lg mb-3">Answer:</b> {query.answer}
                                    </p>)}
                                </div>
                            </div>
                            {query.status === 'notAnswered' && (<motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => answerquery(query)}

                                className="w-full btn btn-primary"
                            >
                                Answer Query
                            </motion.button>)}
                        </motion.div>
                    )}
                </div>
            </div>}
        </>
    )

};

export default QuerriesCentre;