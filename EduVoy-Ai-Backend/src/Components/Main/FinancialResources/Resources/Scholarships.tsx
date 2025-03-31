import { GraduationCap, ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { BACKEND_URL } from './../../../../config';
import { ScholarshipsType } from './../../../../utils/scholarships';
import LoaderComponent from '../../../loader';

const Scholarships: React.FC = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [resources, setResources] = useState<ScholarshipsType[]>([]);
    const [numberOfResources, setNumberOfResources] = useState(0);
    const [numberOfUpdatingResource, setNumberOfUpdatingResource] = useState(0);
    const [isResourceToUpdated, setIsResourceToUpdated] = useState(false);

    // Set Of Add Or Update Resources
    const [title, setTitle] = useState('');
    const [provider, setProvider] = useState('');
    const [type, setType] = useState('all');
    const [amount, setAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [eligibilitiesString, setEligibilities] = useState('');
    const [requirementsString, setRequirements] = useState('');
    const [facultiesString, setFaculties] = useState('');
    const [link, setLink] = useState('');

    const resetForm = (val: number) => {
        setTitle('');
        setProvider('');
        setType('all');
        setAmount('');
        setDeadline('');
        setEligibilities('');
        setRequirements('');
        setFaculties('');
        setLink('');
        if (val === 1) {
            fetchResources();
        }
    }

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

    // Miscellenous
    const [prevNum, setPrevNum] = useState(0);
    const [nextNum, setNextNum] = useState(5);

    const prevNumRef = useRef(prevNum);

    useEffect(() => {
        prevNumRef.current = prevNum;
    }, [prevNum]);

    const nextNumRef = useRef(nextNum);

    useEffect(() => {
        nextNumRef.current = nextNum;
    }, [nextNum]);

    function increseMapCount() {
        setIsFetching(true);
        if (numberOfResources - 1 >= nextNum) {
            setPrevNum((c) => c + 5);
            setNextNum((c) => c + 5);
        }
        fetchResources();
    }

    function decreaseMapCount() {
        setIsFetching(true);
        if (prevNum !== 0) {
            setPrevNum((c) => c - 5);
            setNextNum((c) => c - 5);
        }
        fetchResources();
    }

    function checkAndDecreaseMapCount(number: any, func: any) {
        const fractionalPart = number % 1;
        const targetFraction = 0.2;
        const precision = 1e-7;

        if (Math.abs(fractionalPart - targetFraction) < precision) {
            func();
        }
    }

    //Get Resources
    const fetchResources = async () => {
        resetForm(0);
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            await new Promise((e) => { setTimeout(e, 1200) })

            const queryParams = new URLSearchParams();
            queryParams.append('skip', prevNumRef.current.toString());
            queryParams.append('limit', "5");

            const response = await fetch(`${BACKEND_URL}/admin/finresources/scholarship?${queryParams.toString()}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const res = await response.json();
            setResources(res.data.resources);
            setNumberOfResources(res.data.total);
            setIsFetching(false);
        } catch (error) {
            console.error('Error fetching resources:', error);
            setIsFetching(false);
        }
    };

    // Update Resource
    const goToUpadteResource = async (idx: number) => {
        setNumberOfUpdatingResource(idx);
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/admin/finresources/scholarship/${idx}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data = await response.json();
            const resourceToUpdate : ScholarshipsType = data.resource;

            setTitle(resourceToUpdate.title);
            setProvider(resourceToUpdate.provider);
            setType(resourceToUpdate.type);
            setAmount(resourceToUpdate.amount);
            setDeadline(resourceToUpdate.deadline);
            setEligibilities(resourceToUpdate.eligibilities.join(" : "));
            setRequirements(resourceToUpdate.requirements.join(" : "));
            setFaculties(resourceToUpdate.faculties.join(" : "));
            setLink(resourceToUpdate.link);

            setIsResourceToUpdated(true);
            handleScrollToInputSection();
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    }

    const updateResource = () => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        if (title && provider && type !== 'all' && amount && deadline && eligibilitiesString && requirementsString && facultiesString && link) {
            fetch(`${BACKEND_URL}/admin/finresources/update/scholarship`, {
                method: "PUT",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: numberOfUpdatingResource, title, provider, type, amount, deadline, eligibilities: eligibilitiesString.split(" : "), requirements: requirementsString.split(" : "), faculties: facultiesString.split(" : "), link }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        setIsFetching(false);
                        throw new Error("Failed to fetch data");
                    }
                    handleScrollToTopSection();
                    resetForm(1);
                    setIsResourceToUpdated(false);
                })
                .catch((error) => console.error("Error fetching resources:", error));
        } else {
            alert('Please fill in all fields before submitting.');
            setIsFetching(false);
            return
        }
    }

    //Add Resource
    const addResource = () => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        if (title && provider && type !== 'all' && amount && deadline && eligibilitiesString && requirementsString && facultiesString && link) {

            fetch(`${BACKEND_URL}/admin/finresources/add/scholarship`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, provider, type, amount, deadline, eligibilities: eligibilitiesString.split(" : "), requirements: requirementsString.split(" : "), faculties: facultiesString.split(" : "), link }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        setIsFetching(false);
                        throw new Error("Failed to fetch data");
                    }
                    handleScrollToTopSection();
                    resetForm(1);
                })
                .catch((error) => console.error("Error fetching resources:", error));
        } else {
            alert('Please fill in all fields before submitting.');
            setIsFetching(false);
            return
        }
    }

    // Delete Resource
    const deleteResource = (idx: number) => {
        setIsFetching(true);
        const token = localStorage.getItem('token');
        const result = numberOfResources / 5;

        if (!token) {
            return;
        }

        fetch(`${BACKEND_URL}/admin/finresources/delete/scholarship`, {
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
                checkAndDecreaseMapCount(result, decreaseMapCount);
                resetForm(1);
            })
            .catch((error) => console.error("Error fetching course:", error));
    }

    useEffect(() => {
        setIsFetching(true);
        fetchResources();
    }, []);

    return (
        <>
            {isFetching && <div className='fixed -ml-36 -mt-20'>
                <LoaderComponent />
            </div>}

            {!isFetching && <div className="max-w-7xl mx-auto py-6 -mt-6">
                <div className="grid grid-cols-1 gap-6 -ml-2 w-[1100px]">
                    {resources.map((resource, index) =>
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500"
                        >
                            <div ref={topSectionRef} className="flex items-start space-x-4 mb-5">
                                <div className="p-3 bg-green-200 rounded-lg">
                                    <GraduationCap className="w-6 h-6 text-black" />
                                </div>
                                <div className="flex-1 mt-3">
                                    <b className="font-bold text-xl mb-2">{index + prevNum + 1}. {resource.title}</b>
                                    <br /><br />
                                    <p className="font-light text-xl mb-2"><b className="font-bold text-lg mb-2">Provider:</b> {resource.provider}</p>
                                    <div className='grid grid-cols-2'>
                                        <p className="font-light text-xl mb-2">
                                            <b className="font-bold text-lg mb-3">Type:</b> {resource.type}
                                        </p>

                                        <p className="font-light text-xl mb-2">
                                            <b className="font-bold text-lg mb-3">Deadline:</b> {resource.deadline}
                                        </p>
                                    </div>

                                    <div className='grid grid-cols-2'>
                                        <p className="font-light text-xl mb-2">
                                            <b className="font-bold text-lg mb-3">Amount:</b> {resource.amount}
                                        </p>

                                        <p className="font-light text-xl mb-2">
                                            <b className="font-bold text-lg mb-3">Link:</b> {resource.link}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => goToUpadteResource(resource.id)}

                                    className="w-full btn btn-primary"
                                >
                                    View & Update Resource
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => deleteResource(resource.id)}
                                    className="w-full btn btn-primary"
                                >
                                    Delete Resource
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {numberOfResources > 5 && <div className="flex justify-center mt-5">
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
                        animate={{ opacity: nextNum >= numberOfResources ? 0.5 : 1 }}
                        disabled={nextNum >= numberOfResources}
                        onClick={() => increseMapCount()}
                        className="w-52 btn btn-primary ml-5 mr-5 flex justify-center items-center"
                    >
                        <p>Next Page</p>
                        <ArrowRightCircleIcon className='ml-1' />
                    </motion.button>
                </div>}

                <div ref={inputSectionRef} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 mt-8 text-white -ml-2 w-[1100px]">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Scholarship Title:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter Scholarship Title"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Scholarship Provider:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={provider}
                                onChange={(e) => setProvider(e.target.value)}
                                placeholder="Enter Scholarship Provider"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="difficulty" className="block font-bold text-xl text-white mb-1">
                                Scholarship Type:
                            </label>
                            <select
                                id="difficulty"
                                value={type}
                                onChange={e => setType(e.target.value)}
                                className="w-full border border-black text-black rounded-lg h-10"
                            >
                                <option value="all">Select An Option</option>
                                <option value="Merit Based">Merit Based</option>
                                <option value="Need Based">Need Based</option>
                                <option value="Country Based">Country Based</option>
                                <option value="Field Based">Field Based</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Scholarship Amount:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter Scholarship Amount"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Scholarship Deadline:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                placeholder="Enter Scholarship Deadline"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Eligibilites To Apply (Add " : " Between Two Values):
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={eligibilitiesString}
                                onChange={(e) => setEligibilities(e.target.value)}
                                placeholder="Enter Eligibilites To Apply"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Requirements To Apply (Add " : " Between Two Values):
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={requirementsString}
                                onChange={(e) => setRequirements(e.target.value)}
                                placeholder="Enter Requirements To Apply"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Eligible Faculties (Add " : " Between Two Values):
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={facultiesString}
                                onChange={(e) => setFaculties(e.target.value)}
                                placeholder="Enter Eligible Faculties"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4 col-span-2">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Scholarship Apply Link:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="Enter Scholarship Apply Link"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>
                    </div>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={isResourceToUpdated ? updateResource : addResource}
                        className="w-full btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                    >
                        {isResourceToUpdated ? "Update Resource" : "Add Resource"}
                    </motion.button>
                </div>
            </div>}
        </>
    )
}

export default Scholarships;