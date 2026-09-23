import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { BudgetLimit, CategoryId } from '../types';
import { DEFAULT_CATEGORIES } from '../utils/categorizer';
import { CategoryIcon } from './CategoryIcon';
import { getCurrency } from '../utils/currencies';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgets: BudgetLimit[];
  onSaveBudgets: (updatedBudgets: BudgetLimit[]) => void;
  currency: string;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  budgets,
  onSaveBudgets,
  currency,
}) => {
  const [limits, setLimits] = useState<Record<string, number>>({});
  const curr = getCurrency(currency);

  useEffect(() => {
    if (isOpen) {
      const map: Record<string, number> = {};
      DEFAULT_CATEGORIES.forEach((c) => {
        const found = budgets.find((b) => b.category === c.id);
        map[c.id] = found ? found.monthlyLimit : 0;
      });
      setLimits(map);
    }
  }, [isOpen, budgets]);

  if (!isOpen) return null;

  const handleLimitChange = (catId: CategoryId, val: string) => {
    const num = Math.max(0, parseFloat(val) || 0);
    setLimits((prev) => ({ ...prev, [catId]: num }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BudgetLimit[] = Object.entries(limits).map(([category, monthlyLimit]) => ({
      category,
      monthlyLimit,
    }));
    onSaveBudgets(updated);
    onClose();
  };

  const totalCalculatedBudget = Object.values(limits).reduce((acc, v) => acc + (v || 0), 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-950/40 backdrop-blur-xs p-0 md:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full md:max-w-xl bg-white rounded-t-3xl md:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        <div className="pt-3 px-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Monthly Budget Limits</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Set spending caps per category. Total: {curr.symbol}{totalCalculatedBudget.toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-3.5 flex-1">
          {DEFAULT_CATEGORIES.map((cat) => {
            return (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CategoryIcon categoryId={cat.id} size="sm" />
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900">{cat.label}</h3>
                    <span className="text-[11px] text-slate-400">Monthly spending cap</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 w-36">
                  <span className="text-xs font-bold text-slate-500">{curr.symbol}</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={limits[cat.id] ?? ''}
                    onChange={(e) => handleLimitChange(cat.id, e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold font-mono tabular-nums text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            );
          })}

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check size={16} />
              <span>Save Budget Limits</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
