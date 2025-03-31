import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { GraduationCap, CreditCard, BriefcaseBusiness } from 'lucide-react';
import Scholarships from './Resources/Scholarships';
import Loans from './Resources/Loans';
import Jobs from './Resources/Jobs';

function FinancialTools() {
    const [activeTab, setActiveTab] = useState('scholarship');

    return (
        <div className="tabListMain">
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="tabsList">
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
    );
}

export default FinancialTools;