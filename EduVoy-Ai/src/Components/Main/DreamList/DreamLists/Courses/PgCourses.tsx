import { motion } from 'framer-motion';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, Cross, Book } from 'lucide-react';
import { BACKEND_URL } from '../../../../../config';
import { useState, useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { activeTabAtom, userDetailsAtom, dreamCourseAtom } from '../../../../../Atoms/atoms';
import { Course } from './../../../../../Utils/courses';
import { Option } from './../../../../../Utils/options';
import LoaderComponent from '../../../../loader';
import { CompCourseResult } from './../../../../../Utils/compResult';

const DreamPgCourses = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const userDetails = useRecoilValue(userDetailsAtom);
    const setActiveTab = useSetRecoilState(activeTabAtom);
    const [courses, setCourses] = useState<Course[]>([]);
    const [noOfCourses, setNoOfCourses] = useState(0);
    const [compareCourse, setCompareCourse] = useState<{ [key: number]: boolean }>({});
    const [compareAbleCourse, setCompareAbleCourse] = useState<Number[]>([]);
    const [comparisionResult, setComparisionResult] = useState<CompCourseResult[]>([]);
    const [isManResultOut, setIsManResultOut] = useState(false);
    const [winner, setWinner] = useState(0);

    // Set Of Objects Of Options
    const [objIntake, setObjIntake] = useState<{ [key: number]: string }>({});

    // For Dream List
    const setAddedToList = useSetRecoilState(dreamCourseAtom);
    const addedToList = useRecoilValue(dreamCourseAtom);
    const initialMount = useRef(false);

    const updateDreamCourses = async (dreamCourses: number[]) => {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        await fetch(`${BACKEND_URL}/users/dreamCourses`, {
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

        fetchCourses();
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
        setIsFetching(true);
        initialMount.current = true;
        setAddedToList((prevState) => ({
            ...prevState,
            [courseId]: !prevState[courseId] || false,
        }));
        if (Object.keys(compareCourse).includes(`${courseId}`)) {
            toggleAddedToCompareList(courseId);
        }
    };

    //For Prev And Next Button
    const [prevNum, setPrevNum] = useState(0);
    const [nextNum, setNextNum] = useState(10);

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
        fetchCourses();
    }

    function decreaseMapCount() {
        setIsFetching(true);
        if (prevNum !== 0) {
            setPrevNum((c) => c - 10);
            setNextNum((c) => c - 10);
        }
        fetchCourses();
    }

    useEffect(() => {
        let courses: number[] = [];

        for (const key in addedToList) {
            if (compareCourse[key] === true) {
                courses.push(Number(key));
            }
        }
        if (courses.length === 2 && compareAbleCourse[0] === courses[1]) {
            courses = [courses[1], courses[0]];
        }
        setCompareAbleCourse(courses)
    }, [compareCourse])

    const toggleAddedToCompareList = (courseId: number) => {
        setCompareCourse((prevState) => ({
            ...prevState,
            [courseId]: !prevState[courseId] || false,
        }));
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

            let obj: { [key: number]: string } = {};
            data.intakes.forEach((intake) => {
                obj[intake.id] = intake.option;
            });
            setObjIntake(obj);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }

            const queryParams = new URLSearchParams();
            queryParams.append('userId', userDetails.id.toString());
            queryParams.append('courseType', "Postgraduate");
            queryParams.append('skip', prevNumRef.current.toString());
            queryParams.append('limit', "10");

            const response = await fetch(`${BACKEND_URL}/users/courses/dreamCourses?${queryParams.toString()}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const res = await response.json();
            setCourses(res.data.courses);
            setNoOfCourses(res.data.total);

            const filteredCompareAbleCourses = compareAbleCourse.filter(courseId =>
                res.data.courses.some((course: Course) => course.id === courseId)
            );
            setCompareAbleCourse(filteredCompareAbleCourses);

            await new Promise((e) => { setTimeout(e, 1000) })
            setIsFetching(false);
        } catch (error) {
            console.error('Error fetching unis:', error);
        }
    };

    useEffect(() => {
        setIsFetching(true);
        fetchIntakes();
        fetchCourses();
    }, [])

    async function compareCourses() {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }
        const result = await fetch(`${BACKEND_URL}/users/openai/manual/course?courseId1=${compareAbleCourse[0]}&courseId2=${compareAbleCourse[1]}`, {
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
        data.finalComparisionResult.forEach((item: any) => {
            if (item.course1.result === "Perfect") perfectCountUni1++;
            if (item.course2.result === "Perfect") perfectCountUni2++;
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
                        <h1 className='col-span-5'>Perfect Course - <i className='text-3xl underline underline-offset-8'>{courses.find(course => course.id === compareAbleCourse[winner])?.courseName}</i></h1>

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
                        <h1 className='text-2xl font-bold p-2 text-center mr-4'>{courses.find(course => course.id === compareAbleCourse[0])?.courseName}</h1>
                        <h1 className='text-2xl font-bold p-2 text-center mr-4'>{courses.find(course => course.id === compareAbleCourse[1])?.courseName}</h1>
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
                                    <h1 className={`break-words text-lg rounded-lg ${result.course1.result === "Perfect" ? "bg-green-100" : "bg-red-100"} h-full p-2 text-center`}>{result.course1.value}</h1>
                                    <h1 className={`break-words text-lg rounded-lg ${result.course2.result === "Perfect" ? "bg-green-100" : "bg-red-100"} h-full p-2 text-center`}>{result.course2.value}</h1>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>}

            {!isFetching && <div className='flex flex-col items-center gap-6 mb-10'>

                <div className='grid grid-cols-3 gap-3 justify-around items-center mb-5 p-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white w-[950px]'>
                    <div className='bg-white text-center text-2xl font-bold text-black p-3 rounded-xl'>{courses.find(course => course.id === compareAbleCourse[0])?.courseName || "Add First Course"}</div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: compareAbleCourse.length !== 2 ? 0.5 : 1 }}
                        onClick={compareCourses}
                        className="w-full flex justify-center items-center btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                    >
                        Compare Courses
                    </motion.button>

                    <div className='bg-white text-center text-2xl font-bold text-black p-3 rounded-xl'>{courses.find(course => course.id === compareAbleCourse[1])?.courseName || "Add Second Course"}</div>
                </div>

                {courses.length === 0 && <div className='mt-5 flex items-center flex-col gap-5'>
                    <h1 className='text-2xl font-bold'>Sorry! There Are No Dream Course To Show</h1>
                    <h1 className='text-2xl font-bold'>Go To <button onClick={() => setActiveTab('course')} className='btn btn-primary text-2xl'>Find Courses</button> To Add Your Dream Course</h1>
                </div>}

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
                            <button
                                className={`btn btn-primary w-full flex justify-center items-center ${addedToList[course.id] ? 'bg-red-500 text-white' : ''}`}
                                onClick={() => toggleAddedToList(course.id)}
                            >
                                <Cross className='mr-1 w-6 rotate-45' />
                                <p>Remove From Dream List</p>
                            </button>

                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: compareAbleCourse.length === 2 && !compareAbleCourse.includes(course.id) ? 0.5 : 1 }}
                                disabled={compareAbleCourse.length === 2 && !compareAbleCourse.includes(course.id)}
                                onClick={() => toggleAddedToCompareList(course.id)}
                                className={`btn btn-primary w-full flex justify-center items-center ${compareCourse[course.id] ? 'bg-blue-500 text-white' : ''}`}
                            >
                                {!compareCourse[course.id] ? <Cross className='mr-1 w-6' /> : <Cross className='mr-1 w-6 rotate-45' />}
                                {!compareCourse[course.id] ? <p>Add To Compare List</p> : <p>Remove From Compare List</p>}
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {noOfCourses > 10 && <div className="flex justify-center mt-5">
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

            {isFetching && <div className='fixed h-screen w-[1200px] top-40 -ml-[600px]'>
                <div className='flex justify-center'>
                    <LoaderComponent />
                </div>
            </div>}
        </>
    )
}

export default DreamPgCourses