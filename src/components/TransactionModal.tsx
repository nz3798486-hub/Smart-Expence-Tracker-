import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Trash2, Calendar, Clock, DollarSign } from 'lucide-react';
import { Transaction, TransactionType, CategoryId } from '../types';
import { DEFAULT_CATEGORIES, autoClassifyCategory } from '../utils/categorizer';
import { CURRENCIES } from '../utils/currencies';
import { CategoryIcon } from './CategoryIcon';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id' | 'createdAt'>, existingId?: string) => void;
  onDelete?: (id: string) => void;
  initialTransaction?: Transaction | null;
  defaultCurrency: string;
}

const TRANSACTION_TYPES: { id: TransactionType; label: string; desc: string }[] = [
  { id: 'expense', label: 'Expense', desc: 'Outflow spending' },
  { id: 'income', label: 'Income', desc: 'Salary, earnings, deposits' },
  { id: 'savings', label: 'Savings', desc: 'Deposit to savings fund' },
  { id: 'credit', label: 'Credit', desc: 'Credit card or line spend' },
  { id: 'debit', label: 'Debit', desc: 'Direct bank / debit charge' },
  { id: 'loan', label: 'Loan', desc: 'Funds borrowed or received' },
  { id: 'loan_repayment', label: 'Loan Repay', desc: 'Repaying debt or loan' },
];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialTransaction,
  defaultCurrency,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<CategoryId>('food');
  const [isManuallyOverridden, setIsManuallyOverridden] = useState<boolean>(false);
  const [autoMatchInfo, setAutoMatchInfo] = useState<{ matchedKeyword?: string } | null>(null);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [currency, setCurrency] = useState<string>(defaultCurrency);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Setup initial values on open or edit
  useEffect(() => {
    if (!isOpen) return;

    if (initialTransaction) {
      setType(initialTransaction.type);
      setAmount(initialTransaction.amount.toString());
      setDescription(initialTransaction.description);
      setCategory(initialTransaction.category);
      setIsManuallyOverridden(true);
      setDate(initialTransaction.date);
      setTime(initialTransaction.time || '12:00');
      setCurrency(initialTransaction.currency || defaultCurrency);
      setNotes(initialTransaction.notes || '');
      setAutoMatchInfo(null);
    } else {
      const now = new Date();
      setType('expense');
      setAmount('');
      setDescription('');
      setCategory('food');
      setIsManuallyOverridden(false);
      setDate(now.toISOString().split('T')[0]);
      setTime(now.toTimeString().slice(0, 5));
      setCurrency(defaultCurrency);
      setNotes('');
      setAutoMatchInfo(null);
    }
    setError(null);
  }, [isOpen, initialTransaction, defaultCurrency]);

  // Handle description change with real-time automatic classification
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDescription(val);

    // If user hasn't explicitly clicked a manual category or if it's an expense
    if (!isManuallyOverridden && (type === 'expense' || type === 'credit' || type === 'debit')) {
      const match = autoClassifyCategory(val);
      if (match.confidence !== 'none') {
        setCategory(match.categoryId);
        setAutoMatchInfo({ matchedKeyword: match.matchedKeyword });
      } else {
        setAutoMatchInfo(null);
      }
    }
  };

  const handleCategorySelect = (catId: CategoryId) => {
    setCategory(catId);
    setIsManuallyOverridden(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description for the transaction.');
      return;
    }
    if (!date) {
      setError('Please choose a valid transaction date.');
      return;
    }

    onSave(
      {
        amount: numAmount,
        type,
        category,
        description: description.trim(),
        date,
        time: time || '12:00',
        currency,
        notes: notes.trim(),
      },
      initialTransaction?.id
    );

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-950/40 backdrop-blur-xs p-0 md:p-4 animate-in fade-in duration-200"
    >
      <div
        className="w-full md:max-w-xl bg-white rounded-t-3xl md:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200/80"
      >
        {/* Header / Grab Handle on Mobile */}
        <div className="pt-2 px-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="md:hidden w-10 h-1 bg-slate-200 rounded-full mx-auto mb-2" />
            <h2 className="text-lg font-bold text-slate-900">
              {initialTransaction ? 'Edit Transaction' : 'Record Transaction'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Accurate timestamped record for balance and budgets
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl">
              {error}
            </div>
          )}

          {/* Transaction Type Segmented Control */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 p-1 bg-slate-100 rounded-xl">
              {TRANSACTION_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`py-2 px-1 text-[11px] font-medium rounded-lg transition-all text-center whitespace-nowrap cursor-pointer ${
                    type === t.id
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <DollarSign size={18} />
                </div>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xl font-bold font-mono tabular-nums text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full py-3.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description with Smart Categorization */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Description
              </label>
              {autoMatchInfo?.matchedKeyword && !isManuallyOverridden && (
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <Sparkles size={12} className="text-emerald-600 animate-pulse" />
                  <span>Auto-classified from "{autoMatchInfo.matchedKeyword}"</span>
                </div>
              )}
            </div>
            <input
              type="text"
              required
              placeholder="e.g. Whole Foods Groceries, Edison Power, Uber to work..."
              value={description}
              onChange={handleDescriptionChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Category Selection Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                Category
              </label>
              <span className="text-[11px] text-slate-400">
                {isManuallyOverridden ? 'Manual selection' : 'Automatic suggestion active'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-44 overflow-y-auto p-1">
              {DEFAULT_CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200/70 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <CategoryIcon categoryId={cat.id} size="sm" />
                    <span className="text-xs font-medium text-slate-800 truncate">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Row (Strict Timestamp requirement) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Receipt #4829, Split with Sarah"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            {initialTransaction && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this transaction?')) {
                    onDelete(initialTransaction.id);
                    onClose();
                  }
                }}
                className="px-4 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={15} />
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={16} />
                <span>{initialTransaction ? 'Update Entry' : 'Save Transaction'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
