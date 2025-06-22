import { motion } from 'framer-motion';
import { SearchIcon, ArrowBigRight, Search, Cross, FilterIcon, Book, ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react';
import Select from 'react-dropdown-select';
import { useEffect, useState, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { NumDrop } from '../../../../Utils/numDrop';
import { StringDrop } from '../../../../Utils/stringDrop';
import { EnglandUniversities } from '../../../../Utils/ukUniversities';
import { Course } from "../../../../Utils/courses";
import { Option } from '../../../../Utils/options';
import { BACKEND_URL } from './../../../../config';
import LoaderComponent from './../../../loader';
import { dreamCourseAtom, userDetailsAtom } from './../../../../Atoms/atoms';

const EligibleCourses = () => {
    const [isFetching, setIsFetching] = useState(false);

    // Faculty Search Forms Data
    const [desiredCourseType, setDesiredCourseType] = useState('');
    const [isDesiredUni, setIsDesiredUni] = useState('');
    const [desiredUni, setDesiredUni] = useState(0);
    const [isDesiredIntake, setIsDesiredIntake] = useState('');
    const [desiredIntake, setDesiredIntake] = useState(0);
    const [desiredFaculty, setDesiredFaculty] = useState(0);

    // Previous Studies
    const [firstSub, setFirstSub] = useState('');
    const [secondSub, setSecondSub] = useState('');
    const [thirdSub, setThirdSub] = useState('');
    const [fourthSub, setFourthSub] = useState('');
    const [prevDegree, setPrevDegree] = useState('');

    // Data Of Options
    const [ukUnis, setUkUnis] = useState<NumDrop[]>([]);
    const [intakes, setIntakes] = useState<NumDrop[]>([]);
    const [eligibleFaculties, setEligibleFaculties] = useState<{ id: number, faculty: string }[]>([]);

    // Steps Check
    const [isCourseType, setIsCourseType] = useState(false);
    const [isUni, setIsUni] = useState(false);
    const [isIntake, setIsIntake] = useState(false);

    // Set Of Courses
    const [courses, setCourses] = useState<Course[]>([]);
    const [noOfCourses, setNoOfCourses] = useState(0);

    // Set Of Objects Of Options
    const [objIntake, setObjIntake] = useState<{ [key: number]: string }>({});
    const [objLink, setObjLink] = useState<{ [key: number]: string }>({});

    // Search Query Params
    const [queryCourse, setQueryCourse] = useState('');
    const [queryUni, setQueryUni] = useState(0);
    const [queryIntake, setQueryIntake] = useState(0);

    // For Search
    const [isSearched, setIsSearched] = useState(false);
    const [isFiltered, setIsFiltered] = useState(false);
    const [isMore, setIsMore] = useState(false);

    // For Pagination
    const [prevNum, setPrevNum] = useState(0);
    const [nextNum, setNextNum] = useState(10);

    // For Dream List
    const setAddedToList = useSetRecoilState(dreamCourseAtom);
    const addedToList = useRecoilValue(dreamCourseAtom);
    const userDetails = useRecoilValue(userDetailsAtom);
    const initialMount = useRef(false);

    const updateDreamCourses = (dreamCourses: number[]) => {
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
            body: JSON.stringify({ updatingField: { dreamCourses } }),
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
            let dreamCourses: number[] = [];

            for (const key in addedToList) {
                if (addedToList[key] === true) {
                    dreamCourses.push(Number(key));
                }
            }
            updateDreamCourses(dreamCourses)
        }
    }, [addedToList]);

    const toggleAddedToList = (courseId: number) => {
        initialMount.current = true;
        setAddedToList((prevState) => ({
            ...prevState,
            [courseId]: !prevState[courseId] || false,
        }));
    };

    const queryCourseRef = useRef(queryCourse);

    useEffect(() => {
        queryCourseRef.current = queryCourse;
    }, [queryCourse]);

    function resetQuery() {
        setIsCourseType(false);
        setIsUni(false);
        setIsIntake(false);
        setDesiredCourseType('');
        setDesiredUni(0);
        setDesiredIntake(0);
        setDesiredFaculty(0);
        setEligibleFaculties([]);
    }

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
        if (noOfCourses - 1 >= nextNum) {
            setPrevNum((c) => c + 10);
            setNextNum((c) => c + 10);
        }
        if (queryUni !== 0 || queryIntake !== 0) {
            searchCourses(desiredCourseType, queryUni, queryIntake, desiredFaculty);
        } else {
            searchCourses(desiredCourseType, desiredUni, desiredIntake, desiredFaculty);
        }
    }

    function decreaseMapCount() {
        setIsFetching(true);
        if (prevNum !== 0) {
            setPrevNum((c) => c - 10);
            setNextNum((c) => c - 10);
        }
        if (queryUni !== 0 || queryIntake !== 0) {
            searchCourses(desiredCourseType, queryUni, queryIntake, desiredFaculty);
        } else {
            searchCourses(desiredCourseType, desiredUni, desiredIntake, desiredFaculty);
        }
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

            let options = [];
            options.push(...data.data.universities.map((obj: EnglandUniversities) => ({ value: obj.id, label: obj.universityName })));
            setUkUnis(options);

            let obj: { [key: number]: string } = {};
            data.data.universities.forEach((uni: EnglandUniversities) => {
                obj[uni.id] = uni.universityCoursePage;
            });
            setObjLink(obj);
        } catch (error) {
            console.error('Error fetching unis:', error);
        }
    };

    const fetchIntakes = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/users/options/intake`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data: { intakes: Option[] } = await response.json();

            let options = [];
            options.push(...data.intakes.map(obj => ({ value: obj.id, label: obj.option })));
            setIntakes(options);

            let obj: { [key: number]: string } = {};
            data.intakes.forEach((intake) => {
                obj[intake.id] = intake.option;
            });
            setObjIntake(obj);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    useEffect(() => {
        fetchUkUnis();
        fetchIntakes();
    }, [])

    function goToIntake() {
        if (isDesiredUni === 'No') {
            setIsUni(true);
        } else {
            desiredUni !== 0 ? setIsUni(true) : alert('Please Select Your Desired University!')
        }
    }

    function prevCourse() {
        if (isDesiredIntake === 'No') {
            setIsIntake(true);
        } else {
            desiredIntake !== 0 ? setIsIntake(true) : alert('Please Select Your Desired Intake!')
        }
    }

    async function findFaculties() {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1200));
        if (desiredCourseType === 'Undergraduate') {
            const result = await fetch(`${BACKEND_URL}/users/openai/faculties`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    desiredCourseType,
                    firstSub,
                    secondSub,
                    thirdSub,
                    fourthSub
                }),
            });
            const data = await result.json();
            setEligibleFaculties(data.suggestedFaculties);
            setIsFetching(false);
        } else {
            const result = await fetch(`${BACKEND_URL}/users/openai/faculties`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    desiredCourseType,
                    prevDegree
                }),
            });
            const data = await result.json();
            setEligibleFaculties(data.suggestedFaculties);
            setIsFetching(false);
        }
    }

    async function searchCourses(chosenType: string, chosenUni: number, chosenIntake: number, chosnFcaulty: number) {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            await new Promise((e) => { setTimeout(e, 1500) })

            const queryParams = new URLSearchParams();
            if (queryCourseRef.current !== '') queryParams.append('search', queryCourseRef.current);
            if (chosenType !== 'all') queryParams.append('courseType', chosenType);
            if (chosenUni !== 0) queryParams.append('universityId', chosenUni.toString());
            if (chosenIntake !== 0) queryParams.append('intakes', chosenIntake.toString());
            if (chosnFcaulty !== 0) queryParams.append('facultyId', chosnFcaulty.toString());
            queryParams.append('skip', prevNumRef.current.toString());
            queryParams.append('limit', "10");

            const response = await fetch(`${BACKEND_URL}/users/courses?${queryParams.toString()}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const res = await response.json();
            setCourses(res.data.courses);
            setNoOfCourses(res.data.total);
            setIsFetching(false);
        } catch (error) {
            console.error('Error fetching resources:', error);
            setIsFetching(false);
        }
    }

    function setAndSearchCourses(idx: number) {
        setIsFetching(true);
        setDesiredFaculty(idx);
        searchCourses(desiredCourseType, desiredUni, desiredIntake, idx);
    }

    async function searchCourse() {
        setIsSearched(true);
        setIsFetching(true);
        setPrevNum(0);
        setNextNum(10);
        if (queryUni !== 0 || queryIntake !== 0) {
            searchCourses(desiredCourseType, queryUni, queryIntake, desiredFaculty);
        } else {
            searchCourses(desiredCourseType, desiredUni, desiredIntake, desiredFaculty);
        }
    }

    function resetCourses() {
        setQueryCourse('');
        setIsFetching(true);
        setPrevNum(0);
        setNextNum(10);
        setIsSearched(false);
        searchCourses(desiredCourseType, desiredUni, desiredIntake, desiredFaculty);
        setIsFiltered(false);
    }

    async function filterCourse() {
        setIsFetching(true);
        setPrevNum(0);
        setNextNum(10);
        setIsMore(false);
        setIsFiltered(true);
        searchCourses(desiredCourseType, queryUni, queryIntake, desiredFaculty);
        setQueryUni(0);
        setQueryIntake(0);
        setQueryCourse('');
        setIsSearched(false);
    }

    function resetFilter() {
        setIsFetching(true);
        setIsFiltered(false);
        setPrevNum(0);
        setNextNum(10);
        searchCourses(desiredCourseType, desiredUni, desiredIntake, desiredFaculty);
        setIsSearched(false);
        setQueryCourse('');
    }

    return (
        <>
            {/* Course Type */}
            {!isCourseType && <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-3 space-y-3 w-[800px] mx-auto p-6 bg-white rounded-2xl shadow-2xl"
            >
                <div className='w-full'>
                    <label className="block font-bold text-xl mb-1">
                        Select A Course Type Which You Are Looking For:
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
                            options={[{ value: 'Postgraduate', label: 'Postgraduate' }, { value: 'Undergraduate', label: 'Undergraduate' }]}
                            onChange={(value: StringDrop[]): void => { setDesiredCourseType(value[0].value) }}
                        />
                    </div>
                </div>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: desiredCourseType === '' ? 0.5 : 1 }}
                    disabled={desiredCourseType === ''}
                    onClick={() => setIsCourseType(true)}
                    className="w-full btn btn-primary font-bold flex justify-center items-center"
                >
                    <p>Next</p>
                    <ArrowBigRight />
                </motion.button>
            </motion.div>}

            {/* University */}
            {!isUni && isCourseType && <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-3 space-y-3 w-[800px] mx-auto p-6 bg-white rounded-2xl shadow-2xl"
            >
                <div className='grid grid-cols-1 gap-6'>
                    <div className='w-full'>
                        <label className="block font-bold text-xl mb-1">
                            Are You Searching Courses For Any Specific University?
                        </label>
                        <div className='border-2 border-black'>
                            <Select
                                className='bg-white text-black h-10 text-2xl'
                                name='university'
                                color='#8bb87b'
                                searchable={false}
                                placeholder='Select An Option'
                                closeOnClickInput
                                values={[]}
                                options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]}
                                onChange={(value: StringDrop[]): void => { setIsDesiredUni(value[0].value) }}
                            />
                        </div>
                    </div>

                    {isDesiredUni === 'Yes' && <div className='w-full'>
                        <label className="block font-bold text-xl mb-1">
                            Select An University In Which You Want To Apply:
                        </label>
                        <div className='border-2 border-black'>
                            <Select
                                className='bg-white text-black h-10 text-2xl'
                                name='university'
                                color='#8bb87b'
                                placeholder='Select University'
                                closeOnClickInput
                                values={[]}
                                options={ukUnis}
                                onChange={(value: NumDrop[]): void => { setDesiredUni(value[0].value) }}
                            />
                        </div>
                    </div>}
                </div>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isDesiredUni === '' ? 0.5 : 1 }}
                    disabled={isDesiredUni === ''}
                    onClick={() => { goToIntake(); setIsDesiredUni('') }}
                    className="w-full btn btn-primary font-bold flex justify-center items-center"
                >
                    <p>Next</p>
                    <ArrowBigRight />
                </motion.button>
            </motion.div>}

            {/* Intake */}
            {!isIntake && isUni && <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-3 space-y-3 w-[800px] mx-auto p-6 bg-white rounded-2xl shadow-2xl"
            >
                <div className='grid grid-cols-1 gap-6'>
                    <div className='w-full'>
                        <label className="block font-bold text-xl mb-1">
                            Are You Searching Courses For Any Specific Intake?
                        </label>
                        <div className='border-2 border-black'>
                            <Select
                                className='bg-white text-black h-10 text-2xl'
                                name='university'
                                color='#8bb87b'
                                searchable={false}
                                placeholder='Select An Option'
                                closeOnClickInput
                                values={[]}
                                options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]}
                                onChange={(value: StringDrop[]): void => { setIsDesiredIntake(value[0].value) }}
                            />
                        </div>
                    </div>

                    {isDesiredIntake === 'Yes' && <div className='w-full'>
                        <label className="block font-bold text-xl mb-1">
                            Select An Intake In Which You Want To Apply:
                        </label>
                        <div className='border-2 border-black'>
                            <Select
                                className='bg-white text-black h-10 text-2xl'
                                name='university'
                                color='#8bb87b'
                                placeholder='Select Intake'
                                closeOnClickInput
                                values={[]}
                                options={intakes}
                                onChange={(value: NumDrop[]): void => { setDesiredIntake(value[0].value) }}
                            />
                        </div>
                    </div>}
                </div>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isDesiredIntake === '' ? 0.5 : 1 }}
                    disabled={isDesiredIntake === ''}
                    onClick={() => { prevCourse(); setIsDesiredIntake('') }}
                    className="w-full btn btn-primary font-bold flex justify-center items-center"
                >
                    <p>Next</p>
                    <ArrowBigRight />
                </motion.button>
            </motion.div>}

            {/* Faculties For Undergraduate */}
            {desiredCourseType === 'Undergraduate' && isIntake && desiredFaculty === 0 && eligibleFaculties.length === 0 && <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-3 space-y-3 w-[800px] mx-auto p-6 bg-white rounded-2xl shadow-2xl"
            >
                <div className='grid grid-cols-2 gap-6'>
                    <h1 className='col-span-2 font-bold text-xl'>Enter Best Of 4 Subjects Of Yours In Class 12th:</h1>
                    <input
                        type="text"
                        id="acadMarks"
                        value={firstSub}
                        onChange={(e) => setFirstSub(e.target.value)}
                        placeholder="Enter 1st Best Subject"
                        className="p-2 h-10 border border-black text-xl w-full"
                    />

                    <input
                        type="text"
                        id="acadMarks"
                        value={secondSub}
                        onChange={(e) => setSecondSub(e.target.value)}
                        placeholder="Enter 2nd Best Subject"
                        className="p-2 h-10 border border-black text-xl w-full"
                    />

                    <input
                        type="text"
                        id="acadMarks"
                        value={thirdSub}
                        onChange={(e) => setThirdSub(e.target.value)}
                        placeholder="Enter 3rd Best Subject"
                        className="p-2 h-10 border border-black text-xl w-full"
                    />

                    <input
                        type="text"
                        id="acadMarks"
                        value={fourthSub}
                        onChange={(e) => setFourthSub(e.target.value)}
                        placeholder="Enter 4th Best Subject"
                        className="p-2 h-10 border border-black text-xl w-full"
                    />
                </div>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: firstSub === '' || secondSub === '' || thirdSub === '' || fourthSub === '' ? 0.5 : 1 }}
                    disabled={firstSub === '' || secondSub === '' || thirdSub === '' || fourthSub === ''}
                    onClick={findFaculties}
                    className="w-full btn btn-primary font-bold flex justify-center items-center"
                >
                    <SearchIcon className='mr-2' />
                    <p>Find Eligible Faculties</p>
                </motion.button>
            </motion.div>}

            {/* Faculties For Postgraduate */}
            {desiredCourseType === 'Postgraduate' && isIntake && desiredFaculty === 0 && eligibleFaculties.length === 0 && <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-3 space-y-3 w-[800px] mx-auto p-6 bg-white rounded-2xl shadow-2xl"
            >
                <div className="w-full">
                    <label className="block font-bold text-xl mb-2">
                        Enter Your Previously Completed Undergraduate Degree:
                    </label>
                    <input
                        type="text"
                        id="acadMarks"
                        value={prevDegree}
                        onChange={(e) => setPrevDegree(e.target.value)}
                        placeholder="Enter Degree Title"
                        className="p-2 h-10 border border-black text-xl w-full"
                    />
                </div>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: prevDegree === '' ? 0.5 : 1 }}
                    disabled={prevDegree === ''}
                    onClick={findFaculties}
                    className="w-full btn btn-primary font-bold flex justify-center items-center"
                >
                    <SearchIcon className='mr-2' />
                    <p>Find Eligible Faculties</p>
                </motion.button>
            </motion.div>}

            {isIntake && eligibleFaculties.length !== 0 && desiredFaculty === 0 && <div className='flex flex-col items-center'>
                <div className='p-2 bg-gray-200 rounded-2xl w-full'>
                    <h1 className='text-3xl font-bold text-center'>You Are Eligible To Apply In Below Faculties - Select One</h1>
                </div>

                <div className={`grid ${eligibleFaculties.length > 2 ? "grid-cols-3" : eligibleFaculties.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-5 mt-10`}>
                    {eligibleFaculties.map((faculty, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.2 }}
                            onClick={() => setAndSearchCourses(faculty.id)}
                            className="bg-green-200 font-bold rounded-xl p-2 text-xl text-center cursor-pointer shadow-lg hover:shadow-black transition-all duration-300"
                        >
                            <p>{faculty.faculty}</p>
                        </motion.div>
                    ))}
                </div>
            </div>}

            {isMore && desiredFaculty !== 0 && <div className="fixed h-screen w-[1200px] top-28 -ml-[50px] z-50">
                <div className='flex justify-center'>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className='w-[1000px] flex flex-col gap-5 p-5 mt-56 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white shadow-2xl shadow-black'
                    >
                        <div className='flex justify-end mr-2'>
                            <Cross onClick={() => setIsMore(false)} className='hover:text-black transition-text duration-300 fixed rotate-45 scale-150 cursor-pointer' />
                        </div>
                        <div className='grid grid-cols-4 gap-6 items-end'>
                            <div className='col-span-2 '>
                                <label className="block font-bold text-xl text-white mb-1">
                                    University:
                                </label>
                                <Select
                                    className='w-full bg-white text-black h-10 text-2xl'
                                    name='university'
                                    options={ukUnis}
                                    values={[]}
                                    onChange={(value: NumDrop[]): void => { setQueryUni(value[0].value) }}
                                    color='#8bb87b'
                                    placeholder='Select University'
                                    closeOnClickInput
                                />
                            </div>

                            <div>
                                <label htmlFor="downloadUrl" className="block font-bold text-xl text-white mb-1">
                                    Intake:
                                </label>
                                <Select
                                    className='w-full bg-white text-black h-10 text-2xl'
                                    name='intakes'
                                    options={intakes}
                                    values={[]}
                                    onChange={(value: NumDrop[]): void => { setQueryIntake(value[0].value) }}
                                    color='#8bb87b'
                                    placeholder='Select Intake(s)'
                                    closeOnClickInput
                                />
                            </div>
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={filterCourse}
                                className="w-52 flex justify-center items-center btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                            >
                                <Search className='mr-2' />
                                <p>Filter Course</p>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div >}

            {!isFetching && desiredFaculty !== 0 && <div className="w-[1100px] mx-auto -ml-2 mb-10">
                <div className='p-2 bg-gray-200 rounded-2xl w-full mb-8'>
                    <h1 className='text-3xl font-bold text-center'>You Can Apply For Following Courses</h1>
                </div>

                <div className='grid grid-cols-5 gap-6 items-center mb-5 p-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white'>
                    <div className="mb-4 col-span-3">
                        <label htmlFor="queryCourse" className="block font-bold text-xl text-white mb-1">
                            Course Name:
                        </label>
                        <input
                            type="text"
                            id="queryCourse"
                            value={queryCourse}
                            onChange={(e) => setQueryCourse(e.target.value)}
                            placeholder="Enter Course Name"
                            className="p-2 w-full border border-black text-black rounded-lg"
                        />
                    </div>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={isSearched ? resetCourses : searchCourse}
                        className="w-full flex justify-center items-center btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                    >
                        {isSearched ? <Cross className='mr-2 rotate-45' /> : <Search className='mr-2' />}
                        {isSearched ? <p>Reset</p> : <p>Search Course</p>}
                    </motion.button>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={isFiltered ? resetFilter : () => setIsMore(true)}
                        className="w-full flex justify-center items-center btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                    >
                        {isFiltered ? <Cross className='mr-2 rotate-45' /> : <FilterIcon className='mr-2' />}
                        {isFiltered ? <p>Reset Filter</p> : <p>More Filters</p>}
                    </motion.button>
                </div>

                {courses.length === 0 && <div className='mt-5 flex justify-center'>
                    <h1 className='text-2xl font-bold'>Sorry! There Are No Course That Matches Your Query.</h1>
                </div>}

                {courses.length !== 0 && <div className="grid grid-cols-1 gap-6 w-[1100px]">{courses.map((course, index) =>
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500"
                    >
                        <div className="flex items-start space-x-4 mb-5">
                            <div className="p-3 bg-green-200 rounded-lg">
                                <Book className="w-6 h-6 text-black" />
                            </div>
                            <div className="flex-1 mt-3">
                                <b className="font-bold text-xl mb-3">{index + prevNum + 1}. {course.courseName}</b>
                                <br /><br />
                                <p className="font-light text-xl mb-2">
                                    <b className="font-bold text-lg mb-3">University:</b> {course.universityName}
                                </p>
                                <div className='grid grid-cols-4'>
                                    <p className="font-light text-xl mb-2">
                                        <b className="font-bold text-lg mb-3">Course Type:</b> {course.courseType}
                                    </p>

                                    <p className="font-light text-xl mb-2">
                                        <b className="font-bold text-lg mb-3">Campus:</b> {course.campus}
                                    </p>

                                    <p className="font-light text-xl mb-2">
                                        <b className="font-bold text-lg mb-3">Course Duration:</b> {course.duration}
                                    </p>

                                    <p className="font-light text-xl mb-2">
                                        <b className="font-bold text-lg mb-3">Course Fees:</b> {course.fees}
                                    </p>
                                </div>
                                <div className='flex justify-start items-center'>
                                    <p className="font-light text-xl mb-2">
                                        <b className="font-bold text-lg mb-3">Intake(s):</b>
                                    </p>
                                    {course.intakes.map((intake, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-green-200 p-1 ml-1 mr-1 font-bold rounded-xl"
                                        >
                                            {objIntake[intake as number]}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-around items-center gap-3">
                            <a href={objLink[course.universityId]} target='blank' className='btn btn-primary w-full text-center'>Go To University Course Page</a>

                            <button
                                className={`btn btn-primary w-full flex justify-center items-center ${addedToList[course.id] ? 'bg-red-500 text-white' : ''}`}
                                onClick={() => toggleAddedToList(course.id)}
                            >
                                {!addedToList[course.id] ? <Cross className='mr-1 w-6' /> : <Cross className='mr-1 w-6 rotate-45' />}
                                {!addedToList[course.id] ? <p>Add To Dream List</p> : <p>Remove From Dream List</p>}
                            </button>
                        </div>
                    </motion.div>
                )}
                </div>}

                {noOfCourses > 10 && <div className="flex justify-center mt-10">
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
                        animate={{ opacity: nextNum >= noOfCourses ? 0.5 : 1 }}
                        disabled={nextNum >= noOfCourses}
                        onClick={() => increseMapCount()}
                        className="w-52 btn btn-primary ml-5 mr-5 flex justify-center items-center"
                    >
                        <p>Next Page</p>
                        <ArrowRightCircleIcon className='ml-1' />
                    </motion.button>
                </div>}

                <div className='mt-10 flex justify-center'>
                    <button onClick={resetQuery} className='w-[700px] btn btn-primary'>
                        Reset Query
                    </button>
                </div>
            </div>}

            {isFetching && <div className="fixed bg-opacity-50 bg-gray-100 h-screen w-screen top-0 left-0 z-50">
                <div className='flex justify-center'>
                    <LoaderComponent />
                </div>
            </div>}
        </>
    )
}

export default EligibleCourses