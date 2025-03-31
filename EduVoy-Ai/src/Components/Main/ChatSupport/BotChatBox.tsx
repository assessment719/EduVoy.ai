import { motion } from 'framer-motion';
import Select from 'react-dropdown-select';
import { useState, useEffect, useRef } from 'react';
import { CurrentMessages } from './../../../Utils/currentMessages';
import { chatBoxStateAtom } from './../../../Atoms/atoms';
import { AnyDrop } from './../../../Utils/anyDrop';
import { PgUnis } from '../../../Utils/pgunis';
import { useSetRecoilState } from 'recoil';
import { BACKEND_URL } from '../../../config'
import { Truck } from 'lucide-react';

function BotChat() {
    const [step, setStep] = useState(0);
    const [isAssessment, setIsAssessment] = useState(true);
    const [isOverflow, setIsOverflow] = useState(true);
    const [isInputOpen, setIsInputOpen] = useState(false);
    const [isTextInputOpen, setIsTextInputOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedLabel, setSelectedLabel] = useState('');
    const [fakeRender, setFakeRender] = useState(false);
    const [options, setOptions] = useState([{ value: 'Yes, I want to find Universities and Courses', label: 'Yes' }, { value: 'No, I want to talk to EduVoy.ai', label: 'No' }])
    const [isTyping, setIsTyping] = useState(false);
    const [message, setMessage] = useState('');
    const [currentMessages, setCurrentMessages] = useState<CurrentMessages[]>([{ role: "bot", message: "Hello! I am EduVoy.ai, an AI Powered study abroad advisor." }, { role: "bot", message: "Do you want to find universities and course as per qualification?" }]);
    const setChatBoxState = useSetRecoilState(chatBoxStateAtom);

    //Eligible Universities
    const [universities, setUniversities] = useState<PgUnis[]>([]);

    //Datas For Finding Universities
    const [courseType, setCourseType] = useState('');
    const [instituteId, setInstituteId] = useState('');
    const [academicMarks, setAcademicMarks] = useState('');
    const [requireWaiver, setRequireWaiver] = useState('');
    const [boardId, setBoardId] = useState('');
    const [waiverMarks, setWaiverMarks] = useState('');
    const [eltTest, setEltTest] = useState('');
    const [overall, setOverall] = useState('');
    const [listning, setListning] = useState('');
    const [reading, setReading] = useState('');
    const [writing, setWritting] = useState('');
    const [speaking, setSpeaking] = useState('');
    const [moiUniId, setMoiUniId] = useState('');
    const [mathBoardId, setMathBoardId] = useState('');
    const [mathMarks, setMathMarks] = useState('');

    //Datas For Finding Courses
    const [courseUni, setCourseUni] = useState('');
    const [prevDegree, setPrevDegree] = useState('');
    const [firstSub, setFirstSub] = useState('');
    const [secondSub, setSecondSub] = useState('');
    const [thirdSub, setThirdSub] = useState('');
    const [fourthSub, setFourthSub] = useState('');
    const [desiredIntake, setDesiredIntake] = useState('');
    const [faculty, setFaculty] = useState('');

    //Common Functions
    function createUserMessage(sms: string) {
        setCurrentMessages(msg => [
            ...msg,
            { role: "user", message: sms }
        ]);
    }

    function repetativeFunc(sms: string) {
        setIsTyping(true);
        setFakeRender(true);
        setSelectedValue('');
        setTimeout(() => {
            setFakeRender(false);
        }, 0)
        setTimeout(() => {
            setIsTyping(false);
            setCurrentMessages(msg => [
                ...msg,
                { role: "bot", message: sms }
            ]);
        }, 2000)
    }

    function resetAll() {
        setStep(0);
        setOptions([{ value: 'Yes, I want to find Universities and Courses', label: 'Yes' }, { value: 'No, I want to talk to EduVoy.ai', label: 'No' }]);
        
        // Reset university finding data
        setCourseType('');
        setInstituteId('');
        setAcademicMarks('');
        setRequireWaiver('');
        setBoardId('');
        setWaiverMarks('');
        setEltTest('');
        setOverall('');
        setListning('');
        setReading('');
        setWritting('');
        setSpeaking('');
        setMoiUniId('');
        setMathBoardId('');
        setMathMarks('');
        
        // Reset course finding data
        setCourseUni('');
        setPrevDegree('');
        setFirstSub('');
        setSecondSub('');
        setThirdSub('');
        setFourthSub('');
        setDesiredIntake('');
        setFaculty('');
    }

    const facultyRef = useRef(faculty);

    useEffect(() => {
        facultyRef.current = faculty;
    }, [faculty]);

    const ieltsMarksArr = [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0];

    const ieltsMarksArrOptions = ieltsMarksArr.map(mark => ({ value: mark.toFixed(1), label: mark.toFixed(1) }));

    //Api Calls For Option
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
            const data: { universities: any[] } = await response.json();

            let options = [];
            options.push(...data.universities.map(obj => ({ value: obj.id, label: obj.option })));
            options.push({ value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' })
            setOptions(options);
        } catch (error) {
            console.error('Error fetching resources:', error);
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
            const data: { boards: any[] } = await response.json();

            let options = [];
            options.push(...data.boards.map(obj => ({ value: obj.id, label: obj.option })));
            setOptions(options);
            options.push({ value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' })
        } catch (error) {
            console.error('Error fetching resources:', error);
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
            const data: { moiunis: any[] } = await response.json();

            let options = [];
            options.push(...data.moiunis.map(obj => ({ value: obj.id, label: obj.option })));
            setOptions(options);
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
            const response = await fetch(`${BACKEND_URL}/users/options/intake`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data: { intakes: any[] } = await response.json();

            let options = [];
            options.push(...data.intakes.map(obj => ({ value: obj.id, label: obj.option })));
            setOptions(options);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    const fetchUniversities = async () => {
        setIsTyping(true);
        setFakeRender(true);
        setSelectedValue('');
        setTimeout(() => {
            setFakeRender(false);
        }, 0)
        if (isAssessment && courseType !== '') {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    return;
                }

                await new Promise((resolve) => setTimeout(resolve, 2000));
                const queryParams = new URLSearchParams();
                if (instituteId !== '') queryParams.append('instituteId', instituteId);
                if (academicMarks !== '') queryParams.append('academicMarks', academicMarks);
                if (boardId !== '') queryParams.append('boardId', boardId);
                if (waiverMarks !== '') queryParams.append('waiverMarks', waiverMarks);
                if (eltTest !== '') queryParams.append('eltTest', eltTest);
                if (overall !== '') queryParams.append('overall', overall);
                if (listning !== '') queryParams.append('listning', listning);
                if (reading !== '') queryParams.append('reading', reading);
                if (writing !== '') queryParams.append('writing', writing);
                if (speaking !== '') queryParams.append('speaking', speaking);
                if (moiUniId !== '') queryParams.append('moiUniId', moiUniId);
                if (mathBoardId !== '') queryParams.append('mathBoardId', mathBoardId);
                if (mathMarks !== '') queryParams.append('mathMarks', mathMarks);

                const response = await fetch(`${BACKEND_URL}/users/universities/${courseType.toLowerCase()}/assessment/?${queryParams.toString()}`, {
                    method: "GET",
                    headers: {
                        'token': `${token}`
                    },
                });

                const data: { data: { result: string, universityIds: PgUnis[] } } = await response.json();
                setIsTyping(false);

                setCurrentMessages(msg => [
                    ...msg,
                    { role: "bot", message: data.data.result }
                ]);
                if (data.data.universityIds.length !== 0) {
                    repetativeFunc("Do you want to find eligible courses?");
                    setOptions([{ value: 'Yes, I want to find eligible courses.', label: 'Yes' }, { value: 'No, I want to talk to EduVoy.ai', label: 'No' }]);
                } else {
                    setOptions([{ value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }]);
                }

                setUniversities(data.data.universityIds)

                await new Promise((e) => { setTimeout(e, 2000) })
            } catch (error) {
                setCurrentMessages(msg => [
                    ...msg,
                    { role: "bot", message: "Sorry! There is an issue while assessing you profile." }
                ]);
                setOptions([{ value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }]);
                setIsTyping(false);
            }
        } else {
            alert('Please fill all the required fields. Thank you!');
            return
        }
    }

    const findFaculties = async () => {
        setFakeRender(true);
        setSelectedValue('');
        setTimeout(() => {
            setFakeRender(false);
        }, 0)
        let facultyNames: string[] = []
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1200));
        if (courseType === 'Undergraduate') {
            const result = await fetch(`${BACKEND_URL}/users/openai/faculties`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    desiredCourseType: courseType,
                    firstSub,
                    secondSub,
                    thirdSub,
                    fourthSub
                }),
            });
            const data = await result.json();
            setIsTyping(false);

            facultyNames.push(...data.suggestedFaculties.map((obj: { id: any; faculty: any; }) => (obj.faculty)));
            repetativeFunc(facultyNames.length === 0 ? "Sorry you are not eligible for any faculties." : facultyNames.length === 1 ? `You are elligible to apply for this faculty ${facultyNames[0]}. Select from the options.` : `You are elligible to apply for these faculties ${facultyNames.join(", ")}. Select one faculty from the options.`)

            if (data.suggestedFaculties.length === 0) {
                setOptions([{ value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }]);
            } else {
                let options = [];
                options.push(...data.suggestedFaculties.map((obj: { id: any; faculty: any; }) => ({ value: obj.id, label: obj.faculty })));
                setOptions(options);
            }
        } else {
            const result = await fetch(`${BACKEND_URL}/users/openai/faculties`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    desiredCourseType: courseType,
                    prevDegree
                }),
            });
            const data = await result.json();
            setIsTyping(false);

            facultyNames.push(...data.suggestedFaculties.map((obj: { id: any; faculty: any; }) => (obj.faculty)));
            repetativeFunc(facultyNames.length === 0 ? "Sorry you are not eligible for any faculties." : facultyNames.length === 1 ? `You are elligible to apply for this faculty ${facultyNames[0]}. Select from the options.` : `You are elligible to apply for these faculties ${facultyNames.join(", ")}. Select one faculty from the options.`)

            if (data.suggestedFaculties.length === 0) {
                setOptions([{ value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }]);
            } else {
                let options = [];
                options.push(...data.suggestedFaculties.map((obj: { id: any; faculty: any; }) => ({ value: obj.id, label: obj.faculty })));
                setOptions(options);
            }
        }
    }

    async function searchCourses() {
        let uniIds: string[] = []
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            await new Promise((e) => { setTimeout(e, 1500) })

            const queryParams = new URLSearchParams();
            if (courseType !== '') queryParams.append('courseType', courseType);
            if (desiredIntake !== '') queryParams.append('intakes', desiredIntake);
            if (courseUni !== 'I want to find courses from all the eligible universities.') queryParams.append('universityId', courseUni);
            if (facultyRef.current !== '') queryParams.append('facultyId', facultyRef.current);

            if (courseUni === "I want to find courses from all the eligible universities.") {
                uniIds.push(...universities.map(obj => (obj.universityId.toString())));
                queryParams.append('universityIds', uniIds.join(", "));
            }

            const response = await fetch(`${BACKEND_URL}/users/courses/assessment?${queryParams.toString()}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const res = await response.json();

            setIsTyping(false);

            setCurrentMessages(msg => [
                ...msg,
                { role: "bot", message: res.result }
            ]);
            
            repetativeFunc("Do you want to assess another profile?")

            setOptions([{ value: 'Yes, I want to assess another profile', label: 'Yes' }, { value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }])
        } catch (error) {
            setIsTyping(false);

            setCurrentMessages(msg => [
                ...msg,
                { role: "bot", message: "Sorry! We are facing some issue. Please Try Again" }
            ]);

            setOptions([{ value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }])
        }
    }

    // API - 1 : For Universities or Boards
    function fetchUnisOrBoards() {
        if (selectedLabel === "Postgraduate") {
            fetchUnis();
        } else if (selectedLabel === "Undergraduate") {
            fetchBoards();
        }
    }

    async function sendAssesmentMsg() {
        if (selectedValue === "No, I want to talk to EduVoy.ai") {
            //Don't Want To Do Assessment
            createUserMessage(selectedValue);
            repetativeFunc("How can i help you? I am here to answer your Study Abroad querries.");
            setOptions([{ value: 'Yes, I want to find Universities and Courses', label: 'Yes' }, { value: 'No, I want to talk to EduVoy.ai', label: 'No' }]);
            resetAll();
            setIsAssessment(false);
        } else if (step === 0) {
            //Want To Do Assessment - 1
            createUserMessage(selectedValue);
            repetativeFunc("Okay, What is your desired Course Type?");
            setOptions([{ value: 'I am looking for Postgraduate courses.', label: 'Postgraduate' }, { value: 'I am looking for Undergraduate courses.', label: 'Undergraduate' }, { value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }]);
            setStep(1);
        } else if (step === 1) {
            //After Selecting Course Type - 2
            fetchUnisOrBoards();
            setCourseType(selectedLabel);
            createUserMessage(selectedValue);
            repetativeFunc(selectedLabel === "Postgraduate" ? "From which university you have completed your graduation?" : "From which board you have completed your higher secondary education?");
            setStep(2);
        } else if (step === 2) {
            //After Selecting Institute - 3
            setInstituteId(selectedValue);
            createUserMessage(courseType === "Postgraduate" ? `I have completed my graduation from ${selectedLabel}` : `I have completed my higher secondary examination from ${selectedLabel}`);
            repetativeFunc(courseType === "Postgraduate" ? "How much overall marks have you obtained in your graduation?" : "How much overall marks have you obtained in your higher secondary examination?");
            setIsInputOpen(true);
            setStep(3);
        } else if (step === 3) {
            //After Sharing Academic Marks - 4
            setIsInputOpen(false);
            setAcademicMarks(message);
            createUserMessage(courseType === "Postgraduate" ? `I have completed my graduation with a grade of ${message}%` : `I have completed my higher secondary examination with a grade of ${message}%`);
            repetativeFunc("Do you require or have english language waiver?");
            setOptions([{ value: 'Yes, I want english language waiver', label: 'Yes' }, { value: 'No, I do not want english language waiver', label: 'No' }, { value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }]);
            setStep(4);
            setMessage('');
        } else if (step === 4) {
            //After Answering Waiver Required Or Not - 5 / 7
            setRequireWaiver(selectedLabel);
            createUserMessage(selectedValue);
            repetativeFunc(selectedLabel === "Yes" ? courseType === "Undergraduate" ? "How much english marks have you obtained in your higher secondary examination?" : "From which board you have completed your higher secondary examination?" : "Have you appeared for any English Language Test?");
            if (selectedLabel === "Yes") {
                if (courseType === "Undergraduate") {
                    setIsInputOpen(true);
                    setBoardId(instituteId);
                } else {
                    fetchBoards();
                }
            } else {
                setOptions([{ value: 'Yes, I have appeared for an English Language test', label: 'Yes' }, { value: 'No, I have not appeared for any English Language test', label: 'No' }, { value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }]);
            }
            setStep(selectedLabel === "Yes" ? courseType === "Undergraduate" ? 6 : 5 : 7);
        } else if (step === 5) {
            //After Selecting Waiver Board - 6
            setBoardId(selectedValue);
            createUserMessage(`I have completed my higher secondary examination from ${selectedLabel}`);
            repetativeFunc("How much english marks have you obtained in your higher secondary examination?");
            setIsInputOpen(true);
            setStep(6);
        } else if (step === 6) {
            //After Sharing Waiver Marks - 16
            setIsInputOpen(false);
            setWaiverMarks(message);
            createUserMessage(`I have obtained ${message}% in engilsh language in my higher secondary examination.`);
            repetativeFunc("Do you want to assess your profile based on math marks?");
            setOptions([{ value: 'Yes, I want to assess my profile based on math marks.', label: 'Yes' }, { value: 'No, I do not want to assess my profile based on math marks.', label: 'No' }, { value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }]);
            setStep(16);
            setMessage('');
        } else if (step === 7) {
            //After Answering ELT Required or not - 8 / 13
            createUserMessage(selectedValue);
            repetativeFunc(selectedLabel === "Yes" ? "You have appeared for which english language test from the below?" : courseType === "Postgraduate" ? "Do you require MOI Waiver?" : "Do you want to assess your profile based on math marks?");
            setOptions(selectedLabel === "Yes" ? [{ value: 'ieltsReq', label: 'International English Language Testing System (IELTS)' }, { value: 'pteReq', label: 'Pearson Test of English (PTE)' }, { value: 'toeflReq', label: 'Test of English as a Foreign Language (TOEFL)' }, { value: 'duolingoReq', label: 'Duolingo' }] : courseType === "Postgraduate" ? [{ value: 'Yes, I require MOI Waiver', label: 'Yes' }, { value: 'No, I do not require MOI Waiver', label: 'No' }, { value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }] :
                [{ value: 'Yes, I want to assess my profile based on math marks.', label: 'Yes' }, { value: 'No, I do not want to assess my profile based on math marks.', label: 'No' }, { value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }]);
            setStep(selectedLabel === "Yes" ? 8 : courseType === "Postgraduate" ? 14 : 18);
        } else if (step === 8) {
            //After Selecting ELT
            setEltTest(selectedValue);
            createUserMessage(`I have appeared for ${selectedLabel} test.`);
            repetativeFunc("How much overall marks you have obtained in the test?");
            if (selectedValue === "ieltsReq") {
                setOptions(ieltsMarksArrOptions);
            } else {
                setIsInputOpen(true);
            }
            setStep(9);
        } else if (step === 9) {
            //After Overall
            eltTest === "ieltsReq" ? setOverall(selectedValue) : setOverall(message); ``
            createUserMessage(`Overall Marks - ${selectedLabel}`);
            repetativeFunc("How much listning marks you have obtained in the test?");
            setStep(10);
            setMessage('');
        } else if (step === 10) {
            //After Listning
            eltTest === "ieltsReq" ? setListning(selectedValue) : setListning(message); ``
            createUserMessage(`Listning Marks - ${selectedLabel}`);
            repetativeFunc("How much reading marks you have obtained in the test?");
            setStep(11);
            setMessage('');
        } else if (step === 11) {
            //After Reading
            eltTest === "ieltsReq" ? setReading(selectedValue) : setReading(message); ``
            createUserMessage(`Reading Marks - ${selectedLabel}`);
            repetativeFunc("How much writing marks you have obtained in the test?");
            setStep(12);
            setMessage('');
        } else if (step === 12) {
            //After writing
            eltTest === "ieltsReq" ? setWritting(selectedValue) : setWritting(message); ``
            createUserMessage(`writing Marks - ${selectedLabel}`);
            repetativeFunc("How much speaking marks you have obtained in the test?");
            setStep(13);
            setMessage('');
        } else if (step === 13) {
            //After Speaking
            eltTest === "ieltsReq" ? setSpeaking(selectedValue) : setSpeaking(message); ``
            createUserMessage(`Speaking Marks - ${selectedLabel}`);
            repetativeFunc("Do you want to assess your profile based on math marks?");
            setOptions([{ value: 'Yes, I want to assess my profile based on math marks.', label: 'Yes' }, { value: 'No, I do not want to assess my profile based on math marks.', label: 'No' }, { value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }]);
            setStep(16);
            setMessage('');
        } else if (step === 14) {
            //After Answering MOI Required or not - 15 / 16
            if (selectedLabel === "Yes") {
                fetchMoiUnis();
            }
            createUserMessage(selectedValue);
            repetativeFunc(selectedLabel === "Yes" ? "From which university you have completed your graduation?" : "Do you want to assess your profile based on math marks?");
            if (selectedLabel !== "Yes") {
                setOptions([{ value: 'Yes, I want to assess my profile based on math marks.', label: 'Yes' }, { value: 'No, I do not want to assess my profile based on math marks.', label: 'No' }, { value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }]);
            }
            setStep(selectedLabel === "Yes" ? 15 : 16);
        } else if (step === 15) {
            //After Selecting Moi Institute - 16
            setMoiUniId(selectedValue);
            createUserMessage(`I have completed my graduation from ${selectedLabel}`);
            repetativeFunc("Do you want to assess your profile based on math marks?");
            setOptions([{ value: 'Yes, I want to assess my profile based on math marks.', label: 'Yes' }, { value: 'No, I do not want to assess my profile based on math marks.', label: 'No' }, { value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }]);
            setStep(16);
        } else if (step === 16) {
            //After Answering Math Required Or Not - 17 / 18 / 18
            setRequireWaiver(selectedLabel);
            createUserMessage(selectedValue);
            repetativeFunc(selectedLabel === "Yes" ? courseType === "Undergraduate" ? "How much math marks have you obtained in your higher secondary examination?" : requireWaiver === "Yes" ? "How much math marks have you obtained in your higher secondary examination?" : "From which board you have completed your higher secondary examination?" : "Thank you for sharing your academic information. Do you want to know all the eligible universities for you?");
            if (selectedLabel === "Yes") {
                if (courseType === "Undergraduate") {
                    setIsInputOpen(true);
                    setMathBoardId(instituteId);
                } else {
                    if (requireWaiver === "Yes") {
                        setIsInputOpen(true);
                        setMathBoardId(boardId);
                    } else {
                        fetchBoards();
                    }
                }
            } else {
                setOptions([{ value: 'Yes, I want to assess my profile based on my acdemic qualifications.', label: 'Yes' }, { value: 'No, I want to talk to EduVoy.ai', label: 'No' }]);
            }
            setStep(selectedLabel === "Yes" ? courseType === "Undergraduate" ? 18 : requireWaiver === "Yes" ? 18 : 17 : 19);
        } else if (step === 17) {
            //After Selecting Math Board - 18
            setMathBoardId(selectedValue);
            createUserMessage(`I have completed my higher secondary examination from ${selectedLabel}`);
            repetativeFunc("How much math marks have you obtained in your higher secondary examination?");
            setIsInputOpen(true);
            setStep(18);
        } else if (step === 18) {
            //After Sharing Math Marks - 19
            setIsInputOpen(false);
            setMathMarks(message);
            createUserMessage(mathBoardId === "" ? selectedValue : `I have obtained ${message}% in math subject in my higher secondary examination.`);
            repetativeFunc("Thank you for sharing your academic information. Do you want to know all the eligible universities for you?");
            setOptions([{ value: 'Yes, I want to assess my profile based on my acdemic qualifications.', label: 'Yes' }, { value: 'No, I want to talk to EduVoy.ai', label: 'No' }]);
            setStep(19);
            setMessage('');
        } else if (step === 19) {
            //After Answering Yes To Final Assessment - 20
            createUserMessage(selectedValue);
            fetchUniversities();
            setStep(20);
        } else if (step === 20) {
            //After Answering Want Courses Or Not - 21
            createUserMessage(selectedValue);
            repetativeFunc("Do you want to find courses of all the eligible universities or any specific university?");
            setOptions([{ value: 'I want to find courses from all the eligible universities.', label: 'All Universities' }]);
            universities.forEach(uni => {
                setOptions(opt => [
                    ...opt,
                    { value: `${uni.universityId}`, label: uni.universityName }
                ]);
            })
            setOptions(opt => [
                ...opt,
                { value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }
            ]);
            setStep(21);
        } else if (step === 21) {
            //After Answering Courses of Which University - 22 / 23
            setIsTextInputOpen(true);
            setCourseUni(selectedValue);
            createUserMessage(selectedLabel === "All Universities" || selectedLabel === "Exit Assessment" ? selectedValue : `I want to find courses of ${selectedLabel}.`);
            repetativeFunc(courseType === "Postgraduate" ? "What is your previously completed Undergraduate Degree?" : "What is your first subject from best of 4 in higher secondary examination?");
            setStep(courseType === "Postgraduate" ? 22 : 23);
        } else if (step === 22) {
            //After Answering Prev Deggree - 27
            setIsTextInputOpen(false);
            setPrevDegree(message);
            createUserMessage(`My previously completed Undergraduate Degree is ${message}`);
            repetativeFunc("Do you want to find courses of any specific intake?");
            setOptions([{ value: 'Yes, I want to find courses of a specific intake.', label: 'Yes' }, { value: 'No, I want to find courses of all intakes.', label: 'No' }, { value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }]);
            setStep(27);
            setMessage('');
        } else if (step === 23) {
            //After Answering Prev Deggree - 26
            setFirstSub(message);
            createUserMessage(`My first subject from best of 4 in higher secondary examination is ${message}`);
            repetativeFunc("What is your second subject from best of 4 in higher secondary examination?");
            setStep(24);
            setMessage('');
        } else if (step === 24) {
            //After Answering Prev Deggree - 26
            setSecondSub(message);
            createUserMessage(`My second subject from best of 4 in higher secondary examination is ${message}`);
            repetativeFunc("What is your third subject from best of 4 in higher secondary examination?");
            setStep(25);
            setMessage('');
        } else if (step === 25) {
            //After Answering Prev Deggree - 26
            setThirdSub(message);
            createUserMessage(`My third subject from best of 4 in higher secondary examination is ${message}`);
            repetativeFunc("What is your fourth subject from best of 4 in higher secondary examination?");
            setStep(26);
            setMessage('');
        } else if (step === 26) {
            //After Answering Prev Deggree - 26
            setIsTextInputOpen(false);
            setFourthSub(message);
            createUserMessage(`My fourth subject from best of 4 in higher secondary examination is ${message}`);
            repetativeFunc("Do you want to find courses of any specific intake?");
            setOptions([{ value: 'Yes, I want to find courses of a specific intake.', label: 'Yes' }, { value: 'No, I want to find courses of all intakes.', label: 'No' }, { value: 'No, I want to talk to EduVoy.ai', label: 'Exit Assessment' }]);
            setStep(27);
            setMessage('');
        } else if (step === 27) {
            //After Answering Prev Deggree - 26
            createUserMessage(selectedValue);
            if (selectedLabel === "Yes") {
                fetchIntakes();
                repetativeFunc("Choose one intake for which you want to find courses.");
                setStep(28);
            } else {
                setIsTyping(true);
                findFaculties();
                setStep(29);
            }
        } else if (step === 28) {
            //After Answering Prev Deggree - 26
            setDesiredIntake(selectedValue);
            createUserMessage(`I want to find courses for ${selectedLabel} intake.`);
            setIsTyping(true);
            findFaculties();
            setStep(29);
        } else if (step === 29) {
            //After Answering Prev Deggree - 26
            setFaculty(selectedValue);
            setIsTyping(true);
            createUserMessage(`I want to find courses under ${selectedLabel} faculty.`);
            searchCourses();
            setStep(30);
        } else if (step === 30) {
            //After Answering Prev Deggree - 26
            createUserMessage(selectedValue);
            repetativeFunc("Do you want to find universities and course as per qualification?");
            resetAll();
        }
    }

    async function sendMessage() {
        createUserMessage(message);
        setIsTyping(true);

        if (message !== '') {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    return;
                }

                const result = await fetch(`${BACKEND_URL}/users/openai/chat`, {
                    method: "POST",
                    headers: {
                        'token': `${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message
                    }),
                });
                const data = await result.json();
                await new Promise((resolve) => setTimeout(resolve, 1500));
                setIsTyping(false);

                setCurrentMessages(msg => [
                    ...msg,
                    { role: "bot", message: data.reply }
                ]);
            } catch (error) {
                console.error("Error analyzing response:", error);
                await new Promise((resolve) => setTimeout(resolve, 1500));
                setIsTyping(false);

                setCurrentMessages(msg => [
                    ...msg,
                    { role: "bot", message: "Sorry there is an error while replying. Please try again" }
                ]);
            }
        }

        setMessage('');
    }

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [currentMessages]);

    return (
        <>
            <div className='fixed bottom-24 right-8'>
                <div className='flex justify-center'>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-100 rounded-xl shadow-3xl border-4 border-black mt-28 w-[450px] h-[450px]"
                    >
                        <div className='flex m-4 justify-between items-center px-6 p-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl top-0'>
                            <h1 className='text-2xl font-bold text-center'>
                                EduVoy.ai Chat Support
                            </h1>
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => setChatBoxState((c) => !c)}
                                className="w-38 btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                            >
                                Exit
                            </motion.button>
                        </div>

                        <div ref={chatContainerRef} className="flex flex-col justify-start space-y-4 h-[266px] m-4 overflow-auto">
                            {currentMessages.map((message) => (
                                <div
                                    className={`${message.role === "bot" ? "text-left" : "text-right"}`}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-gray-200 p-3 font-bold text-lg rounded-xl inline-block max-w-[75%]"
                                    >
                                        {message.message}
                                    </motion.div>
                                </div>
                            ))}
                            {isTyping && <div
                                className="text-left"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex justify-evenly bg-gray-200 p-3 font-bold text-lg rounded-xl w-28"
                                >
                                    <div className='w-3 h-3 bg-black rounded-full animate-pulse-slow'></div>
                                    <div className='w-3 h-3 bg-black rounded-full animate-pulse-slow'></div>
                                    <div className='w-3 h-3 bg-black rounded-full animate-pulse-slow'></div>
                                    <div className='w-3 h-3 bg-black rounded-full animate-pulse-slow'></div>
                                    <div className='w-3 h-3 bg-black rounded-full animate-pulse-slow'></div>
                                </motion.div>
                            </div>}
                        </div>

                        <div className="flex justify-around bg-gradient-to-r from-blue-500 to-purple-600 rounded-br-lg rounded-bl-lg px-6 py-3 mb-8 text-white w-full">
                            {!isAssessment && <input
                                type="text"
                                id="optionTitle"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter Your Message...."
                                className="p-2 w-full border border-black text-black rounded-lg mr-5"
                            />}

                            {isAssessment && isInputOpen && <input
                                type="number"
                                id="optionTitle"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter Your Marks....."
                                className="p-2 w-full border border-black text-black rounded-lg mr-5"
                            />}

                            {isAssessment && isTextInputOpen && <input
                                type="text"
                                id="optionTitle"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter Your Message....."
                                className="p-2 w-full border border-black text-black rounded-lg mr-5"
                            />}

                            {!fakeRender && isAssessment && !isInputOpen && !isTextInputOpen && <div className='border-2 border-black'>
                                <Select
                                    className={`bg-white text-black h-10 text-xl min-w-60 max-w-60 ${isOverflow ? "overflow-y-hidden" : ""}`}
                                    name='options'
                                    color='#8bb87b'
                                    searchable={options.length !== 0 && options[0].label === "Yes" ? false : true}
                                    dropdownPosition={"top"}
                                    placeholder='Select An Option'
                                    closeOnClickInput
                                    values={[]}
                                    options={options}
                                    onDropdownOpen={() => setIsOverflow(c => !c)}
                                    onDropdownClose={() => setIsOverflow(true)}
                                    onChange={(value: AnyDrop[]): void => { setSelectedValue(value[0].value); setSelectedLabel(value[0].label); setIsOverflow(c => !c) }}
                                />
                            </div>}

                            {fakeRender && isAssessment && !isInputOpen && !isTextInputOpen && <div className='border-2 border-black'>
                                <Select
                                    className="bg-white text-black h-10 text-xl min-w-60 max-w-60"
                                    name='options'
                                    color='#8bb87b'
                                    placeholder='Select An Option'
                                    values={[]}
                                    options={[]}
                                    onChange={(value: AnyDrop[]): void => console.log(value[0].value)}
                                />
                            </div>}

                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: message === ''
                                        ? selectedValue === ''
                                            ? 0.5
                                            : isTyping
                                                ? 0.5
                                                : 1
                                        : isTyping
                                            ? 0.5
                                            : 1
                                }}
                                disabled={
                                    message === ''
                                        ? selectedValue === ''
                                            ? true
                                            : isTyping
                                                ? true
                                                : false
                                        : isTyping
                                            ? true
                                            : false
                                }
                                onClick={isAssessment ? sendAssesmentMsg : sendMessage}
                                className="w-32 btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                            >
                                Send
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    )
}

export default BotChat