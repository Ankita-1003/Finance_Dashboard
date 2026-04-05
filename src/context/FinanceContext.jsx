import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import { initialTransactions } from "../data/mockData";
import toast from "react-hot-toast";

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("fintrack_v1_transactions");
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [categoryBudgets, setCategoryBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem("fintrack_v1_budgets");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("fintrack_v1_role") || null;
  }); 
  const [theme, setTheme] = useState("dark");

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("fintrack_v1_users");
      return saved
        ? JSON.parse(saved)
        : {
            admin: { name: "Admin", email: "", avatar: "" },
            viewer: { name: "Viewer", email: "", avatar: "" },
          };
    } catch {
      return {
        admin: { name: "Admin", email: "", avatar: "" },
        viewer: { name: "Viewer", email: "", avatar: "" },
      };
    }
  });

  const user = users[role] || {};

  useEffect(() => {
    localStorage.setItem("fintrack_v1_transactions", JSON.stringify(transactions));
  }, [transactions]);
  
  useEffect(() => {
    if (role && !['admin', 'viewer'].includes(role)) {
       setRole(null);
       localStorage.removeItem("fintrack_v1_role");
    }
  }, [role]);

  useEffect(() => {
    if (role) {
      localStorage.setItem("fintrack_v1_role", role);
    } else {
      localStorage.removeItem("fintrack_v1_role");
    }
  }, [role]);

  useEffect(() => {
    localStorage.setItem("fintrack_v1_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("fintrack_v1_budgets", JSON.stringify(categoryBudgets));
  }, [categoryBudgets]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const addTransaction = (txn) => {
    if (role !== "admin") return;
    setTransactions((prev) => [{ ...txn, id: Date.now().toString() }, ...prev]);
    toast.success("Transaction added successfully! 💰");
  };

  const deleteTransaction = (id) => {
    if (role !== "admin") return;
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.success("Transaction deleted successfully! 🗑️");
  };

  
  const updateTransaction = (updatedTxn) => {
    if (role !== "admin") return;

    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTxn.id ? updatedTxn : t)),
    );
    toast.success("Transaction updated successfully! ");
  };

  const updateBudget = (category, amount) => {
    if (role !== "admin") return;
    setCategoryBudgets((prev) => ({ ...prev, [category]: Number(amount) }));
    toast.success(`Budget updated for ${category}! 🎯`);
  };

  const updateBudgets = (budgets) => {
    if (role !== "admin") return;
    setCategoryBudgets((prev) => ({ ...prev, ...budgets }));
    toast.success("All budgets updated successfully! 🎯");
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    toast.success(`Switched to ${newTheme} mode! ${newTheme === 'dark' ? '🌙' : '☀️'}`, {
      id: 'theme-toggle'
    });
  };

  const updateProfile = (data) => {
    if (!role) return;

    setUsers((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        ...data,
      },
    }));
    toast.success("Profile updated successfully! ✨");
  };

  const summary = useMemo(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach((t) => {
      if (t.type === "income") income += Number(t.amount);
      if (t.type === "expense") expenses += Number(t.amount);
    });
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        categoryBudgets,
        updateBudget,
        updateBudgets,
        role,
        setRole,
        theme,
        toggleTheme,
        user,
        updateProfile,
        summary,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
