import { motion } from 'framer-motion';
import { Search, Cross, FilterIcon, Book, ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react';
import Select from 'react-dropdown-select';
import moment from 'moment';
import { EnglandUniversities } from './../../../utils/ukuniversities';
import { Dropdown } from './../../../utils/dropdown';
import { Option } from './../../../utils/options';
import { Course } from './../../../utils/courses'
import { useEffect, useState, useRef } from 'react';
import { BACKEND_URL } from './../../../config';
import LoaderComponent from '../../loader';

const CourseCentre: React.FC = () => {
    const [isFetching, setIsFetching] = useState(false);

    // Set Of Options
    const [uniOptions, setUniOption] = useState<Dropdown[]>([]);
    const [intakes, setIntakes] = useState<Dropdown[]>([]);
    const [facultiesOpt, setFacultiesOpt] = useState<Dropdown[]>([]);

    // Set Of Select Values
    const [selectedUni, setSelectedUni] = useState<Dropdown[]>([]);
    const [selectedIntakes, setSelectedIntakes] = useState<Dropdown[]>([]);
    const [selectedFaculties, setSelectedFaculties] = useState<Dropdown[]>([]);

    // Set Of Add Of Update Courses
    const [courseName, setCourseName] = useState('');
    const [courseType, setCourseType] = useState('all');
    const [campus, setCampus] = useState('');
    const [duration, setDuration] = useState('');
    const [fees, setFees] = useState(0);

    // Set Of Objects Of Options
    const [objIntake, setObjIntake] = useState<{ [key: number]: string }>({});
    const [objFaculty, setObjFaculty] = useState<{ [key: number]: string }>({});

    // Set Of Courses
    const [courses, setCourses] = useState<Course[]>([]);
    const [noOfCourses, setNoOfCourses] = useState(0);

    // For Search
    const [isSearched, setIsSearched] = useState(false);
    const [isFiltered, setIsFiltered] = useState(false);
    const [isMore, setIsMore] = useState(false);

    // Search Query Params
    const [queryCourse, setQueryCourse] = useState('');
    const [queryUni, setQueryUni] = useState(0);
    const [queryType, setQueryType] = useState('all');
    const [queryIntake, setQueryIntake] = useState(0);

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

    async function searchCourse() {
        setIsFetching(true);
        setIsSearched(true);
        setPrevNum(0);
        setNextNum(5);
        fetchCourses();
    }

    function resetCourses() {
        setQueryCourse('');
        setIsFetching(true);
        setPrevNum(0);
        setNextNum(5);
        setIsSearched(false);
        fetchCourses();
        setIsFiltered(false);
    }

    async function filterCourse() {
        setIsFetching(true);
        setPrevNum(0);
        setNextNum(5);
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
        setNextNum(5);
        fetchCourses();
        setIsSearched(false);
        setQueryCourse('');
    }

    function resetSearchFn() {
        setQueryCourse('');
        setIsSearched(false);
        setQueryUni(0);
        setQueryType('all');
        setQueryIntake(0);
        setIsFiltered(false);
    }

    // Miscellenous
    const [numberOfUpdatingCourse, setNumberOfUpdatingCourse] = useState(0);
    const [isCourseToUpdated, setIsCourseToUpdated] = useState(false);

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
        if (noOfCourses - 1 >= nextNum) {
            setPrevNum((c) => c + 5);
            setNextNum((c) => c + 5);
        }
        fetchCourses();
    }

    function decreaseMapCount() {
        setIsFetching(true);
        if (prevNum !== 0) {
            setPrevNum((c) => c - 5);
            setNextNum((c) => c - 5);
        }
        fetchCourses();
    }

    const fetchUnis = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/admin/finaluniversities`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const res = await response.json();
            const data = res.data;

            let options = [];
            options.push(...data.universities.map((obj : EnglandUniversities) => ({ value: obj.id, label: obj.universityName })));
            setUniOption(options);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    const fetchIntakes = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/admin/options/intake`, {
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

    const fetchFaculties = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/admin/options/faculty`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data: { faculties: Option[] } = await response.json();

            let options = [];
            options.push(...data.faculties.map(obj => ({ value: obj.id, label: obj.option })));
            setFacultiesOpt(options);

            let obj: { [key: number]: string } = {};
            data.faculties.forEach((faculty) => {
                obj[faculty.id] = faculty.option;
            });
            setObjFaculty(obj);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            await new Promise((e) => { setTimeout(e, 1200) })

            const queryParams = new URLSearchParams();
            queryParams.append('skip', prevNumRef.current.toString());
            queryParams.append('limit', nextNumRef.current.toString());
            
            if (queryCourseRef.current !== '') queryParams.append('search', queryCourseRef.current);
            if (queryUniRef.current !== 0) queryParams.append('universityId', queryUniRef.current.toString());
            if (queryTypeRef.current!== 'all') queryParams.append('courseType', queryTypeRef.current);
            if (queryIntakeRef.current !== 0) queryParams.append('intakes', queryIntakeRef.current.toString());

            const response = await fetch(`${BACKEND_URL}/admin/courses?${queryParams.toString()}`, {
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

    useEffect(() => {
        setIsFetching(true);
        fetchCourses();
        fetchUnis();
        fetchIntakes();
        fetchFaculties();
    }, []);

    // const fakeArray: Dropdown[] = [{value: 0, label: ''}]
    const resetForm = () => {
        setCourseName('');
        setSelectedUni([]);
        setCourseType('all');
        setCampus('');
        setDuration('');
        setFees(0);
        setSelectedIntakes([]);
        setSelectedFaculties([]);
        fetchCourses();
    }

    function createIntakes() {
        const idsOfIntakes = []
        idsOfIntakes.push(...selectedIntakes.map(intake => intake.value));
        return idsOfIntakes
    }

    function createFaculties() {
        const idsOfFaculties = []
        idsOfFaculties.push(...selectedFaculties.map(intake => intake.value));
        return idsOfFaculties
    }

    const inputSectionRef = useRef<HTMLDivElement | null>(null);
    const topSectionRef = useRef<HTMLDivElement | null>(null);

    const handleScrollToInputSection = () => {
        inputSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const handleScrollToTopSection = () => {
        topSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const goToUpadteCourse = async (idx: number) => {
        setNumberOfUpdatingCourse(idx);

        handleScrollToInputSection();

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/admin/courses/${idx}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data = await response.json();
            const courseToUpdate = data.course;

            setCourseName(`${courseToUpdate.courseName}`);

            setSelectedUni([{
                value: courseToUpdate.universityId,
                label: `${courseToUpdate.universityName}`,
            }]);

            setCourseType(`${courseToUpdate.courseType}`);

            setCampus(`${courseToUpdate.campus}`);

            setDuration(`${courseToUpdate.duration}`);

            setFees(courseToUpdate.fees)

            const allIntakes = courseToUpdate.intakes.map((intake: number) => ({
                value: intake,
                label: `${objIntake[intake]}`
            }));

            setSelectedIntakes(allIntakes);

            const allFaculties = courseToUpdate.faculties.map((faculty: number) => ({
                value: faculty,
                label: `${objFaculty[faculty]}`
            }));

            setSelectedFaculties(allFaculties);

            setIsCourseToUpdated(true);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    }

    const updateCourse = () => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        if (selectedUni && courseName && courseType !== "all" && campus && duration && fees && selectedIntakes && selectedFaculties) {
            const intakes = createIntakes();
            const faculties = createFaculties();
            const universityId = selectedUni[0].value;
            const universityName = selectedUni[0].label;

            fetch(`${BACKEND_URL}/admin/courses/update`, {
                method: "PUT",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: numberOfUpdatingCourse, universityId, courseName, courseType, universityName, campus, duration, fees, intakes, faculties }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        setIsFetching(false);
                        throw new Error("Failed to fetch data");
                    }
                    handleScrollToTopSection();
                    resetForm();
                    setIsCourseToUpdated(false);
                    resetSearchFn();
                })
                .catch((error) => console.error("Error fetching course:", error));
        } else {
            alert('Please fill in all fields before submitting.');
            setIsFetching(false);
            resetSearchFn();
            return
        }
    }

    function checkAndDecreaseMapCount(number: any, func: any) {
        const fractionalPart = number % 1;
        const targetFraction = 0.2;
        const precision = 1e-7;

        if (Math.abs(fractionalPart - targetFraction) < precision) {
            func();
        }
    }

    const deleteCourse = (idx: number) => {
        setIsFetching(true);
        const token = localStorage.getItem('token');
        const result = noOfCourses / 5;

        if (!token) {
            return;
        }

        fetch(`${BACKEND_URL}/admin/courses/delete`, {
            method: "DELETE",
            headers: {
                'token': `${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: idx }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    setIsFetching(false);
                    throw new Error("Failed to fetch data");
                }
                checkAndDecreaseMapCount(result, decreaseMapCount);
                resetForm();
                resetSearchFn();
            })
            .catch((error) => console.error("Error fetching course:", error));
    }

    const addCourse = () => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        // Add Course
        if (courseName && selectedUni && courseType !== "all" && campus && duration && fees && selectedIntakes && selectedFaculties) {
            const newId = moment().unix() + Math.floor((Math.random() * 100) + 1);
            const intakes = createIntakes();
            const faculties = createFaculties();
            const universityId = selectedUni[0].value;
            const universityName = selectedUni[0].label;

            fetch(`${BACKEND_URL}/admin/courses/add`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: newId, universityId, courseName, courseType, universityName, campus, duration, fees, intakes, faculties }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch data");
                    }
                    handleScrollToTopSection();
                    resetForm();
                    resetSearchFn();
                })
                .catch((error) => console.error("Error fetching courses:", error));
        } else {
            alert('Please fill in all fields before submitting.');
            setIsFetching(false);
            resetSearchFn();
            return
        }
    }

    return (
        <>
            {isFetching && <div className='fixed w-full h-full'>
                <div className='flex justify-center -mt-20 -ml-80'>
                    <LoaderComponent />
                </div>
            </div>}

            {isMore && <div className='fixed h-screen w-[1200px] top-28 -ml-5 z-50'>
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
                                    className='w-full bg-white text-black h-10 text-lg'
                                    name='university'
                                    options={uniOptions}
                                    values={[]}
                                    onChange={(value: Dropdown[]): void => { setQueryUni(value[0].value) }}
                                    color='#8bb87b'
                                    placeholder='Select University'
                                    closeOnClickInput
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block font-bold text-xl text-white mb-1">
                                    Course Type:
                                </label>
                                <select
                                    id="difficulty"
                                    value={queryType}
                                    onChange={e => setQueryType(e.target.value)}
                                    className="w-full border border-black text-black rounded-lg h-10"
                                >
                                    <option value="all">All Types</option>
                                    <option value="Postgraduate">Postgraduate</option>
                                    <option value="Undergraduate">Undergraduate</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="downloadUrl" className="block font-bold text-xl text-white mb-1">
                                    Intake:
                                </label>
                                <Select
                                    className='w-full bg-white text-black h-10 text-lg'
                                    name='intakes'
                                    options={intakes}
                                    values={[]}
                                    onChange={(value: Dropdown[]): void => { setQueryIntake(value[0].value) }}
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

            {!isFetching && <div className="max-w-7xl mx-auto p-6 -mt-6">
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
                <div className="grid grid-cols-1 gap-6 w-[1100px]">
                    {courses.map((course, index) =>
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500"
                        >
                            <div ref={topSectionRef} className="flex items-start space-x-4 mb-5">
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
                                            <b className="font-bold text-lg mb-3">Course Fee:</b> {course.fees}
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
                                    <div className='flex justify-start items-center'>
                                        <p className="font-light text-xl mb-2">
                                            <b className="font-bold text-lg mb-3">Faculty(s):</b>
                                        </p>
                                        {course.faculties.map((faculty, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-green-200 p-1 ml-1 mr-1 font-bold rounded-xl"
                                            >
                                                {objFaculty[faculty as number]}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => goToUpadteCourse(course.id)}
                                    className="w-full btn btn-primary"
                                >
                                    Update Course
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => deleteCourse(course.id)}
                                    className="w-full btn btn-primary"
                                >
                                    Delete Course
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {noOfCourses > 5 && <div className="flex justify-center mt-5">
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

                <div ref={inputSectionRef} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 mt-5 text-white w-[1100px]">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Course Name:
                            </label>
                            <input
                                type="text"
                                id="courseName"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                placeholder="Enter Course Name"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="type" className="block font-bold text-xl text-white mb-1">
                                University:
                            </label>
                            <Select
                                className='w-full bg-white text-black h-10 text-lg'
                                name='university'
                                options={uniOptions}
                                values={selectedUni}
                                onChange={(value: Dropdown[]): void => { setSelectedUni(value) }}
                                color='#8bb87b'
                                placeholder='Select University'
                                closeOnClickInput
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="category" className="block font-bold text-xl text-white mb-1">
                                Course Type:
                            </label>
                            <select
                                id="difficulty"
                                value={courseType}
                                onChange={e => setCourseType(e.target.value)}
                                className="w-full border border-black text-black rounded-lg h-10"
                            >
                                <option value="all">All Types</option>
                                <option value="Postgraduate">Postgraduate</option>
                                <option value="Undergraduate">Undergraduate</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Campus:
                            </label>
                            <input
                                type="text"
                                id="campus"
                                value={campus}
                                onChange={(e) => setCampus(e.target.value)}
                                placeholder="Enter Campus Address"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Duration:
                            </label>
                            <input
                                type="text"
                                id="duration"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder="Enter Course Duration"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Fees:
                            </label>
                            <input
                                type="number"
                                id="fees"
                                value={fees}
                                onChange={(e) => setFees(Number(e.target.value))}
                                placeholder="Enter Course Name"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="downloadUrl" className="block font-bold text-xl text-white mb-1">
                                Intake(s):
                            </label>
                            <Select
                                className='w-full bg-white text-black h-10 text-lg'
                                name='intakes'
                                options={intakes}
                                values={selectedIntakes}
                                onChange={(value: Dropdown[]): void => { setSelectedIntakes(value) }}
                                multi
                                color='#8bb87b'
                                placeholder='Select Intake(s)'
                                closeOnClickInput
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="downloadUrl" className="block font-bold text-xl text-white mb-1">
                                Faculty(s):
                            </label>
                            <Select
                                className='w-full bg-white text-black h-10 text-lg'
                                name='facultes'
                                options={facultiesOpt}
                                values={selectedFaculties}
                                onChange={(value: Dropdown[]): void => { setSelectedFaculties(value) }}
                                multi
                                color='#8bb87b'
                                placeholder='Select Faculty(s)'
                                closeOnClickInput
                            />
                        </div>
                    </div>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={isCourseToUpdated ? updateCourse : addCourse}
                        className="w-full btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                    >
                        {isCourseToUpdated ? "Update Course" : "Add Course"}
                    </motion.button>
                </div>
            </div>}
        </>
    )
}

export default CourseCentre