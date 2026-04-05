
const getToday = (d = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString().split('T')[0];
};

const getLastMonth = (d = 0) => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  date.setDate(date.getDate() - d);
  return date.toISOString().split('T')[0];
};

export const initialTransactions = [
  
  // Current Month
  { id: 'tx_101', date: getToday(2), amount: 4850.00, category: 'Salary', type: 'income' },
  { id: 'tx_102', date: getToday(4), amount: 1250.75, category: 'Groceries', type: 'expense' },
  { id: 'tx_103', date: getToday(7), amount: 450.00, category: 'Entertainment', type: 'expense' },
  { id: 'tx_104', date: getToday(8), amount: 215.30, category: 'Utilities', type: 'expense' },
  { id: 'tx_105', date: getToday(12), amount: 120.00, category: 'Shopping', type: 'expense' },
  
  // Last Month
  { id: 'tx_091', date: getLastMonth(1), amount: 6200.00, category: 'Freelance', type: 'income' },
  { id: 'tx_092', date: getLastMonth(5), amount: 1100.00, category: 'Other', type: 'expense' },
  { id: 'tx_093', date: getLastMonth(10), amount: 450.00, category: 'Subscriptions', type: 'expense' },
  { id: 'tx_094', date: getLastMonth(15), amount: 320.00, category: 'Dining', type: 'expense' },
  { id: 'tx_095', date: getLastMonth(20), amount: 1450.00, category: 'Investment', type: 'income' },
  { id: 'tx_096', date: getLastMonth(25), amount: 85.50, category: 'Utilities', type: 'expense' },
  
  
  // Historical Data
  { id: 'tx_h1', date: '2024-11-20', amount: 15000.00, category: 'Initial Capital', type: 'income' },
];

export const expenseCategories = [
  'Groceries', 'Entertainment', 'Utilities', 'Shopping', 'Transport', 'Dining', 'Subscriptions', 'Other'
];

export const incomeCategories = [
  'Salary', 'Freelance', 'Investment', 'Other'
];
