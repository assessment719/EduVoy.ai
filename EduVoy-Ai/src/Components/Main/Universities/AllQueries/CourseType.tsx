import { motion } from 'framer-motion';
import Select from 'react-dropdown-select';
import { SearchIcon, Cross, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { StringDrop } from '../../../../Utils/stringDrop';
import { PgUnis } from '../../../../Utils/pgunis';
import { EnglandUniversities } from '../../../../Utils/ukUniversities';
import { BACKEND_URL } from '../../../../config';
import LoaderComponent from './../../../loader';

const CourseType = () => {
    const [courseType, setCourseType] = useState('');
    const [courseVarient, setCourseVarient] = useState('');

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

    const ugCourseTypes = [
        { value: 'placementCourses', label: 'Placement Courses' },
        { value: 'topupCourses', label: 'Top-Up Courses' }
    ]

    const pgCourseTypes = [
        { value: 'placementCourses', label: 'Placement Courses' },
        { value: 'topupCourses', label: 'Top-Up Courses' },
        { value: 'resCourses', label: 'Research Courses' }
    ]

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
        if (courseType && courseVarient) {
            setIsFetching(true);
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    return;
                }

                await new Promise((resolve) => setTimeout(resolve, 2000));
                const queryParams = new URLSearchParams();
                if (courseVarient !== '') queryParams.append('courseType', courseVarient);

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
        setCourseVarient('');
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
                            Select Preferred Course Type:
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
                                options={courseType === "undergraduate" ? ugCourseTypes : pgCourseTypes}
                                onChange={(value: StringDrop[]): void => { setCourseVarient(value[0].value) }}
                            />
                        </div>
                    </div>
                </div>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: courseType === '' || courseVarient === '' ? 0.5 : 1 }}
                    disabled={courseType === '' || courseVarient === ''}
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
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>}

            {isGotData && !isFetching && noOfUnis === 0 && <div className='mt-5 flex justify-center'>
                <h1 className='text-2xl font-bold'>Sorry! There Is No University Offering This Course Type.</h1>
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

export default CourseType