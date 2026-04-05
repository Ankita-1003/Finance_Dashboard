import React, { useState, useMemo } from "react";
import { format, parseISO, subDays, isAfter } from "date-fns";
import {
  Search,
  Filter,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  ChevronDown,
  Edit2,
} from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { cn } from "../Layout/Sidebar";
import toast from "react-hot-toast";
import TransactionModal from "../model/TransactionModal";

import CustomSelect from "../UI/CustomSelect";

const TransactionList = () => {


  const { transactions, deleteTransaction, role } = useFinance();
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

 
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState("all"); 
  const [dateRange, setDateRange] = useState("all"); 
  const [sortBy, setSortBy] = useState("dateDesc");  


  const handleEdit = (txn) => {
    setEditData(txn);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
  };

  const filteredTransactions = useMemo(() => {
    const today = new Date();

    let result = transactions
      .filter((t) => (filterType === "all" ? true : t.type === filterType))
      .filter(
        (t) =>
          t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.amount.toString().includes(searchTerm),
      );

    if (dateRange !== "all") {
      const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
      const cutoffDate = subDays(today, days);
      result = result.filter((t) => isAfter(parseISO(t.date), cutoffDate));
    }

    result.sort((a, b) => {
      if (sortBy === "dateDesc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "dateAsc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "amountDesc") return Number(b.amount) - Number(a.amount);
      if (sortBy === "amountAsc") return Number(a.amount) - Number(b.amount);
      return 0;
    });

    return result;
  }, [transactions, searchTerm, filterType, dateRange, sortBy]);

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error("No transactions to export!");
      return;
    }

    toast.loading("Exporting data to CSV... ", { duration: 1500 });
    
   
    setTimeout(() => {
      const headers = ["Transaction ID", "Date", "Type", "Category", "Amount"];
      const rows = filteredTransactions.map((t) => [
        t.id,
        t.date,
        t.type,
        t.category,
        t.amount,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((e) => e.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `fintrack_export_${format(new Date(), "yyyy-MM-dd")}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Data exported successfully! ");
    }, 1500);
  };

  return (
    <>
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-visible flex flex-col transition-all duration-300">
      
      <div className="p-4 md:p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border transform hover:scale-[1.02] active:scale-95 ${
              showFilters
                ? "bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/40 dark:border-primary-800 dark:text-primary-400 shadow-sm ring-2 ring-primary-500/20"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-primary-500/10 dark:hover:border-primary-800/50"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden xs:inline">Filters</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
            />
          </button>

          <button
            onClick={handleExportCSV}
            disabled={filteredTransactions.length === 0}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary-500/10 dark:hover:border-primary-800/50 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm disabled:transform-none"
            title="Export to CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden xs:inline">Export</span>
          </button>
        </div>
      </div>

      
      <div
        className={cn(
          "bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 overflow-visible transition-all duration-300",
          showFilters
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 border-transparent border-b-0 overflow-hidden",
        )}
      >
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 pb-12 sm:pb-4">
          <CustomSelect
            label="Transaction Type"
            value={filterType}
            onChange={setFilterType}
            options={[
              { value: "all", label: "All Types" },
              { value: "income", label: "Income" },
              { value: "expense", label: "Expenses" },
            ]}
          />

          <CustomSelect
            label="Date Range"
            value={dateRange}
            onChange={setDateRange}
            options={[
              { value: "all", label: "All Time" },
              { value: "7d", label: "Last 7 Days" },
              { value: "30d", label: "Last 30 Days" },
              { value: "90d", label: "Last 90 Days" },
            ]}
          />

          <CustomSelect
            label="Sort By"
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: "dateDesc", label: "Newest First" },
              { value: "dateAsc", label: "Oldest First" },
              { value: "amountDesc", label: "Highest Amount" },
              { value: "amountAsc", label: "Lowest Amount" },
            ]}
          />
        </div>
      </div>

      
      <div className="flex flex-col min-h-[400px]">
      
        <div className="hidden sm:grid sm:grid-cols-[1fr_120px_120px_100px] bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold px-4 sm:px-6 py-3 sm:py-4">
          <div>Transaction</div>
          <div>Date</div>
          <div className="text-right sm:text-left">Amount</div>
          {role === "admin" && <div className="text-right">Actions</div>}
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {filteredTransactions.length === 0 ? (
            <div className="px-4 sm:px-6 py-12 text-center text-sm text-gray-500 font-medium">
              No transactions found matching your filter criteria.
            </div>
          ) : (
            filteredTransactions.map((t) => (
              <div
                key={t.id}
                className="hover:bg-gray-50/80 dark:hover:bg-gray-700/20 transition-colors group px-3 sm:px-6 py-3 sm:py-4"
              >
                <div className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[1fr_120px_120px_100px] items-center gap-2 sm:gap-4">
                  
                 
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div
                      className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 border",
                        t.type === "income"
                          ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400"
                          : "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400",
                      )}
                    >
                      {t.type === "income" ? (
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold sm:font-medium text-[13px] sm:text-base text-gray-900 dark:text-white capitalize truncate">
                        {t.category}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {t.type}
                        <span className="sm:hidden font-normal text-gray-400"> • {format(parseISO(t.date), "MM/dd")}</span>
                      </p>
                    </div>
                  </div>

                  
                  <div className="hidden sm:block text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {format(parseISO(t.date), "MMM dd, yyyy")}
                  </div>

                  
                  <div className="flex flex-col items-end sm:items-start justify-center">
                    <span
                      className={cn(
                        "font-bold sm:font-semibold text-[13px] sm:text-base whitespace-nowrap",
                        t.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-gray-900 dark:text-white",
                      )}
                    >
                      {t.type === "income" ? "+" : "-"}$
                      {Number(t.amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    
                  
                    {role === "admin" && (
                      <div className="flex sm:hidden items-center gap-1 mt-1">
                        <button
                          onClick={() => handleEdit(t)}
                          className="p-1 text-gray-400 hover:text-primary-500 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1 text-gray-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                
                  {role === "admin" && (
                    <div className="hidden sm:flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(t)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>

    <TransactionModal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setEditData(null);
      }}
      editData={editData}
    />
    </>
  );
};

export default TransactionList;
