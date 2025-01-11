import { motion } from 'framer-motion';
import Select from 'react-dropdown-select';
import { SearchIcon, Cross, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { StringDrop } from '../../../../Utils/stringDrop';
import { PgUnis } from '../../../../Utils/pgunis';
import { EnglandUniversities } from '../../../../Utils/ukUniversities';
import { numNumDrop } from '../../../../Utils/numNumDrop';
import { BACKEND_URL } from './../../../../config';
import LoaderComponent from './../../../loader';

const Test = () => {
    const [courseType, setCourseType] = useState('');
    const [selectedTest, setSelectedTest] = useState('');
    const [overall, setOverall] = useState(0);
    const [listening, setListening] = useState(0);
    const [reading, setReading] = useState(0);
    const [writing, setWriting] = useState(0);
    const [speaking, setSpeaking] = useState(0);

    const [isFetching, setIsFetching] = useState(false);
    const [isGotData, setIsGotData] = useState(false);
    const [isMore, setIsMore] = useState(false);
    const [objUnisWeb, setObjUnisWeb] = useState<{ [key: number]: string }>({});
    const [objUnisImg, setObjUnisImg] = useState<{ [key: number]: string }>({});
    const [objUnisAdd, setObjUnisAdd] = useState<{ [key: number]: string }>({});

    const [objMarks, setObjMarks] = useState<{ [key: string]: number }>({});
    const [extraInfo, setExtraInfo] = useState('');

    const [unis, setUnis] = useState<PgUnis[]>([]);
    const [noOfUnis, setNoOfUnis] = useState(0);

    const ieltsMarksArr = [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0];

    const ieltsMarksArrOptions = ieltsMarksArr.map(mark => ({ value: Number(mark.toFixed(1)), label: Number(mark.toFixed(1)) }));

    // For University Search
    const [isSearched, setIsSearched] = useState(false);
    const [queryUni, setQueryUni] = useState('');

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
            const data: { universities: EnglandUniversities[] } = await response.json();

            let imgObj: { [key: number]: string } = {};
            data.universities.forEach((uni) => {
                imgObj[uni.id] = uni.logoLink;
            });
            setObjUnisImg(imgObj);

            let webObj: { [key: number]: string } = {};
            data.universities.forEach((uni) => {
                webObj[uni.id] = uni.universityWebsitePage;
            });
            setObjUnisWeb(webObj);

            let addObj: { [key: number]: string } = {};
            data.universities.forEach((uni) => {
                addObj[uni.id] = uni.location;
            });
            setObjUnisAdd(addObj);
        } catch (error) {
            console.error('Error fetching unis:', error);
        }
    };

    useEffect(() => {
        fetchUkUnis();
    }, [])

    const fetchUniversities = async () => {
        if (courseType && selectedTest && overall !== 0 && listening !== 0 && reading !== 0 && writing !== 0 && speaking !== 0) {
            setIsFetching(true);
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    return;
                }

                await new Promise((resolve) => setTimeout(resolve, 2000));
                const queryParams = new URLSearchParams();
                if (selectedTest !== '') queryParams.append('testName', selectedTest);
                if (overall !== 0) queryParams.append('overall', overall.toString());
                if (listening !== 0) queryParams.append('listening', listening.toString());
                if (reading !== 0) queryParams.append('reading', reading.toString());
                if (writing !== 0) queryParams.append('writing', writing.toString());
                if (speaking !== 0) queryParams.append('speaking', speaking.toString());

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
        setSelectedTest('');
        setOverall(0);
        setListening(0);
        setReading(0);
        setWriting(0);
        setSpeaking(0);
    }

    async function showMore(universityId: Number) {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/users/universities/${courseType}/${universityId}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data = await response.json();
            const infoOfUni = data.university;

            //Fetching All Data
            if (selectedTest === 'ieltsReq') {
                setObjMarks(infoOfUni.ieltsReq);
            } else if (selectedTest === 'pteReq') {
                setObjMarks(infoOfUni.pteReq);
            } else if (selectedTest === 'toeflReq') {
                setObjMarks(infoOfUni.toeflReq);
            } else {
                setObjMarks(infoOfUni.duolingoReq);
            }

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
                className="mt-3 space-y-3 w-[800px] mx-auto p-6 bg-white rounded-2xl shadow-2xl"
            >
                <div className='grid grid-cols-1 gap-6'>
                    <div className='w-full'>
                        <label htmlFor="type" className="block font-bold text-xl mb-1">
                            Select Course Type:
                        </label>
                        <div className='border-2 border-black'>
                            <Select
                                className='bg-white text-black h-10 text-2xl'
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
                        <label htmlFor="type" className="block font-bold text-xl mb-1">
                            Select English Language Test:
                        </label>
                        <div className='border-2 border-black'>
                            <Select
                                className='bg-white text-black h-10 text-2xl'
                                name='university'
                                color='#8bb87b'
                                searchable={false}
                                placeholder='Select English Language Test'
                                closeOnClickInput
                                values={[]}
                                options={[
                                    { value: 'ieltsReq', label: 'International English Language Testing System (IELTS)' },
                                    { value: 'pteReq', label: 'Pearson Test of English (PTE)' },
                                    { value: 'toeflReq', label: 'Test of English as a Foreign Language (TOEFL)' },
                                    { value: 'duolingoReq', label: 'Duolingo' }
                                ]}
                                onChange={(value: StringDrop[]): void => { setSelectedTest(value[0].value) }}
                            />
                        </div>
                    </div>

                    {courseType && selectedTest && selectedTest === 'ieltsReq' && <div className='grid grid-cols-2 gap-6'>
                        <div className='w-full col-span-2'>
                            <label htmlFor="type" className="block font-bold text-xl mb-1">
                                Select Overall Marks:
                            </label>
                            <div className='border-2 border-black'>
                                <Select
                                    className='bg-white text-black h-10 text-2xl'
                                    name='university'
                                    color='#8bb87b'
                                    placeholder='Select Overall Marks'
                                    closeOnClickInput
                                    values={[]}
                                    options={ieltsMarksArrOptions}
                                    onChange={(value: numNumDrop[]): void => { setOverall(value[0].value) }}
                                />
                            </div>
                        </div>

                        <div className='w-full'>
                            <label htmlFor="type" className="block font-bold text-xl mb-1">
                                Select Listening Marks:
                            </label>
                            <div className='border-2 border-black'>
                                <Select
                                    className='bg-white text-black h-10 text-2xl'
                                    name='university'
                                    color='#8bb87b'
                                    placeholder='Select Listening Marks'
                                    closeOnClickInput
                                    values={[]}
                                    options={ieltsMarksArrOptions}
                                    onChange={(value: numNumDrop[]): void => { setListening(value[0].value) }}
                                />
                            </div>
                        </div>

                        <div className='w-full'>
                            <label htmlFor="type" className="block font-bold text-xl mb-1">
                                Select Reading Marks:
                            </label>
                            <div className='border-2 border-black'>
                                <Select
                                    className='bg-white text-black h-10 text-2xl'
                                    name='university'
                                    color='#8bb87b'
                                    placeholder='Select Reading Marks'
                                    closeOnClickInput
                                    values={[]}
                                    options={ieltsMarksArrOptions}
                                    onChange={(value: numNumDrop[]): void => { setReading(value[0].value) }}
                                />
                            </div>
                        </div>

                        <div className='w-full'>
                            <label htmlFor="type" className="block font-bold text-xl mb-1">
                                Select Writing Marks:
                            </label>
                            <div className='border-2 border-black'>
                                <Select
                                    className='bg-white text-black h-10 text-2xl'
                                    name='university'
                                    color='#8bb87b'
                                    placeholder='Select Writing Marks'
                                    closeOnClickInput
                                    values={[]}
                                    options={ieltsMarksArrOptions}
                                    onChange={(value: numNumDrop[]): void => { setWriting(value[0].value) }}
                                />
                            </div>
                        </div>

                        <div className='w-full'>
                            <label htmlFor="type" className="block font-bold text-xl mb-1">
                                Select Speaking Marks:
                            </label>
                            <div className='border-2 border-black'>
                                <Select
                                    className='bg-white text-black h-10 text-2xl'
                                    name='university'
                                    color='#8bb87b'
                                    placeholder='Select Speaking Marks'
                                    values={[]}
                                    options={ieltsMarksArrOptions}
                                    onChange={(value: numNumDrop[]): void => { setSpeaking(value[0].value) }}
                                />
                            </div>
                        </div>
                    </div>}

                    {courseType && selectedTest && selectedTest !== 'ieltsReq' && <div className='grid grid-cols-2 gap-6'>
                        <div className="w-full col-span-2">
                            <label htmlFor="expectedKeywordsID" className="block font-bold text-xl mb-1">
                                Enter Overall Marks:
                            </label>
                            <input
                                type="text"
                                id="acadMarks"
                                value={overall === 0 ? '' : overall}
                                onChange={(e) => setOverall(Number(e.target.value))}
                                placeholder="Enter Overall Marks"
                                className="p-2 h-11 border-2 border-black text-xl w-full"
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="expectedKeywordsID" className="block font-bold text-xl mb-1">
                                Enter Listening Marks:
                            </label>
                            <input
                                type="text"
                                id="acadMarks"
                                value={listening === 0 ? '' : listening}
                                onChange={(e) => setListening(Number(e.target.value))}
                                placeholder="Enter Listening Marks"
                                className="p-2 h-11 border-2 border-black text-xl w-full"
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="expectedKeywordsID" className="block font-bold text-xl mb-1">
                                Enter Reading Marks:
                            </label>
                            <input
                                type="text"
                                id="acadMarks"
                                value={reading === 0 ? '' : reading}
                                onChange={(e) => setReading(Number(e.target.value))}
                                placeholder="Enter Reading Marks"
                                className="p-2 h-11 border-2 border-black text-xl w-full"
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="expectedKeywordsID" className="block font-bold text-xl mb-1">
                                Enter Writing Marks:
                            </label>
                            <input
                                type="text"
                                id="acadMarks"
                                value={writing === 0 ? '' : writing}
                                onChange={(e) => setWriting(Number(e.target.value))}
                                placeholder="Enter Writing Marks"
                                className="p-2 h-11 border-2 border-black text-xl w-full"
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="expectedKeywordsID" className="block font-bold text-xl mb-1">
                                Enter Speaking Marks:
                            </label>
                            <input
                                type="text"
                                id="acadMarks"
                                value={speaking === 0 ? '' : speaking}
                                onChange={(e) => setSpeaking(Number(e.target.value))}
                                placeholder="Enter Speaking Marks"
                                className="p-2 h-11 border-2 border-black text-xl w-full"
                            />
                        </div>
                    </div>}
                </div>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: courseType === '' || selectedTest === '' || overall === 0 || listening === 0 || reading === 0 || writing === 0 || speaking === 0 ? 0.5 : 1 }}
                    disabled={courseType === '' || selectedTest === '' || overall === 0 || listening === 0 || reading === 0 || writing === 0 || speaking === 0}
                    onClick={findUnis}
                    className="w-full btn btn-primary font-bold flex justify-center items-center"
                >
                    <SearchIcon className='mr-2' />
                    <p>Find Universities</p>
                </motion.button>
            </motion.div>}

            {isGotData && !isFetching && noOfUnis !== 0 && <div className='flex flex-col items-center gap-6'>
                <h1 className='text-3xl font-bold underline m-2'>-: You Can Apply For Following Universities :-</h1>

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
                        className="w-[700px] bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500"
                    >
                        <div className="flex justify-around items-center space-x-4">
                            <div className='rounded-xl border-2 border-black overflow-hidden '>
                                <img src={objUnisImg[uni.universityId]} className='object-cover w-24 h-20' />
                            </div>
                            <div className="flex-1 mt-3">
                                <b className="font-bold text-xl mb-3">{uni.universityName}</b>
                                <br />
                                <p className="text-lg mb-3">{objUnisAdd[uni.universityId]}</p>
                            </div>
                            <div className='flex flex-col gap-3'>
                                <a href={objUnisWeb[uni.universityId]} target='blank'><button className='btn btn-primary'>Go To University Website</button></a>
                                <button onClick={() => showMore(uni.universityId)} className='btn btn-primary'>More Info</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>}

            {isMore && <div className='fixed h-screen w-[1200px] top-28 -ml-[100px]'>
                <div className='flex justify-center'>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="w-[700px] mt-[15%] border-4 border-black bg-white p-5 rounded-xl shadow-2xl hover:shadow-black transition-shadow duration-500"
                    >
                        <div className='flex justify-end'>
                            <Cross onClick={() => setIsMore(false)} className='fixed hover:text-red-500 transition-text duration-300 scale-150 rotate-45 cursor-pointer' />
                        </div>
                        <div className='flex flex-col p-3 gap-5'>
                            <div>
                                <h1 className='font-bold text-3xl underline'>English Test Requirements:</h1>
                                <div className="grid grid-cols-4 gap-2 mt-2">
                                    <h1 className='font-bold text-xl underline'>{selectedTest === 'ieltsReq' ? 'IELTS'
                                        : courseType === 'pteReq' ? 'PTE'
                                            : courseType === 'toeflReq' ? 'TOEFL'
                                                : 'Duolingo'}:</h1>

                                    <h1 className='text-xl col-span-4'><b>Overall: </b>{objMarks.overall}</h1>
                                    <h1 className='text-xl'><b>Listening: </b>{objMarks.listening}</h1>
                                    <h1 className='text-xl'><b>Reading: </b>{objMarks.reading}</h1>
                                    <h1 className='text-xl'><b>Writing: </b>{objMarks.speaking}</h1>
                                    <h1 className='text-xl'><b>Speaking: </b>{objMarks.writing}</h1>
                                </div>
                            </div>
                            <div>
                                <h1 className='font-bold text-3xl underline'>Extra Requirements:</h1>
                                <h1 className='text-xl mt-2'>{extraInfo}</h1>
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

export default Test