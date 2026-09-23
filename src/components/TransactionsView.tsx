import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Plus,
  SlidersHorizontal,
  X,
  Calendar,
} from 'lucide-react';
import { Transaction, TransactionType, CategoryId, TimeFilter } from '../types';
import { DEFAULT_CATEGORIES, getCategoryInfo } from '../utils/categorizer';
import { formatCurrency } from '../utils/currencies';
import { CategoryIcon } from './CategoryIcon';
import { exportToCSV } from '../utils/storage';

interface TransactionsViewProps {
  transactions: Transaction[];
  currency: string;
  onOpenAddModal: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  currency,
  onOpenAddModal,
  onSelectTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Filtering transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Search text match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(q);
        const matchesNotes = (tx.notes || '').toLowerCase().includes(q);
        const catInfo = getCategoryInfo(tx.category);
        const matchesCat = catInfo.label.toLowerCase().includes(q);
        if (!matchesDesc && !matchesNotes && !matchesCat) return false;
      }

      // Type filter
      if (selectedType !== 'all' && tx.type !== selectedType) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && tx.category !== selectedCategory) {
        return false;
      }

      // Custom date range
      if (startDate && tx.date < startDate) return false;
      if (endDate && tx.date > endDate) return false;

      // TimeFilter preset
      if (timeFilter !== 'all' && timeFilter !== 'custom') {
        const now = new Date();
        const txDate = new Date(tx.date + 'T' + (tx.time || '12:00'));
        if (timeFilter === 'today') {
          const isToday = tx.date === now.toISOString().split('T')[0];
          if (!isToday) return false;
        } else if (timeFilter === 'week') {
          const diffDays = (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24);
          if (diffDays < 0 || diffDays > 7) return false;
        } else if (timeFilter === 'month') {
          if (
            txDate.getFullYear() !== now.getFullYear() ||
            txDate.getMonth() !== now.getMonth()
          ) {
            return false;
          }
        } else if (timeFilter === 'year') {
          if (txDate.getFullYear() !== now.getFullYear()) return false;
        }
      }

      return true;
    });
  }, [transactions, searchQuery, selectedType, selectedCategory, timeFilter, startDate, endDate]);

  // Group by Date for pristine presentation
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    filteredTransactions.forEach((tx) => {
      const d = tx.date;
      if (!groups[d]) groups[d] = [];
      groups[d].push(tx);
    });

    const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    return sortedDates.map((dateStr) => {
      let label = dateStr;
      if (dateStr === todayStr) label = 'Today';
      else if (dateStr === yesterdayStr) label = 'Yesterday';
      else {
        const dObj = new Date(dateStr + 'T12:00:00');
        label = dObj.toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }

      const dayTotal = groups[dateStr].reduce((acc, t) => {
        if (t.type === 'expense' || t.type === 'debit') return acc - Number(t.amount);
        if (t.type === 'income') return acc + Number(t.amount);
        return acc;
      }, 0);

      return {
        dateStr,
        label,
        items: groups[dateStr],
        dayTotal,
      };
    });
  }, [filteredTransactions]);

  const hasActiveFilters =
    searchQuery ||
    selectedType !== 'all' ||
    selectedCategory !== 'all' ||
    timeFilter !== 'all' ||
    startDate ||
    endDate;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('all');
    setTimeFilter('all');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Transaction Activity
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {filteredTransactions.length} of {transactions.length} records shown
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(filteredTransactions)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Record New</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by description, merchant, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick Time Range Preset */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
            {(['all', 'today', 'week', 'month', 'year'] as TimeFilter[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer capitalize ${
                  timeFilter === tf
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf === 'all' ? 'All Time' : tf === 'week' ? '7 Days' : tf}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Secondary Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Transaction Type Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
              <option value="savings">Savings</option>
              <option value="loan">Loan</option>
              <option value="loan_repayment">Loan Repayment</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">Filtering applied</span>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Transactions Grouped Feed */}
      {groupedTransactions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80">
          <p className="text-sm font-semibold text-slate-700">No transactions found</p>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search criteria or date filters
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedTransactions.map((group) => (
            <div key={group.dateStr} className="space-y-1.5">
              {/* Clean Date Header */}
              <div className="flex items-center justify-between px-2 pt-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {group.label}
                </span>
                <span className="text-[11px] font-mono tabular-nums text-slate-400">
                  {group.items.length} {group.items.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>

              {/* Day's Transactions List Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
                {group.items.map((tx) => {
                  const info = getCategoryInfo(tx.category);
                  const isIncome = tx.type === 'income' || tx.type === 'loan';
                  return (
                    <div
                      key={tx.id}
                      onClick={() => onSelectTransaction(tx)}
                      className="py-3 px-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5 truncate">
                        <CategoryIcon categoryId={tx.category} type={tx.type} size="md" />
                        <div className="truncate">
                          <h2 className="text-xs md:text-sm font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                            {tx.description}
                          </h2>
                          {/* Zero-Pill Unboxed Metadata with Typographic Separators */}
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <span>{info.label}</span>
                            <span aria-hidden="true">·</span>
                            <span className="capitalize">{tx.type.replace('_', ' ')}</span>
                            {tx.time && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{tx.time}</span>
                              </>
                            )}
                            {tx.notes && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="truncate max-w-[120px] md:max-w-xs">{tx.notes}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-3">
                        <div
                          className={`text-sm md:text-base font-bold font-mono tabular-nums ${
                            isIncome ? 'text-emerald-600' : 'text-slate-900'
                          }`}
                        >
                          {isIncome ? '+' : '-'}{formatCurrency(tx.amount, tx.currency || currency)}
                        </div>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {tx.currency || currency}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
