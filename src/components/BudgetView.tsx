import React from 'react';
import {
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { FinancialSummary } from '../utils/calculations';
import { formatCurrency } from '../utils/currencies';
import { getCategoryInfo } from '../utils/categorizer';
import { CategoryIcon } from './CategoryIcon';
import { BudgetProgressBar } from './charts/BudgetProgressBar';

interface BudgetViewProps {
  summary: FinancialSummary;
  currency: string;
  onOpenBudgetModal: () => void;
  onOpenAddModal: () => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  summary,
  currency,
  onOpenBudgetModal,
  onOpenAddModal,
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Monthly Budget
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Spending caps and real-time category limits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBudgetModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            <SlidersHorizontal size={14} />
            <span>Configure Limits</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Aggregate Budget Hero Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Monthly Budget Status
            </span>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-3xl md:text-4xl font-bold font-mono tabular-nums text-slate-900">
                {formatCurrency(summary.totalBudgetSpent, currency)}
              </span>
              <span className="text-sm font-semibold text-slate-400 font-mono tabular-nums">
                / {formatCurrency(summary.totalBudget, currency)} allocated
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Remaining Budget</span>
              <span
                className={`text-xl font-bold font-mono tabular-nums ${
                  summary.totalBudgetRemaining > 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {formatCurrency(summary.totalBudgetRemaining, currency)}
              </span>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Pace Consumed</span>
              <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                {summary.totalBudgetPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <BudgetProgressBar percentage={summary.totalBudgetPercentage} height="lg" showLabel />
        </div>

        {/* Warning cards if exceeded or approaching */}
        {summary.categoriesOverBudget.length > 0 && (
          <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
            <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xs font-bold text-rose-900">
                {summary.categoriesOverBudget.length} {summary.categoriesOverBudget.length === 1 ? 'Category Exceeded Limit' : 'Categories Exceeded Limits'}
              </h2>
              <p className="text-xs text-rose-700 mt-0.5">
                Spending has crossed 100% of defined budget cap. Consider trimming non-essential expenditures or rebalancing caps.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Category Budget Breakdown Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-900">Category Allocations</h2>
          <span className="text-xs text-slate-400">
            {summary.categorySummaries.length} tracked categories
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {summary.categorySummaries.map((cat) => {
            const info = getCategoryInfo(cat.categoryId);
            const isExceeded = cat.status === 'exceeded';
            const isWarning = cat.status === 'warning';

            return (
              <div
                key={cat.categoryId}
                className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <CategoryIcon categoryId={cat.categoryId} size="md" />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{info.label}</h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <span>{cat.transactionCount} transactions</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums font-semibold">
                            {cat.percentage.toFixed(0)}% used
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="shrink-0 text-right">
                      {isExceeded ? (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600">
                          <AlertCircle size={14} />
                          <span>Exceeded</span>
                        </div>
                      ) : isWarning ? (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                          <AlertTriangle size={14} />
                          <span>Near Limit</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          <CheckCircle2 size={14} />
                          <span>On Track</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial figures row */}
                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Spent
                      </span>
                      <span
                        className={`text-base font-bold font-mono tabular-nums ${
                          isExceeded ? 'text-rose-600' : 'text-slate-900'
                        }`}
                      >
                        {formatCurrency(cat.spent, currency)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Remaining
                      </span>
                      <span className="text-base font-bold font-mono tabular-nums text-slate-700">
                        {formatCurrency(cat.remaining, currency)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2.5">
                    <BudgetProgressBar percentage={cat.percentage} height="sm" />
                  </div>
                </div>

                {/* Subtext info */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Limit: {formatCurrency(cat.limit, currency)}</span>
                  <span>
                    {cat.limit > 0
                      ? cat.spent > cat.limit
                        ? `${formatCurrency(cat.spent - cat.limit, currency)} over cap`
                        : `${formatCurrency(cat.remaining, currency)} available`
                      : 'No cap set'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
