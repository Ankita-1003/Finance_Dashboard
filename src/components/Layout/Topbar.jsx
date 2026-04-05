import React, { useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import toast from "react-hot-toast";
import {
  Sun,
  Moon,
  Bell,
  ShieldAlert,
  User,
  Menu,
  X,
  LayoutDashboard,
  ArrowRightLeft,
  PieChart,
  Settings,
  ChevronDown,
} from "lucide-react";

const Topbar = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme, role, setRole, user } = useFinance();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: ArrowRightLeft },
    { id: "analytics", label: "Analytics", icon: PieChart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false); 
  };

  return (
    <div className="relative z-50">
      
      <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-6 sticky top-0">
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-500 dark:text-gray-400 p-1 -ml-1 rounded-md active:bg-gray-100 dark:active:bg-gray-700"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
            FinTrack
          </span>
        </div>

        <div className="hidden md:flex flex-1">
          {/* Topbar placeholder on desktop */}
        </div>

        <div className="flex items-center gap-1.5 md:gap-5">
         
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-200 cursor-default">
              {role === "admin" ? (
                <ShieldAlert className="w-3.5 h-3.5 text-primary-500" />
              ) : (
                <User className="w-3.5 h-3.5 text-emerald-500" />
              )}
              <span className="capitalize hidden lg:block">{role}</span>
            </div>
            <button
              onClick={() => {
                setRole(null);
                toast("Logged out. Please select a role.", { icon: "👋", id: "role-status" });
              }}
              className="text-xs font-medium text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors hidden lg:block"
              title="Switch Role"
            >
              Switch Role
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 md:p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <div className="flex items-center gap-2 ml-0 sm:ml-1">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {user?.name?.[0] || "U"}
              </div>
            )}

            <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-200">
              {user?.name}
            </span>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg md:hidden">
          <nav className="flex flex-col p-2 pt-0 space-y-1">
            <div className="px-4 py-3 mb-2 border-b border-gray-100 dark:border-gray-700">
               <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Navigation</p>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 active:bg-gray-100 dark:active:bg-gray-700"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-primary-700 dark:text-primary-400" : "text-gray-400 dark:text-gray-500"}`}
                  />
                  {item.label}
                </button>
              );
            })}

           
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 pb-2">
               <div className="px-4 mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">User Settings</p>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
                        {user?.name?.[0] || 'U'}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize flex items-center gap-1">
                           {role === 'admin' ? <ShieldAlert className="w-3 h-3 text-primary-500" /> : <User className="w-3 h-3 text-emerald-500" />}
                           {role}
                        </p>
                     </div>
                  </div>
               </div>
               <div className="px-2 space-y-1">
                  <button
                    onClick={() => {
                      toggleTheme();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
                    {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </button>
                  <button
                    onClick={() => {
                      setRole(null);
                      setIsMobileMenuOpen(false);
                      toast("Logged out. Please select a role.", { icon: "👋", id: "role-status" });
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                    Switch Role
                  </button>
               </div>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Topbar;
