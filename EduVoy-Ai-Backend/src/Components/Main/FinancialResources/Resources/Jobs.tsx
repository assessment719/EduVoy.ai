import { BriefcaseBusiness, ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { BACKEND_URL } from './../../../../config';
import { JobsType } from './../../../../utils/jobs';
import LoaderComponent from '../../../loader';

const Jobs: React.FC = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [resources, setResources] = useState<JobsType[]>([]);
    const [numberOfResources, setNumberOfResources] = useState(0);
    const [numberOfUpdatingResource, setNumberOfUpdatingResource] = useState(0);
    const [isResourceToUpdated, setIsResourceToUpdated] = useState(false);

    // Set Of Add Or Update Resources
    const [title, setTitle] = useState('');
    const [avgHourlyRate, setAvgHourlyRate] = useState('');
    const [hoursPerWeek, setHoursPerWeek] = useState('');
    const [locationsString, setLocations] = useState('');
    const [requirementsString, setRequirements] = useState('');
    const [benefitsString, setBenefits] = useState('');
    const [tips, setTips] = useState('');

    const resetForm = (val: number) => {
        setTitle('');
        setAvgHourlyRate('');
        setHoursPerWeek('');
        setLocations('');
        setRequirements('');
        setBenefits('');
        setTips('');
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

            const response = await fetch(`${BACKEND_URL}/admin/finresources/job?${queryParams.toString()}`, {
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
            const response = await fetch(`${BACKEND_URL}/admin/finresources/job/${idx}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data = await response.json();
            const resourceToUpdate: JobsType = data.resource;

            setTitle(resourceToUpdate.title);
            setAvgHourlyRate(resourceToUpdate.avgHourlyRate);
            setHoursPerWeek(resourceToUpdate.hoursPerWeek);
            setLocations(resourceToUpdate.locations.join(" : "));
            setRequirements(resourceToUpdate.requirements.join(" : "));
            setBenefits(resourceToUpdate.benefits.join(" : "));
            setTips(resourceToUpdate.tips);

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

        if (title && avgHourlyRate && hoursPerWeek && locationsString && requirementsString && benefitsString && tips) {
            fetch(`${BACKEND_URL}/admin/finresources/update/job`, {
                method: "PUT",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: numberOfUpdatingResource, title, avgHourlyRate, hoursPerWeek, locations: locationsString.split(" : "), requirements: requirementsString.split(" : "), benefits: benefitsString.split(" : "), tips }),
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

        if (title && avgHourlyRate && hoursPerWeek && locationsString && requirementsString && benefitsString && tips) {

            fetch(`${BACKEND_URL}/admin/finresources/add/job`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, avgHourlyRate, hoursPerWeek, locations: locationsString.split(" : "), requirements: requirementsString.split(" : "), benefits: benefitsString.split(" : "), tips }),
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

        fetch(`${BACKEND_URL}/admin/finresources/delete/job`, {
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
                                    <BriefcaseBusiness className="w-6 h-6 text-black" />
                                </div>
                                <div className="flex-1 mt-3">
                                    <b className="font-bold text-xl mb-2">{index + prevNum + 1}. {resource.title}</b>
                                    <br /><br />
                                    <div className='grid grid-cols-2'>
                                        <p className="font-light text-xl mb-2">
                                            <b className="font-bold text-lg mb-3">Average Hourly Rate:</b> {resource.avgHourlyRate}
                                        </p>

                                        <p className="font-light text-xl mb-2">
                                            <b className="font-bold text-lg mb-3">Working Hours Per Week:</b> {resource.hoursPerWeek}
                                        </p>
                                    </div>
                                    <p className="font-light text-xl mb-2"><b className="font-bold text-lg mb-2">Tips:</b> {resource.tips}</p>
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
                                Job Title:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter Job Title"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Average Hourly Rate:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={avgHourlyRate}
                                onChange={(e) => setAvgHourlyRate(e.target.value)}
                                placeholder="Enter Average Hourly Rate"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Working Hours Per Week:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={hoursPerWeek}
                                onChange={(e) => setHoursPerWeek(e.target.value)}
                                placeholder="Enter Working Hours Per Week"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Job Locations (Add " : " Between Two Values):
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={locationsString}
                                onChange={(e) => setLocations(e.target.value)}
                                placeholder="Enter Job Locations"
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
                                Benefits To Work (Add " : " Between Two Values):
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={benefitsString}
                                onChange={(e) => setBenefits(e.target.value)}
                                placeholder="Enter Benefits To Work"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4 col-span-2">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Tips:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={tips}
                                onChange={(e) => setTips(e.target.value)}
                                placeholder="Enter Tips"
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

export default Jobs;