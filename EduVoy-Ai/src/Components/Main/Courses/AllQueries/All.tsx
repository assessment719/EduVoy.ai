import { motion } from 'framer-motion';
import { Search, Cross, FilterIcon, Book, ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react';
import Select from 'react-dropdown-select';
import { useEffect, useState, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { NumDrop } from '../../../../Utils/numDrop';
import { StringDrop } from '../../../../Utils/stringDrop';
import { Course } from "../../../../Utils/courses";
import { Option } from '../../../../Utils/options';
import { EnglandUniversities } from '../../../../Utils/ukUniversities';
import { BACKEND_URL } from './../../../../config';
import LoaderComponent from './../../../loader';
import { dreamCourseAtom, userDetailsAtom } from './../../../../Atoms/atoms';


const AllCourses: React.FC = () => {
    const [isFetching, setIsFetching] = useState(false);

    // Set Of Options
    const [uniOptions, setUniOption] = useState<NumDrop[]>([]);
    const [intakes, setIntakes] = useState<NumDrop[]>([]);

    // Set Of Courses
    const [courses, setCourses] = useState<Course[]>([]);
    const [noOfCourses, setNoOfCourses] = useState(0);

    // Set Of Objects Of Options
    const [objIntake, setObjIntake] = useState<{ [key: number]: string }>({});
    const [objLink, setObjLink] = useState<{ [key: number]: string }>({});

    // Search Query Params
    const [queryCourse, setQueryCourse] = useState('');
    const [queryUni, setQueryUni] = useState(0);
    const [queryType, setQueryType] = useState('all');
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

        fetch(`${BACKEND_URL}/users/dreamCourses`, {
            method: "PUT",
            headers: {
                'token': `${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: userDetails.id, dreamCourses: dreamCourses }),
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

    const queryUniRef = useRef(queryUni);

    useEffect(() => {
        queryUniRef.current = queryUni;
    }, [queryUni]);

    const queryTypeRef = useRef(queryType);

    useEffect(() => {
        queryTypeRef.current = queryType;
    }, [queryType]);

    const queryIntakeRef = useRef(queryIntake);

    useEffect(() => {
        queryIntakeRef.current = queryIntake;
    }, [queryIntake]);

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
        if (noOfCourses - 1 >= nextNumRef.current) {
            setPrevNum((c) => c + 10);
            setNextNum((c) => c + 10);
        }
        fetchCourses();
    }

    function decreaseMapCount() {
        setIsFetching(true);
        if (prevNumRef.current !== 0) {
            setPrevNum((c) => c - 10);
            setNextNum((c) => c - 10);
        }
        fetchCourses();
    }

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            await new Promise((e) => { setTimeout(e, 1200) })

            const queryParams = new URLSearchParams();
            if (queryCourseRef.current !== '') queryParams.append('search', queryCourseRef.current);
            if (queryUniRef.current !== 0) queryParams.append('universityId', queryUniRef.current.toString());
            if (queryTypeRef.current !== 'all') queryParams.append('courseType', queryTypeRef.current);
            if (queryIntakeRef.current !== 0) queryParams.append('intakes', queryIntakeRef.current.toString());
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
            setUniOption(options);

            let obj: { [key: number]: string } = {};
            data.data.universities.forEach((uni: EnglandUniversities) => {
                obj[uni.id] = uni.universityCoursePage;
            });
            setObjLink(obj);
        } catch (error) {
            console.error('Error fetching unis:', error);
        }
    };

    useEffect(() => {
        setIsFetching(true);
        fetchCourses();
        fetchIntakes();
        fetchUkUnis();
    }, [])

    async function searchCourse() {
        setIsSearched(true);
        setIsFetching(true);
        setPrevNum(0);
        setNextNum(10);
        fetchCourses();
    }

    async function resetCourses() {
        setQueryCourse('');
        setIsFetching(true);
        setPrevNum(0);
        setNextNum(10);
        setIsSearched(false);
        fetchCourses();
        setIsFiltered(false);
    }

    async function filterCourse() {
        setIsFetching(true);
        setPrevNum(0);
        setNextNum(10);
        setIsMore(false);
        setIsFiltered(true);
        fetchCourses();
        setIsSearched(false);
        setQueryCourse('');
    }

    function resetFilter() {
        setQueryUni(0);
        setQueryType('all');
        setQueryIntake(0);
        setIsFetching(true);
        setIsFiltered(false);
        setPrevNum(0);
        setNextNum(10);
        fetchCourses();
        setIsSearched(false);
        setQueryCourse('');
    }

    return (
        <>
            {isFetching && <div className='fixed h-screen w-[1200px] top-28 -ml-[600px]'>
                <div className='flex justify-center'>
                    <LoaderComponent />
                </div>
            </div>}

            {isMore && <div className="fixed h-screen w-[1200px] top-28 -ml-[50px] z-50">
                <div className='flex justify-center'>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className='w-[1000px] flex flex-col gap-5 p-5 mt-52 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white shadow-2xl shadow-black'
                    >
                        <div className='flex justify-end mr-2'>
                            <Cross onClick={() => setIsMore(false)} className='hover:text-black transition-text duration-300 fixed rotate-45 scale-150 cursor-pointer' />
                        </div>
                        <div className='grid grid-cols-4 gap-6'>
                            <div className='col-span-2 '>
                                <label htmlFor="type" className="block font-bold text-xl text-white mb-1">
                                    University:
                                </label>
                                <Select
                                    className='w-full bg-white text-black h-10 text-2xl'
                                    name='university'
                                    options={uniOptions}
                                    values={[]}
                                    onChange={(value: NumDrop[]): void => { setQueryUni(value[0].value) }}
                                    color='#8bb87b'
                                    placeholder='Select University'
                                    closeOnClickInput
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block font-bold text-xl text-white mb-1">
                                    Course Type:
                                </label>
                                <Select
                                    className='bg-white text-black h-10 text-2xl'
                                    name='university'
                                    color='#8bb87b'
                                    searchable={false}
                                    placeholder='Select Course Type'
                                    closeOnClickInput
                                    values={[]}
                                    options={[{ value: 'Postgraduate', label: 'Postgraduate' }, { value: 'Undergraduate', label: 'Undergraduate' }]}
                                    onChange={(value: StringDrop[]): void => { setQueryType(value[0].value) }}
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
                        </div>
                        <div className='flex justify-end'>
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

            {!isFetching && <div className="w-[1100px] mx-auto -ml-2 mb-10">
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

                {isSearched && courses.length === 0 && <div className='mt-5 flex justify-center'>
                    <h1 className='text-2xl font-bold'>Sorry! There Are No Course That Matches Your Query.</h1>
                </div>}

                {isFiltered && courses.length === 0 && <div className='mt-5 flex justify-center'>
                    <h1 className='text-2xl font-bold'>Sorry! There Are No Course That Matches Your Query.</h1>
                </div>}

                {courses.length !== 0 && <div className="grid grid-cols-1 gap-6 w-[1100px]">
                    {courses.map((course, index) =>
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500 w-[1100px] gap-3"
                        >
                            <div className="flex items-start space-x-4 mb-5">
                                <div className="p-3 bg-green-200 rounded-lg">
                                    <Book className="w-6 h-6 text-black" />
                                </div>
                                <div className="flex-1 mt-3">
                                    <b className="font-bold text-xl mb-3">{course.courseName}</b>
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
            </div>}
        </>
    )
}

export default AllCourses