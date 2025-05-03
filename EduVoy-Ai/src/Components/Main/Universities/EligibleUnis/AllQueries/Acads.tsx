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
import { userDetailsAtom, dreamUniAtom } from '../../../../../Atoms/atoms';


const Acads = () => {
    const [courseType, setCourseType] = useState('');
    const [institutionId, setInstitutionId] = useState(0);
    const [acadMarks, setAcadMarks] = useState(0);

    const [boards, setBoards] = useState<NumDrop[]>([]);
    const [universities, setUniversities] = useState<NumDrop[]>([]);

    const [isFetching, setIsFetching] = useState(false);
    const [isGotData, setIsGotData] = useState(false);
    const [isMore, setIsMore] = useState(false);
    const [objUnisWeb, setObjUnisWeb] = useState<{ [key: number]: string }>({});
    const [objUnisImg, setObjUnisImg] = useState<{ [key: number]: string }>({});
    const [objUnisAdd, setObjUnisAdd] = useState<{ [key: number]: string }>({});

    const [objBoards, setObjBoards] = useState<{ [key: number]: string }>({});
    const [objUnis, setObjUnis] = useState<{ [key: number]: string }>({});
    const [objMarks, setObjMarks] = useState<{ [key: number]: number }>({});
    const [extraInfo, setExtraInfo] = useState('');

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

        fetch(`${BACKEND_URL}/users/updateField/dreamUnis/${userDetails.id}`, {
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

    const fetchBoards = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/users/options/board`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data: { boards: Option[] } = await response.json();

            let options = [];
            options.push(...data.boards.map(obj => ({ value: obj.id, label: obj.option })));
            setBoards(options);

            let Obj: { [key: number]: string } = {};
            data.boards.forEach((board) => {
                Obj[board.id] = board.option;
            });
            setObjBoards(Obj);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    const fetchUnis = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/users/options/university`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data: { universities: Option[] } = await response.json();

            let options = [];
            options.push(...data.universities.map(obj => ({ value: obj.id, label: obj.option })));
            setUniversities(options);

            let Obj: { [key: number]: string } = {};
            data.universities.forEach((uni) => {
                Obj[uni.id] = uni.option;
            });
            setObjUnis(Obj);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    useEffect(() => {
        fetchUnis();
        fetchBoards();
        fetchUkUnis();
    }, [])

    const fetchUniversities = async () => {
        if (courseType && institutionId !== 0 && acadMarks !== 0) {
            setIsFetching(true);
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    return;
                }

                await new Promise((resolve) => setTimeout(resolve, 2000));
                const queryParams = new URLSearchParams();
                if (courseType === 'postgraduate' && institutionId !== 0) queryParams.append('acadUniId', institutionId.toString());
                if (courseType === 'undergraduate' && institutionId !== 0) queryParams.append('boardId', institutionId.toString());
                if (acadMarks !== 0) queryParams.append('acadMarks', acadMarks.toString());

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
        setCourseType('');
        setInstitutionId(0);
        setAcadMarks(0);
        setQueryUni('');
        setIsSearched(false);
    }

    async function showMore(universityId: Number) {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/users/universities/${courseType}/academicReq/${universityId}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data = await response.json();
            const infoOfUni = data.university;

            //Fetching All Data
            setObjMarks(infoOfUni.academicReq);
            setExtraInfo(infoOfUni.extraReqInfo);
            setIsMore(true);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
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
                                values={[]}
                                options={[{ value: 'postgraduate', label: 'Postgraduate' }, { value: 'undergraduate', label: 'Undergraduate' }]}
                                onChange={(value: StringDrop[]): void => { setCourseType(value[0].value) }}
                            />
                        </div>
                    </div>

                    <div className='w-full'>
                        <label className="label">
                            Select University or Board:
                        </label>
                        <div className='selectBorder'>
                            <Select
                                className='select'
                                name='university'
                                color='#8bb87b'
                                placeholder='Select University or Board'
                                closeOnClickInput
                                values={[]}
                                options={courseType === "undergraduate" ? boards : universities}
                                onChange={(value: NumDrop[]): void => { setInstitutionId(value[0].value) }}
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="label">
                            Enter Overall Marks:
                        </label>
                        <input
                            type="number"
                            id="acadMarks"
                            value={acadMarks === 0 ? '' : acadMarks}
                            onChange={(e) => setAcadMarks(Number(e.target.value))}
                            placeholder="Enter Overall Percentage"
                            className="input"
                        />
                    </div>
                </div>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: courseType === '' || institutionId === 0 || acadMarks === 0 ? 0.5 : 1 }}
                    disabled={courseType === '' || institutionId === 0 || acadMarks === 0}
                    onClick={findUnis}
                    className="uniSubmitBtn"
                >
                    <SearchIcon className='mr-2' />
                    <p>Find Universities</p>
                </motion.button>
            </motion.div>}

            {isGotData && !isFetching && noOfUnis !== 0 && <div className='flex flex-col items-center gap-6'>
                <div className='uniHeadDiv'>
                    <h1 className='uniHead'>You Can Apply For Following Universities</h1>
                </div>

                <div className='uniSearchBox'>
                    <div className="mb-4 col-span-3">
                        <label htmlFor="queryCourse" className="label">
                            University Name:
                        </label>
                        <input
                            type="text"
                            id="queryCourse"
                            value={queryUni}
                            onChange={(e) => setQueryUni(e.target.value)}
                            placeholder="Enter University Name"
                            className="input rounded-lg"
                        />
                    </div>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={isSearched ? resetUnis : searchUnis}
                        className="btn btn-primary uniSearchBtn"
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
                                <div className="flex justify-around items-center gap-3">
                                    <button onClick={() => showMore(uni.universityId)} className='btn btn-primary w-full'>More Info</button>

                                    <a href={objUnisWeb[uni.universityId]} target='blank' className='btn btn-primary w-full text-center'>University Website</a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>}

            {isMore && <div className='uniMoreDiv'>
                <div className='flex justify-center'>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="morePopUp"
                    >
                        <div className='flex justify-end'>
                            <Cross onClick={() => setIsMore(false)} className='moreClose' />
                        </div>
                        <div className='flex flex-col p-3 gap-5'>
                            <div>
                                <h1 className='font-bold text-3xl underline'>Academic Requirements (Overall Marks):</h1>
                                <div className="grid grid-cols-1 gap-2 mt-2">
                                    {Object.entries(objMarks).map(([key, value]) => (
                                        <h1 className='text-xl'><b>- {courseType === 'postgraduate' ? objUnis[key as any] : objBoards[key as any]}: </b>{value}%</h1>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h1 className='font-bold text-3xl underline'>Extra Requirements:</h1>
                                <h1 className='text-xl mt-2 max-h-40 overflow-y-auto'>{extraInfo}</h1>
                            </div>
                        </div>
                    </motion.div>
                </div>
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

export default Acads