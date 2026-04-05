import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';

const Insights = () => {
  const { transactions, role } = useFinance();

  const insights = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    
    if (role === 'admin') {
      // Admin Insights
      const totalTransactions = transactions.length;
      const totalExpenseVolume = expenses.reduce((a, b) => a + Number(b.amount), 0);
      const avgExpense = totalExpenseVolume / (expenses.length || 1);
      const largeExpenses = expenses.filter(e => Number(e.amount) > 500).length;

      return [
        {
          icon: AlertCircle,
          text: `Audit Alert: ${largeExpenses} transactions flagged over $500 threshold this period.`,
          color: largeExpenses > 0 ? "text-amber-500" : "text-emerald-500",
          bg: largeExpenses > 0 ? "bg-amber-50 dark:bg-amber-900/20" : "bg-emerald-50 dark:bg-emerald-900/20"
        },
        {
          icon: TrendingUp,
          text: `System Log: ${totalTransactions} active records securely encrypted in database.`,
          color: "text-blue-500",
          bg: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
          icon: Lightbulb,
          text: `System Operational Burn Rate: Average disbursement is $${avgExpense.toFixed(2)} per record.`,
          color: "text-purple-500",
          bg: "bg-purple-50 dark:bg-purple-900/20"
        }
      ];
    }

    // Viewer Insights
    if (expenses.length === 0) {
      return [{ icon: Lightbulb, text: "Start adding expenses to see personalized insights.", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" }];
    }

    // Highest expense category
    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});
    
    let maxCat = { name: '', value: 0 };
    for (const [key, val] of Object.entries(categoryTotals)) {
       if(val > maxCat.value) { maxCat = { name: key, value: val }; }
    }

    // Biggest single transaction
    let biggestTxn = expenses[0];
    expenses.forEach(t => {
      if(Number(t.amount) > Number(biggestTxn.amount)) biggestTxn = t;
    });

      return [
        { 
          icon: AlertCircle, 
          text: `Highest Spending: ${maxCat.name} is your top category at $${maxCat.value.toFixed(0)} this month.`, 
          color: "text-rose-500", 
          bg: "bg-rose-50 dark:bg-rose-900/20" 
        },
        { 
          icon: TrendingUp, 
          text: `Largest Expense: You spent $${biggestTxn.amount} on ${biggestTxn.category} in a single transaction.`, 
          color: "text-amber-500", 
          bg: "bg-amber-50 dark:bg-amber-900/20" 
        },
        {
          icon: Lightbulb,
          text: `Monthly Activity: You have successfully recorded ${expenses.length} expenses in this period.`,
          color: "text-emerald-500",
          bg: "bg-emerald-50 dark:bg-emerald-900/20"
        }
      ];
  }, [transactions, role]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {role === 'admin' ? 'System Audit Logs' : 'Smart Insights'}
      </h3>
      <div className="space-y-4">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-3">
             <div className={`p-2 rounded-xl ${insight.bg} ${insight.color} shrink-0`}>
                <insight.icon className="w-5 h-5" />
             </div>
             <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
               {insight.text}
             </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insights;
