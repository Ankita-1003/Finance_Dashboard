import React, { useMemo, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Info, Edit2, Check, X } from 'lucide-react';

const BudgetVsActuals = () => {
  const { transactions, categoryBudgets, updateBudgets, role } = useFinance();
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({});

  const categoryData = useMemo(() => {
    // Get all expenses by category for current month
    const currentDate = new Date();
    const currentMonthPrefix = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    const expenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonthPrefix));
    
    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

    // Combine any category that has spending OR has a set budget
    const allCategories = new Set([...Object.keys(categoryTotals), ...Object.keys(categoryBudgets)]);
    
    const sortedCategories = Array.from(allCategories)
      .map(cat => {
        const spent = categoryTotals[cat] || 0;

        const budget = categoryBudgets[cat] || 300; 
        return { name: cat, spent, budget };
      })
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5); 

    return sortedCategories;
  }, [transactions, categoryBudgets]);

  const handleEditChange = (cat, val) => {
    setEditValues(prev => ({ ...prev, [cat]: Number(val) }));
  };

  const handleSave = () => {
    updateBudgets(editValues);
    setIsEditing(false);
  };

  const startEditing = () => {
    const initVals = {};
    categoryData.forEach(cat => initVals[cat.name] = cat.budget);
    setEditValues(initVals);
    setIsEditing(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Where Your Money Is Going</h3>
            <div className="group relative z-10 hidden sm:block">
              <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
              <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 dark:bg-gray-700 text-xs text-white rounded-lg shadow-xl text-center font-normal">
                See and manage your custom spending limits.
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Current month spend vs. custom budget limit.</p>
        </div>
        {role === 'admin' && (
          <div>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 rounded-lg transition-colors"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            ) : (
              <button 
                onClick={startEditing}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit limits
              </button>
            )}
          </div>
        )}
      </div>

      {categoryData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">No expenses this month yet.</div>
      ) : (
        <div className="space-y-6 flex-1 flex flex-col justify-center">
          {categoryData.map((cat, i) => {
            const percent = Math.min(100, (cat.spent / cat.budget) * 100);
            
            
            let colorClass = "bg-primary-500";
            if (percent > 90) colorClass = "bg-red-500";
            else if (percent > 75) colorClass = "bg-amber-500";

            return (
              <div key={cat.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{cat.name}</span>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 dark:text-gray-400">${cat.spent.toLocaleString()} /</span>
                      <div className="relative w-20">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                        <input 
                          type="number"
                          value={editValues[cat.name] ?? cat.budget}
                          onChange={(e) => handleEditChange(cat.name, e.target.value)}
                          className="w-full pl-5 pr-2 py-1 text-xs bg-white dark:bg-gray-900 border border-primary-500 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 dark:text-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      <span className="text-gray-900 dark:text-white font-medium">${cat.spent.toLocaleString()}</span> / ${cat.budget.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${colorClass} transition-all duration-500`} 
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetVsActuals;
