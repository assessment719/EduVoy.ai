import { Cross, Search, University, ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { EnglandUniversities } from './../../../../utils/ukuniversities';
import { BACKEND_URL } from './../../../../config';
import LoaderComponent from '../../../loader';

const UkUniversities: React.FC = () => {
    const [universityName, setUniversityName] = useState('');
    const [location, setLocation] = useState('');
    const [logoLink, setLogoLink] = useState('');
    const [universityWebsitePage, setUniversityWebsitePage] = useState('');
    const [universityCoursePage, setUniversityCoursePage] = useState('');
    const [globalRanking, setGlobalRanking] = useState('');
    const [accreditation, setAccreditation] = useState('one');
    const [tutionFees, setTutionFees] = useState('');
    const [scholarships, setScholarships] = useState('');
    const [researchFacilities, setResearchFacilities] = useState('');
    const [jobPlacementRate, setJobPlacementRate] = useState('0%');
    const [livingCost, setLivingCost] = useState('');
    const [averageSalary, setAverageSalary] = useState('');
    const [studentReview, setStudentReview] = useState('0/5');
    const [isFetching, setIsFetching] = useState(false);

    const [ukUniversities, setUkUniversities] = useState<EnglandUniversities[]>([]);
    const [numberOfUkUniversities, setNumberOfUkUniversities] = useState(0);
    const [numberOfUpdatingUkUniversity, setNumberOfUpdatingUkUniversity] = useState(0);
    const [isUkUniversityToUpdated, setIsUkUniversityToUpdated] = useState(false);

    // For University Search
    const [isSearched, setIsSearched] = useState(false);
    const [queryUni, setQueryUni] = useState('');

    const queryUniRef = useRef(queryUni);

    useEffect(() => {
        queryUniRef.current = queryUni;
    }, [queryUni]);

    async function searchUnis() {
        setIsSearched(true);
        setIsFetching(true);
        fetchUkUniversities();
    }

    function resetUnis() {
        setQueryUni('');
        setIsFetching(true);
        setIsSearched(false);
        fetchUkUniversities();
    }

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
        if (numberOfUkUniversities - 1 >= nextNum) {
            setPrevNum((c) => c + 5);
            setNextNum((c) => c + 5);
        }
        fetchUkUniversities();
    }

    function decreaseMapCount() {
        setIsFetching(true);
        if (prevNum !== 0) {
            setPrevNum((c) => c - 5);
            setNextNum((c) => c - 5);
        }
        fetchUkUniversities();
    }

    function checkAndDecreaseMapCount(number: any, func: any) {
        const fractionalPart = number % 1;
        const targetFraction = 0.2;
        const precision = 1e-7;

        if (Math.abs(fractionalPart - targetFraction) < precision) {
            func();
        }
    }

    // Get Uk Universitties
    const fetchUkUniversities = async () => {
        resetForm(0);
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            await new Promise((e) => { setTimeout(e, 1200) })

            const queryParams = new URLSearchParams();
            if (queryUniRef.current !== '') queryParams.append('search', queryUniRef.current);
            queryParams.append('skip', prevNumRef.current.toString());
            queryParams.append('limit', "5");
            
            const response = await fetch(`${BACKEND_URL}/admin/finaluniversities?${queryParams.toString()}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const res = await response.json();
            setUkUniversities(res.data.universities);
            setNumberOfUkUniversities(res.data.total);
            setIsFetching(false);
        } catch (error) {
            console.error('Error fetching ukuniversities:', error);
            setIsFetching(false);
        }
    };

    useEffect(() => {
        setIsFetching(true);
        fetchUkUniversities();
    }, []);

    const resetForm = (val: number) => {
        setUniversityName('');
        setLocation('');
        setLogoLink('');
        setUniversityWebsitePage('');
        setUniversityCoursePage('');
        setGlobalRanking('');
        setAccreditation('one');
        setTutionFees('');
        setScholarships('');
        setResearchFacilities('');
        setJobPlacementRate('0%');
        setLivingCost('');
        setAverageSalary('');
        setStudentReview('0/5');
        if (val === 1) {
            fetchUkUniversities();
        }
    }

    // Update Uk Universities
    const inputSectionRef = useRef<HTMLDivElement | null>(null);

    const handleScrollToInputSection = () => {
        inputSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const goToUpadteUkUniversity = async (idx: number) => {
        setNumberOfUpdatingUkUniversity(idx);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/admin/finaluniversities/${idx}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data = await response.json();
            const universityToUpdate = data.university;

            setUniversityName(universityToUpdate.universityName);
            setLocation(universityToUpdate.location);
            setLogoLink(universityToUpdate.logoLink);
            setUniversityWebsitePage(universityToUpdate.universityWebsitePage);
            setUniversityCoursePage(universityToUpdate.universityCoursePage);
            setGlobalRanking(universityToUpdate.globalRanking);
            setAccreditation(universityToUpdate.accreditation);
            setTutionFees(universityToUpdate.tutionFees);
            setScholarships(universityToUpdate.scholarships);
            setResearchFacilities(universityToUpdate.researchFacilities);
            setJobPlacementRate(universityToUpdate.jobPlacementRate);
            setLivingCost(universityToUpdate.livingCost);
            setAverageSalary(universityToUpdate.averageSalary);
            setStudentReview(universityToUpdate.studentReview);
            setIsUkUniversityToUpdated(true);
            handleScrollToInputSection();
        } catch (error) {
            console.error('Error fetching ukuniversities:', error);
        }
    }

    const updateUkUniversity = () => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        if (universityName && location && logoLink && universityWebsitePage && universityCoursePage && globalRanking && accreditation !== 'one' && tutionFees && scholarships && researchFacilities && jobPlacementRate && livingCost && averageSalary && studentReview) {
            fetch(`${BACKEND_URL}/admin/finaluniversities/update`, {
                method: "PUT",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: numberOfUpdatingUkUniversity, universityName, location, logoLink, universityWebsitePage, universityCoursePage, globalRanking, accreditation, tutionFees, scholarships, researchFacilities, jobPlacementRate, livingCost, averageSalary, studentReview }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        setIsFetching(false);
                        throw new Error("Failed to fetch data");
                    }
                    resetForm(1);
                    setIsUkUniversityToUpdated(false);
                    setIsSearched(false);
                    setQueryUni('');
                })
                .catch((error) => console.error("Error fetching ukuniversities:", error));
        } else {
            alert('Please fill in all fields before submitting.');
            setIsFetching(false);
            setIsSearched(false);
            setQueryUni('');
            return
        }
    }

    // Delete Uk Universities
    const deleteUkUniversity = (idx: number) => {
        setIsFetching(true);
        const token = localStorage.getItem('token');
        const result = numberOfUkUniversities / 5;

        if (!token) {
            return;
        }

        fetch(`${BACKEND_URL}/admin/finaluniversities/delete`, {
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
                resetForm(1);
                checkAndDecreaseMapCount(result, decreaseMapCount);
                setIsSearched(false);
                setQueryUni('');
            })
            .catch((error) => console.error("Error fetching ukuniversities:", error));
    }

    // Add Uk Universities
    const addUkUniversity = async () => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        if (universityName && location && logoLink && universityWebsitePage && universityCoursePage && globalRanking && accreditation !== 'one' && tutionFees && scholarships && researchFacilities && jobPlacementRate && livingCost && averageSalary && studentReview) {

            fetch(`${BACKEND_URL}/admin/finaluniversities/add`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ universityName, location, logoLink, universityWebsitePage, universityCoursePage, globalRanking, accreditation, tutionFees, scholarships, researchFacilities, jobPlacementRate, livingCost, averageSalary, studentReview }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        setIsFetching(false);
                        throw new Error("Failed to fetch data");
                    }
                    resetForm(1);
                    setIsSearched(false);
                    setQueryUni('');
                })
                .catch((error) => console.error("Error fetching ukuniversities:", error));
        } else {
            alert('Please fill in all fields before submitting.');
            setIsFetching(false);
            setIsSearched(false);
            setQueryUni('');
            return
        }
    }

    return (
        <>
            {isFetching && <div className='fixed w-96 h-full'>
                <div className='flex justify-center -mt-32 mr-96'>
                    <LoaderComponent />
                </div>
            </div>}
            {!isFetching && <div className="max-w-7xl mx-auto p-6 -mt-6 -ml-6">
                <div className='flex justify-center'>
                    <div className="flex justify-around bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-5 mb-8 text-white w-[1000px]">
                        <input
                            type="text"
                            id="queryUni"
                            value={queryUni}
                            onChange={(e) => setQueryUni(e.target.value)}
                            placeholder="Enter University Name"
                            className="p-2 w-full border border-black text-black rounded-lg mr-5"
                        />
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={isSearched ? resetUnis : searchUnis}
                            className="w-80 flex justify-center items-center btn btn-primary bg-gradient-to-r from-red-500 to-green-600 ml-5"
                        >
                            {isSearched ? <Cross className='mr-2 rotate-45' /> : <Search className='mr-2' />}
                            {isSearched ? <p>Reset</p> : <p>Search University</p>}
                        </motion.button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 w-[1100px]">
                    {ukUniversities.map((ukuniversity, index) =>
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500"
                        >
                            <div className="flex items-start space-x-4 mb-5">
                                <div className="p-3 bg-green-200 rounded-lg">
                                    <University className="w-6 h-6 text-black" />
                                </div>
                                <div className="flex-1 mt-3">
                                    <b className="font-bold text-xl mb-2">{index + prevNum + 1}. {ukuniversity.universityName}</b><br /><br />
                                    <p className="font-light text-xl mb-2"><b className="font-bold text-lg mb-2">Location:</b> {ukuniversity.location}</p>
                                    <p className="font-light text-xl mb-2"><b className="font-bold text-lg mb-2">Logo Link:</b> {ukuniversity.logoLink}</p>
                                    <p className="font-light text-xl mb-2"><b className="font-bold text-lg mb-2">Website Link:</b> {ukuniversity.universityWebsitePage}</p>
                                    <p className="font-light text-xl mb-2"><b className="font-bold text-lg mb-2">Course Page Link:</b> {ukuniversity.universityCoursePage}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => goToUpadteUkUniversity(ukuniversity.id)}

                                    className="w-full btn btn-primary"
                                >
                                    View & Update University
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => deleteUkUniversity(ukuniversity.id)}
                                    className="w-full btn btn-primary"
                                >
                                    Delete University
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {numberOfUkUniversities > 5 && <div className="flex justify-center mt-8">
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
                        animate={{ opacity: nextNum >= numberOfUkUniversities ? 0.5 : 1 }}
                        disabled={nextNum >= numberOfUkUniversities}
                        onClick={() => increseMapCount()}
                        className="w-52 btn btn-primary ml-5 mr-5 flex justify-center items-center"
                    >
                        <p>Next Page</p>
                        <ArrowRightCircleIcon className='ml-1' />
                    </motion.button>
                </div>}

                <div ref={inputSectionRef} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 mt-8 text-white w-[1100px]">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                University Name:
                            </label>
                            <input
                                type="text"
                                id="universityName"
                                value={universityName}
                                onChange={(e) => setUniversityName(e.target.value)}
                                placeholder="Enter University Name"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                University Location:
                            </label>
                            <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Enter University Location"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                University Logo Link:
                            </label>
                            <input
                                type="text"
                                id="logoLink"
                                value={logoLink}
                                onChange={(e) => setLogoLink(e.target.value)}
                                placeholder="Enter University Logo Link"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block font-bold text-xl text-white mb-1">
                                University Website Link:
                            </label>
                            <input
                                type="text"
                                id="universityWebsitePage"
                                value={universityWebsitePage}
                                onChange={(e) => setUniversityWebsitePage(e.target.value)}
                                placeholder="Enter University Website Link"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="category" className="block font-bold text-xl text-white mb-1">
                                University Course Page Link:
                            </label>
                            <input
                                type="text"
                                id="universityCoursePage"
                                value={universityCoursePage}
                                onChange={(e) => setUniversityCoursePage(e.target.value)}
                                placeholder="Enter University Course Page Link"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="category" className="block font-bold text-xl text-white mb-1">
                                University Global Ranking:
                            </label>
                            <input
                                type="text"
                                id="universityCoursePage"
                                value={globalRanking}
                                onChange={(e) => setGlobalRanking(e.target.value)}
                                placeholder="Enter University Global Ranking"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block font-bold text-xl text-white mb-1">
                                University Accreditation:
                            </label>
                            <select
                                id="difficulty"
                                value={accreditation}
                                onChange={e => setAccreditation(e.target.value)}
                                className="w-full border border-black text-black rounded-lg h-10"
                            >
                                <option value="one">Select An Option</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="category" className="block font-bold text-xl text-white mb-1">
                                University Tuition Fees / Year:
                            </label>
                            <input
                                type="text"
                                id="universityCoursePage"
                                value={tutionFees}
                                onChange={(e) => setTutionFees(e.target.value)}
                                placeholder="Enter University Tuition Fees / Year"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="category" className="block font-bold text-xl text-white mb-1">
                                University Scholarships Availability:
                            </label>
                            <input
                                type="text"
                                id="universityCoursePage"
                                value={scholarships}
                                onChange={(e) => setScholarships(e.target.value)}
                                placeholder="Enter University Scholarships Availability"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="category" className="block font-bold text-xl text-white mb-1">
                                University Research Facilities:
                            </label>
                            <input
                                type="text"
                                id="universityCoursePage"
                                value={researchFacilities}
                                onChange={(e) => setResearchFacilities(e.target.value)}
                                placeholder="Enter University Research Facilities"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="category" className="block font-bold text-xl text-white mb-1">
                                University Job Placement Rate:
                            </label>
                            <input
                                type="text"
                                id="universityCoursePage"
                                value={jobPlacementRate}
                                onChange={(e) => setJobPlacementRate(e.target.value)}
                                placeholder="Enter University Job Placement Rate"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="category" className="block font-bold text-xl text-white mb-1">
                                University Living Costs / Year (Approx):
                            </label>
                            <input
                                type="text"
                                id="universityCoursePage"
                                value={livingCost}
                                onChange={(e) => setLivingCost(e.target.value)}
                                placeholder="Enter University Living Costs / Year"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="category" className="block font-bold text-xl text-white mb-1">
                                University Average Graduate Salary:
                            </label>
                            <input
                                type="text"
                                id="universityCoursePage"
                                value={averageSalary}
                                onChange={(e) => setAverageSalary(e.target.value)}
                                placeholder="Enter University Average Graduate Salary"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="category" className="block font-bold text-xl text-white mb-1">
                                Univrsity Student Reviews & Ratings:
                            </label>
                            <input
                                type="text"
                                id="universityCoursePage"
                                value={studentReview}
                                onChange={(e) => setStudentReview(e.target.value)}
                                placeholder="Enter University Student Reviews & Ratings"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>
                    </div>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={isUkUniversityToUpdated ? updateUkUniversity : addUkUniversity}
                        className="w-full btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                    >
                        {isUkUniversityToUpdated ? "Update UK University" : "Add UK University"}
                    </motion.button>
                </div>
            </div>}
        </>
    )
}

export default UkUniversities