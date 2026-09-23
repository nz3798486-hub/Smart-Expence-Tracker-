import React from 'react';
import { formatCurrency } from '../../utils/currencies';

interface IncomeExpenseBarChartProps {
  income: number;
  expenses: number;
  savings: number;
  loans: number;
  currency: string;
}

export const IncomeExpenseBarChart: React.FC<IncomeExpenseBarChartProps> = ({
  income,
  expenses,
  savings,
  loans,
  currency,
}) => {
  const items = [
    { label: 'Income', amount: income, color: '#10b981', bg: 'bg-emerald-500' },
    { label: 'Expenses', amount: expenses, color: '#ef4444', bg: 'bg-rose-500' },
    { label: 'Savings', amount: savings, color: '#8b5cf6', bg: 'bg-purple-500' },
    { label: 'Loans', amount: loans, color: '#ec4899', bg: 'bg-pink-500' },
  ];

  const maxVal = Math.max(...items.map((i) => i.amount), 100);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2 pt-4">
        {items.map((item) => {
          const heightPercent = Math.max(8, (item.amount / maxVal) * 100);
          return (
            <div key={item.label} className="flex flex-col items-center">
              <span className="text-[11px] font-bold font-mono tabular-nums text-slate-700 mb-2 truncate max-w-full">
                {formatCurrency(item.amount, currency, true)}
              </span>
              <div className="w-full bg-slate-100 rounded-t-xl h-28 flex items-end justify-center p-1">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[40px] rounded-t-lg ${item.bg} transition-all duration-500`}
                />
              </div>
              <span className="text-[11px] font-medium text-slate-500 mt-2 truncate">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
