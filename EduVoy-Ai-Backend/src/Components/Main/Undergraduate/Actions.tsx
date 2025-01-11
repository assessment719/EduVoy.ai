import { motion } from 'framer-motion';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isUgActionedAtom, stateOfChangesAtom, inActionUniIdAtom, isFetchingAtom } from './Atoms';
import { useEffect, useState } from 'react';
import { EnglandUniversities } from './../../../utils/ukuniversities';
import { Option } from './../../../utils/options';
import { BACKEND_URL } from './../../../config';

const Action = () => {
    const setIsActioned = useSetRecoilState(isUgActionedAtom);
    const setIsFetching = useSetRecoilState(isFetchingAtom);
    const setAddingUni = useSetRecoilState(inActionUniIdAtom);
    const state = useRecoilValue(stateOfChangesAtom);
    const universityId = useRecoilValue(inActionUniIdAtom);
    const isFetching = useRecoilValue(isFetchingAtom);

    // Set Of Objects Of Options
    const [objUkUnis, setObjUkUnis] = useState<{ [key: number]: string }>({});
    const [objOptionBoards, setObjOptionBoards] = useState<{ [key: number]: string }>({});

    const engTestMarksObj = { overall: 1000, listening: 1000, reading: 1000, writing: 1000, speaking: 1000 }
    const ieltsMarksArr = [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 11.0]

    // Set Of Object Of Value Of Marks
    const [objAcadMarks, setObjAcadMarks] = useState<{ [key: number]: number }>({});
    const [objEngMarks, setObjEngMarks] = useState<{ [key: number]: number }>({});
    const [objMathMarks, setObjMathMarks] = useState<{ [key: number]: number }>({});
    const [objIeltsMarks, setObjIeltsMarks] = useState<{ [key: string]: number }>({ overall: 11.0, listening: 11.0, reading: 11.0, writing: 11.0, speaking: 11.0 });
    const [objPteMarks, setObjPteMarks] = useState<{ [key: string]: number }>(engTestMarksObj);
    const [objToeflMarks, setObjToeflMarks] = useState<{ [key: string]: number }>(engTestMarksObj);
    const [objDuoMarks, setObjDuoMarks] = useState<{ [key: string]: number }>(engTestMarksObj);
    const [placement, setPlacement] = useState('all');
    const [topup, setTopup] = useState('all');
    const [fees, setFees] = useState(0);
    const [extraReq, setExtraReq] = useState('');

    const fetchUkUnis = async () => {
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
            const data: { universities: EnglandUniversities[] } = await response.json();

            let obj: { [key: number]: string } = {};
            data.universities.forEach((uni) => {
                obj[uni.id] = uni.universityName;
            });
            setObjUkUnis(obj);
        } catch (error) {
            console.error('Error fetching unis:', error);
        }
    };

    const fetchOptionBoards = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/admin/options/board`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data: { boards: Option[] } = await response.json();

            let obj: { [key: number]: string } = {};
            data.boards.forEach((board) => {
                obj[board.id] = board.option;
            });
            setObjOptionBoards(obj);

            if (state === 'adding') {
                let marksobj: { [key: number]: number } = {};
                data.boards.forEach((board) => {
                    marksobj[board.id] = 101;
                });
                setObjAcadMarks(marksobj);
            }

            if (state === 'adding') {
                let engobj: { [key: number]: number } = {};
                data.boards.forEach((board) => {
                    engobj[board.id] = 101;
                });
                setObjEngMarks(engobj);
            }

            if (state === 'adding') {
                let mathobj: { [key: number]: number } = {};
                data.boards.forEach((board) => {
                    mathobj[board.id] = 101;
                });
                setObjMathMarks(mathobj);
            }
        } catch (error) {
            console.error('Error fetching unis:', error);
        }
    };

    useEffect(() => {
        setIsFetching(true);
        fetchUkUnis();
        fetchOptionBoards();
        if (state === 'adding') {
            setTimeout(() => {
                setIsFetching(false);
            }, 1200)
        }
    }, [])

    function exit() {
        setIsFetching(true);
        setIsActioned(false);
        setAddingUni(0);
        setTimeout(() => {
            setIsFetching(false);
        }, 1200)
    }

    const handleAcadMarksChange = (key: number, value: number) => {
        setObjAcadMarks((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleEngMarksChange = (key: number, value: number) => {
        setObjEngMarks((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleMathMarksChange = (key: number, value: number) => {
        setObjMathMarks((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleIeltsMarksChange = (key: string, value: number) => {
        setObjIeltsMarks((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handlePteMarksChange = (key: string, value: number) => {
        setObjPteMarks((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleToeflMarksChange = (key: string, value: number) => {
        setObjToeflMarks((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleDuoMarksChange = (key: string, value: number) => {
        setObjDuoMarks((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    // All Fetch Functions
    const addUniReq = () => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        // Add University Requirement
        if (extraReq !== "") {
            fetch(`${BACKEND_URL}/admin/universities/uguniversities/add`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    universityId,
                    universityName: objUkUnis[universityId],
                    academicReq: objAcadMarks,
                    englishReq: objEngMarks,
                    ieltsReq: objIeltsMarks,
                    pteReq: objPteMarks,
                    toeflReq: objToeflMarks,
                    duolingoReq: objDuoMarks,
                    mathReq: objMathMarks,
                    placementCourses: placement,
                    topupCourses: topup,
                    fees,
                    extraReqInfo: extraReq
                }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch data");
                    }
                    setIsActioned(false);
                    setAddingUni(0);
                })
                .catch((error) => console.error("Error fetching courses:", error));
        } else {
            alert('Please Fill The Extra Requirements With NA.');
            setIsFetching(false);
            return
        }
    }

    async function fetchingUpdatingUniData() {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/admin/universities/uguniversities/${universityId}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data = await response.json();
            const uniToUpdate = data.ugUniversity;

            //Fetching All Data
            setObjAcadMarks(uniToUpdate.academicReq);
            setObjEngMarks(uniToUpdate.englishReq);
            setObjMathMarks(uniToUpdate.mathReq);
            setObjIeltsMarks(uniToUpdate.ieltsReq);
            setObjPteMarks(uniToUpdate.pteReq);
            setObjToeflMarks(uniToUpdate.toeflReq);
            setObjDuoMarks(uniToUpdate.duolingoReq);
            setPlacement(`${uniToUpdate.placementCourses}`);
            setTopup(`${uniToUpdate.topupCourses}`);
            setFees(uniToUpdate.fees);
            setExtraReq(`${uniToUpdate.extraReqInfo}`);
            setTimeout(() => {
                setIsFetching(false);
            }, 1200)
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    }

    useEffect(() => {
        if (state === 'updating') {
            fetchingUpdatingUniData();
        }
    }, [state])

    const updateUniReq = () => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        // Update University Requirement
        if (extraReq !== "") {
            fetch(`${BACKEND_URL}/admin/universities/uguniversities/update`, {
                method: "PUT",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    universityId,
                    universityName: objUkUnis[universityId],
                    academicReq: objAcadMarks,
                    englishReq: objEngMarks,
                    ieltsReq: objIeltsMarks,
                    pteReq: objPteMarks,
                    toeflReq: objToeflMarks,
                    duolingoReq: objDuoMarks,
                    mathReq: objMathMarks,
                    placementCourses: placement,
                    topupCourses: topup,
                    fees,
                    extraReqInfo: extraReq
                }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch data");
                    }
                    setIsActioned(false);
                    setAddingUni(0);
                })
                .catch((error) => console.error("Error fetching courses:", error));
        } else {
            alert('Please Fill The Extra Requirements With NA.');
            setIsFetching(false);
            return
        }
    }

    return (
        <>
            {!isFetching && <div className="max-w-7xl mx-auto p-6 -mt-6">
                <h1 className="text-3xl text-center font-bold mb-3 bg-green-200 p-1 rounded-2xl">{state === 'adding' ? "Adding University Requirements" : "Updating University Requirements"}</h1>
                <div className='flex justify-between items-center pb-5 border-b-4 border-black w-[1100px]'>
                    <h1 className="text-3xl font-bold">{objUkUnis[universityId]}</h1>
                    <button onClick={exit} className='btn btn-primary w-32'>Exit</button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 * 0.1 }}
                >
                    <h1 className="text-2xl font-bold mb-3 mt-3">Academic Requirement</h1>
                    <div className='pb-5 border-b-4 border-black'>
                        <div className='flex justify-around items-center p-1 mb-3 bg-gray-200 rounded-2xl'>
                            <h1 className="text-xl font-bold">Board Name</h1>
                            <h1 className="text-xl font-bold">Overall Academic Marks</h1>
                        </div>
                        {Object.entries(objOptionBoards).map(([key, value]) => (
                            <div className='flex justify-between items-center p-1 mb-3'>
                                <h1 className="text-xl font-bold w-[50%]">{value}</h1>
                                <input
                                    type="text"
                                    id="acadMarks"
                                    value={objAcadMarks[key as any]}
                                    onChange={(e) => handleAcadMarksChange(key as any, Number(e.target.value))}
                                    placeholder="Enter Academic Marks"
                                    className="p-2 border border-black text-black text-xl text-center rounded-lg w-[50%]"
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 * 0.1 }}
                >
                    <h1 className="text-2xl font-bold mb-3 mt-3">English Waiver Requirement</h1>
                    <div className='pb-5 border-b-4 border-black'>
                        <div className='flex justify-around items-center p-1 mb-3 bg-gray-200 rounded-2xl'>
                            <h1 className="text-xl font-bold">Board Name</h1>
                            <h1 className="text-xl font-bold">English Subject Marks</h1>
                        </div>
                        {Object.entries(objOptionBoards).map(([key, value]) => (
                            <div className='flex justify-between items-center p-1 mb-3'>
                                <h1 className="text-xl font-bold w-[50%]">{value}</h1>
                                <input
                                    type="text"
                                    id="acadMarks"
                                    value={objEngMarks[key as any]}
                                    onChange={(e) => handleEngMarksChange(key as any, Number(e.target.value))}
                                    placeholder="Enter English Subject Marks"
                                    className="p-2 border border-black text-black text-xl text-center rounded-lg w-[50%]"
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3 * 0.1 }}
                >
                    <h1 className="text-2xl font-bold mb-3 mt-3">Math Requirement</h1>
                    <div className='pb-5 border-b-4 border-black'>
                        <div className='flex justify-around items-center p-1 mb-3 bg-gray-200 rounded-2xl'>
                            <h1 className="text-xl font-bold">Board Name</h1>
                            <h1 className="text-xl font-bold">Math Subject Marks</h1>
                        </div>
                        {Object.entries(objOptionBoards).map(([key, value]) => (
                            <div className='flex justify-between items-center p-1 mb-3'>
                                <h1 className="text-xl font-bold w-[50%]">{value}</h1>
                                <input
                                    type="text"
                                    id="acadMarks"
                                    value={objMathMarks[key as any]}
                                    onChange={(e) => handleMathMarksChange(key as any, Number(e.target.value))}
                                    placeholder="Enter Math Subject Marks"
                                    className="p-2 border border-black text-black text-xl text-center rounded-lg w-[50%]"
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3 * 0.1 }}
                >
                    <h1 className="text-2xl font-bold mb-3 mt-3">English Language Test Requirement</h1>
                    <div className='pb-5 border-b-4 border-black'>
                        <div className='flex justify-around items-center p-1 mb-3 bg-gray-200 rounded-2xl'>
                            <h1 className="text-xl font-bold w-[25%]">English Language Tests</h1>
                            <h1 className="text-xl font-bold">Overall</h1>
                            <h1 className="text-xl font-bold">Listening</h1>
                            <h1 className="text-xl font-bold">Reading</h1>
                            <h1 className="text-xl font-bold">Writing</h1>
                            <h1 className="text-xl font-bold">Speaking</h1>
                        </div>
                        <div className='flex justify-between items-center p-1 mb-3'>
                            <h1 className="text-xl font-bold w-[40%]">IELTS</h1>
                            <select
                                id="overall"
                                value={objIeltsMarks.overall.toFixed(1)}
                                onChange={e => handleIeltsMarksChange('overall', Number(e.target.value))}
                                className="p-2 mr-2 ml-2 border border-black text-black text-xl text-center rounded-lg w-[15%]"
                            >
                                {ieltsMarksArr.map((mark) => (
                                    <option key={mark} value={mark.toFixed(1)}>{mark.toFixed(1)}</option>
                                ))}
                            </select>
                            <select
                                id="listening"
                                value={objIeltsMarks.listening.toFixed(1)}
                                onChange={e => handleIeltsMarksChange('listening', Number(e.target.value))}
                                className="p-2 mr-2 ml-2 border border-black text-black text-xl text-center rounded-lg w-[15%]"
                            >
                                {ieltsMarksArr.map((mark) => (
                                    <option key={mark} value={mark.toFixed(1)}>{mark.toFixed(1)}</option>
                                ))}
                            </select>
                            <select
                                id="reading"
                                value={objIeltsMarks.reading.toFixed(1)}
                                onChange={e => handleIeltsMarksChange('reading', Number(e.target.value))}
                                className="p-2 mr-2 ml-2 border border-black text-black text-xl text-center rounded-lg w-[15%]"
                            >
                                {ieltsMarksArr.map((mark) => (
                                    <option key={mark} value={mark.toFixed(1)}>{mark.toFixed(1)}</option>
                                ))}
                            </select>
                            <select
                                id="writing"
                                value={objIeltsMarks.writing.toFixed(1)}
                                onChange={e => handleIeltsMarksChange('writing', Number(e.target.value))}
                                className="p-2 mr-2 ml-2 border border-black text-black text-xl text-center rounded-lg w-[15%]"
                            >
                                {ieltsMarksArr.map((mark) => (
                                    <option key={mark} value={mark.toFixed(1)}>{mark.toFixed(1)}</option>
                                ))}
                            </select>
                            <select
                                id="speaking"
                                value={objIeltsMarks.speaking.toFixed(1)}
                                onChange={e => handleIeltsMarksChange('speaking', Number(e.target.value))}
                                className="p-2 mr-2 ml-2 border border-black text-black text-xl text-center rounded-lg w-[15%]"
                            >
                                {ieltsMarksArr.map((mark) => (
                                    <option key={mark} value={mark.toFixed(1)}>{mark.toFixed(1)}</option>
                                ))}
                            </select>
                        </div>
                        {[
                            { label: 'Pearson Test of English', value: objPteMarks, fnx: handlePteMarksChange },
                            { label: 'TOEFL', value: objToeflMarks, fnx: handleToeflMarksChange },
                            { label: 'Duolingo', value: objDuoMarks, fnx: handleDuoMarksChange },
                        ].map(({ label, value, fnx }) => (
                            <div className='flex justify-between items-center p-1 mb-3'>
                                <h1 className="text-xl font-bold w-[40%]">{label}</h1>
                                <input
                                    type="text"
                                    id="overall"
                                    value={value.overall}
                                    onChange={(e) => fnx('overall', Number(e.target.value))}
                                    placeholder="Overall"
                                    className="p-2 mr-2 ml-2 border border-black text-black text-xl text-center rounded-lg w-[15%]"
                                />
                                <input
                                    type="text"
                                    id="listening"
                                    value={value.listening}
                                    onChange={(e) => fnx('listening', Number(e.target.value))}
                                    placeholder="Listening"
                                    className="p-2 mr-2 ml-2 border border-black text-black text-xl text-center rounded-lg w-[15%]"
                                />
                                <input
                                    type="text"
                                    id="reading"
                                    value={value.reading}
                                    onChange={(e) => fnx('reading', Number(e.target.value))}
                                    placeholder="Reading"
                                    className="p-2 mr-2 ml-2 border border-black text-black text-xl text-center rounded-lg w-[15%]"
                                />
                                <input
                                    type="text"
                                    id="writing"
                                    value={value.writing}
                                    onChange={(e) => fnx('writing', Number(e.target.value))}
                                    placeholder="Writing"
                                    className="p-2 mr-2 ml-2 border border-black text-black text-xl text-center rounded-lg w-[15%]"
                                />
                                <input
                                    type="text"
                                    id="speaking"
                                    value={value.speaking}
                                    onChange={(e) => fnx('speaking', Number(e.target.value))}
                                    placeholder="Speaking"
                                    className="p-2 mr-2 ml-2 border border-black text-black text-xl text-center rounded-lg w-[15%]"
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 * 0.1 }}
                >
                    <h1 className="text-2xl font-bold mb-3 mt-3">Extra Informations</h1>
                    <div className='grid grid-cols-3 gap-5 pb-5'>
                        <div className="mb-4">
                            <label htmlFor="category" className="block font-bold text-xl mb-1">
                                Is Placement Courses Available?
                            </label>
                            <select
                                id="placement"
                                value={placement}
                                onChange={e => setPlacement(e.target.value)}
                                className="w-full border border-black text-black rounded-lg h-10"
                            >
                                <option value="all">Select An Decision</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="category" className="block font-bold text-xl mb-1">
                                Is Top-Up Courses Available?
                            </label>
                            <select
                                id="topup"
                                value={topup}
                                onChange={e => setTopup(e.target.value)}
                                className="w-full border border-black text-black rounded-lg h-10"
                            >
                                <option value="all">Select An Decision</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl mb-1">
                                Enter Minimum Course Fee:
                            </label>
                            <input
                                type="number"
                                id="fees"
                                value={fees}
                                onChange={(e) => setFees(Number(e.target.value))}
                                placeholder="Enter Course Fee"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4 col-span-3">
                            <label htmlFor="title" className="block font-bold text-xl mb-1">
                                Enter Extra Requirements (If Not Available Put NA):
                            </label>
                            <input
                                type="text"
                                id="extraReq"
                                value={extraReq}
                                onChange={(e) => setExtraReq(e.target.value)}
                                placeholder="Enter Extra Requirements"
                                className="p-2 w-full border border-black text-black rounded-lg h-20"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={state === 'adding' ? addUniReq : updateUniReq}
                    className="w-full text-white btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                >
                    {state === 'adding' ? "Add University Requirement" : "Update University Requirement"}
                </motion.button>
            </div>}
        </>
    )
}

export default Action