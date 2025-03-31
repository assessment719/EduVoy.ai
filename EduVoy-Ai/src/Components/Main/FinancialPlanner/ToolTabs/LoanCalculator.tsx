import { formatCurrency, calculateMonthlyPayment } from './../utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userDetailsAtom, loanAtom } from './../../../../Atoms/atoms';
import { BACKEND_URL } from './../../../../config';

const LoanCalculator = () => {
    const userDetails = useRecoilValue(userDetailsAtom);
    const loan = useRecoilValue(loanAtom);
    const setLoan = useSetRecoilState(loanAtom);

    const [amount, setAmount] = useState(loan.amount);
    const [interestRate, setInterestRate] = useState(loan.interestRate);
    const [termYears, setTermYears] = useState(loan.termYears);
    const [scenarios, setScenarios] = useState<Array<{ year: number, balance: number }>>([]);

    let monthlyPayment = 0;
    if (amount !== 0 && interestRate !== 0 && termYears !== 0) {
        monthlyPayment = calculateMonthlyPayment(amount, interestRate, termYears);
    }
    const totalPayment = monthlyPayment * termYears * 12;
    const totalInterest = totalPayment - amount;

    useEffect(() => {
        const calculateAmortization = () => {
            const monthlyRate = interestRate / 12 / 100;
            let balance = amount;
            const yearlyData = [];

            for (let year = 0; year <= termYears; year++) {
                yearlyData.push({
                    year,
                    balance: Math.round(balance)
                });

                for (let month = 0; month < 12; month++) {
                    const interest = balance * monthlyRate;
                    balance = balance - (monthlyPayment - interest);
                }
            }

            setScenarios(yearlyData);
        };

        calculateAmortization();
    }, [amount, interestRate, termYears, monthlyPayment]);

    const cureentLoan = {
        amount,
        interestRate,
        termYears
    }

    const saveLoanDetails = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        await fetch(`${BACKEND_URL}/users/updateField/loan/${userDetails.id}`, {
            method: "PUT",
            headers: {
                'token': `${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                updatingField: {
                    loan: cureentLoan
                }
            }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    alert('Sorry! Error While Saving. Please Try Again.');
                    throw new Error("Failed to fetch data");
                }
                setLoan(cureentLoan);
                alert('Your Loan Details Has Been Saved To Your Profile.');
            })
            .catch((error) => console.error("Error fetching questions:", error));
    }

    return (
        <>
            <div className="space-y-6 mb-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-[1100px] -ml-2">
                    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900">Loan Details</h2>

                        <div>
                            <label className="label">
                                Loan Amount
                            </label>
                            <input
                                type="number"
                                value={amount === 0 ? '' : amount}
                                placeholder="Enter Amount"
                                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                                className="input rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="label">
                                Annual Interest Rate (%)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={interestRate === 0 ? '' : interestRate}
                                placeholder="Enter Interest Rate"
                                onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                                className="input rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="label">
                                Loan Term (years)
                            </label>
                            <input
                                type="number"
                                value={termYears === 0 ? '' : termYears}
                                placeholder="Enter Term Years"
                                onChange={(e) => setTermYears(Number(e.target.value) || 0)}
                                className="input rounded-lg"
                            />
                        </div>
                        <button
                            onClick={saveLoanDetails}
                            className="btn btn-primary w-full mt-5"
                        >
                            Save Loan Details
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900">Payment Summary</h2>

                        <div className="space-y-2 text-lg">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Monthly Payment</span>
                                <span className="font-semibold text-green-600">{formatCurrency(monthlyPayment)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Interest</span>
                                <span className="font-semibold text-orange-400">{formatCurrency(totalInterest)}</span>
                            </div>

                            <div className="flex justify-between pt-2 border-t">
                                <span className="text-gray-600">Total Payment</span>
                                <span className="font-semibold text-green-600">{formatCurrency(totalPayment)}</span>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-indigo-50 rounded-md">
                            <h3 className="text-xl font-medium text-indigo-800">Quick Tips</h3>
                            <ul className="mt-2 text-lg text-indigo-700 list-disc list-inside">
                                <li>Consider prepayment options to reduce total interest</li>
                                <li>Check for education-specific loan schemes</li>
                                <li>Compare multiple lenders for best rates</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg w-[1100px] -ml-2">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Loan Balance Over Time
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={scenarios}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="year"
                                    label={{ value: 'Years', position: 'bottom' }}
                                />
                                <YAxis
                                    tickFormatter={(value) => `£${value.toLocaleString()}`}
                                />
                                <Tooltip
                                    formatter={(value) => [`£${Number(value).toLocaleString()}`, 'Balance']}
                                    labelFormatter={(label) => `Year ${label}`}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="balance"
                                    stroke="#8bb87b"
                                    strokeWidth={3}
                                    dot={true}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoanCalculator;