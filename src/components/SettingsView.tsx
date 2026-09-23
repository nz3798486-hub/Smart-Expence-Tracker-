import React, { useRef } from 'react';
import {
  Globe,
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Calculator,
  ShieldCheck,
} from 'lucide-react';
import { CURRENCIES } from '../utils/currencies';
import { Transaction, BudgetLimit, SavingsGoal, LoanItem } from '../types';
import { exportToCSV, exportToJSON } from '../utils/storage';
import { DEFAULT_CATEGORIES } from '../utils/categorizer';
import { CategoryIcon } from './CategoryIcon';

interface SettingsViewProps {
  currency: string;
  onCurrencyChange: (code: string) => void;
  transactions: Transaction[];
  budgets: BudgetLimit[];
  savingsGoals: SavingsGoal[];
  loans: LoanItem[];
  onResetDemoData: () => void;
  onClearAllData: () => void;
  onImportData: (data: {
    transactions?: Transaction[];
    budgets?: BudgetLimit[];
    savings?: SavingsGoal[];
    loans?: LoanItem[];
  }) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currency,
  onCurrencyChange,
  transactions,
  budgets,
  savingsGoals,
  loans,
  onResetDemoData,
  onClearAllData,
  onImportData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          onImportData({
            transactions: parsed.transactions,
            budgets: parsed.budgets,
            savings: parsed.savings,
            loans: parsed.loans,
          });
          alert('Data backup successfully restored!');
        }
      } catch (err) {
        alert('Invalid JSON file format. Please upload a valid Smart Expense Tracker backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title */}
      <div className="pt-2">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
          Preferences & Data Management
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure preferred currency, export ledgers, and manage local storage
        </p>
      </div>

      {/* Currency Preference Card */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={18} className="text-emerald-700" />
          <h2 className="text-sm font-bold text-slate-900">Preferred Display Currency</h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          All financial figures, summary totals, and charts across the entire application will render using this currency symbol and standard format.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {CURRENCIES.map((c) => {
            const isSelected = currency === c.code;
            return (
              <button
                key={c.code}
                onClick={() => onCurrencyChange(c.code)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">{c.code}</span>
                  <span className="text-xs font-mono font-bold text-emerald-700">{c.symbol}</span>
                </div>
                <span className="text-[11px] text-slate-500 truncate block mt-1">
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calculation Transparency Explainer */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Calculator size={18} className="text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">Financial Calculation Logic</h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          How Smart Expense Tracker calculates your current financial standing:
        </p>

        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-xl font-mono text-[11px] border border-slate-200/60">
            <span className="text-emerald-700 font-bold">Available Balance</span> = (Total Income + Loans Borrowed) - (Total Expenses + Loan Repayments + Savings Locked)
          </div>
          <div className="p-3 bg-slate-50 rounded-xl font-mono text-[11px] border border-slate-200/60">
            <span className="text-pink-700 font-bold">Outstanding Debt</span> = Total Loans Borrowed - Total Loan Repayments
          </div>
          <div className="p-3 bg-slate-50 rounded-xl font-mono text-[11px] border border-slate-200/60">
            <span className="text-slate-900 font-bold">Remaining Budget</span> = Category Monthly Limit - Category Cumulative Period Expenses
          </div>
        </div>
      </div>

      {/* Active Spending Categories */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-1">Configured Spending Categories</h2>
        <p className="text-xs text-slate-500 mb-4">
          Each category features intelligent auto-classification rules matching 60+ transaction keywords.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {DEFAULT_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100"
            >
              <CategoryIcon categoryId={cat.id} size="sm" />
              <span className="text-xs font-semibold text-slate-800 truncate">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Backup & Reset */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Database size={18} className="text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">Data Storage & Backup</h2>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Your records are stored securely in your browser's private local database. You can export complete backups anytime.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Export CSV */}
          <button
            onClick={() => exportToCSV(transactions)}
            className="flex items-center justify-center gap-2 p-3 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download size={15} />
            <span>Export CSV Ledger</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={() => exportToJSON(transactions, budgets, savingsGoals, loans)}
            className="flex items-center justify-center gap-2 p-3 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download size={15} />
            <span>Backup Full JSON</span>
          </button>

          {/* Import JSON */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-3 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <Upload size={15} />
              <span>Restore Backup</span>
            </button>
          </div>

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (confirm('Reset to initial sample demo data? Any recent custom entries will be replaced with clean demo records.')) {
                onResetDemoData();
              }
            }}
            className="flex items-center justify-center gap-2 p-3 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw size={15} />
            <span>Seed Demo Data</span>
          </button>
        </div>

        {/* Clear Data Danger Zone */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-rose-700 block">Clear All Stored Records</span>
            <span className="text-[11px] text-slate-400">
              Permanently purge all stored transactions, budgets, and loans from browser memory.
            </span>
          </div>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to permanently delete ALL financial data?')) {
                onClearAllData();
              }
            }}
            className="px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
};
