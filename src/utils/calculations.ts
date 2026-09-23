import { Transaction, BudgetLimit, CategoryId, TimeFilter } from '../types';
import { DEFAULT_CATEGORIES } from './categorizer';

export interface CategorySummary {
  categoryId: CategoryId;
  spent: number;
  limit: number;
  remaining: number;
  percentage: number;
  status: 'healthy' | 'warning' | 'exceeded';
  transactionCount: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalCredit: number;
  totalDebit: number;
  totalLoans: number;
  totalLoanRepayments: number;
  outstandingLoans: number;
  availableBalance: number;
  totalBudget: number;
  totalBudgetSpent: number;
  totalBudgetRemaining: number;
  totalBudgetPercentage: number;
  savingsRate: number;
  dailyAverageSpend: number;
  categorySummaries: CategorySummary[];
  categoriesOverBudget: CategorySummary[];
  categoriesNearLimit: CategorySummary[];
}

export function filterTransactionsByTime(
  transactions: Transaction[],
  filter: TimeFilter,
  referenceDate = new Date()
): Transaction[] {
  if (filter === 'all') return transactions;

  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth();
  const refDay = referenceDate.getDate();

  return transactions.filter((tx) => {
    const txDate = new Date(tx.date + 'T' + (tx.time || '12:00'));
    const txYear = txDate.getFullYear();
    const txMonth = txDate.getMonth();
    const txDay = txDate.getDate();

    if (filter === 'today') {
      return txYear === refYear && txMonth === refMonth && txDay === refDay;
    }

    if (filter === 'week') {
      const nowMs = referenceDate.getTime();
      const diffDays = (nowMs - txDate.getTime()) / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 7;
    }

    if (filter === 'month') {
      return txYear === refYear && txMonth === refMonth;
    }

    if (filter === 'year') {
      return txYear === refYear;
    }

    return true;
  });
}

export function computeFinancialSummary(
  allTransactions: Transaction[],
  budgets: BudgetLimit[],
  timeFilter: TimeFilter = 'month'
): FinancialSummary {
  // For lifetime balance calculations, we track overall financial position
  let allIncome = 0;
  let allExpenses = 0;
  let allSavings = 0;
  let allCredit = 0;
  let allDebit = 0;
  let allLoans = 0;
  let allRepayments = 0;

  for (const tx of allTransactions) {
    const amt = Number(tx.amount) || 0;
    switch (tx.type) {
      case 'income':
        allIncome += amt;
        break;
      case 'expense':
        allExpenses += amt;
        break;
      case 'savings':
        allSavings += amt;
        break;
      case 'credit':
        allCredit += amt;
        break;
      case 'debit':
        allDebit += amt;
        break;
      case 'loan':
        allLoans += amt;
        break;
      case 'loan_repayment':
        allRepayments += amt;
        break;
    }
  }

  const outstandingLoans = Math.max(0, allLoans - allRepayments);
  // Available Balance = (Total Income + Loans borrowed) - (Total Expenses + Loan Repayments + Savings locked)
  const availableBalance = (allIncome + allLoans) - (allExpenses + allRepayments + allSavings);

  // Period-specific transactions (for current month by default)
  const periodTransactions = filterTransactionsByTime(allTransactions, timeFilter);

  let periodIncome = 0;
  let periodExpenses = 0;
  let periodSavings = 0;
  let periodCredit = 0;
  let periodDebit = 0;
  let periodLoans = 0;
  let periodRepayments = 0;

  // Category spending accumulators for the period
  const categorySpendingMap: Record<string, { spent: number; count: number }> = {};

  for (const cat of DEFAULT_CATEGORIES) {
    categorySpendingMap[cat.id] = { spent: 0, count: 0 };
  }

  for (const tx of periodTransactions) {
    const amt = Number(tx.amount) || 0;
    if (tx.type === 'expense') {
      periodExpenses += amt;
      const catKey = tx.category || 'other';
      if (!categorySpendingMap[catKey]) {
        categorySpendingMap[catKey] = { spent: 0, count: 0 };
      }
      categorySpendingMap[catKey].spent += amt;
      categorySpendingMap[catKey].count += 1;
    } else if (tx.type === 'income') {
      periodIncome += amt;
    } else if (tx.type === 'savings') {
      periodSavings += amt;
    } else if (tx.type === 'credit') {
      periodCredit += amt;
    } else if (tx.type === 'debit') {
      periodDebit += amt;
    } else if (tx.type === 'loan') {
      periodLoans += amt;
    } else if (tx.type === 'loan_repayment') {
      periodRepayments += amt;
    }
  }

  // Budget summaries
  let totalBudget = 0;
  let totalBudgetSpent = 0;

  const categorySummaries: CategorySummary[] = budgets.map((b) => {
    const data = categorySpendingMap[b.category] || { spent: 0, count: 0 };
    const spent = data.spent;
    const limit = b.monthlyLimit;
    const remaining = Math.max(0, limit - spent);
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;

    let status: 'healthy' | 'warning' | 'exceeded' = 'healthy';
    if (percentage >= 100) {
      status = 'exceeded';
    } else if (percentage >= 80) {
      status = 'warning';
    }

    totalBudget += limit;
    totalBudgetSpent += spent;

    return {
      categoryId: b.category,
      spent,
      limit,
      remaining,
      percentage,
      status,
      transactionCount: data.count,
    };
  });

  // Sort by spent descending
  categorySummaries.sort((a, b) => b.spent - a.spent);

  const categoriesOverBudget = categorySummaries.filter((c) => c.status === 'exceeded');
  const categoriesNearLimit = categorySummaries.filter((c) => c.status === 'warning');

  const totalBudgetRemaining = Math.max(0, totalBudget - totalBudgetSpent);
  const totalBudgetPercentage = totalBudget > 0 ? (totalBudgetSpent / totalBudget) * 100 : 0;

  const savingsRate = periodIncome > 0 ? (periodSavings / periodIncome) * 100 : 0;

  // Daily average spend for the current month
  const now = new Date();
  const dayOfMonth = Math.max(1, now.getDate());
  const dailyAverageSpend = periodExpenses / dayOfMonth;

  return {
    totalIncome: periodIncome || allIncome,
    totalExpenses: periodExpenses || allExpenses,
    totalSavings: periodSavings || allSavings,
    totalCredit: periodCredit || allCredit,
    totalDebit: periodDebit || allDebit,
    totalLoans: periodLoans || allLoans,
    totalLoanRepayments: periodRepayments || allRepayments,
    outstandingLoans,
    availableBalance,
    totalBudget,
    totalBudgetSpent,
    totalBudgetRemaining,
    totalBudgetPercentage,
    savingsRate,
    dailyAverageSpend,
    categorySummaries,
    categoriesOverBudget,
    categoriesNearLimit,
  };
}
