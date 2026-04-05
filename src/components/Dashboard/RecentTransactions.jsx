import React from 'react';
import { format, parseISO } from 'date-fns';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const RecentTransactions = () => {
  const { transactions } = useFinance();
  const recentTransactions = transactions.slice(0, 5); // Get latest 5

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col transition-all duration-300">
      <div className="p-4 md:p-5 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <th className="px-4 py-3 font-semibold">Transaction</th>
              <th className="hidden sm:table-cell px-4 py-3 font-semibold whitespace-nowrap">Date</th>
              <th className="px-4 py-3 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentTransactions.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">
                  No recent transactions found.
                </td>
              </tr>
            ) : (
              recentTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                        t.type === 'income' 
                           ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400" 
                           : "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400"
                      )}>
                        {t.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-gray-900 dark:text-white capitalize truncate">{t.category}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                           {t.type} <span className="sm:hidden font-normal text-gray-400"> • {format(parseISO(t.date), 'MM/dd')}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-4 py-3 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {format(parseISO(t.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn(
                      "font-semibold text-sm whitespace-nowrap",
                      t.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"
                    )}>
                      {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
