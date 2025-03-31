import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calculator, PiggyBank, Wallet, Landmark } from 'lucide-react';
import Dashboard from "./ToolTabs/Dashboard";
import CostEstimator from "./ToolTabs/CostEstimator";
import BudgetPlanner from "./ToolTabs/BudgetPlanner";
import LoanCalculator from "./ToolTabs/LoanCalculator";
import FundingSources from "./ToolTabs/FundingSources/FundingSources";

function PlanningTools() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="tabListMain">
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="tabsList">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'cost', label: 'Cost Estimator', icon: Calculator },
                        { id: 'budget', label: 'Budget Planner', icon: PiggyBank },
                        { id: 'loan', label: 'Loan Calculator', icon: Wallet },
                        { id: 'source', label: 'Funding Sources', icon: Landmark },
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
                    <Tabs.Content value="dashboard">
                        <Dashboard />
                    </Tabs.Content>

                    <Tabs.Content value="cost">
                        <CostEstimator />
                    </Tabs.Content>

                    <Tabs.Content value="budget">
                        <BudgetPlanner />
                    </Tabs.Content>

                    <Tabs.Content value="loan">
                        <LoanCalculator />
                    </Tabs.Content>

                    <Tabs.Content value="source">
                        <FundingSources />
                    </Tabs.Content>
                </motion.div>
            </Tabs.Root>
        </div>
    );
}

export default PlanningTools;