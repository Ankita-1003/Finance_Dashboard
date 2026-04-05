import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Sparkles } from 'lucide-react';

const AnalyticsSummary = () => {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return ["Start adding transactions to see your smart insights here!"];
    }

    const messages = [];

    // Most expensive category this month
    const currentDate = new Date();
    const currentMonthPrefix = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    const currentMonthExpenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonthPrefix));
    
    if (currentMonthExpenses.length > 0) {
      const categoryTotals = currentMonthExpenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {});
      
      const topCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b);
      messages.push(`Your biggest expense so far this month is on **${topCategory}** ($${categoryTotals[topCategory].toLocaleString()}).`);
    } else {
      messages.push("You haven't spent anything yet this month. Great job!");
    }

    // Spending by day insight
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const spendingMap = { 'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 'Friday': 0, 'Saturday': 0 };

    let hasExpenses = false;
    transactions.forEach(t => {
      if (t.type === 'expense') {
        hasExpenses = true;
        const date = new Date(t.date);
        const dayName = days[date.getUTCDay()];
        spendingMap[dayName] += Number(t.amount);
      }
    });

    if (hasExpenses) {
      const topDay = Object.keys(spendingMap).reduce((a, b) => spendingMap[a] > spendingMap[b] ? a : b);
      messages.push(`Historically, **${topDay}s** are your most expensive days.`);
    }

    // Overall health (Income vs Expense total)
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
    
    if (totalIncome > totalExpense && totalExpense > 0) {
      const ratio = Math.round((totalExpense / totalIncome) * 100);
      messages.push(`You generally spend about ${ratio}% of what you earn.`);
    } else if (totalExpense > totalIncome) {
      messages.push(`Heads up! Overall, you've spent more than you've brought in.`);
    }

    return messages;
  }, [transactions]);

  return (
    <div className="bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-primary-100 dark:border-primary-800/30 mb-8 max-w-4xl shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg text-primary-600 dark:text-primary-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Smart Summary</h3>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, idx) => {
          
          const parts = insight.split(/(\*\*.*?\*\*)/g);
          return (
            <p key={idx} className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
              <span className="text-primary-500 mt-1.5 shrink-0 text-xs">●</span>
              <span>
                {parts.map((part, i) => 
                  part.startsWith('**') && part.endsWith('**') 
                    ? <span key={i} className="font-bold text-gray-900 dark:text-gray-100">{part.slice(2, -2)}</span> 
                    : part
                )}
              </span>
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsSummary;
