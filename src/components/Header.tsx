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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      {/* Top Branding Animated Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-b border-emerald-500/30 py-1.5 px-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5 text-center leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-extrabold tracking-wide text-xs sm:text-[13px] animate-gradient-text uppercase">
              Developed by Ai Agentic Automation
            </span>
          </div>

          <span className="hidden sm:inline text-slate-600 font-bold">·</span>

          <div className="flex items-center flex-wrap justify-center gap-1.5 text-xs sm:text-[13px] font-bold">
            <span className="text-emerald-400 flex items-center gap-1 font-extrabold">
              <svg
                className="w-3.5 h-3.5 fill-current text-emerald-400 shrink-0"
                viewBox="0 0 24 24"
              >
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.128-.517-1.748-.718-2.884-2.483-2.971-2.6-.088-.116-.708-.941-.708-1.792s.448-1.272.607-1.446c.159-.175.346-.219.462-.219.116 0 .232.001.332.006.106.005.249-.04.39.299.144.348.491 1.199.535 1.286.044.087.073.189.014.305-.058.116-.088.188-.175.29-.088.102-.185.228-.264.306-.088.088-.18.183-.077.36.102.174.454.748.974 1.212.67.597 1.235.782 1.409.869.174.087.276.073.378-.044.102-.116.435-.508.551-.682.116-.174.232-.145.39-.087.16.058 1.014.478 1.188.565.174.088.29.131.333.204.043.073.043.421-.101.826z" />
              </svg>
              <span>Whatsapp</span>
            </span>
            <a
              href="https://wa.me/923401266879"
              target="_blank"
              rel="noopener noreferrer"
              title="Chat on WhatsApp +923401266879"
              className="text-white hover:text-emerald-300 font-mono tracking-tight font-extrabold underline decoration-emerald-500/60 hover:decoration-emerald-400 transition-colors"
            >
              +923401266879
            </a>
            <span className="text-slate-500">,</span>
            <a
              href="https://wa.me/923090641655"
              target="_blank"
              rel="noopener noreferrer"
              title="Chat on WhatsApp +923090641655"
              className="text-white hover:text-emerald-300 font-mono tracking-tight font-extrabold underline decoration-emerald-500/60 hover:decoration-emerald-400 transition-colors"
            >
              +923090641655
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">

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
