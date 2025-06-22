import { motion } from 'framer-motion';
import Select from 'react-dropdown-select';
import { SearchIcon, Cross, Search } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { StringDrop } from '../../../../../Utils/stringDrop';
import { NumDrop } from '../../../../../Utils/numDrop';
import { Option } from '../../../../../Utils/options';
import { PgUnis } from '../../../../../Utils/pgunis';
import { EnglandUniversities } from '../../../../../Utils/ukUniversities';
import { BACKEND_URL } from '../../../../../config';
import LoaderComponent from '../../../../loader';
import { userDetailsAtom, dreamUniAtom } from'../../../../../Atoms/atoms';

const Moi = () => {

    const [courseType, setCourseType] = useState('postgraduate');
    const [selectedMoiUni, setSelectedMoiUni] = useState(0);

    const [universities, setUniversities] = useState<NumDrop[]>([]);

    const [isFetching, setIsFetching] = useState(false);
    const [isGotData, setIsGotData] = useState(false);
    const [objUnisWeb, setObjUnisWeb] = useState<{ [key: number]: string }>({});
    const [objUnisImg, setObjUnisImg] = useState<{ [key: number]: string }>({});
    const [objUnisAdd, setObjUnisAdd] = useState<{ [key: number]: string }>({});

    const [unis, setUnis] = useState<PgUnis[]>([]);
    const [noOfUnis, setNoOfUnis] = useState(0);

    // For University Search
    const [isSearched, setIsSearched] = useState(false);
    const [queryUni, setQueryUni] = useState('');

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

    async function searchUnis() {
        setIsSearched(true);
        setIsFetching(true);
        await new Promise((e) => { setTimeout(e, 1200) })
        const filteredUnis = unis?.filter((Uni) =>
            Uni.universityName.toLowerCase().includes(queryUni.toLowerCase())
        );
        setUnis(filteredUnis);
        setIsFetching(false);
        if (filteredUnis.length <= 5) {
            setNoOfUnis(10000);
        }
    }

    function resetUnis() {
        setIsFetching(true);
        setIsSearched(false);
        fetchUniversities();
        setQueryUni('');
    }

    const fetchUkUnis = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/users/finaluniversities`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data = await response.json();

            let imgObj: { [key: number]: string } = {};
            data.data.universities.forEach((uni: EnglandUniversities) => {
                imgObj[uni.id] = uni.logoLink;
            });
            setObjUnisImg(imgObj);

            let webObj: { [key: number]: string } = {};
            data.data.universities.forEach((uni: EnglandUniversities) => {
                webObj[uni.id] = uni.universityWebsitePage;
            });
            setObjUnisWeb(webObj);

            let addObj: { [key: number]: string } = {};
            data.data.universities.forEach((uni: EnglandUniversities) => {
                addObj[uni.id] = uni.location;
            });
            setObjUnisAdd(addObj);
        } catch (error) {
            console.error('Error fetching unis:', error);
        }
    };

    const fetchMoiUnis = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/users/options/moiunis`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data: { moiunis: Option[] } = await response.json();

            let options = [];
            options.push(...data.moiunis.map(obj => ({ value: obj.id, label: obj.option })));
            setUniversities(options);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    useEffect(() => {
        fetchMoiUnis();
        fetchUkUnis();
    }, [])

    const fetchUniversities = async () => {
        if (courseType && selectedMoiUni !== 0) {
            setIsFetching(true);
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    return;
                }

                await new Promise((resolve) => setTimeout(resolve, 2000));
                const queryParams = new URLSearchParams();
                if (selectedMoiUni !== 0) queryParams.append('moiUniId', selectedMoiUni.toString());

                const response = await fetch(`${BACKEND_URL}/users/universities/${courseType}/?${queryParams.toString()}`, {
                    method: "GET",
                    headers: {
                        'token': `${token}`
                    },
                });
                const data: { universities: PgUnis[] } = await response.json();
                setUnis(data.universities);
                setNoOfUnis(data.universities.length);
                setIsGotData(true);
                setIsFetching(false);
            } catch (error) {
                console.error('Error fetching resources:', error);
                setIsFetching(false);
            }
        } else {
            alert('Please fill all the required fields. Thank you!');
            return
        }
    }

    function findUnis() {
        fetchUniversities();
    }

    function resetQuery() {
        setIsGotData(false);
        setCourseType('postgraduate');
        setSelectedMoiUni(0);
        setQueryUni('');
        setIsSearched(false);
    }

    return (
        <>
            {!isGotData && <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="eligibleUniBox"
            >
                <div className='grid grid-cols-1 gap-6'>
                    <div className='w-full'>
                        <label className="label">
                            Select Course Type:
                        </label>
                        <div className='selectBorder'>
                            <Select
                                className='select'
                                name='university'
                                color='#8bb87b'
                                searchable={false}
                                placeholder='Select Course Type'
                                closeOnClickInput
                                values={[{ value: 'postgraduate', label: 'Postgraduate' }]}
                                options={[{ value: 'postgraduate', label: 'Postgraduate' }]}
                                onChange={(value: StringDrop[]): void => { setCourseType(value[0].value) }}
                            />
                        </div>
                    </div>

                    <div className='w-full'>
                        <label className="label">
                            Select University:
                        </label>
                        <div className='selectBorder'>
                            <Select
                                className='select'
                                name='university'
                                color='#8bb87b'
                                placeholder='Select University'
                                closeOnClickInput
                                values={[]}
                                options={universities}
                                onChange={(value: NumDrop[]): void => { setSelectedMoiUni(value[0].value) }}
                            />
                        </div>
                    </div>
                </div>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: selectedMoiUni === 0 ? 0.5 : 1 }}
                    disabled={selectedMoiUni === 0}
                    onClick={findUnis}
                    className="uniSubmitBtn"
                >
                    <SearchIcon className='mr-2' />
                    <p>Find Universities</p>
                </motion.button>
            </motion.div>}

            {isGotData && !isFetching && noOfUnis !== 0 && <div className='flex flex-col items-center gap-6'>
                <div className='p-2 bg-gray-200 rounded-2xl w-full'>
                    <h1 className='text-3xl font-bold text-center'>You Can Apply For Following Universities</h1>
                </div>

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
                        className="w-[950px] bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500 flex flex-col gap-3"
                    >
                        <div className="flex justify-around items-center space-x-4">
                            <div className='rounded-xl border-2 border-black overflow-hidden'>
                                <img src={objUnisImg[uni.universityId]} className='object-cover w-24 h-20' />
                            </div>
                            <div className="flex-1 mt-3">
                                <b className="font-bold text-xl mb-3">{uni.universityName}</b>
                                <br />
                                <p className="text-lg mb-3">{objUnisAdd[uni.universityId]}</p>
                            </div>
                            <div className='flex flex-col gap-3 w-[50%]'>
                                <button
                                    className={`btn btn-primary w-full flex justify-center items-center ${addedToList[uni.universityId] ? 'bg-red-500 text-white' : ''}`}
                                    onClick={() => toggleAddedToList(uni.universityId)}
                                >
                                    {!addedToList[uni.universityId] ? <Cross className='mr-1 w-6' /> : <Cross className='mr-1 w-6 rotate-45' />}
                                    {!addedToList[uni.universityId] ? <p>Add To Dream List</p> : <p>Remove From Dream List</p>}
                                </button>

                                <a href={objUnisWeb[uni.universityId]} target='blank' className='btn btn-primary w-full text-center'>University Website</a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>}

            {isGotData && !isFetching && noOfUnis === 0 && <div className='mt-5 flex justify-center'>
                <h1 className='text-2xl font-bold'>Sorry! You Are Not Eligible For Any University.</h1>
            </div>}

            {isGotData && !isFetching && <div className='m-5 flex justify-center'>
                <button onClick={resetQuery} className='w-[700px] btn btn-primary'>
                    Reset Query
                </button>
            </div>}

            {isFetching && <div className='fixed bg-opacity-50 bg-gray-100 h-screen w-screen top-0 left-0'>
                <div className='flex justify-center'>
                    <LoaderComponent />
                </div>
            </div>}
        </>
    )
}

export default Moi