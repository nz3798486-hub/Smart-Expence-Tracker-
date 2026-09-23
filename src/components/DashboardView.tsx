import React from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  AlertTriangle,
  ChevronRight,
  Plus,
  CreditCard,
  Building,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Transaction, ActiveTab, TimeFilter } from '../types';
import { FinancialSummary } from '../utils/calculations';
import { formatCurrency } from '../utils/currencies';
import { CategoryIcon } from './CategoryIcon';
import { BudgetProgressBar } from './charts/BudgetProgressBar';
import { CategoryDonutChart } from './charts/CategoryDonutChart';
import { getCategoryInfo } from '../utils/categorizer';

interface DashboardViewProps {
  summary: FinancialSummary;
  recentTransactions: Transaction[];
  currency: string;
  timeFilter: TimeFilter;
  setTimeFilter: (tf: TimeFilter) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary,
  recentTransactions,
  currency,
  timeFilter,
  setTimeFilter,
  setActiveTab,
  onOpenAddModal,
  onSelectTransaction,
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Controls: Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Financial Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time balance, budgets, loans, and spending analytics
          </p>
        </div>

        {/* Time Segmented Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl self-start sm:self-auto">
          {(['month', 'week', 'year', 'all'] as TimeFilter[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer capitalize ${
                timeFilter === tf
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf === 'month' ? 'This Month' : tf === 'week' ? '7 Days' : tf === 'year' ? 'This Year' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Net Available Balance Card (Hero) */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-slate-950/10 relative overflow-hidden">
        {/* Subtle background decorative shapes */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Total Available Balance
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Ledger</span>
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl md:text-5xl font-bold font-mono tabular-nums tracking-tight">
              {formatCurrency(summary.availableBalance, currency)}
            </span>
          </div>

          {/* Core Flow Metrics Sub-grid */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <ArrowDownLeft size={14} className="text-emerald-400" />
                <span>Total Income</span>
              </div>
              <div className="text-base md:text-lg font-bold font-mono tabular-nums text-emerald-400 mt-1">
                +{formatCurrency(summary.totalIncome, currency)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <ArrowUpRight size={14} className="text-rose-400" />
                <span>Total Expenses</span>
              </div>
              <div className="text-base md:text-lg font-bold font-mono tabular-nums text-rose-400 mt-1">
                -{formatCurrency(summary.totalExpenses, currency)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <PiggyBank size={14} className="text-purple-400" />
                <span>Total Savings</span>
              </div>
              <div className="text-base md:text-lg font-bold font-mono tabular-nums text-purple-300 mt-1">
                {formatCurrency(summary.totalSavings, currency)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Building size={14} className="text-pink-400" />
                <span>Loans Balance</span>
              </div>
              <div className="text-base md:text-lg font-bold font-mono tabular-nums text-pink-300 mt-1">
                {formatCurrency(summary.outstandingLoans, currency)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Credit Activity</span>
            <CreditCard size={15} className="text-amber-500" />
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
            {formatCurrency(summary.totalCredit, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Card / line spend</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Debit Activity</span>
            <Wallet size={15} className="text-cyan-600" />
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
            {formatCurrency(summary.totalDebit, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Direct bank debits</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Daily Burn</span>
            <TrendingDown size={15} className="text-slate-500" />
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
            {formatCurrency(summary.dailyAverageSpend, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Avg spend / day</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Savings Rate</span>
            <TrendingUp size={15} className="text-emerald-600" />
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-emerald-700">
            {summary.savingsRate.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Of monthly earnings</div>
        </div>
      </div>

      {/* Monthly Budget Summary Section */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Monthly Budget Overview</h2>
            <p className="text-xs text-slate-500">
              {formatCurrency(summary.totalBudgetSpent, currency)} spent of{' '}
              {formatCurrency(summary.totalBudget, currency)} allocated
            </p>
          </div>
          <button
            onClick={() => setActiveTab('budget')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Manage Budget</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <BudgetProgressBar percentage={summary.totalBudgetPercentage} height="md" showLabel />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div>
            <span className="text-[11px] text-slate-400 block">Remaining Budget</span>
            <span className="text-base font-bold font-mono tabular-nums text-emerald-700">
              {formatCurrency(summary.totalBudgetRemaining, currency)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Budget Consumed</span>
            <span className="text-base font-bold font-mono tabular-nums text-slate-800">
              {summary.totalBudgetPercentage.toFixed(1)}%
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Categories at Risk</span>
            <span className="text-base font-bold font-mono tabular-nums text-amber-600">
              {summary.categoriesNearLimit.length + summary.categoriesOverBudget.length}
            </span>
          </div>
        </div>

        {/* Budget Warning Banner if approaching or over */}
        {(summary.categoriesOverBudget.length > 0 || summary.categoriesNearLimit.length > 0) && (
          <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              {summary.categoriesOverBudget.map((c) => {
                const info = getCategoryInfo(c.categoryId);
                return (
                  <div key={c.categoryId} className="font-medium">
                    <span className="font-bold text-rose-700">{info.label}</span> has exceeded budget limit ({c.percentage.toFixed(0)}% consumed, {formatCurrency(c.spent, currency)} / {formatCurrency(c.limit, currency)}).
                  </div>
                );
              })}
              {summary.categoriesNearLimit.map((c) => {
                const info = getCategoryInfo(c.categoryId);
                return (
                  <div key={c.categoryId}>
                    <span className="font-semibold">{info.label}</span> is approaching limit ({c.percentage.toFixed(0)}% consumed).
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Spending Breakdown Donut Section */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Spending by Category</h2>
            <p className="text-xs text-slate-500">Distribution across active budget categories</p>
          </div>
          <button
            onClick={() => setActiveTab('analytics')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Deep Analytics</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <CategoryDonutChart
          categorySummaries={summary.categorySummaries}
          currency={currency}
          totalSpent={summary.totalExpenses}
        />
      </div>

      {/* Recent Transactions Feed */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Financial Activity</h2>
            <p className="text-xs text-slate-500">Latest recorded transactions</p>
          </div>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-slate-400">No transactions recorded yet.</p>
            <button
              onClick={onOpenAddModal}
              className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl cursor-pointer"
            >
              Add First Transaction
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTransactions.slice(0, 6).map((tx) => {
              const info = getCategoryInfo(tx.category);
              const isIncome = tx.type === 'income' || tx.type === 'loan';
              return (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 truncate">
                    <CategoryIcon categoryId={tx.category} type={tx.type} size="md" />
                    <div className="truncate">
                      <h3 className="text-xs font-semibold text-slate-900 truncate">
                        {tx.description}
                      </h3>
                      {/* Zero-Pill Unboxed Metadata with Typographic Separators */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <span>{info.label}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{tx.type.replace('_', ' ')}</span>
                        <span aria-hidden="true">·</span>
                        <span>{tx.date}</span>
                        {tx.time && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{tx.time}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-3">
                    <span
                      className={`text-sm font-bold font-mono tabular-nums ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount, tx.currency || currency)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
