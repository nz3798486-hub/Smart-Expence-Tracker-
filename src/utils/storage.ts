import { Transaction, BudgetLimit, SavingsGoal, LoanItem } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'smart_expense_transactions_v1',
  BUDGETS: 'smart_expense_budgets_v1',
  CURRENCY: 'smart_expense_currency_v1',
  SAVINGS_GOALS: 'smart_expense_savings_goals_v1',
  LOANS: 'smart_expense_loans_v1',
  INITIALIZED: 'smart_expense_initialized_v1',
};

// Generate seed date strings relative to today
function getDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export const INITIAL_BUDGETS: BudgetLimit[] = [
  { category: 'housing', monthlyLimit: 1400 },
  { category: 'food', monthlyLimit: 650 },
  { category: 'transportation', monthlyLimit: 250 },
  { category: 'utilities', monthlyLimit: 180 },
  { category: 'electricity', monthlyLimit: 120 },
  { category: 'shopping', monthlyLimit: 300 },
  { category: 'entertainment', monthlyLimit: 150 },
  { category: 'health', monthlyLimit: 120 },
  { category: 'education', monthlyLimit: 100 },
  { category: 'other', monthlyLimit: 100 },
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    title: 'Emergency Safety Fund',
    targetAmount: 5000,
    currentAmount: 2850,
    targetDate: '2026-12-31',
    category: 'Emergency',
  },
  {
    id: 'goal-2',
    title: 'New Laptop & Workstation',
    targetAmount: 1800,
    currentAmount: 1200,
    targetDate: '2026-10-15',
    category: 'Tech Equipment',
  },
  {
    id: 'goal-3',
    title: 'Holiday Travel Trip',
    targetAmount: 1200,
    currentAmount: 450,
    targetDate: '2026-11-20',
    category: 'Vacation',
  },
];

export const INITIAL_LOANS: LoanItem[] = [
  {
    id: 'loan-1',
    lenderOrBorrower: 'First Horizon Credit Union',
    totalAmount: 3200,
    repaidAmount: 1400,
    dueDate: '2027-04-01',
    interestRate: 4.5,
    notes: 'Low interest home improvement loan',
    type: 'borrowed',
  },
  {
    id: 'loan-2',
    lenderOrBorrower: 'Personal Loan to Alex',
    totalAmount: 600,
    repaidAmount: 200,
    dueDate: '2026-10-01',
    notes: 'Emergency car repair loan to brother',
    type: 'lent',
  },
];

export function getInitialTransactions(): Transaction[] {
  return [
    {
      id: 'tx-1',
      amount: 4800,
      type: 'income',
      category: 'other',
      description: 'Monthly Salary Direct Deposit',
      date: getDateString(22),
      time: '09:00',
      currency: 'USD',
      notes: 'Primary monthly compensation',
      createdAt: Date.now() - 22 * 86400000,
    },
    {
      id: 'tx-2',
      amount: 1350,
      type: 'expense',
      category: 'housing',
      description: 'Apartment Monthly Rent Transfer',
      date: getDateString(21),
      time: '10:30',
      currency: 'USD',
      notes: 'Automated bank wire',
      createdAt: Date.now() - 21 * 86400000,
    },
    {
      id: 'tx-3',
      amount: 142.50,
      type: 'expense',
      category: 'food',
      description: 'Whole Foods Grocery Haul',
      date: getDateString(18),
      time: '17:45',
      currency: 'USD',
      notes: 'Weekly organic produce & supplies',
      createdAt: Date.now() - 18 * 86400000,
    },
    {
      id: 'tx-4',
      amount: 110.00,
      type: 'expense',
      category: 'electricity',
      description: 'City Edison Power Bill',
      date: getDateString(16),
      time: '14:20',
      currency: 'USD',
      notes: 'Summer cooling cycle electricity invoice',
      createdAt: Date.now() - 16 * 86400000,
    },
    {
      id: 'tx-5',
      amount: 85.00,
      type: 'expense',
      category: 'utilities',
      description: 'Fiber High-Speed Internet Bill',
      date: getDateString(15),
      time: '11:15',
      currency: 'USD',
      notes: 'Monthly Gigabit internet service',
      createdAt: Date.now() - 15 * 86400000,
    },
    {
      id: 'tx-6',
      amount: 45.00,
      type: 'expense',
      category: 'transportation',
      description: 'Shell Gas Station Fill-up',
      date: getDateString(13),
      time: '08:30',
      currency: 'USD',
      notes: 'Regular unleaded petrol',
      createdAt: Date.now() - 13 * 86400000,
    },
    {
      id: 'tx-7',
      amount: 350.00,
      type: 'savings',
      category: 'other',
      description: 'Transfer to High-Yield Savings Account',
      date: getDateString(12),
      time: '12:00',
      currency: 'USD',
      notes: 'Automated recurring savings deposit',
      createdAt: Date.now() - 12 * 86400000,
    },
    {
      id: 'tx-8',
      amount: 62.40,
      type: 'expense',
      category: 'food',
      description: 'Trader Joe\'s Pantry & Snacks',
      date: getDateString(10),
      time: '18:10',
      currency: 'USD',
      createdAt: Date.now() - 10 * 86400000,
    },
    {
      id: 'tx-9',
      amount: 89.99,
      type: 'credit',
      category: 'shopping',
      description: 'Amazon Prime Order - Noise Canceling Headphones',
      date: getDateString(8),
      time: '15:20',
      currency: 'USD',
      notes: 'Paid with Sapphire Credit Card',
      createdAt: Date.now() - 8 * 86400000,
    },
    {
      id: 'tx-10',
      amount: 250.00,
      type: 'loan_repayment',
      category: 'other',
      description: 'Credit Union Loan Monthly Repayment',
      date: getDateString(6),
      time: '16:00',
      currency: 'USD',
      notes: 'Installment #14 paid off',
      createdAt: Date.now() - 6 * 86400000,
    },
    {
      id: 'tx-11',
      amount: 32.50,
      type: 'expense',
      category: 'transportation',
      description: 'Uber Ride from Airport',
      date: getDateString(5),
      time: '21:15',
      currency: 'USD',
      createdAt: Date.now() - 5 * 86400000,
    },
    {
      id: 'tx-12',
      amount: 45.00,
      type: 'expense',
      category: 'health',
      description: 'CVS Pharmacy Prescription Refill',
      date: getDateString(4),
      time: '13:40',
      currency: 'USD',
      createdAt: Date.now() - 4 * 86400000,
    },
    {
      id: 'tx-13',
      amount: 29.99,
      type: 'expense',
      category: 'education',
      description: 'Udemy Full-Stack Architecture Course',
      date: getDateString(3),
      time: '20:10',
      currency: 'USD',
      createdAt: Date.now() - 3 * 86400000,
    },
    {
      id: 'tx-14',
      amount: 19.99,
      type: 'expense',
      category: 'entertainment',
      description: 'Netflix 4K Ultra Monthly Subscription',
      date: getDateString(2),
      time: '04:00',
      currency: 'USD',
      createdAt: Date.now() - 2 * 86400000,
    },
    {
      id: 'tx-15',
      amount: 54.20,
      type: 'debit',
      category: 'food',
      description: 'Dinner with friends at Italian Trattoria',
      date: getDateString(1),
      time: '19:45',
      currency: 'USD',
      notes: 'Direct debit card payment',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'tx-16',
      amount: 14.75,
      type: 'expense',
      category: 'food',
      description: 'Starbucks Morning Latte & Bagel',
      date: getDateString(0),
      time: '08:15',
      currency: 'USD',
      createdAt: Date.now(),
    },
  ];
}

// Storage helpers
export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      const seeded = getInitialTransactions();
      saveTransactions(seeded);
      return seeded;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load transactions:', e);
    return getInitialTransactions();
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions:', e);
  }
}

export function loadBudgets(): BudgetLimit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (!raw) {
      saveBudgets(INITIAL_BUDGETS);
      return INITIAL_BUDGETS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load budgets:', e);
    return INITIAL_BUDGETS;
  }
}

export function saveBudgets(budgets: BudgetLimit[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  } catch (e) {
    console.error('Failed to save budgets:', e);
  }
}

export function loadCurrency(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENCY) || 'USD';
  } catch {
    return 'USD';
  }
}

export function saveCurrency(code: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, code);
  } catch (e) {
    console.error('Failed to save currency:', e);
  }
}

export function loadSavingsGoals(): SavingsGoal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS);
    if (!raw) {
      saveSavingsGoals(INITIAL_SAVINGS_GOALS);
      return INITIAL_SAVINGS_GOALS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_SAVINGS_GOALS;
  }
}

export function saveSavingsGoals(goals: SavingsGoal[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(goals));
  } catch (e) {
    console.error('Failed to save savings goals:', e);
  }
}

export function loadLoans(): LoanItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOANS);
    if (!raw) {
      saveLoans(INITIAL_LOANS);
      return INITIAL_LOANS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_LOANS;
  }
}

export function saveLoans(loans: LoanItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  } catch (e) {
    console.error('Failed to save loans:', e);
  }
}

// Data Export & Import
export function exportToCSV(transactions: Transaction[]): void {
  const headers = ['ID', 'Date', 'Time', 'Type', 'Category', 'Description', 'Amount', 'Currency', 'Notes'];
  const rows = transactions.map((t) => [
    t.id,
    t.date,
    t.time || '',
    t.type,
    t.category,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.amount,
    t.currency,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `smart_expense_ledger_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(
  transactions: Transaction[],
  budgets: BudgetLimit[],
  savings: SavingsGoal[],
  loans: LoanItem[]
): void {
  const payload = {
    app: 'Smart Expense Tracker',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    transactions,
    budgets,
    savings,
    loans,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `smart_expense_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function resetToDemoData(): {
  transactions: Transaction[];
  budgets: BudgetLimit[];
  savings: SavingsGoal[];
  loans: LoanItem[];
} {
  const transactions = getInitialTransactions();
  const budgets = INITIAL_BUDGETS;
  const savings = INITIAL_SAVINGS_GOALS;
  const loans = INITIAL_LOANS;

  saveTransactions(transactions);
  saveBudgets(budgets);
  saveSavingsGoals(savings);
  saveLoans(loans);

  return { transactions, budgets, savings, loans };
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  localStorage.removeItem(STORAGE_KEYS.BUDGETS);
  localStorage.removeItem(STORAGE_KEYS.SAVINGS_GOALS);
  localStorage.removeItem(STORAGE_KEYS.LOANS);
}
