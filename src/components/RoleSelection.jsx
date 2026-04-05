import React from 'react';
import { ShieldAlert, User, Wallet } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import toast from 'react-hot-toast';

const RoleSelection = () => {
  const { setRole } = useFinance();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/50 mb-6">
            <Wallet className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Welcome to FinTrack</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Please select your role to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        
          <button
            onClick={() => {
              setRole('admin');
              toast.success("Welcome! Logged in as Admin 👋", { icon: '🛡️', id: 'role-status' });
            }}
            className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-transparent hover:border-primary-500 dark:hover:border-primary-500 shadow-sm hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 dark:bg-primary-900/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldAlert className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Continue as Admin</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Full access to manage transactions, view advanced analytics, and configure account settings.
              </p>
              <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium">
                Continue <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </button>

          
          <button
            onClick={() => {
              setRole('viewer');
              toast.success("Welcome! Logged in as Viewer 👋", { icon: '👤', id: 'role-status' });
            }}
            className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <User className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Continue as Viewer</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Read-only access to view personalized insights, recent transactions, and dashboard overviews.
              </p>
              <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                Continue <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
