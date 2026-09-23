export type TransactionType =
  | 'expense'
  | 'income'
  | 'credit'
  | 'debit'
  | 'savings'
  | 'loan'
  | 'loan_repayment';

export type CategoryId =
  | 'food'
  | 'health'
  | 'transportation'
  | 'education'
  | 'electricity'
  | 'utilities'
  | 'shopping'
  | 'housing'
  | 'entertainment'
  | 'other'
  | string;

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  iconName: string;
  color: string;
  bgColor: string;
  keywords: string[];
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: CategoryId;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  currency: string; // 'USD', etc.
  notes?: string;
  createdAt: number;
}

export interface BudgetLimit {
  category: CategoryId;
  monthlyLimit: number;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  category?: string;
}

export interface LoanItem {
  id: string;
  lenderOrBorrower: string;
  totalAmount: number;
  repaidAmount: number;
  dueDate?: string;
  interestRate?: number;
  notes?: string;
  type: 'borrowed' | 'lent'; // loans taken or given
}

export type TimeFilter = 'today' | 'week' | 'month' | 'year' | 'all' | 'custom';

export type ActiveTab = 'dashboard' | 'transactions' | 'budget' | 'analytics' | 'loans_savings' | 'settings';
