import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SummaryCards = () => {
  const { summary, transactions } = useFinance();

  const trends = useMemo(() => {
    if (!transactions || transactions.length === 0) return null;

    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
    const lastMonthStr = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

    let thisMonth = { income: 0, expense: 0 };
    let lastMonth = { income: 0, expense: 0 };

    transactions.forEach(t => {
      const amt = Number(t.amount);
      if (t.date.startsWith(currentMonthStr)) {
        if (t.type === 'income') thisMonth.income += amt; else thisMonth.expense += amt;
      } else if (t.date.startsWith(lastMonthStr)) {
        if (t.type === 'income') lastMonth.income += amt; else lastMonth.expense += amt;
      }
    });

    const calcGrowth = (current, previous, inverted = false) => {
      if (previous === 0) {
        if (current === 0) return { text: '0%', status: 'up' };
        
        return { text: '+100%', status: inverted ? 'down' : 'up' };
      }
      
      const diffPercent = ((current - previous) / previous) * 100;
      const status = diffPercent >= 0 ? (inverted ? 'down' : 'up') : (inverted ? 'up' : 'down');
      
      const prefix = diffPercent > 0 ? '+' : (diffPercent < 0 ? '-' : '');
      return { text: `${prefix}${Math.abs(diffPercent).toFixed(1)}%`, status };
    };

    
    const startOfMonthBalance = summary.balance - (thisMonth.income - thisMonth.expense);

    return {
      balance: calcGrowth(summary.balance, startOfMonthBalance),
      income: calcGrowth(thisMonth.income, lastMonth.income),
      expense: calcGrowth(thisMonth.expense, lastMonth.expense, true),
      thisMonthValues: thisMonth
    };
  }, [summary.balance, transactions]);

  const cards = [
    {
      title: 'Total Balance',
      amount: summary.balance,
      icon: Wallet,
      trend: trends?.balance?.text,
      trendStatus: trends?.balance?.status,
      color: 'bg-primary-500',
    },
    {
      title: 'Monthly Income',
      amount: trends?.thisMonthValues.income || 0,
      icon: ArrowUpRight,
      trend: trends?.income?.text,
      trendStatus: trends?.income?.status,
      color: 'bg-emerald-500',
    },
    {
      title: 'Monthly Expenses',
      amount: trends?.thisMonthValues.expense || 0,
      icon: ArrowDownRight,
      trend: trends?.expense?.text,
      trendStatus: trends?.expense?.status,
      color: 'bg-rose-500',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {cards.map((card, i) => (
        <div 
          key={i} 
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                ${card.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm", card.color)}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
          
          {trends ? (
            <div className="flex items-center gap-2 relative z-10">
              <span className={cn(
                "text-xs font-semibold px-2 py-1 rounded-md",
                card.trendStatus === 'up' 
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                  : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
              )}>
                {card.trend}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
            </div>
          ) : (
             <div className="h-6 relative z-10 hidden sm:block"></div>
          )}

         
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-gradient-to-br from-transparent to-gray-50 dark:to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
