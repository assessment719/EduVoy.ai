import AnimatedStatCard from './../../AnimatedCard';
import { motion } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import { GraduationCap, CreditCard, BriefcaseBusiness } from 'lucide-react';
import { useState, useEffect } from 'react';
import Scholarships from './Sources/Scholarship';
import Loans from './Sources/Loan';
import Jobs from './Sources/Job';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userDetailsAtom, scholarshipListAtom, loanListAtom, jobListAtom } from './../../../../../Atoms/atoms';
import { BACKEND_URL } from './../../../../../config';

const FundingSources = () => {
    const [activeTab, setActiveTab] = useState('scholarship');
    const userDetails = useRecoilValue(userDetailsAtom);
    const setScholarships = useSetRecoilState(scholarshipListAtom);
    const setLoans = useSetRecoilState(loanListAtom);
    const setJobs = useSetRecoilState(jobListAtom);

    const fundingStats = [
        {
            title: 'Average Scholarship',
            value: 12000,
            prefix: '£',
            description: 'Average scholarship amount for Indian students in the UK'
        },
        {
            title: 'Part-Time Income',
            value: 9600,
            prefix: '£',
            suffix: '/year',
            description: 'Potential annual income from part-time work (20hrs/week)'
        },
        {
            title: 'Available Scholarships',
            value: 500,
            suffix: '+',
            description: 'Scholarships available for Indian students'
        },
        {
            title: 'Student Loan Rate',
            value: 9.5,
            suffix: '%',
            description: 'Average interest rate on Indian student loans for UK study'
        }
    ];

    const fetchShortlist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
    
            const urls = [
                `${BACKEND_URL}/users/getField/scholarships/${userDetails.id}`,
                `${BACKEND_URL}/users/getField/loans/${userDetails.id}`,
                `${BACKEND_URL}/users/getField/jobs/${userDetails.id}`
            ];
    
            // Execute all fetch requests in parallel
            const [scholarshipRes, loanRes, jobRes] = await Promise.all(
                urls.map(url =>
                    fetch(url, {
                        method: "GET",
                        headers: { 'token': token }
                    }).then(res => res.json())
                )
            );
    
            // Process scholarships
            let obj1: { [key: string]: boolean } = {};
            scholarshipRes.fieldDetails.scholarships.forEach((courseId: number) => {
                obj1[courseId] = true;
            });
            setScholarships(obj1);
    
            // Process loans
            let obj2: { [key: string]: boolean } = {};
            loanRes.fieldDetails.loans.forEach((courseId: number) => {
                obj2[courseId] = true;
            });
            setLoans(obj2);
    
            // Process jobs
            let obj3: { [key: string]: boolean } = {};
            jobRes.fieldDetails.jobs.forEach((courseId: number) => {
                obj3[courseId] = true;
            });
            setJobs(obj3);
    
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    useEffect(() => {
        fetchShortlist();
    }, [])

    return (
        <>
            <div className="max-w-7xl mx-auto mb-14 -ml-2">
                <div className="text-center mb-12 animate-on-scroll">
                    <h1 className="text-4xl font-bold mb-2">Funding Sources</h1>
                    <p className="text-xl text-muted-foreground">
                        Discover scholarships, loans, and part-time work opportunities to fund your UK education.
                    </p>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-12">
                    {fundingStats.map((stat, index) => (
                        <AnimatedStatCard
                            key={index}
                            stat={stat}
                            index={index}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{
                        once: true,
                        margin: "0px 0px -30% 0px",
                    }}
                    transition={{ delay: 0.1 }}
                    className='flex justify-center'
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-[1000px]">
                        <div className="bg-white rounded-lg shadow-xl p-6 h-full">
                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center mb-4">
                                    <GraduationCap className="h-6 w-6 text-black" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Scholarships & Grants</h2>
                                <p className="text-gray-500 text-lg">
                                    Financial aid that doesn't need to be repaid, based on merit, need, or specific criteria.
                                </p>
                            </div>
                            <div className="mt-4">
                                <ul className="space-y-2 text-lg">
                                    <li className="flex items-start space-x-2">
                                        <div className="h-5 w-5 flex items-center justify-center mt-0.5 rounded-full bg-green-200">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
                                        </div>
                                        <span className="flex-1">No repayment required</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <div className="h-5 w-5 flex items-center justify-center mt-0.5 rounded-full bg-green-200">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
                                        </div>
                                        <span className="flex-1">Competitive application process</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <div className="h-5 w-5 flex items-center justify-center mt-0.5 rounded-full bg-green-200">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
                                        </div>
                                        <span className="flex-1">Often require strong academic performance</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-xl p-6 h-full">
                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center mb-4">
                                    <CreditCard className="h-6 w-6 text-black" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Education Loans</h2>
                                <p className="text-gray-500 text-lg">
                                    Borrowed funds specifically for education expenses that must be repaid with interest.
                                </p>
                            </div>
                            <div className="mt-4">
                                <ul className="space-y-2 text-lg">
                                    <li className="flex items-start space-x-2">
                                        <div className="h-5 w-5 flex items-center justify-center mt-0.5 rounded-full bg-green-200">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
                                        </div>
                                        <span className="flex-1">Cover tuition and living expenses</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <div className="h-5 w-5 flex items-center justify-center mt-0.5 rounded-full bg-green-200">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
                                        </div>
                                        <span className="flex-1">Repayment typically begins after graduation</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <div className="h-5 w-5 flex items-center justify-center mt-0.5 rounded-full bg-green-200">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
                                        </div>
                                        <span className="flex-1">May require collateral or guarantor</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-xl p-6 h-full">
                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center mb-4">
                                    <BriefcaseBusiness className="h-6 w-6 text-black" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Part-Time Work</h2>
                                <p className="text-gray-500 text-lg">
                                    Employment opportunities available to international students during their studies.
                                </p>
                            </div>
                            <div className="mt-4">
                                <ul className="space-y-2 text-lg">
                                    <li className="flex items-start space-x-2">
                                        <div className="h-5 w-5 flex items-center justify-center mt-0.5 rounded-full bg-green-200">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
                                        </div>
                                        <span className="flex-1">Up to 20 hours per week during term time</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <div className="h-5 w-5 flex items-center justify-center mt-0.5 rounded-full bg-green-200">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
                                        </div>
                                        <span className="flex-1">Full-time during holidays</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <div className="h-5 w-5 flex items-center justify-center mt-0.5 rounded-full bg-green-200">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
                                        </div>
                                        <span className="flex-1">Provides experience and supplementary income</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="tabListMain px-0 my-10">
                    <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                        <div className='flex justify-center'>
                            <Tabs.List className="tabsList mb-5 w-[900px]">
                                {[
                                    { id: 'scholarship', label: 'Scholarships', icon: GraduationCap },
                                    { id: 'loans', label: 'Loans', icon: CreditCard },
                                    { id: 'jobs', label: 'Part-Time Jobs', icon: BriefcaseBusiness }
                                ].map(({ id, label, icon: Icon }) => (
                                    <Tabs.Trigger
                                        key={id}
                                        value={id}
                                        className={`tabs space-x-2
                  ${activeTab === id
                                                ? 'activeTab'
                                                : 'inActiveTab'
                                            }
                `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{label}</span>
                                    </Tabs.Trigger>
                                ))}
                            </Tabs.List>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className='flex justify-center'
                        >
                            <Tabs.Content value="scholarship">
                                <Scholarships />
                            </Tabs.Content>

                            <Tabs.Content value="loans">
                                <Loans />
                            </Tabs.Content>

                            <Tabs.Content value="jobs">
                                <Jobs />
                            </Tabs.Content>
                        </motion.div>
                    </Tabs.Root>
                </div>
            </div >
        </>
    )
}

export default FundingSources;