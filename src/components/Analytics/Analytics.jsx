import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Download, TrendingUp, AlertTriangle } from 'lucide-react';
import IncomeExpenseChart from './IncomeExpenseChart';
import BudgetVsActuals from './BudgetVsActuals';
import SpendingByDay from './SpendingByDay';
import AnalyticsSummary from './AnalyticsSummary';

const AnalyticsView = () => {
  const { role, transactions } = useFinance();

  const handleExport = () => {
    
    // Generate CSV stub
    const csvContent = "data:text/csv;charset=utf-8,Date,Type,Category,Amount\n" 
      + transactions.map(t => `${t.date},${t.type},${t.category},${t.amount}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "finance_analytics_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">Advanced Analytics</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Deep dive into your spending patterns and financial health.</p>
        </div>
        
        {role === 'admin' && (
          <button 
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        )}
      </div>

      {role === 'admin' && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-4">
            <div className="p-2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">System Forecast</h4>
              <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mt-1">Based on global historical data, users save 15% more when tracking daily.</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-4">
            <div className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">Anomaly Detected</h4>
              <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-1">Overall platform dining expenses increased by 12% this month.</p>
            </div>
          </div>
        </div>
      )}

      <AnalyticsSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart />
        </div>
        <div>
          <BudgetVsActuals />
        </div>
      </div>
      
      <div className="mt-6">
        <SpendingByDay />
      </div>
    </>
  );
};

export default AnalyticsView;
