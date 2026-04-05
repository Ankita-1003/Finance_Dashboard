import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { expenseCategories, incomeCategories } from '../../data/mockData';
import toast from 'react-hot-toast';

import CustomSelect from '../UI/CustomSelect';

const TransactionModal = ({ isOpen, onClose, editData }) => {
  const { addTransaction, updateTransaction } = useFinance();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: expenseCategories[0],
    date: new Date().toISOString().substring(0, 10)
  });
  
  
  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        amount: editData.amount.toString()
      });
    } else {
      
      setFormData({
        type: 'expense',
        amount: '',
        category: expenseCategories[0],
        date: new Date().toISOString().substring(0, 10)
      });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.amount) {
      toast.error("Please enter an amount.");
      return;
    }
    
    if(editData?.id) {
       updateTransaction({
          ...formData,
          amount: Number(formData.amount)
       });
    } else {
       addTransaction({
          ...formData,
          amount: Number(formData.amount)
       });
    }
    
    
    setFormData({
      type: 'expense',
      amount: '',
      category: expenseCategories[0],
      date: new Date().toISOString().substring(0, 10)
    });
    onClose();
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({ 
      ...prev, 
      type, 
      category: type === 'expense' ? expenseCategories[0] : incomeCategories[0] 
    }));
  };

  const currentCategories = formData.type === 'expense' ? expenseCategories : incomeCategories;
  const categoryOptions = currentCategories.map(cat => ({ value: cat, label: cat }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm dark:bg-gray-900/60 transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
           <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
              {editData ? "Edit Transaction" : "Add Transaction"}
           </h3>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <X className="w-5 h-5" />
           </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-visible">
            
           <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
              <button 
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${formData.type === 'expense' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Expense
              </button>
              <button 
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${formData.type === 'income' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Income
              </button>
           </div>
           
          
           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Amount ($)</label>
             <input 
               type="number" 
               required
               min="0"
               step="0.01"
               value={formData.amount}
               onChange={(e) => setFormData({...formData, amount: e.target.value})}
               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
               placeholder="0.00"
             />
           </div>

          
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-visible">
             <CustomSelect
               label="Category"
               value={formData.category}
               onChange={(val) => setFormData({...formData, category: val})}
               options={categoryOptions}
             />
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date</label>
               <input 
                 type="date"
                 required
                 value={formData.date}
                 onChange={(e) => setFormData({...formData, date: e.target.value})}
                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all cursor-pointer"
               />
             </div>
           </div>

           
           <div className="pt-4">
             <button 
               type="submit"
               className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium tracking-wide shadow-sm hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all"
             >
               {editData ? "Update Transaction" : "Save Transaction"}
             </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
