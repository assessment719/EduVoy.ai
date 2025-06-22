import { motion } from 'framer-motion';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, Cross, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { EnglandUniversities } from '../../../../Utils/ukUniversities';
import { BACKEND_URL } from '../../../../config';
import LoaderComponent from '../../../loader';
import { userDetailsAtom, dreamUniAtom } from './../../../../Atoms/atoms';

const AllUnis = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [unis, setUnis] = useState<EnglandUniversities[]>([]);
    const [noOfUnis, setNoOfUnis] = useState(0);

    // For University Search
    const [isSearched, setIsSearched] = useState(false);
    const [queryUni, setQueryUni] = useState('');

    const queryUniRef = useRef(queryUni);

    useEffect(() => {
        queryUniRef.current = queryUni;
    }, [queryUni]);

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

    // For Dream List
    const setAddedToList = useSetRecoilState(dreamUniAtom);
    const addedToList = useRecoilValue(dreamUniAtom);
    const userDetails = useRecoilValue(userDetailsAtom);
    const initialMount = useRef(false);

    const updateDreamUnis = (dreamUnis: number[]) => {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        fetch(`${BACKEND_URL}/users/updateField/${userDetails.id}`, {
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
        initialMount.current = true;
        setAddedToList((prevState) => ({
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
            await new Promise((e) => { setTimeout(e, 1200) })

            const queryParams = new URLSearchParams();
            if (queryUniRef.current !== '') queryParams.append('search', queryUniRef.current);
            queryParams.append('skip', prevNumRef.current.toString());
            queryParams.append('limit', "5");

            const response = await fetch(`${BACKEND_URL}/users/finaluniversities?${queryParams.toString()}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data = await response.json();
            setUnis(data.data.universities);
            setNoOfUnis(data.data.total);
            setIsFetching(false);
        } catch (error) {
            console.error('Error fetching unis:', error);
        }
    };

    useEffect(() => {
        setIsFetching(true);
        fetchUnis();
    }, [])

    function searchUnis() {
        setIsFetching(true);
        setIsSearched(true);
        fetchUnis();
    }

    function resetUnis() {
        setQueryUni('');
        setIsFetching(true);
        setIsSearched(false);
        fetchUnis();
    }

    return (
        <>
            {!isFetching && <div className='flex flex-col items-center gap-6 mb-10'>
                <div className='grid grid-cols-5 gap-6 items-center mb-5 p-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white w-[1000px]'>
                    <div className="mb-4 col-span-3">
                        <label htmlFor="queryCourse" className="block font-bold text-xl text-white mb-1">
                            University Name:
                        </label>
                        <input
                            type="text"
                            id="queryCourse"
                            value={queryUni}
                            onChange={(e) => setQueryUni(e.target.value)}
                            placeholder="Enter University Name"
                            className="p-2 w-full border border-black text-black rounded-lg"
                        />
                    </div>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={isSearched ? resetUnis : searchUnis}
                        className="w-full flex justify-center items-center btn btn-primary bg-gradient-to-r from-red-500 to-green-600 col-span-2"
                    >
                        {isSearched ? <Cross className='mr-2 rotate-45' /> : <Search className='mr-2' />}
                        {isSearched ? <p>Reset Search</p> : <p>Search University</p>}
                    </motion.button>
                </div>

                {unis.length === 0 && <div className='mt-5 flex justify-center'>
                    <h1 className='text-2xl font-bold'>Sorry! There Are No University That Matches Your Query.</h1>
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
                                    {!addedToList[uni.id] ? <Cross className='mr-1 w-6' /> : <Cross className='mr-1 w-6 rotate-45' />}
                                    {!addedToList[uni.id] ? <p>Add To Dream List</p> : <p>Remove From Dream List</p>}
                                </button>

                                <a href={uni.universityWebsitePage} target='blank' className='btn btn-primary w-full text-center'>University Website</a>
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

export default AllUnis