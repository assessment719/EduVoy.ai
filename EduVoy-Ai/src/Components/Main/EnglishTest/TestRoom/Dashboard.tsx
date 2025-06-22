import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRecoilValue } from 'recoil';
import ProgresBar from './../UI/ProgressBar';
import WeeklyProgresBar from './../UI/WeeklyProgressBar';
import { englishTests } from './../../../../Utils/englishTest';
import { englishTestsAtom } from './../../../../Atoms/atoms';
import { testNameAtom } from './../atoms';
import { useEffect, useState } from 'react';

function Dashboard() {
    const [currentTest, setCurrentTest] = useState<{ [key: string]: any }>({});
    const testName = useRecoilValue(testNameAtom);
    const englishTests: englishTests = useRecoilValue(englishTestsAtom);

    useEffect(() => {
        setCurrentTest(englishTests[testName as keyof englishTests]);
        console.log(englishTests[testName as keyof englishTests], 'englishTests[testName as keyof englishTests]');
    }, [])

    const weeklyProgress = [
        { weekNo: 1, topic: 'Understanding Test Structure + Basic Skills', value: currentTest?.currentDate < 7 ? (currentTest?.currentDate / 7) * 100 : 100 },
        { weekNo: 2, topic: 'Improving Accuracy + Advanced Question Types', value: currentTest?.currentDate < 14 ? ((currentTest?.currentDate - 7) / 7) * 100 : 100 },
        { weekNo: 3, topic: 'Time Management + Test Tactics', value: currentTest?.currentDate < 21 ? ((currentTest?.currentDate - 14) / 7) * 100 : 100 },
        { weekNo: 4, topic: 'Full Simulations + Error Analysis', value: currentTest?.currentDate < 28 ? ((currentTest?.currentDate - 21) / 7) * 100 : 100 },
        { weekNo: 5, topic: 'Exam Readiness + Stress Management', value: currentTest?.currentDate < 30 ? ((currentTest?.currentDate - 28) / 2) * 100 : 100 }
    ]

    const testReport = [
        { name: 'Listning Test', Marks: currentTest?.listeningScore },
        { name: 'Reading Test', Marks: currentTest?.readingScore },
        { name: 'Writting Test', Marks: (currentTest?.writingScoreTaskA + currentTest?.writingScoreTaskB) / 2 },
        { name: 'Speaking Test', Marks: (currentTest?.speakingScorePartA + currentTest?.speakingScorePartB + currentTest?.speakingScorePartC) / 3 }
    ]

    return (
        <>
            <div className='flex flex-col gap-5'>
                <div className='rounded-xl text-start border-2 border-gray-400 shadow-xl py-2 px-4'>
                    <h1 className='text-2xl font-bold'>Progress Overview</h1>
                    <p className='text-lg'>Day {currentTest?.currentDate} of 30</p>
                    <ProgresBar value={(currentTest?.currentDate / 30) * 100} />

                    <div className='text-center my-3'>
                        <p className='text-2xl font-bold'>{30 - currentTest?.currentDate}</p>
                        <p className='text-xl'>Days Remaining</p>
                    </div>
                </div>

                <div className='rounded-xl text-start border-2 border-gray-400 shadow-xl py-2 px-4'>
                    <h1 className='text-2xl font-bold'>Weekly Goals</h1>
                    <p className='text-lg'>Track your progress through each week</p>

                    <div className='grid grid-cols-2 gap-5 my-2'>
                        {weeklyProgress.map((week, index) => (
                            <WeeklyProgresBar
                                key={index}
                                weekNo={week.weekNo}
                                topic={week.topic}
                                value={week.value}
                            />
                        ))}
                    </div>
                </div>

                <div className='rounded-xl text-center border-2 border-gray-400 shadow-xl p-4'>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                        Individual Test Progress
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={testReport}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => value}
                                />
                                <Bar dataKey="Marks" fill="#8bb87b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Dashboard;