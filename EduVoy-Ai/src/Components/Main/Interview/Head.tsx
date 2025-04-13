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
    <div className="tabListMain">
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="tabsList">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
            { id: 'simulator', label: 'Interview Simulator', icon: Laptop },
            { id: 'resources', label: 'Resource Center', icon: BookOpen },
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='-ml-2'
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