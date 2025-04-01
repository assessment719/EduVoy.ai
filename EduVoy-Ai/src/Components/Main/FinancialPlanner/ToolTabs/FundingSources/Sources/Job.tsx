import { motion } from 'framer-motion';
import { BACKEND_URL } from './../../../../../../config';
import Select from 'react-dropdown-select';
import * as Collapsible from "@radix-ui/react-collapsible";
import { JobsType } from './../../../../../../Utils/job';
import { useEffect, useState, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { BriefcaseBusiness, ChevronDown, CheckCircle, Cross } from 'lucide-react';
import { userDetailsAtom, jobListAtom } from './../../../../../../Atoms/atoms';

const Jobs = () => {
    const [isFetched, setIsFetched] = useState(false);
    const [filter, setFilter] = useState('');
    const [resources, setResources] = useState<JobsType[]>([]);
    const [openStates, setOpenStates] = useState<{ [key: number]: boolean }>({});
    const initialMount = useRef(false);

    //For Short List
    const setShortList = useSetRecoilState(jobListAtom);
    const shortList = useRecoilValue(jobListAtom);
    const userDetails = useRecoilValue(userDetailsAtom);

    const toggleCollapse = (index: number) => {
        setOpenStates((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const toggleShortList = (courseId: number) => {
        initialMount.current = true;
        setShortList((prevState) => ({
            ...prevState,
            [courseId]: !prevState[courseId] || false,
        }));
    };

    const updateShortList = (jobs: number[]) => {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        fetch(`${BACKEND_URL}/users/updateField/jobs/${userDetails.id}`, {
            method: "PUT",
            headers: {
                'token': `${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ updatingField: { jobs } }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch data");
                }
            })
            .catch((error) => console.error("Error fetching questions:", error));
    }

    useEffect(() => {
        if (initialMount.current === true) {
            let resource: number[] = [];

            for (const key in shortList) {
                if (shortList[key] === true) {
                    resource.push(Number(key));
                }
            }
            updateShortList(resource)
        }
    }, [shortList]);

    const fetchResources = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/users/finResources/job`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data: { resources: JobsType[] } = await response.json();
            setResources(data.resources);
            setIsFetched(true);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    useEffect(() => {
        if (filter === 'true') {
            const filteredResult = resources.filter(resource =>
                shortList[resource.id] === true
            );
            setResources(filteredResult);
        } else {
            fetchResources();
        }
    }, [filter, shortList])

    return (
        <>
            <div className="w-[1100px] p-6 min-h-screen">
                <div className='mb-10 flex justify-end items-center gap-4'>
                    <h1 className='text-2xl font-bold'>Filter:</h1>
                    <div className='selectBorder'>
                        <Select
                            style={{ width: '300px' }}
                            className='select'
                            name='university'
                            color='#8bb87b'
                            searchable={false}
                            placeholder='Select An Option'
                            closeOnClickInput
                            values={[{ value: 'false', label: 'All Jobs' }]}
                            options={[{ value: 'false', label: 'All Jobs' }, { value: 'true', label: 'Shortlisted Jobs' }]}
                            onChange={(value): void => { setFilter(value[0].value) }}
                        />
                    </div>
                </div>
                {isFetched && resources.length === 0 && <div className="font-bold text-xl text-center w-full">Sorry! There are no shortlisted part-time jobs.</div>}
                {resources.length !== 0 && <div className="grid grid-cols-1 gap-6">
                    {resources.map((resource, index) =>
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500"
                        >
                            <div className="flex items-start space-x-4 mb-5">
                                <div className="p-3 bg-green-200 rounded-lg">
                                    <BriefcaseBusiness className="w-6 h-6 text-black" />
                                </div>
                                <div className="flex-1 mt-3">
                                    <b className="font-bold text-xl mb-2">{index + 1}. {resource.title}</b>
                                    <br /><br />
                                    <div className='grid grid-cols-2'>
                                        <p className="font-light text-xl mb-2">
                                            <b className="font-bold text-lg mb-3">Average Hourly Rate:</b> {resource.avgHourlyRate}
                                        </p>

                                        <p className="font-light text-xl mb-2">
                                            <b className="font-bold text-lg mb-3">Working Hours Per Week:</b> {resource.hoursPerWeek}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Collapsible.Root open={openStates[index] || false} onOpenChange={() => toggleCollapse(index)}>
                                <Collapsible.Trigger className="w-full flex items-center justify-center p-2 border rounded-md text-black hover:bg-gray-100 transition mb-5 text-xl font-bold">
                                    {openStates[index] ? "Show Less" : "Show More"}
                                    <ChevronDown className={`ml-2 h-5 w-5 transition-transform ${openStates[index] ? "rotate-180" : ""}`} />
                                </Collapsible.Trigger>

                                <Collapsible.Content className="pt-3 space-y-4 mb-5">
                                    {resource.locations && (<div>
                                        <h4 className="text-lg font-bold mb-2">Job Locations</h4>
                                        <ul className="space-y-1">
                                            {resource.locations.map((item, i) => (
                                                <li key={i} className="flex items-center text-lg">
                                                    <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>)}

                                    {resource.requirements && (<div>
                                        <h4 className="text-lg font-bold mb-2">Requirements</h4>
                                        <ul className="space-y-1">
                                            {resource.requirements.map((item, i) => (
                                                <li key={i} className="flex items-center text-lg">
                                                    <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>)}

                                    {resource.benefits && (<div>
                                        <h4 className="text-lg font-bold mb-2">Benefits</h4>
                                        <ul className="space-y-1">
                                            {resource.benefits.map((item, i) => (
                                                <li key={i} className="flex items-center text-lg">
                                                    <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>)}

                                    {resource.tips && (<p className="font-light text-xl mb-2"><b className="font-bold text-lg mb-2">Tips:</b> {resource.tips}</p>)}
                                </Collapsible.Content>
                            </Collapsible.Root>

                            <button
                                className={`btn btn-primary w-full flex justify-center items-center ${shortList[resource.id] ? 'bg-red-500 text-white' : ''}`}
                                onClick={() => toggleShortList(resource.id)}
                            >
                                {!shortList[resource.id] ? <Cross className='mr-1 w-6' /> : <Cross className='mr-1 w-6 rotate-45' />}
                                {!shortList[resource.id] ? <p>Add To Shortlist</p> : <p>Remove From Shortlist</p>}
                            </button>
                        </motion.div>
                    )}
                </div>}
            </div>
        </>
    )
}

export default Jobs