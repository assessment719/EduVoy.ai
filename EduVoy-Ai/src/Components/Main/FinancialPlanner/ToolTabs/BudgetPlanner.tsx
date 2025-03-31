import { Briefcase, PiggyBank, AlertCircle } from 'lucide-react';
import { formatCurrency } from './../utils';
import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userDetailsAtom, expensesAtom, incomesAtom } from './../../../../Atoms/atoms';
import { BACKEND_URL } from './../../../../config';

const BudgetPlanner = () => {
    const userDetails = useRecoilValue(userDetailsAtom);
    const expenses = useRecoilValue(expensesAtom);
    const incomes = useRecoilValue(incomesAtom);
    const setIncomes = useSetRecoilState(incomesAtom);

    // Income States
    const [partTimeWork, setPartTimeWork] = useState(incomes.income.partTimeWork);
    const [familySupport, setFamilySupport] = useState(incomes.income.familySupport);
    const [personalSavings, setPersonalSavings] = useState(incomes.income.personalSavings);
    const [other, setOther] = useState(incomes.income.other);

    // Goals States
    const [savingsGoal, setSavingsGoal] = useState(incomes.savingsGoal);
    const [emergencyFund, setEmergencyFund] = useState(incomes.emergencyFund);

    const monthlyIncome = partTimeWork + familySupport + (personalSavings / 12) + other;
    let monthlyExpenses = 0;
    {
        Object.entries(expenses?.livingExpenses ?? {}).map(([, value]) => (
            monthlyExpenses += value
        ))
    }
    const monthlyBalance = monthlyIncome - monthlyExpenses;
    const annualBalance = monthlyBalance * 12;

    const currentIncomes = {
        income: {
            partTimeWork,
            familySupport,
            personalSavings,
            other
        },
        savingsGoal,
        emergencyFund
    }

    const saveBudgetPlan = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        await fetch(`${BACKEND_URL}/users/updateField/incomes/${userDetails.id}`, {
            method: "PUT",
            headers: {
                'token': `${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                updatingField: {
                    incomes: currentIncomes
                }
            }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    alert('Sorry! Error While Saving. Please Try Again.');
                    throw new Error("Failed to fetch data");
                }
                setIncomes(currentIncomes);
                alert('Your Budget Plan Has Been Saved To Your Profile.');
            })
            .catch((error) => console.error("Error fetching questions:", error));
    }

    return (
        <>
            <div className="space-y-6 mb-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-[1100px] -ml-2">
                    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                        <div className="flex items-center space-x-2 text-2xl font-semibold text-gray-900">
                            <Briefcase className="h-8 w-8 text-green-200" />
                            <h2 className='underline underline-offset-8'>Monthly Income Sources</h2>
                        </div>

                        <div>
                            <label className="label">
                                Part-time Work
                            </label>
                            <input
                                type="number"
                                value={partTimeWork === 0 ? '' : partTimeWork}
                                placeholder="Enter Amount"
                                onChange={(e) => setPartTimeWork(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                            <p className="mt-1 text-lg text-gray-500">Maximum 20 hours per week during term time</p>
                        </div>

                        <div>
                            <label className="label">
                                Family Support
                            </label>
                            <input
                                type="number"
                                value={familySupport === 0 ? '' : familySupport}
                                placeholder="Enter Amount"
                                onChange={(e) => setFamilySupport(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="label">
                                Total Annual Savings
                            </label>
                            <input
                                type="number"
                                value={personalSavings === 0 ? '' : personalSavings}
                                placeholder="Enter Amount"
                                onChange={(e) => setPersonalSavings(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="label">
                                Other Monthly Income
                            </label>
                            <input
                                type="number"
                                value={other === 0 ? '' : other}
                                placeholder="Enter Amount"
                                onChange={(e) => setOther(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                        <div className="flex items-center space-x-2 text-2xl font-semibold text-gray-900">
                            <PiggyBank className="h-8 w-8 text-green-200" />
                            <h2 className='underline underline-offset-8'>Savings Goals</h2>
                        </div>

                        <div>
                            <label className="label">
                                Monthly Savings Target
                            </label>
                            <input
                                type="number"
                                value={savingsGoal === 0 ? '' : savingsGoal}
                                placeholder="Enter Amount"
                                onChange={(e) => setSavingsGoal(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="label">
                                Emergency Fund Target
                            </label>
                            <input
                                type="number"
                                value={emergencyFund === 0 ? '' : emergencyFund}
                                placeholder="Enter Amount"
                                onChange={(e) => setEmergencyFund(Number(e.target.value))}
                                className="input rounded-lg"
                            />
                        </div>

                        <div className="mt-4 p-4 bg-indigo-50 rounded-md">
                            <h3 className="text-xl font-medium text-indigo-800">
                                Savings Tips
                            </h3>
                            <ul className="mt-2 text-lg text-indigo-700 list-disc list-inside">
                                <li>Aim to save at least 10% of your monthly income</li>
                                <li>Build an emergency fund covering 3-6 months of expenses</li>
                                <li>Look for student discounts on essential items</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg w-[1100px] -ml-2">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Budget Summary</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-600">Monthly Income</h3>
                                <p className="mt-2 text-2xl font-bold text-green-600">
                                    {formatCurrency(monthlyIncome)}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-600">Monthly Expenses</h3>
                                <p className="mt-2 text-2xl font-bold text-orange-400">
                                    {formatCurrency(monthlyExpenses)}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-600">Monthly Balance</h3>
                                <p className={`mt-2 text-2xl font-bold ${monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(monthlyBalance)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-xl font-semibold text-gray mb-2">Annual Projection</h3>
                            <p className={`text-lg ${annualBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                Projected annual balance: {formatCurrency(annualBalance)}
                            </p>
                        </div>

                        {monthlyBalance < savingsGoal && (
                            <div className="mt-4 p-4 bg-red-50 rounded-md">
                                <div className="flex items-center space-x-2">
                                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                                    <h3 className="text-lg font-medium text-yellow-800">
                                        Savings Goal Alert
                                    </h3>
                                </div>
                                <p className="mt-2 text-lg text-yellow-70">
                                    Your current monthly balance is below your savings goal. Consider reducing expenses or finding additional income sources.
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={saveBudgetPlan}
                        className="btn btn-primary w-full mt-5"
                    >
                        Save Budget Plan
                    </button>
                </div>
            </div>
        </>
    )
}

export default BudgetPlanner;