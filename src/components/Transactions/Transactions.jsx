import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TransactionList from './TransactionList';
import TransactionModal from '../model/TransactionModal';
import { useFinance } from '../../context/FinanceContext';

const TransactionsView = () => {
  const { role } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">Transactions</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Review your transaction history and manage expenses.</p>
        </div>
        
        {role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium tracking-wide shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add New
          </button>
        )}
      </div>

      <TransactionList />
      
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default TransactionsView;
