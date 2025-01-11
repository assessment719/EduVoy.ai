import { motion } from 'framer-motion';
import Select from 'react-dropdown-select';
import { jsPDF } from "jspdf";
import { StringDrop } from '../../../Utils/stringDrop';
import { useState, useRef } from 'react';
import { BACKEND_URL } from './../../../config'
import LoaderComponent from './../../loader';

const SOP = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [finalSOP, setFinalSOP] = useState('');

    const [courseType, setCourseType] = useState('');
    const [stuDestination, setStuDestination] = useState('');
    const [stuCountry, setStuCountry] = useState('');
    const [university, setUniversity] = useState('');
    const [course, setCourse] = useState('');
    const [stuName, setStuName] = useState('');
    const [stuCity, setStuCity] = useState('');
    const [stuState, setStuState] = useState('');
    const [stuBoard, setStuBoard] = useState('');
    const [stu12Year, setStu12Year] = useState('');
    const [stu12Marks, setStu12Marks] = useState('');
    const [stuUGDegree, setStuUGDegree] = useState('');
    const [stuUni, setStuUni] = useState('');
    const [stuUGYear, setStuUGYear] = useState('');
    const [stuUGMarks, setStuUGMarks] = useState('');
    const [stuJobTitle, setStuJobTitle] = useState('');
    const [stuJobCompany, setStuJobCompany] = useState('');
    const [stuJobStartDate, setStuJobStartDate] = useState('');
    const [stuJobEndDate, setStuJobEndDate] = useState('');

    const outputSectionRef = useRef<HTMLDivElement | null>(null);

    const handleScrollToOutputSection = () => {
        outputSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    async function generateSop() {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        if (courseType === 'Undergraduate') {
            const result = await fetch(`${BACKEND_URL}/users/openai/sop`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    courseType,
                    stuDestination,
                    stuCountry,
                    university,
                    course,
                    stuName,
                    stuCity,
                    stuState,
                    stuBoard,
                    stu12Year,
                    stu12Marks,
                    stuJobTitle,
                    stuJobCompany,
                    stuJobStartDate,
                    stuJobEndDate
                }),
            });
            const data = await result.json();
            setFinalSOP(data.organisedSOP);
            setIsFetching(false);
            handleScrollToOutputSection();
        } else {
            const result = await fetch(`${BACKEND_URL}/users/openai/sop`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    courseType,
                    stuDestination,
                    stuCountry,
                    university,
                    course,
                    stuName,
                    stuCity,
                    stuState,
                    stuBoard,
                    stu12Year,
                    stu12Marks,
                    stuUGDegree,
                    stuUni,
                    stuUGYear,
                    stuUGMarks,
                    stuJobTitle,
                    stuJobCompany,
                    stuJobStartDate,
                    stuJobEndDate
                }),
            });
            const data = await result.json();
            setFinalSOP(data.organisedSOP);
            setIsFetching(false);
            handleScrollToOutputSection();
        }
    }

    function copySop() {
        navigator.clipboard.writeText(finalSOP).then(() => {
            alert("Copied to clipboard!");
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    function downloadSop() {
        const doc = new jsPDF();


        const margin = 10;
        const pageWidth = doc.internal.pageSize.width;
        const borderWidth = pageWidth - 2 * margin;
        const borderHeight = 277;

        const addTextWithBorder = (text: string) => {
            const wrappedText = doc.splitTextToSize(text, borderWidth - 10);

            let yOffset = margin + 10;
            const maxHeight = margin + borderHeight;
            const lineHeight = 7;

            for (let i = 0; i < wrappedText.length; i++) {
                if (yOffset + lineHeight > maxHeight) {
                    doc.addPage();
                    yOffset = margin + 10;
                }

                doc.rect(margin, margin, borderWidth, borderHeight);
                doc.text(wrappedText[i], margin + 5, yOffset);
                yOffset += lineHeight;
            }
        };

        addTextWithBorder(finalSOP);

        doc.save(`${stuName} SOP.pdf`);
    }

    const resetSopInputs = () => {
        setFinalSOP('');
        setCourseType('');
        setStuDestination('');
        setStuCountry('');
        setUniversity('');
        setCourse('');
        setStuName('');
        setStuCity('');
        setStuState('');
        setStuBoard('');
        setStu12Year('');
        setStu12Marks('');
        setStuUGDegree('');
        setStuUni('');
        setStuUGYear('');
        setStuUGMarks('');
        setStuJobTitle('');
        setStuJobCompany('');
        setStuJobStartDate('');
        setStuJobEndDate('');
    };

    return (
        <>
            {isFetching && <div className='fixed bg-opacity-50 bg-gray-100 h-screen w-screen top-0 left-0'>
                <div className='flex justify-center'>
                    <LoaderComponent />
                </div>
            </div>}

            {!isFetching && finalSOP !== '' && <div ref={outputSectionRef} className="flex flex-col gap-5 ml-6 w-[1100px] mb-10">
                <textarea className="h-96 rounded-2xl overflow-auto p-5 text-xl border-2 border-black" value={finalSOP} readOnly></textarea>
                <button onClick={copySop} className="btn btn-primary text-2xl">Copy to Clipboard</button>
                <div className="flex justify-around">
                    <button onClick={generateSop} className="btn btn-primary w-[25%] text-2xl">Regenerate SOP</button>
                    <button onClick={downloadSop} className="btn btn-primary w-[25%] text-2xl">Download The SOP</button>
                    <button onClick={resetSopInputs} className="btn btn-primary w-[25%] text-2xl">Generate Another SOP</button>
                </div>
            </div>}

            <div className="flex flex-col gap-5 ml-6 mb-10 w-[1100px]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 * 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500 w-full border-2 border-black"
                >
                    <h2 className='font-bold text-3xl mb-5 text-center'>Course Details</h2>

                    <div className='flex grid-cols-4 gap-8 items-start'>
                        <div>
                            <label className="block font-bold text-xl mb-1">Desired Country To Apply:</label>
                            <input type="text" value={stuDestination} onChange={(e) => setStuDestination(e.target.value)} placeholder="Enter Your Country Name" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                        </div>

                        <div>
                            <label className="block font-bold text-xl mb-1">Select Desired Course Type:</label>
                            <div className='border-2 border-black'>
                                <Select
                                    className='bg-white text-black h-9 text-xl'
                                    name='university'
                                    color='#8bb87b'
                                    searchable={false}
                                    placeholder='Select Course Type'
                                    closeOnClickInput
                                    values={courseType === '' ? [] : [{value: `${courseType}`, label: `${courseType}`}]}
                                    options={[{ value: 'Undergraduate', label: 'Undergraduate' }, { value: 'Postgraduate', label: 'Postgraduate' }]}
                                    onChange={(value: StringDrop[]): void => { setCourseType(value[0].value) }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-bold text-xl mb-1">Desired University To Apply:</label>
                            <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="Enter Your University Name" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                        </div>

                        <div>
                            <label className="block font-bold text-xl mb-1">Desired Course To Apply:</label>
                            <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Enter Your Course Name" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 * 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500 w-full border-2 border-black"
                >
                    <h2 className='font-bold text-3xl mb-5 text-center'>Student's Personal Details</h2>

                    <div className='flex grid-cols-4 gap-8 items-start'>
                        <div>
                            <label className="block font-bold text-xl mb-1">Student's Full <br /> Name:</label>
                            <input type="text" value={stuName} onChange={(e) => setStuName(e.target.value)} placeholder="Enter Your Full Name" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                        </div>

                        <div>
                            <label className="block font-bold text-xl mb-1">Student's Country of Residence:</label>
                            <input type="text" value={stuCountry} onChange={(e) => setStuCountry(e.target.value)} placeholder="Enter Country Name" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                        </div>

                        <div>
                            <label className="block font-bold text-xl mb-1">Student's State of Residence:</label>
                            <input type="text" value={stuState} onChange={(e) => setStuState(e.target.value)} placeholder="Enter State Name" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                        </div>

                        <div>
                            <label className="block font-bold text-xl mb-1">Student's City of Residence:</label>
                            <input type="text" value={stuCity} onChange={(e) => setStuCity(e.target.value)} placeholder="Enter City Name" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3 * 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500 w-full border-2 border-black"
                >
                    <h2 className='font-bold text-3xl mb-5 text-center'>Student's Academic Details and Work Experience</h2>

                    <div className='flex grid-cols-3 gap-8 items-start'>
                        <div className='rounded-xl w-full border-2 border-black p-2 flex flex-col gap-5 h-[450px]'>
                            <h2 className='font-bold text-lg text-center underline'>Higher Secondary Education Details</h2>

                            <div>
                                <label className="block font-bold text-xl mb-1">Attended Board Name:</label>
                                <input type="text" value={stuBoard} onChange={(e) => setStuBoard(e.target.value)} placeholder="Enter Your Board Name" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                            </div>

                            <div>
                                <label className="block font-bold text-xl mb-1">Year of Passing:</label>
                                <input type="text" value={stu12Year} onChange={(e) => setStu12Year(e.target.value)} placeholder="Enter Your Year of Passing" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                            </div>

                            <div>
                                <label className="block font-bold text-xl mb-1">Enter Marks:</label>
                                <input type="text" value={stu12Marks} onChange={(e) => setStu12Marks(e.target.value)} placeholder="Enter Your Overall Marks" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                            </div>
                        </div>

                        {courseType === 'Postgraduate' && <div className='rounded-xl w-full border-2 border-black p-2 flex flex-col gap-5 h-[450px]'>
                            <h2 className='font-bold text-lg text-center underline'>Undergraduate Details</h2>

                            <div>
                                <label className="block font-bold text-xl mb-1">Enter Degree Title:</label>
                                <input type="text" value={stuUGDegree} onChange={(e) => setStuUGDegree(e.target.value)} placeholder="Enter Your Degree Title" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                            </div>

                            <div>
                                <label className="block font-bold text-xl mb-1">Attended University Name:</label>
                                <input type="text" value={stuUni} onChange={(e) => setStuUni(e.target.value)} placeholder="Enter Your University Name" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                            </div>

                            <div>
                                <label className="block font-bold text-xl mb-1">Year of Passing:</label>
                                <input type="text" value={stuUGYear} onChange={(e) => setStuUGYear(e.target.value)} placeholder="Enter Passing Year or, NA If Pursuing" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                            </div>

                            <div>
                                <label className="block font-bold text-xl mb-1">Enter Marks:</label>
                                <input type="text" value={stuUGMarks} onChange={(e) => setStuUGMarks(e.target.value)} placeholder="Enter Your Overall Marks or, Pursuing" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                            </div>
                        </div>}

                        <div className='rounded-xl w-full border-2 border-black p-2 flex flex-col gap-5 h-[450px]'>
                            <h2 className='font-bold text-lg text-center underline'>Work Experience Details</h2>

                            <div>
                                <label className="block font-bold text-xl mb-1">Enter Job Title:</label>
                                <input type="text" value={stuJobTitle} onChange={(e) => setStuJobTitle(e.target.value)} placeholder="Enter Your Job Title" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                            </div>

                            <div>
                                <label className="block font-bold text-xl mb-1">Enter Company/Organisation Name:</label>
                                <input type="text" value={stuJobCompany} onChange={(e) => setStuJobCompany(e.target.value)} placeholder="Enter Your Company Name" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                            </div>

                            <div>
                                <label className="block font-bold text-xl mb-1">Enter Joining Date:</label>
                                <input type="text" value={stuJobStartDate} onChange={(e) => setStuJobStartDate(e.target.value)} placeholder="DD/MM/YYYY" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                            </div>

                            <div>
                                <label className="block font-bold text-xl mb-1">Enter Releasing Date:</label>
                                <input type="text" value={stuJobEndDate} onChange={(e) => setStuJobEndDate(e.target.value)} placeholder="DD/MM/YYYY or, Till Date" className="p-2 h-10 border-2 border-black text-lg w-full rounded-lg" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <button onClick={generateSop} className='btn btn-primary mt-5 text-2xl'>Generate Statement of Purpose</button>
            </div>
        </>
    )
}

export default SOP