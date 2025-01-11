import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { Laptop, BarChart2, BookOpen } from 'lucide-react';
import InterviewSimulator from './InterviewSimulator';
import Dashboard from './Dashboard';
import ResourceCenter from './ResourceCenter';

function Interview() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8">
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex gap-2 space-x-1 -ml-2 bg-gray-200 p-4 rounded-xl shadow-sm mb-8 font-bold w-[1100px]">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
            { id: 'simulator', label: 'Interview Simulator', icon: Laptop },
            { id: 'resources', label: 'Resource Center', icon: BookOpen },
          ].map(({ id, label, icon: Icon }) => (
            <Tabs.Trigger
              key={id}
              value={id}
              className={`flex-1 shadow-md shadow-black text-lg p-2 flex items-center justify-center space-x-2 rounded-lg transition-colors duration-200 cursor-pointer
                  ${activeTab === id
                  ? 'bg-green-200 text-white'
                  : 'hover:bg-gray-100'
                }
                `}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Tabs.Content value="dashboard">
            <Dashboard />
          </Tabs.Content>

          <Tabs.Content value="simulator" forceMount>
            <div
              className={`${activeTab !== 'simulator' ? 'hidden' : 'block'
                }`}
            >
              <InterviewSimulator />
            </div>
          </Tabs.Content>

          <Tabs.Content value="resources">
            <ResourceCenter />
          </Tabs.Content>
        </motion.div>
      </Tabs.Root>
    </div>
  );
}

export default Interview;