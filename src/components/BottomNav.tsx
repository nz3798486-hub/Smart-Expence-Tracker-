import React from 'react';
import { LayoutDashboard, ArrowLeftRight, PieChart, TrendingUp, MoreVertical, Plus } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  budgetAlertCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  budgetAlertCount = 0,
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`min-h-[48px] min-w-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'dashboard' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard size={20} className={activeTab === 'dashboard' ? 'stroke-[2.4]' : 'stroke-[1.8]'} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Overview</span>
        </button>

        {/* Tab 2: Transactions */}
        <button
          onClick={() => setActiveTab('transactions')}
          className={`min-h-[48px] min-w-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'transactions' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ArrowLeftRight size={20} className={activeTab === 'transactions' ? 'stroke-[2.4]' : 'stroke-[1.8]'} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Activity</span>
        </button>

        {/* Tab 3: Centered Quick Add Button (Elevated touch action) */}
        <div className="flex items-center justify-center">
          <button
            onClick={onOpenAddModal}
            aria-label="Add New Transaction"
            className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/20 active:scale-90 transition-transform cursor-pointer -mt-4 border-2 border-white"
          >
            <Plus size={22} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 4: Budget */}
        <button
          onClick={() => setActiveTab('budget')}
          className={`relative min-h-[48px] min-w-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'budget' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <PieChart size={20} className={activeTab === 'budget' ? 'stroke-[2.4]' : 'stroke-[1.8]'} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Budget</span>
          {budgetAlertCount > 0 && (
            <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        {/* Tab 5: Analytics / More */}
        <button
          onClick={() => setActiveTab(activeTab === 'analytics' || activeTab === 'loans_savings' || activeTab === 'settings' ? activeTab : 'analytics')}
          className={`min-h-[48px] min-w-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'analytics' || activeTab === 'loans_savings' || activeTab === 'settings'
              ? 'text-emerald-700'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <TrendingUp size={20} className={activeTab === 'analytics' ? 'stroke-[2.4]' : 'stroke-[1.8]'} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Analytics</span>
        </button>
      </div>
    </nav>
  );
};
