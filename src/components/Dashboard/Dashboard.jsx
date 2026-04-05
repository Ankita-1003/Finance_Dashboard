import React from 'react';
import SummaryCards from './SummaryCards';
import DashboardCharts from './Charts';
import Insights from './Insights';
import RecentTransactions from './RecentTransactions';

const DashboardView = () => {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">Dashboard Overview</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Welcome back! Here's what's happening with your finances today.</p>
      </div>
      
      <SummaryCards />
      
      <div className="mt-6">
        <DashboardCharts />
      </div>

      <div className="mt-6 mb-8">
        <RecentTransactions />
      </div>

      <div className="mt-6 mb-12">
        <Insights />
      </div>
    </>
  );
};

export default DashboardView;
