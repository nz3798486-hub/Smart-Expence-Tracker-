import React from 'react';
import {
  TrendingUp,
  PieChart,
  BarChart3,
  CreditCard,
  Building,
  Lightbulb,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
} from 'lucide-react';
import { FinancialSummary } from '../utils/calculations';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/currencies';
import { getCategoryInfo } from '../utils/categorizer';
import { CategoryDonutChart } from './charts/CategoryDonutChart';
import { SpendingTrendChart } from './charts/SpendingTrendChart';
import { IncomeExpenseBarChart } from './charts/IncomeExpenseBarChart';
import { CategoryIcon } from './CategoryIcon';

interface AnalyticsViewProps {
  summary: FinancialSummary;
  transactions: Transaction[];
  currency: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  summary,
  transactions,
  currency,
}) => {
  const topCategory = summary.categorySummaries[0];
  const topCatInfo = topCategory ? getCategoryInfo(topCategory.categoryId) : null;
  const topCatPercent =
    summary.totalExpenses > 0 && topCategory
      ? ((topCategory.spent / summary.totalExpenses) * 100).toFixed(0)
      : '0';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Title */}
      <div className="pt-2">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
          Financial Intelligence & Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Spending trends, cash-flow ratios, and budget velocity
        </p>
      </div>

      {/* Key Insights Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Insight 1: Top Category */}
        <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Largest Outflow
              </span>
              <PieChart size={15} className="text-emerald-600" />
            </div>
            <div className="flex items-center gap-2.5">
              {topCategory && <CategoryIcon categoryId={topCategory.categoryId} size="sm" />}
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {topCatInfo ? topCatInfo.label : 'None'}
                </h3>
                <span className="text-xs font-bold font-mono tabular-nums text-slate-600">
                  {formatCurrency(topCategory?.spent || 0, currency)} ({topCatPercent}% of expenses)
                </span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
            Accounts for the highest proportion of your monthly spending.
          </p>
        </div>

        {/* Insight 2: Savings Health */}
        <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Savings Rate
              </span>
              <TrendingUp size={15} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-purple-700">
              {summary.savingsRate.toFixed(1)}%
            </div>
            <span className="text-xs text-slate-500 mt-0.5 block">
              {formatCurrency(summary.totalSavings, currency)} deposited to savings
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
            {summary.savingsRate >= 20
              ? 'Excellent. Exceeds standard 20% financial wellness benchmark.'
              : 'Targeting 20% savings builds strong liquidity buffers.'}
          </p>
        </div>

        {/* Insight 3: Credit vs Debit Split */}
        <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Payment Channels
              </span>
              <CreditCard size={15} className="text-amber-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Credit</span>
                <span className="text-sm font-bold font-mono tabular-nums text-slate-900">
                  {formatCurrency(summary.totalCredit, currency)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Debit / Cash</span>
                <span className="text-sm font-bold font-mono tabular-nums text-slate-900">
                  {formatCurrency(summary.totalDebit, currency)}
                </span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
            {summary.totalCredit > 0
              ? `Credit cards represent ${((summary.totalCredit / (summary.totalCredit + summary.totalDebit || 1)) * 100).toFixed(0)}% of cashless activity.`
              : 'Zero credit card debt incurred this period.'}
          </p>
        </div>
      </div>

      {/* Row 1: Donut Spending Breakdown + Income vs Expense Bar Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Spending by Category Donut */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">Category Spending Distribution</h2>
            <p className="text-xs text-slate-500">Tap slices for percentage and amount breakdown</p>
          </div>
          <CategoryDonutChart
            categorySummaries={summary.categorySummaries}
            currency={currency}
            totalSpent={summary.totalExpenses}
          />
        </div>

        {/* Income vs Expenses Bar Chart */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900">Inflow vs Outflow Comparison</h2>
              <p className="text-xs text-slate-500">Cash velocity comparison across all primary accounts</p>
            </div>
            <IncomeExpenseBarChart
              income={summary.totalIncome}
              expenses={summary.totalExpenses}
              savings={summary.totalSavings}
              loans={summary.totalLoans}
              currency={currency}
            />
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Net Operating Surplus</span>
              <span
                className={`font-bold font-mono tabular-nums text-sm ${
                  summary.totalIncome >= summary.totalExpenses ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {formatCurrency(summary.totalIncome - summary.totalExpenses, currency)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[11px] block">Outstanding Debt</span>
              <span className="font-bold font-mono tabular-nums text-sm text-pink-700">
                {formatCurrency(summary.outstandingLoans, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: 14-Day Spending Trend Line Chart */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Daily Spending Trend (Last 14 Days)</h2>
            <p className="text-xs text-slate-500">
              Interactive timeline tracking expense volatility and volume
            </p>
          </div>
        </div>

        <SpendingTrendChart transactions={transactions} currency={currency} />
      </div>

      {/* Actionable Financial Advice */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Lightbulb size={16} />
          <span>Smart Financial Guidance</span>
        </div>
        <div className="space-y-2 text-xs text-slate-300">
          {summary.totalBudgetPercentage > 90 ? (
            <p>
              • Budget consumption is high ({summary.totalBudgetPercentage.toFixed(0)}%). Prioritize non-discretionary expenses in the remaining days of the month.
            </p>
          ) : (
            <p>
              • Budget pace is healthy at {summary.totalBudgetPercentage.toFixed(0)}%. You have {formatCurrency(summary.totalBudgetRemaining, currency)} in remaining spending headroom.
            </p>
          )}
          {summary.outstandingLoans > 0 && (
            <p>
              • You have {formatCurrency(summary.outstandingLoans, currency)} in outstanding debt. Making extra principal repayments early reduces long-term interest charges.
            </p>
          )}
          <p>
            • Daily average spending is currently {formatCurrency(summary.dailyAverageSpend, currency)}/day.
          </p>
        </div>
      </div>
    </div>
  );
};
