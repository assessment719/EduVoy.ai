import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { exportRecentScores } from './analysation'

const Dashboard = () => {
  const [recentScores, setRecentScores] = useState(exportRecentScores());

  const bestScore = Math.max(...recentScores.map((session) => session.score));
  const recentSession = recentScores[recentScores.length - 1];

  useEffect(() => {
    const updatedScores = exportRecentScores();
    setRecentScores(updatedScores);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-200 rounded-lg">
              <Trophy className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="font-bold text-lg">Best Score</p>
              <h3 className="text-2xl font-bold">{bestScore}%</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-200 rounded-lg">
              <Target className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="font-bold text-lg">Sessions Completed</p>
              <h3 className="text-2xl font-bold">{recentSession ? recentSession.session : 0}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Progress Overview</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recentScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="session" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8bb87b"
                strokeWidth={2}
                dot={{ fill: '#000' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;