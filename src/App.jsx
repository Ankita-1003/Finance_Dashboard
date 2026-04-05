import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';
import DashboardView from './components/Dashboard/Dashboard';
import TransactionsView from './components/Transactions/Transactions';
import AnalyticsView from './components/Analytics/Analytics';
import RoleSelection from './components/RoleSelection';
import { useFinance } from './context/FinanceContext';
import Settings from './components/Settings';
import { Toaster } from 'react-hot-toast';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { role } = useFinance();

  if (!role) {
    return <RoleSelection />;
  }

  return (
    <>
    <Toaster position="top-right" />

    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'transactions' && <TransactionsView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'settings' && <Settings />}
          </div>
        </main>
      </div>
    </div>

    </>
  );
  
}

export default App;
