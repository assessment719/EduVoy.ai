import { Building2, Plane, HeartPulse, BadgePoundSterling } from 'lucide-react';
import { formatCurrency } from './../utils';
import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userDetailsAtom, expensesAtom } from './../../../../Atoms/atoms';
import { BACKEND_URL } from './../../../../config';

const CostEstimator = () => {
    const userDetails = useRecoilValue(userDetailsAtom);
    const expenses = useRecoilValue(expensesAtom);
    const setExpenses = useSetRecoilState(expensesAtom);

    // Course Fees States
    const [tuitionFees, setTuitionFees] = useState(expenses.courseFees.tuitionFees);
    const [books, setBooks] = useState(expenses.courseFees.books);
    const [research, setResearch] = useState(expenses.courseFees.research);

    // Living Expenses States
    const [accommodation, setAccommodation] = useState(expenses.livingExpenses.accommodation);
    const [food, setFood] = useState(expenses.livingExpenses.food);
    const [transport, setTransport] = useState(expenses.livingExpenses.transport);
    const [utilities, setUtilities] = useState(expenses.livingExpenses.utilities);
    const [personal, setPersonal] = useState(expenses.livingExpenses.personal);

    // Travel Expenses States
    const [visaFees, setVisaFees] = useState(expenses.travelExp.visaFees);
    const [flightCosts, setFlightCosts] = useState(expenses.travelExp.flightCosts);

    // Health Expenses States
    const [healthInsurance, setHealthInsurance] = useState(expenses.healthExp.healthInsurance);
    const [biometricExp, setBiometricExp] = useState(expenses.healthExp.biometricExp);
    const [tbTestExp, setTbTestExp] = useState(expenses.healthExp.tbTestExp);
    const [healthSurcharge, setHealthSurcharge] = useState(expenses.healthExp.healthSurcharge);

    //To Calculate Cost Summery
    const totalLivingExpenses = accommodation + food + transport + utilities + personal;
    const totalCost = tuitionFees + (totalLivingExpenses * 12) + visaFees + flightCosts + healthInsurance + biometricExp + tbTestExp + healthSurcharge;

    const currentExpenses = {
        courseFees: {
            tuitionFees,
            books,
            research
        },
        livingExpenses: {
            accommodation,
            food,
            transport,
            utilities,
            personal
        },
        travelExp: {
            visaFees,
            flightCosts
        },
        healthExp: {
            healthInsurance,
            biometricExp,
            tbTestExp,
            healthSurcharge
        }
    }

    const saveEstimates = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        await fetch(`${BACKEND_URL}/users/updateField/expenses/${userDetails.id}`, {
            method: "PUT",
            headers: {
                'token': `${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                updatingField: {
                    expenses: currentExpenses
                }
            }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    alert('Sorry! Error While Saving. Please Try Again.');
                    throw new Error("Failed to fetch data");
                }
                setExpenses(currentExpenses);
                alert('Your Estimated cost Has Been Saved To Your Profile.');
            })
            .catch((error) => console.error("Error fetching questions:", error));
    }

    return (
        <>
            <div className="space-y-6 mb-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-[1100px] -ml-2">
                    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                        <div className="flex items-center space-x-2 text-2xl font-semibold text-gray-900">
                            <BadgePoundSterling className="h-8 w-8 text-green-200" />
                            <h2 className='underline underline-offset-8'>Tuition & Academic Costs</h2>
                        </div>
                        <div>
                            <label className="label">
                                Annual Tution Fees
                            </label>
                            <input
                                type="number"
                                value={tuitionFees === 0 ? '' : tuitionFees}
                                placeholder="Enter Amount"
                                onChange={(e) => setTuitionFees(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="label">
                                Books and Stationeries
                            </label>
                            <input
                                type="number"
                                value={books === 0 ? '' : books}
                                placeholder="Enter Amount"
                                onChange={(e) => setBooks(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="label">
                                Research and Project Expenses
                            </label>
                            <input
                                type="number"
                                value={research === 0 ? '' : research}
                                placeholder="Enter Amount"
                                onChange={(e) => setResearch(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                        <div className="flex items-center space-x-2 text-2xl font-semibold text-gray-900">
                            <Building2 className="h-8 w-8 text-green-200" />
                            <h2 className='underline underline-offset-8'>Monthly Living Expenses</h2>
                        </div>
                        <div>
                            <label className="label">
                                Accommodation
                            </label>
                            <input
                                type="number"
                                value={accommodation === 0 ? '' : accommodation}
                                placeholder="Enter Amount"
                                onChange={(e) => setAccommodation(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="label">
                                Food
                            </label>
                            <input
                                type="number"
                                value={food === 0 ? '' : food}
                                placeholder="Enter Amount"
                                onChange={(e) => setFood(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="label">
                                Transport
                            </label>
                            <input
                                type="number"
                                value={transport === 0 ? '' : transport}
                                placeholder="Enter Amount"
                                onChange={(e) => setTransport(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="label">
                                Utilities
                            </label>
                            <input
                                type="number"
                                value={utilities === 0 ? '' : utilities}
                                placeholder="Enter Amount"
                                onChange={(e) => setUtilities(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="label">
                                Personal
                            </label>
                            <input
                                type="number"
                                value={personal === 0 ? '' : personal}
                                placeholder="Enter Amount"
                                onChange={(e) => setPersonal(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                        <div className="flex items-center space-x-2 text-2xl font-semibold text-gray-900">
                            <Plane className="h-8 w-8 text-green-200" />
                            <h2 className='underline underline-offset-8'>Travel & Visa</h2>
                        </div>
                        <div>
                            <label className="label">
                                Visa Fees
                            </label>
                            <input
                                type="number"
                                value={visaFees === 0 ? '' : visaFees}
                                placeholder="Enter Amount"
                                onChange={(e) => setVisaFees(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="label">
                                Flight Costs
                            </label>
                            <input
                                type="number"
                                value={flightCosts === 0 ? '' : flightCosts}
                                placeholder="Enter Amount"
                                onChange={(e) => setFlightCosts(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                        <div className="flex items-center space-x-2 text-2xl font-semibold text-gray-900">
                            <HeartPulse className="h-8 w-8 text-green-200" />
                            <h2 className='underline underline-offset-8'>Health & Insurance</h2>
                        </div>
                        <div>
                            <label className="label">
                                Health Insurance (IHS)
                            </label>
                            <input
                                type="number"
                                value={healthInsurance === 0 ? '' : healthInsurance}
                                placeholder="Enter Amount"
                                onChange={(e) => setHealthInsurance(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="label">
                                Biometric Appointment
                            </label>
                            <input
                                type="number"
                                value={biometricExp === 0 ? '' : biometricExp}
                                placeholder="Enter Amount"
                                onChange={(e) => setBiometricExp(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="label">
                                Tuberculosis Test
                            </label>
                            <input
                                type="number"
                                value={tbTestExp === 0 ? '' : tbTestExp}
                                placeholder="Enter Amount"
                                onChange={(e) => setTbTestExp(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="label">
                                Immigration Health Surcharge
                            </label>
                            <input
                                type="number"
                                value={healthSurcharge === 0 ? '' : healthSurcharge}
                                placeholder="Enter Amount"
                                onChange={(e) => setHealthSurcharge(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg w-[1100px] -ml-2">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cost Summary</h2>
                    <div className="space-y-2 text-lg">
                        <div className="flex justify-between">
                            <span>Annual Tuition</span>
                            <span>{formatCurrency(tuitionFees)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Annual Living Expenses</span>
                            <span>{formatCurrency(totalLivingExpenses * 12)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Visa & Travel</span>
                            <span>{formatCurrency(visaFees + flightCosts)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Health & Insurance</span>
                            <span>{formatCurrency(healthInsurance + biometricExp + tbTestExp + healthSurcharge)}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total Estimated Cost</span>
                                <span>{formatCurrency(totalCost)}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={saveEstimates}
                        className="btn btn-primary w-full mt-5"
                    >
                        Save Estimates
                    </button>
                </div>
            </div>
        </>
    )
}

export default CostEstimator;