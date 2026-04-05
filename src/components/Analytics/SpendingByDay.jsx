import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Info } from 'lucide-react';

const SpendingByDay = () => {
  const { transactions, theme } = useFinance();

  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const spendingMap = { 'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0 };

    transactions.forEach(t => {
      if (t.type === 'expense') {
        const date = new Date(t.date);
        const dayName = days[date.getUTCDay()]; 
        spendingMap[dayName] += Number(t.amount);
      }
    });

    return days.map(day => ({
      name: day,
      amount: spendingMap[day]
    }));
  }, [transactions]);

  const textColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = theme === 'dark' ? '#374151' : '#f3f4f6';
  const accentColor = theme === 'dark' ? '#3b82f6' : '#2563eb'; 

  
  const maxAmount = Math.max(...chartData.map(d => d.amount));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Which Days Are Most Expensive?</h3>
          <div className="group relative z-10 hidden sm:block">
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 dark:bg-gray-700 text-xs text-white rounded-lg shadow-xl text-center font-normal">
              We add up your expenses by day of the week to reveal your habits.
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Historically, this is when you spend the most.</p>
      </div>
      
      {Math.max(...chartData.map(d => d.amount)) === 0 ? (
         <div className="h-64 flex items-center justify-center text-gray-500 text-sm">No expense data available.</div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 12}} width={45} tickFormatter={(val) => `$${val}`} />
              <RechartsTooltip 
                cursor={{fill: theme === 'dark' ? '#374151' : '#f3f4f6', opacity: 0.4}}
                formatter={(value) => [`$${value}`, 'Expenses']}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', 
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                }}
                labelStyle={{ color: theme === 'dark' ? '#ffffff' : '#111827', fontWeight: 'bold', marginBottom: '4px' }}
                itemStyle={{ color: theme === 'dark' ? '#f3f4f6' : '#111827' }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={50}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.amount === maxAmount ? '#f59e0b' : accentColor} /> // Highlight max spend day in amber
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SpendingByDay;
