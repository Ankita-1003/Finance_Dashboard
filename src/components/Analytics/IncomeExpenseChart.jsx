import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { Info } from 'lucide-react';

const IncomeExpenseChart = () => {
  const { transactions, theme } = useFinance();

  const chartData = useMemo(() => {
    const monthlyData = {};

    transactions.forEach(t => {
      const monthKey = t.date.substring(0, 7);
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { name: monthKey, income: 0, expense: 0, monthSort: monthKey };
      }
      if (t.type === 'income') {
        monthlyData[monthKey].income += Number(t.amount);
      } else {
        monthlyData[monthKey].expense += Number(t.amount);
      }
    });

    return Object.values(monthlyData)
      .sort((a, b) => a.monthSort.localeCompare(b.monthSort))
      .map(d => ({
        ...d,
        name: format(parseISO(`${d.name}-01`), 'MMM yyyy')
      }));
  }, [transactions]);

  const textColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = theme === 'dark' ? '#374151' : '#f3f4f6';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm h-full">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Money In vs. Money Out</h3>
          <div className="group relative z-10 hidden sm:block">
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-56 p-2 bg-gray-900 dark:bg-gray-700 text-xs text-white rounded-lg shadow-xl text-center font-normal">
              Compare your total earnings to your total spending per month.
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">See your monthly cash flow at a glance.</p>
      </div>
      
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500 text-sm">No data available yet.</div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 12}} width={45} tickFormatter={(val) => `$${val}`} />
              <RechartsTooltip 
                cursor={{fill: theme === 'dark' ? '#374151' : '#f3f4f6', opacity: 0.4}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', color: theme === 'dark' ? '#f3f4f6' : '#111827' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: textColor, paddingTop: '10px' }} iconType="circle" />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default IncomeExpenseChart;
