import React from 'react';
import { Plus, Globe } from 'lucide-react';
import { ActiveTab } from '../types';
import { CURRENCIES } from '../utils/currencies';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currency: string;
  onCurrencyChange: (code: string) => void;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currency,
  onCurrencyChange,
  onOpenAddModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-left font-display text-lg md:text-xl font-bold tracking-tight text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          Smart Expense Tracker
        </button>

        {/* Zone 2: Desktop Navigation Links (Text with hover states) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              activeTab === 'dashboard' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 pb-0.5' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              activeTab === 'transactions' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 pb-0.5' : ''
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              activeTab === 'budget' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 pb-0.5' : ''
            }`}
          >
            Budget
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              activeTab === 'analytics' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 pb-0.5' : ''
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('loans_savings')}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              activeTab === 'loans_savings' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 pb-0.5' : ''
            }`}
          >
            Loans & Goals
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              activeTab === 'settings' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 pb-0.5' : ''
            }`}
          >
            Settings
          </button>
        </nav>

        {/* Zone 3: Actions (Currency selector & Add transaction) */}
        <div className="flex items-center gap-2">
          {/* Currency dropdown selector */}
          <div className="relative flex items-center bg-slate-100 rounded-lg px-2.5 py-1.5 border border-slate-200/60 hover:border-slate-300 transition-colors">
            <Globe size={14} className="text-slate-500 mr-1.5 shrink-0" />
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              aria-label="Select Preferred Currency"
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Add CTA */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Entry</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </header>
  );
};
