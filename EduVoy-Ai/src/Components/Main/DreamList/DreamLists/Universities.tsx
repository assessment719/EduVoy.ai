import { motion } from 'framer-motion';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, Cross } from 'lucide-react';
import { BACKEND_URL } from '../../../../config';
import { useState, useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { activeTabAtom, userDetailsAtom, dreamUniAtom } from '../../../../Atoms/atoms';
import { EnglandUniversities } from '../../../../Utils/ukUniversities';
import LoaderComponent from '../../../loader';
import { CompUniResult } from './../../../../Utils/compResult';

const DreamUniversities = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const userDetails = useRecoilValue(userDetailsAtom);
    const setActiveTab = useSetRecoilState(activeTabAtom);
    const [unis, setUnis] = useState<EnglandUniversities[]>([]);
    const [noOfUnis, setNoOfUnis] = useState(0);
    const [compareUni, setCompareUni] = useState<{ [key: number]: boolean }>({});
    const [compareAbleUnis, setCompareAbleUnis] = useState<Number[]>([]);
    const [comparisionResult, setComparisionResult] = useState<CompUniResult[]>([]);
    const [isManResultOut, setIsManResultOut] = useState(false);
    const [winner, setWinner] = useState(0);

    // For Dream List
    const setAddedToList = useSetRecoilState(dreamUniAtom);
    const addedToList = useRecoilValue(dreamUniAtom);
    const initialMount = useRef(false);

    const updateDreamUnis = async (dreamUnis: number[]) => {
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
            body: JSON.stringify({ updatingField: { dreamUnis } }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch data");
                }
            })
            .catch((error) => console.error("Error fetching questions:", error));

        fetchUnis();
    }

    useEffect(() => {
        if (initialMount.current === true) {
            let dreamUnis: number[] = [];

            for (const key in addedToList) {
                if (addedToList[key] === true) {
                    dreamUnis.push(Number(key));
                }
            }
            updateDreamUnis(dreamUnis)
        }
    }, [addedToList]);

    const toggleAddedToList = (universityId: number) => {
        setIsFetching(true);
        initialMount.current = true;
        setAddedToList((prevState) => ({
            ...prevState,
            [universityId]: !prevState[universityId] || false,
        }));
        if (Object.keys(compareUni).includes(`${universityId}`)) {
            toggleAddedToCompareList(universityId);
        }
    };

    //For Prev And Next Button
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
        if (noOfUnis - 1 >= nextNum) {
            setPrevNum((c) => c + 5);
            setNextNum((c) => c + 5);
        }
        fetchUnis();
    }

    function decreaseMapCount() {
        setIsFetching(true);
        if (prevNum !== 0) {
            setPrevNum((c) => c - 5);
            setNextNum((c) => c - 5);
        }
        fetchUnis();
    }

    useEffect(() => {
        let universities: number[] = [];

        for (const key in addedToList) {
            if (compareUni[key] === true) {
                universities.push(Number(key));
            }
        }
        if (universities.length === 2 && compareAbleUnis[0] === universities[1]) {
            universities = [universities[1], universities[0]];
        }
        setCompareAbleUnis(universities);
    }, [compareUni])

    const toggleAddedToCompareList = (universityId: number) => {
        setCompareUni((prevState) => ({
            ...prevState,
            [universityId]: !prevState[universityId] || false,
        }));
    };

    const fetchUnis = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }

            const queryParams = new URLSearchParams();
            queryParams.append('userId', userDetails.id.toString());
            queryParams.append('skip', prevNumRef.current.toString());
            queryParams.append('limit', "5");

            const response = await fetch(`${BACKEND_URL}/users/finaluniversities/dreamUnis?${queryParams.toString()}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const res = await response.json();
            setUnis(res.data.universities);
            setNoOfUnis(res.data.total);

            const filteredCompareAbleUnis = compareAbleUnis.filter(uniId =>
                res.data.universities.some((uni: EnglandUniversities) => uni.id === uniId)
            );
            setCompareAbleUnis(filteredCompareAbleUnis);

            await new Promise((e) => { setTimeout(e, 1000) })
            setIsFetching(false);
        } catch (error) {
            console.error('Error fetching unis:', error);
        }
    };

    const fetchDreamUnis = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }

            const response = await fetch(`${BACKEND_URL}/users/getField/dreamUnis/${userDetails.id}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data = await response.json();

            let obj: { [key: string]: boolean } = {};
            data.fieldDetails.dreamUnis.forEach((courseId: number) => {
                obj[courseId] = true;
            });
            setAddedToList(obj);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    useEffect(() => {
        setIsFetching(true);
        fetchDreamUnis();
        fetchUnis();
    }, [])

    async function compareUniversities() {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }
        const result = await fetch(`${BACKEND_URL}/users/openai/manual/university?uniId1=${compareAbleUnis[0]}&uniId2=${compareAbleUnis[1]}`, {
            method: "GET",
            headers: {
                'token': `${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await result.json();

        setComparisionResult(data.finalComparisionResult);

        let perfectCountUni1 = 0;
        let perfectCountUni2 = 0;
        data.finalComparisionResult.forEach((item: CompUniResult) => {
            if (item.uni1.result === "Perfect") perfectCountUni1++;
            if (item.uni2.result === "Perfect") perfectCountUni2++;
        });
        perfectCountUni1 > perfectCountUni2 ? setWinner(0) : setWinner(1);
        setIsLoading(false);
        setIsManResultOut(true);
    }

    return (
        <>
            {isLoading && <div className='fixed bg-opacity-50 bg-gray-100 w-screen h-screen z-50 top-0 left-0'>
                <div className='flex justify-center'>
                    <LoaderComponent />
                </div>
            </div>}

            {!isLoading && isManResultOut && unis.find(uni => uni.id === compareAbleUnis[winner])?.universityName && unis.find(uni => uni.id === compareAbleUnis[0])?.universityName && unis.find(uni => uni.id === compareAbleUnis[1])?.universityName && (
                <div className='fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className='bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden'
                    >
                        {/* Header */}
                        <div className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-4 text-white relative overflow-hidden'>
                            <div className='absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm'></div>
                            <div className='relative flex items-center justify-between'>
                                <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                </svg>
                                <div className='flex-1'>
                                    <h1 className='text-2xl font-bold'>We Found Your Perfect Match!</h1>
                                    <p className='text-blue-100 text-xl'>
                                        <span className='font-semibold text-white'>
                                            {unis.find(uni => uni.id === compareAbleUnis[winner])?.universityName}
                                        </span>
                                    </p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsManResultOut(false)}
                                    className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 ml-4"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </motion.button>
                            </div>
                        </div>

                        {/* Comparison Header */}
                        <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
                            <div className='grid grid-cols-3 gap-6 text-xl'>
                                <div className='flex items-center'>
                                    <div className='w-3 h-3 bg-blue-500 rounded-full mr-3'></div>
                                    <h3 className='font-semibold'>Comparison Criteria</h3>
                                </div>
                                <div className='text-center'>
                                    <h3 className='font-bold'>
                                        {unis.find(uni => uni.id === compareAbleUnis[0])?.universityName}
                                    </h3>
                                    <div className='w-full h-1 bg-blue-500 mx-auto mt-1 rounded-full'></div>
                                </div>
                                <div className='text-center'>
                                    <h3 className='font-bold'>
                                        {unis.find(uni => uni.id === compareAbleUnis[1])?.universityName}
                                    </h3>
                                    <div className='w-full h-1 bg-purple-500 mx-auto mt-1 rounded-full'></div>
                                </div>
                            </div>
                        </div>

                        {/* Comparison Content */}
                        <div className='max-h-[400px] overflow-y-auto'>
                            <div className='px-6 py-2'>
                                {comparisionResult.map((result, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.3 }}
                                        className={`py-4 ${index !== comparisionResult.length - 1 ? 'border-b border-gray-100' : ''}`}
                                    >
                                        <div className='grid grid-cols-3 gap-6 items-center'>
                                            {/* Feature Title */}
                                            <div className='flex items-center'>
                                                <div className={`w-2 h-8 rounded-full mr-3 ${result.uni1.result === "Perfect" || result.uni2.result === "Perfect"
                                                    ? 'bg-green-400'
                                                    : 'bg-gray-300'
                                                    }`}></div>
                                                <h4 className='font-semibold break-words'>{result.featureTitle}</h4>
                                            </div>

                                            {/* University 1 Result */}
                                            <div className='text-center'>
                                                <div className={`inline-flex w-full justify-center items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${result.uni1.result === "Perfect"
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : 'bg-red-100 text-red-800 border border-red-200'
                                                    }`}>
                                                    {result.uni1.result === "Perfect" && (
                                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                    {result.uni1.result !== "Perfect" && (
                                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                    <span className='break-words w-[80%]'>{result.uni1.value}</span>
                                                </div>
                                            </div>

                                            {/* University 2 Result */}
                                            <div className='text-center'>
                                                <div className={`inline-flex w-full justify-center items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${result.uni2.result === "Perfect"
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : 'bg-red-100 text-red-800 border border-red-200'
                                                    }`}>
                                                    {result.uni2.result === "Perfect" && (
                                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                    {result.uni2.result !== "Perfect" && (
                                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                    <span className='break-words w-[80%]'>{result.uni2.value}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className='bg-gray-50 px-6 py-2 border-t border-gray-200'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center text-lg text-gray-600'>
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Comparing {comparisionResult.length} University Criteria
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsManResultOut(false)}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-lg text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                                >
                                    Close Comparison
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {!isFetching && <div className='flex flex-col items-center gap-6'>

                <div className='grid grid-cols-3 gap-3 justify-around items-center mb-5 p-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white w-[1000px]'>
                    <div className='bg-white text-center text-2xl font-bold text-black p-3 rounded-xl'>{unis.find(uni => uni.id === compareAbleUnis[0])?.universityName || "Add First University"}</div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: compareAbleUnis.length !== 2 ? 0.5 : 1 }}
                        disabled={compareAbleUnis.length !== 2}
                        onClick={compareUniversities}
                        className="w-full flex justify-center items-center btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                    >
                        Compare Universities
                    </motion.button>

                    <div className='bg-white text-center text-2xl font-bold text-black p-3 rounded-xl'>{unis.find(uni => uni.id === compareAbleUnis[1])?.universityName || "Add Second University"}</div>
                </div>

                {unis.length === 0 && <div className='mt-5 flex items-center flex-col gap-5'>
                    <h1 className='text-2xl font-bold'>Sorry! There Are No Dream University To Show</h1>
                    <h1 className='text-2xl font-bold'>Go To <button onClick={() => setActiveTab('university')} className='btn btn-primary text-2xl'>Find Universties</button> To Add Your Dream Universities</h1>
                </div>}

                {unis.map((uni, index) =>
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="w-[850px] bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500 flex flex-col gap-3"
                    >
                        <div className="flex justify-around items-center space-x-4">
                            <div className='rounded-xl border-2 border-black overflow-hidden'>
                                <img src={uni.logoLink} className='object-cover w-24 h-20' />
                            </div>
                            <div className="flex-1 mt-3">
                                <b className="font-bold text-xl mb-3">{uni.universityName}</b>
                                <br />
                                <p className="text-lg mb-3">{uni.location}</p>
                            </div>
                            <div className='flex flex-col gap-3 w-[40%]'>
                                <button
                                    className={`btn btn-primary w-full flex justify-center items-center ${addedToList[uni.id] ? 'bg-red-500 text-white' : ''}`}
                                    onClick={() => toggleAddedToList(uni.id)}
                                >
                                    <Cross className='mr-1 w-6 rotate-45' />
                                    <p>Remove From Dream List</p>
                                </button>

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: compareAbleUnis.length === 2 && !compareAbleUnis.includes(uni.id) ? 0.5 : 1 }}
                                    disabled={compareAbleUnis.length === 2 && !compareAbleUnis.includes(uni.id)}
                                    onClick={() => toggleAddedToCompareList(uni.id)}
                                    className={`btn btn-primary w-full flex justify-center items-center ${compareUni[uni.id] ? 'bg-blue-500 text-white' : ''}`}
                                >
                                    {!compareUni[uni.id] ? <Cross className='mr-1 w-6' /> : <Cross className='mr-1 w-6 rotate-45' />}
                                    {!compareUni[uni.id] ? <p>Add To Compare List</p> : <p>Remove From Compare List</p>}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {noOfUnis > 5 && <div className="flex justify-center mt-5">
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
                        animate={{ opacity: nextNum >= noOfUnis ? 0.5 : 1 }}
                        disabled={nextNum >= noOfUnis}
                        onClick={() => increseMapCount()}
                        className="w-52 btn btn-primary ml-5 mr-5 flex justify-center items-center"
                    >
                        <p>Next Page</p>
                        <ArrowRightCircleIcon className='ml-1' />
                    </motion.button>
                </div>}
            </div>}

            {isFetching && <div className='fixed h-screen w-[1200px] top-28 -ml-[600px]'>
                <div className='flex justify-center'>
                    <LoaderComponent />
                </div>
            </div>}
        </>
    )
}

export default DreamUniversities