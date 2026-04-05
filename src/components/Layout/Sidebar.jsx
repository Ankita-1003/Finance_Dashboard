import React from 'react';
import { LayoutDashboard, ArrowRightLeft, PieChart, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowRightLeft },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">$</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">FinTrack</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700/50"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-primary-700 dark:text-primary-400" : "text-gray-400 dark:text-gray-500")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
         <div className="bg-primary-50 dark:bg-gray-700/50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Pro Plan</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Get advanced analytics</p>
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium py-2 rounded-lg transition-colors">
              Upgrade
            </button>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;
