import { CreditCard, ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { BACKEND_URL } from './../../../../config';
import { LoansType } from './../../../../utils/loans';
import LoaderComponent from '../../../loader';

const Loans: React.FC = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [resources, setResources] = useState<LoansType[]>([]);
    const [numberOfResources, setNumberOfResources] = useState(0);
    const [numberOfUpdatingResource, setNumberOfUpdatingResource] = useState(0);
    const [isResourceToUpdated, setIsResourceToUpdated] = useState(false);

    // Set Of Add Or Update Resources
    const [title, setTitle] = useState('');
    const [bankName, setBankName] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [collateral, setCollateral] = useState('all');
    const [featuresString, setFeatures] = useState('');
    const [eligibilityString, setEligibility] = useState('');
    const [tenure, setTenure] = useState('');
    const [processingFee, setProcessingFee] = useState('');
    const [link, setLink] = useState('');

    const resetForm = (val: number) => {
        setTitle('');
        setBankName('');
        setInterestRate('');
        setMaxAmount('');
        setCollateral('all');
        setFeatures('');
        setEligibility('');
        setTenure('');
        setProcessingFee('');
        setLink('');
        if (val === 1) {
            fetchResources();
        }
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

    // Miscellenous
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
        if (numberOfResources - 1 >= nextNum) {
            setPrevNum((c) => c + 5);
            setNextNum((c) => c + 5);
        }
        fetchResources();
    }

    function decreaseMapCount() {
        setIsFetching(true);
        if (prevNum !== 0) {
            setPrevNum((c) => c - 5);
            setNextNum((c) => c - 5);
        }
        fetchResources();
    }

    function checkAndDecreaseMapCount(number: any, func: any) {
        const fractionalPart = number % 1;
        const targetFraction = 0.2;
        const precision = 1e-7;

        if (Math.abs(fractionalPart - targetFraction) < precision) {
            func();
        }
    }

    //Get Resources
    const fetchResources = async () => {
        resetForm(0);
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            await new Promise((e) => { setTimeout(e, 1200) })

            const queryParams = new URLSearchParams();
            queryParams.append('skip', prevNumRef.current.toString());
            queryParams.append('limit', "5");

            const response = await fetch(`${BACKEND_URL}/admin/finresources/loan?${queryParams.toString()}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const res = await response.json();
            setResources(res.data.resources);
            setNumberOfResources(res.data.total);
            setIsFetching(false);
        } catch (error) {
            console.error('Error fetching resources:', error);
            setIsFetching(false);
        }
    };

    // Update Resource
    const goToUpadteResource = async (idx: number) => {
        setNumberOfUpdatingResource(idx);
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/admin/finresources/loan/${idx}`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data = await response.json();
            const resourceToUpdate: LoansType = data.resource;

            setTitle(resourceToUpdate.title);
            setBankName(resourceToUpdate.bankName);
            setInterestRate(resourceToUpdate.interestRate);
            setMaxAmount(resourceToUpdate.maxAmount);
            setCollateral(resourceToUpdate.collateral);
            setFeatures(resourceToUpdate.features.join(" : "));
            setEligibility(resourceToUpdate.eligibility.join(" : "));
            setTenure(resourceToUpdate.tenure);
            setProcessingFee(resourceToUpdate.processingFee);
            setLink(resourceToUpdate.link);

            setIsResourceToUpdated(true);
            handleScrollToInputSection();
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    }

    const updateResource = () => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        if (title && bankName && interestRate && maxAmount && collateral !== 'all' && featuresString && eligibilityString && tenure && processingFee && link) {
            fetch(`${BACKEND_URL}/admin/finresources/update/loan`, {
                method: "PUT",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: numberOfUpdatingResource, title, bankName, interestRate, maxAmount, collateral, features: featuresString.split(" : "), eligibility: eligibilityString.split(" : "), tenure, processingFee, link }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        setIsFetching(false);
                        throw new Error("Failed to fetch data");
                    }
                    handleScrollToTopSection();
                    resetForm(1);
                    setIsResourceToUpdated(false);
                })
                .catch((error) => console.error("Error fetching resources:", error));
        } else {
            alert('Please fill in all fields before submitting.');
            setIsFetching(false);
            return
        }
    }

    //Add Resource
    const addResource = () => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        if (title && bankName && interestRate && maxAmount && collateral !== 'all' && featuresString && eligibilityString && tenure && processingFee && link) {

            fetch(`${BACKEND_URL}/admin/finresources/add/loan`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, bankName, interestRate, maxAmount, collateral, features: featuresString.split(" : "), eligibility: eligibilityString.split(" : "), tenure, processingFee, link }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        setIsFetching(false);
                        throw new Error("Failed to fetch data");
                    }
                    handleScrollToTopSection();
                    resetForm(1);
                })
                .catch((error) => console.error("Error fetching resources:", error));
        } else {
            alert('Please fill in all fields before submitting.');
            setIsFetching(false);
            return
        }
    }

    // Delete Resource
    const deleteResource = (idx: number) => {
        setIsFetching(true);
        const token = localStorage.getItem('token');
        const result = numberOfResources / 5;

        if (!token) {
            return;
        }

        fetch(`${BACKEND_URL}/admin/finresources/delete/loan`, {
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
                resetForm(1);
            })
            .catch((error) => console.error("Error fetching course:", error));
    }

    useEffect(() => {
        setIsFetching(true);
        fetchResources();
    }, []);

    return (
        <>
            {isFetching && <div className='fixed -ml-36 -mt-20'>
                <LoaderComponent />
            </div>}

            {!isFetching && <div className="max-w-7xl mx-auto py-6 -mt-6">
                <div className="grid grid-cols-1 gap-6 -ml-2 w-[1100px]">
                    {resources.map((resource, index) =>
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500"
                        >
                            <div ref={topSectionRef} className="flex items-start space-x-4 mb-5">
                                <div className="p-3 bg-green-200 rounded-lg">
                                    <CreditCard className="w-6 h-6 text-black" />
                                </div>
                                <div className="flex-1 mt-3">
                                    <b className="font-bold text-xl mb-2">{index + prevNum + 1}. {resource.title}</b>
                                    <br /><br />
                                    <p className="font-light text-xl mb-2"><b className="font-bold text-lg mb-2">Provider:</b> {resource.bankName}</p>
                                    <div className='grid grid-cols-2'>
                                        <p className="font-light text-xl mb-2">
                                            <b className="font-bold text-lg mb-3">Interest Rate:</b> {resource.interestRate}
                                        </p>

                                        <p className="font-light text-xl mb-2">
                                            <b className="font-bold text-lg mb-3">Max Amount:</b> {resource.maxAmount}
                                        </p>
                                    </div>

                                    <div className='grid grid-cols-2'>
                                        <p className="font-light text-xl mb-2">
                                            <b className="font-bold text-lg mb-3">Repayment Tenure:</b> {resource.tenure}
                                        </p>

                                        <p className="font-light text-xl mb-2">
                                            <b className="font-bold text-lg mb-3">Collateral Requirements:</b> {resource.collateral}
                                        </p>
                                    </div>

                                    <p className="font-light text-xl mb-2"><b className="font-bold text-lg mb-2">Link:</b> {resource.link}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => goToUpadteResource(resource.id)}

                                    className="w-full btn btn-primary"
                                >
                                    View & Update Resource
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => deleteResource(resource.id)}
                                    className="w-full btn btn-primary"
                                >
                                    Delete Resource
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {numberOfResources > 5 && <div className="flex justify-center mt-5">
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
                        animate={{ opacity: nextNum >= numberOfResources ? 0.5 : 1 }}
                        disabled={nextNum >= numberOfResources}
                        onClick={() => increseMapCount()}
                        className="w-52 btn btn-primary ml-5 mr-5 flex justify-center items-center"
                    >
                        <p>Next Page</p>
                        <ArrowRightCircleIcon className='ml-1' />
                    </motion.button>
                </div>}

                <div ref={inputSectionRef} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 mt-8 text-white -ml-2 w-[1100px]">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Loan Title:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter Loan Title"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Loan Provider:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                placeholder="Enter Loan Prviding Institute Name"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Interest Rate:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={interestRate}
                                onChange={(e) => setInterestRate(e.target.value)}
                                placeholder="Enter Interest Rate"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Maximum Loan Amount:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={maxAmount}
                                onChange={(e) => setMaxAmount(e.target.value)}
                                placeholder="Enter Maximum Loan Amount"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="difficulty" className="block font-bold text-xl text-white mb-1">
                                Collateral Requirements:
                            </label>
                            <select
                                id="difficulty"
                                value={collateral}
                                onChange={e => setCollateral(e.target.value)}
                                className="w-full border border-black text-black rounded-lg h-10"
                            >
                                <option value="all">Select An Option</option>
                                <option value="Required">Required</option>
                                <option value="Optional">Optional</option>
                                <option value="Not Required">Not Required</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Features Of Loan (Add " : " Between Two Values):
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={featuresString}
                                onChange={(e) => setFeatures(e.target.value)}
                                placeholder="Enter Features Of Loan"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Eligibilities To Apply (Add " : " Between Two Values):
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={eligibilityString}
                                onChange={(e) => setEligibility(e.target.value)}
                                placeholder="Enter Eligibilities To Apply"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Loan Repayment Tenure:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={tenure}
                                onChange={(e) => setTenure(e.target.value)}
                                placeholder="Enter Loan Repayment Tenure"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Loan Processing Fee:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={processingFee}
                                onChange={(e) => setProcessingFee(e.target.value)}
                                placeholder="Enter Processing Fee"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Loan Apply Link:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="Enter Loan Apply Link"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>
                    </div>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={isResourceToUpdated ? updateResource : addResource}
                        className="w-full btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                    >
                        {isResourceToUpdated ? "Update Resource" : "Add Resource"}
                    </motion.button>
                </div>
            </div>}
        </>
    )
}

export default Loans;