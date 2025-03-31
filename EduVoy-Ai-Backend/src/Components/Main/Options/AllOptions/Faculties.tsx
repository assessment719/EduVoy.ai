import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Option } from './../../../../utils/options';
import { BACKEND_URL } from './../../../../config';
import LoaderComponent from '../../../loader';

const Faculties: React.FC = () => {
    const [optionTitle, setOptionTitle] = useState('');
    const [isFetching, setIsFetching] = useState(false);

    const [options, setOptions] = useState<Option[]>([]);
    const [numberOfUpdatingOption, setNumberOfUpdatingOption] = useState(0);
    const [isOptionToUpdated, setIsOptionToUpdated] = useState(false);

    // Get Uk Universitties
    const fetchOptions = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            await new Promise((e) => { setTimeout(e, 1200) })
            const response = await fetch(`${BACKEND_URL}/admin/options/faculty`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data: { faculties: Option[] } = await response.json();
            setOptions(data.faculties);
            setIsFetching(false);
        } catch (error) {
            console.error('Error fetching options:', error);
            setIsFetching(false);
        }
    };

    useEffect(() => {
        setIsFetching(true);
        fetchOptions();
    }, []);

    const resetForm = () => {
        setOptionTitle('');
        fetchOptions();
    }

    // Update Uk Universities
    const inputSectionRef = useRef<HTMLDivElement | null>(null);

    const handleScrollToInputSection = () => {
        inputSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const goToUpadteOption = async (idx: number) => {
        setNumberOfUpdatingOption(idx);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/admin/options/faculty/${idx}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data = await response.json();
            const universityToUpdate = data.faculty;

            setOptionTitle(universityToUpdate.option);
            setIsOptionToUpdated(true);
            handleScrollToInputSection();
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    }

    const updateOption = () => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        if (optionTitle) {
            fetch(`${BACKEND_URL}/admin/options/update/faculty`, {
                method: "PUT",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: numberOfUpdatingOption, option: optionTitle }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        setIsFetching(false);
                        throw new Error("Failed to fetch data");
                    }
                    resetForm();
                    setIsOptionToUpdated(false);
                })
                .catch((error) => console.error("Error fetching options:", error));
        } else {
            alert('Please fill in all fields before submitting.');
            setIsFetching(false);
            return
        }
    }

    // Delete Uk Universities
    const deleteOption = (idx: number) => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        fetch(`${BACKEND_URL}/admin/options/delete/faculty`, {
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
            })
            .catch((error) => console.error("Error fetching options:", error));
    }

    // Add Uk Universities
    const addOption = () => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        if (optionTitle) {

            fetch(`${BACKEND_URL}/admin/options/add/faculty`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ option: optionTitle }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        setIsFetching(false);
                        throw new Error("Failed to fetch data");
                    }
                    resetForm();
                })
                .catch((error) => console.error("Error fetching options:", error));
        } else {
            alert('Please fill in all fields before submitting.');
            setIsFetching(false);
            return
        }
    }

    return (
        <>
            {isFetching && <div className='fixed w-96 h-full'>
                <div className='flex justify-center -mt-32 mr-96'>
                    <LoaderComponent />
                </div>
            </div>}
            {!isFetching && <div className="max-w-7xl mx-auto p-6 -mt-6 -ml-6">
                <div className='flex justify-center'>
                    <div ref={inputSectionRef} className="flex justify-around bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-5 mb-8 text-white w-[1000px]">
                        <input
                            type="text"
                            id="optionTitle"
                            value={optionTitle}
                            onChange={(e) => setOptionTitle(e.target.value)}
                            placeholder="Enter Faculty Title"
                            className="p-2 w-full border border-black text-black rounded-lg mr-5"
                        />

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={isOptionToUpdated ? updateOption : addOption}
                            className="w-80 btn btn-primary bg-gradient-to-r from-red-500 to-green-600 ml-5"
                        >
                            {isOptionToUpdated ? "Update Faculty" : "Add Faculty"}
                        </motion.button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 w-[1100px]">
                    {options.map((choice, index) =>
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col justify-between bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500"
                        >
                            <div className="flex items-start space-x-4 mb-5">
                                <div className="p-3 bg-green-200 rounded-lg">
                                    <BookOpen className="w-6 h-6 text-black" />
                                </div>
                                <div className="flex-1 mt-3">
                                    <b className="font-bold text-xl mb-2">{index + 1}. {choice.option}</b><br /><br />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => goToUpadteOption(choice.id)}

                                    className="w-full btn btn-primary"
                                >
                                    Update
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => deleteOption(choice.id)}
                                    className="w-full btn btn-primary"
                                >
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>}
        </>
    )
}

export default Faculties