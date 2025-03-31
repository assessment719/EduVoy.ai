import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from './../utils';
import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { expensesAtom, incomesAtom } from './../../../../Atoms/atoms';

const Dashboard = () => {
    const expenses = useRecoilValue(expensesAtom);
    const incomes = useRecoilValue(incomesAtom);

    const expenseData = [
        { name: 'Academic Cost', Amount: (expenses?.courseFees?.tuitionFees || 0) + (expenses?.courseFees?.books || 0) + (expenses?.courseFees?.research || 0) },
        { name: 'Accommodation', Amount: (expenses?.livingExpenses?.accommodation || 0) * 12 },
        { name: 'Food', Amount: (expenses?.livingExpenses?.food || 0) * 12 },
        { name: 'Transport', Amount: (expenses?.livingExpenses?.transport || 0) * 12 },
        { name: 'Utilities', Amount: (expenses?.livingExpenses?.utilities || 0) * 12 },
        { name: 'Personal', Amount: (expenses?.livingExpenses?.personal || 0) * 12 },
        { name: 'Health Insurance', Amount: (expenses?.healthExp?.healthInsurance || 0) + (expenses?.healthExp?.biometricExp || 0) + (expenses?.healthExp.tbTestExp || 0) + (expenses?.healthExp?.healthSurcharge || 0) },
        { name: 'Visa & Travel', Amount: (expenses?.travelExp?.visaFees || 0) + (expenses?.travelExp.flightCosts || 0) },
    ];

    const totalAnnualExpenses = expenseData.reduce((acc, item) => acc + item.Amount, 0);
    let monthlyIncome = 0;
    {
        Object.entries(incomes?.income ?? {}).map(([, value]) => (
            monthlyIncome += value
        ))
    }
    const annualIncome = monthlyIncome * 12;
    const savingsDeficit = annualIncome - totalAnnualExpenses;

    return (
        <>
            <div className="space-y-6 mb-14">
                <h1 className="text-4xl text-center font-bold text-gray-900">
                    Financial Overview
                </h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 w-[1100px] -ml-2"
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                            Annual Expenses
                        </h2>
                        <p className="text-3xl font-bold text-orange-400">
                            {formatCurrency(totalAnnualExpenses)}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                            Annual Income
                        </h2>
                        <p className="text-3xl font-bold text-green-600">
                            {formatCurrency(annualIncome)}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                            Annual Balance
                        </h2>
                        <p className={`text-3xl font-bold ${savingsDeficit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(savingsDeficit)}
                        </p>
                    </div>
                </motion.div>

                <div className="bg-white p-6 rounded-lg shadow-lg w-[1100px] -ml-2">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                        Annual Expense Breakdown
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={expenseData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value as number)}
                                />
                                <Bar dataKey="Amount" fill="#8bb87b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {savingsDeficit < 0 && (
                    <div className="bg-red-50 p-6 rounded-lg w-[1100px] -ml-2">
                        <h2 className="text-lg font-semibold text-red-800">
                            Financial Alert
                        </h2>
                        <p className="mt-2 text-red-700">
                            Your annual expenses exceed your income by {formatCurrency(Math.abs(savingsDeficit))}.
                            Consider reviewing your budget or exploring additional funding options.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

export default Dashboard;