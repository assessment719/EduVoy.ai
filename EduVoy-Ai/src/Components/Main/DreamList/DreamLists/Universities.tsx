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

        await fetch(`${BACKEND_URL}/users/dreamUnis`, {
            method: "PUT",
            headers: {
                'token': `${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: userDetails.id, dreamUnis: dreamUnis }),
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

            const response = await fetch(`${BACKEND_URL}/users/dreamUnis?userId=${userDetails.id}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data = await response.json();

            let obj: { [key: string]: boolean } = {};
            data.dreamUnis.forEach((courseId: number) => {
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
        setIsManResultOut(true);
        setIsLoading(false);
    }

    return (
        <>
            {isLoading && <div className='fixed bg-opacity-50 bg-gray-100 w-screen h-screen z-50 top-0 left-0'>
                <div className='flex justify-center'>
                    <LoaderComponent />
                </div>
            </div>}

            {!isLoading && isManResultOut && <div className='fixed bg-opacity-50 bg-gray-100 w-screen h-screen z-50 top-0 left-0'>
                <div className='flex justify-center flex-col mt-8 ml-[20%]'>

                    <div className='w-[850px] text-2xl font-bold p-2 text-center rounded-tr-xl rounded-tl-xl bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-b-0 border-black grid grid-flow-col grid-cols-6 items-center text-white'>
                        <h1 className='col-span-5'>Perfect University - <i className='text-3xl underline underline-offset-8'>{unis.find(uni => uni.id === compareAbleUnis[winner])?.universityName}</i></h1>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setIsManResultOut(false)}
                            className="w-38 btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                        >
                            Exit
                        </motion.button>
                    </div>

                    <div className='w-[850px] grid grid-cols-3 gap-3 items-center bg-white border-2 border-black'>
                        <h1 className='text-2xl font-bold p-2 text-center mr-4'>Aspects</h1>
                        <h1 className='text-2xl font-bold p-2 text-center mr-4'>{unis.find(uni => uni.id === compareAbleUnis[0])?.universityName}</h1>
                        <h1 className='text-2xl font-bold p-2 text-center mr-4'>{unis.find(uni => uni.id === compareAbleUnis[1])?.universityName}</h1>
                    </div>

                    <div className='max-h-[530px] w-[850px] overflow-y-auto rounded-br-xl rounded-bl-xl border-2 border-t-0 border-black bg-white'>
                        {comparisionResult.map((result, index) =>
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`w-[830px] bg-white p-1 flex flex-col gap-3 ${index === comparisionResult.length - 1 ? "" : "border-b-2 border-black"}`}
                            >
                                <div className='grid grid-cols-3 gap-3 items-center'>
                                    <h1 className='break-words text-xl font-bold'>{result.featureTitle}</h1>
                                    <h1 className={`break-words text-lg rounded-lg ${result.uni1.result === "Perfect" ? "bg-green-100" : "bg-red-100"} h-full text-center p-2`}>{result.uni1.value}</h1>
                                    <h1 className={`break-words text-lg rounded-lg ${result.uni2.result === "Perfect" ? "bg-green-100" : "bg-red-100"} h-full text-center p-2`}>{result.uni2.value}</h1>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>}

            {!isFetching && <div className='flex flex-col items-center gap-6'>

                <div className='grid grid-cols-3 gap-3 justify-around items-center mb-5 p-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white w-[1000px]'>
                    <div className='bg-white text-center text-2xl font-bold text-black p-3 rounded-xl'>{unis.find(uni => uni.id === compareAbleUnis[0])?.universityName || "Add First University"}</div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: compareAbleUnis.length !== 2 ? 0.5 : 1 }}
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