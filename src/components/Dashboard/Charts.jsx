import React, { useMemo, useState } from 'react';
import { format, subDays } from 'date-fns';
import { useFinance } from '../../context/FinanceContext';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';

const COLORS = ['#3b82f6', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#d946ef', '#8b5cf6'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  if (percent < 0.05) return null; 
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold" className="pointer-events-none">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const DashboardCharts = () => {
  const { transactions, theme } = useFinance();
  const [dateRange, setDateRange] = useState({ 
    start: '', 
    end: '' 
  });

  // Process data for charts
  const { areaData, pieData, trendKeyword } = useMemo(() => {
    // Pie Chart: Expenses by Category
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});
    const pieData = Object.keys(categoryTotals).map((key) => ({
      name: key,
      value: categoryTotals[key],
    })).sort((a,b) => b.value - a.value);

    // Area Chart: Income vs Expenses over time
    const sortedTxns = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    //  Calculate running totals for the entire timeline first
    const dailyBalances = [];
    let runningBalance = 0;
    
    // Map for quick lookup of transaction totals per day
    const txnMap = {};
    sortedTxns.forEach(t => {
      if (!txnMap[t.date]) txnMap[t.date] = { income: 0, expense: 0 };
      if (t.type === 'income') txnMap[t.date].income += Number(t.amount);
      if (t.type === 'expense') txnMap[t.date].expense += Number(t.amount);
    });

    // Identify the range to display
    const startDate = dateRange.start || (sortedTxns.length > 0 ? sortedTxns[0].date : format(new Date(), 'yyyy-MM-dd'));
    const endDate = dateRange.end || format(new Date(), 'yyyy-MM-dd');

    // Calculate cumulative balance upto the start date
    let cumulativeBalance = 0;
    sortedTxns.forEach(t => {
      if (t.date < startDate) {
        cumulativeBalance += (t.type === 'income' ? Number(t.amount) : -Number(t.amount));
      }
    });

    // Fill every day in the range
    const displayData = [];
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    let currentBalance = cumulativeBalance;

    // Safety break for 2 years max to prevent infinite loops
    let safetyCounter = 0;
    while (currentDate <= lastDate && safetyCounter < 731) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      
      if (txnMap[dateStr]) {
        currentBalance += (txnMap[dateStr].income - txnMap[dateStr].expense);
      }
      
      displayData.push({
        date: dateStr,
        shortDate: dateStr.substring(5),
        balance: currentBalance
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
      safetyCounter++;
    }

    const filteredTimeline = displayData;

  
    let keyword = { label: 'Stable', type: 'stable' };
    if (filteredTimeline.length > 1) {
      const startBal = filteredTimeline[0].balance;
      const endBal = filteredTimeline[filteredTimeline.length - 1].balance;
     
      const threshold = Math.max(10, Math.abs(startBal) * 0.05); 
      
      if (endBal > startBal + threshold) {
        keyword = { label: 'Growing', type: 'growing' };
      } else if (endBal < startBal - threshold) {
        keyword = { label: 'Declining', type: 'declining' };
      }
    }

    return { areaData: filteredTimeline, pieData, trendKeyword: keyword };
  }, [transactions, dateRange]);

  const textColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = theme === 'dark' ? '#374151' : '#f3f4f6';
  const strokeColor = theme === 'dark' ? '#4b5563' : '#d1d5db';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Area Chart - Balance Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm lg:col-span-2">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Balance Trend
              </h3>
              {/* Trend Badge */}
              {trendKeyword && areaData.length > 1 && (
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  trendKeyword.type === 'growing' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' :
                  trendKeyword.type === 'declining' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800' :
                  'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                }`}>
                  {trendKeyword.type === 'growing' && <TrendingUp className="w-3 h-3" />}
                  {trendKeyword.type === 'declining' && <TrendingDown className="w-3 h-3" />}
                  {trendKeyword.type === 'stable' && <Minus className="w-3 h-3" />}
                  {trendKeyword.label}
                </span>
              )}
            </div>
            
            {(dateRange.start || dateRange.end) && (
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Viewing: {dateRange.start || 'Start'} to {dateRange.end || 'End'}
              </p>
            )}
          </div>
          
          {/* Date Picker */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5">
              <input 
                title="Start Date"
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none w-[125px] cursor-pointer"
              />
              <span className="text-gray-400 text-sm font-medium px-1">to</span>
              <input 
                title="End Date"
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none w-[125px] cursor-pointer"
              />
              {(dateRange.start || dateRange.end) && (
                <button 
                  onClick={() => setDateRange({ start: '', end: '' })}
                  className="text-xs text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 font-medium ml-2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="h-72">
          {areaData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">No balance data in this range.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: textColor, fontSize: 11}} 
                  dy={10} 
                  minTickGap={40}
                  interval="preserveStartEnd"
                  tickFormatter={(val) => {
                
                    const d = new Date(val);
                    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
                  }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 12}} width={45} tickFormatter={(val) => `$${val}`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', color: theme === 'dark' ? '#f3f4f6' : '#111827' }}
                />
                <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Pie Chart - Expenses Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col h-[500px]">
        {/* Sticky Header */}
        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Spending Breakdown</h3>
        </div>

        
        <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
          {pieData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">No expenses yet.</div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="h-[220px] w-full relative shrink-0">
               
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                  <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    ${pieData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total</span>
                </div>
                 
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <filter id="donut3d" x="-20%" y="-20%" width="140%" height="140%">
                         
                         <feDropShadow dx="-1" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.15" result="drop" />
                         <feOffset in="SourceAlpha" dx="0" dy="-2" result="offsetTop"/>
                         <feComposite in="SourceAlpha" in2="offsetTop" operator="out" result="inverseTop"/>
                         <feFlood floodColor="white" floodOpacity="0.3" result="colorTop"/>
                         <feComposite in="colorTop" in2="inverseTop" operator="in" result="shadowTop"/>

                        
                         <feOffset in="SourceAlpha" dx="0" dy="4" result="offsetBottom"/>
                         <feComposite in="SourceAlpha" in2="offsetBottom" operator="out" result="inverseBottom"/>
                         <feFlood floodColor="black" floodOpacity="0.15" result="colorBottom"/>
                         <feComposite in="colorBottom" in2="inverseBottom" operator="in" result="shadowBottom"/>

                         
                         <feComposite in="shadowTop" in2="drop" operator="over" result="combo1" />
                         <feComposite in="shadowBottom" in2="combo1" operator="over" />
                      </filter>
                    </defs>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      dataKey="value"
                      stroke="none"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      style={{ filter: 'url(#donut3d)' }}
                    >
                      {pieData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value) => `$${value}`}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', color: theme === 'dark' ? '#f3f4f6' : '#111827' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
            
              <div className="flex flex-col gap-4 w-full px-2">
                 {pieData.map((entry, i) => {
                   const total = pieData.reduce((sum, item) => sum + item.value, 0);
                   const precent = Math.round((entry.value / total) * 100);
                   return (
                     <div key={entry.name} className="flex flex-col gap-1.5 w-full">
                       <div className="flex justify-between items-end text-xs sm:text-sm font-medium">
                         <span className="text-gray-600 dark:text-gray-400 truncate pr-2">{entry.name}</span>
                         <span className="text-gray-900 dark:text-white font-bold">{precent}%</span>
                       </div>
                       <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                         <div 
                           className="h-full rounded-full transition-all duration-700 ease-in-out relative origin-left" 
                           style={{ width: `${precent}%`, backgroundColor: COLORS[i % COLORS.length] }}
                         >
                           {/* Highlight */}
                           <div className="absolute inset-x-0 top-0 h-1 bg-white opacity-20" />
                         </div>
                       </div>
                     </div>
                   );
                 })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
