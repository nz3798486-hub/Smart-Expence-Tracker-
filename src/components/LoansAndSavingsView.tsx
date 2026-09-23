import React, { useState } from 'react';
import {
  PiggyBank,
  Building,
  Plus,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { SavingsGoal, LoanItem } from '../types';
import { formatCurrency } from '../utils/currencies';

interface LoansAndSavingsViewProps {
  savingsGoals: SavingsGoal[];
  loans: LoanItem[];
  currency: string;
  onAddSavingsFund: (goalId: string, amount: number) => void;
  onAddLoanRepayment: (loanId: string, amount: number) => void;
  onOpenAddModal: () => void;
  onSaveSavingsGoal: (goal: SavingsGoal) => void;
  onSaveLoan: (loan: LoanItem) => void;
}

export const LoansAndSavingsView: React.FC<LoansAndSavingsViewProps> = ({
  savingsGoals,
  loans,
  currency,
  onAddSavingsFund,
  onAddLoanRepayment,
  onOpenAddModal,
  onSaveSavingsGoal,
  onSaveLoan,
}) => {
  const [activeTab, setActiveTab] = useState<'savings' | 'loans'>('savings');

  // Modal states for adding quick savings/loan records
  const [quickAmountModal, setQuickAmountModal] = useState<{
    type: 'savings' | 'repayment';
    id: string;
    title: string;
  } | null>(null);
  const [quickAmount, setQuickAmount] = useState<string>('');

  // New goal modal
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalInitial, setNewGoalInitial] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');

  // New loan modal
  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);
  const [newLoanLender, setNewLoanLender] = useState('');
  const [newLoanAmount, setNewLoanAmount] = useState('');
  const [newLoanRepaid, setNewLoanRepaid] = useState('0');
  const [newLoanRate, setNewLoanRate] = useState('');
  const [newLoanDueDate, setNewLoanDueDate] = useState('');

  const totalSaved = savingsGoals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalSavingsTarget = savingsGoals.reduce((acc, g) => acc + g.targetAmount, 0);

  const totalLoansBorrowed = loans.reduce((acc, l) => acc + l.totalAmount, 0);
  const totalLoansRepaid = loans.reduce((acc, l) => acc + l.repaidAmount, 0);
  const totalOutstandingLoan = Math.max(0, totalLoansBorrowed - totalLoansRepaid);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(quickAmount);
    if (!quickAmountModal || isNaN(amt) || amt <= 0) return;

    if (quickAmountModal.type === 'savings') {
      onAddSavingsFund(quickAmountModal.id, amt);
    } else {
      onAddLoanRepayment(quickAmountModal.id, amt);
    }
    setQuickAmountModal(null);
    setQuickAmount('');
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(newGoalTarget);
    const initial = parseFloat(newGoalInitial) || 0;
    if (!newGoalTitle || isNaN(target) || target <= 0) return;

    onSaveSavingsGoal({
      id: 'goal-' + Date.now(),
      title: newGoalTitle.trim(),
      targetAmount: target,
      currentAmount: initial,
      targetDate: newGoalDate || undefined,
    });

    setIsNewGoalModalOpen(false);
    setNewGoalTitle('');
    setNewGoalTarget('');
    setNewGoalInitial('');
    setNewGoalDate('');
  };

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newLoanAmount);
    const repaid = parseFloat(newLoanRepaid) || 0;
    if (!newLoanLender || isNaN(amt) || amt <= 0) return;

    onSaveLoan({
      id: 'loan-' + Date.now(),
      lenderOrBorrower: newLoanLender.trim(),
      totalAmount: amt,
      repaidAmount: repaid,
      dueDate: newLoanDueDate || undefined,
      interestRate: parseFloat(newLoanRate) || undefined,
      type: 'borrowed',
    });

    setIsNewLoanModalOpen(false);
    setNewLoanLender('');
    setNewLoanAmount('');
    setNewLoanRepaid('0');
    setNewLoanRate('');
    setNewLoanDueDate('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Title & Segment Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Savings & Loan Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dedicated tracking for long-term reserves and credit facilities
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('savings')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'savings'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Savings Goals ({savingsGoals.length})
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'loans'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Loans & Debt ({loans.length})
          </button>
        </div>
      </div>

      {activeTab === 'savings' ? (
        /* SAVINGS SECTION */
        <div className="space-y-4">
          {/* Savings Summary Hero */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-200">
                  Total Accumulated Savings
                </span>
                <div className="mt-2 text-3xl md:text-4xl font-bold font-mono tabular-nums">
                  {formatCurrency(totalSaved, currency)}
                </div>
                <span className="text-xs text-purple-200 mt-1 block">
                  Target: {formatCurrency(totalSavingsTarget, currency)} across all funds
                </span>
              </div>

              <button
                onClick={() => setIsNewGoalModalOpen(true)}
                className="self-start md:self-auto px-4 py-2.5 bg-white text-purple-900 font-semibold text-xs rounded-xl shadow-xs hover:bg-purple-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={16} />
                <span>New Savings Goal</span>
              </button>
            </div>

            {/* Overall progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-purple-200 font-mono tabular-nums mb-1.5">
                <span>Total Portfolio Funded</span>
                <span>
                  {totalSavingsTarget > 0 ? ((totalSaved / totalSavingsTarget) * 100).toFixed(0) : 0}%
                </span>
              </div>
              <div className="w-full bg-purple-950/60 rounded-full h-3 overflow-hidden p-0.5 border border-purple-800/50">
                <div
                  className="bg-purple-400 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      totalSavingsTarget > 0 ? (totalSaved / totalSavingsTarget) * 100 : 0
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Savings Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savingsGoals.map((goal) => {
              const percent =
                goal.targetAmount > 0
                  ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
                  : 0;
              const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

              return (
                <div
                  key={goal.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <PiggyBank size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{goal.title}</h3>
                          {goal.targetDate && (
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              Target Date: {goal.targetDate}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-xs font-bold font-mono tabular-nums text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg">
                        {percent.toFixed(0)}%
                      </span>
                    </div>

                    <div className="mt-5 flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Current Saved
                        </span>
                        <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                          {formatCurrency(goal.currentAmount, currency)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Goal Target
                        </span>
                        <span className="text-base font-bold font-mono tabular-nums text-slate-600">
                          {formatCurrency(goal.targetAmount, currency)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono tabular-nums">
                      {remaining === 0 ? 'Goal completed 🎉' : `${formatCurrency(remaining, currency)} remaining`}
                    </span>
                    <button
                      onClick={() =>
                        setQuickAmountModal({
                          type: 'savings',
                          id: goal.id,
                          title: goal.title,
                        })
                      }
                      className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                    >
                      + Add Funds
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* LOANS SECTION */
        <div className="space-y-4">
          {/* Loans Summary Hero */}
          <div className="bg-gradient-to-r from-pink-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-pink-200">
                  Total Outstanding Debt
                </span>
                <div className="mt-2 text-3xl md:text-4xl font-bold font-mono tabular-nums text-pink-300">
                  {formatCurrency(totalOutstandingLoan, currency)}
                </div>
                <span className="text-xs text-pink-200 mt-1 block">
                  Original borrowed: {formatCurrency(totalLoansBorrowed, currency)} · Total repaid: {formatCurrency(totalLoansRepaid, currency)}
                </span>
              </div>

              <button
                onClick={() => setIsNewLoanModalOpen(true)}
                className="self-start md:self-auto px-4 py-2.5 bg-white text-pink-900 font-semibold text-xs rounded-xl shadow-xs hover:bg-pink-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={16} />
                <span>Track New Loan</span>
              </button>
            </div>

            {/* Repayment progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-pink-200 font-mono tabular-nums mb-1.5">
                <span>Repaid Progress</span>
                <span>
                  {totalLoansBorrowed > 0
                    ? ((totalLoansRepaid / totalLoansBorrowed) * 100).toFixed(0)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-pink-900/40">
                <div
                  className="bg-pink-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      totalLoansBorrowed > 0 ? (totalLoansRepaid / totalLoansBorrowed) * 100 : 0
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Loans List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loans.map((loan) => {
              const remainingDebt = Math.max(0, loan.totalAmount - loan.repaidAmount);
              const repaidPercent =
                loan.totalAmount > 0
                  ? Math.min(100, (loan.repaidAmount / loan.totalAmount) * 100)
                  : 0;

              return (
                <div
                  key={loan.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                          <Building size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            {loan.lenderOrBorrower}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            {loan.interestRate && <span>{loan.interestRate}% APR</span>}
                            {loan.dueDate && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>Due: {loan.dueDate}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-bold font-mono tabular-nums text-pink-700 bg-pink-50 px-2 py-0.5 rounded-lg">
                        {repaidPercent.toFixed(0)}% Repaid
                      </span>
                    </div>

                    <div className="mt-5 flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Outstanding Balance
                        </span>
                        <span className="text-lg font-bold font-mono tabular-nums text-pink-700">
                          {formatCurrency(remainingDebt, currency)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Original Principal
                        </span>
                        <span className="text-base font-bold font-mono tabular-nums text-slate-700">
                          {formatCurrency(loan.totalAmount, currency)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-pink-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${repaidPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono tabular-nums">
                      Repaid: {formatCurrency(loan.repaidAmount, currency)}
                    </span>
                    <button
                      onClick={() =>
                        setQuickAmountModal({
                          type: 'repayment',
                          id: loan.id,
                          title: loan.lenderOrBorrower,
                        })
                      }
                      className="px-3 py-1.5 text-xs font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Record Repayment
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Deposit / Repayment Modal */}
      {quickAmountModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900">
              {quickAmountModal.type === 'savings' ? 'Add to Savings Fund' : 'Record Loan Repayment'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {quickAmountModal.title}
            </p>

            <form onSubmit={handleQuickSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount ({currency})
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  autoFocus
                  placeholder="0.00"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickAmountModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Goal Modal */}
      {isNewGoalModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Create New Savings Goal</h2>
            <form onSubmit={handleCreateGoal} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vacation Fund, House Downpayment"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Amount ({currency})</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  placeholder="e.g. 5000"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Saved ({currency})</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0.00"
                  value={newGoalInitial}
                  onChange={(e) => setNewGoalInitial(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Date (Optional)</label>
                <input
                  type="date"
                  value={newGoalDate}
                  onChange={(e) => setNewGoalDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewGoalModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg cursor-pointer"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Loan Modal */}
      {isNewLoanModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Track New Loan / Debt</h2>
            <form onSubmit={handleCreateLoan} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lender / Facility Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chase Bank Auto Loan, Alex"
                  value={newLoanLender}
                  onChange={(e) => setNewLoanLender(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Loan Amount ({currency})</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  placeholder="e.g. 10000"
                  value={newLoanAmount}
                  onChange={(e) => setNewLoanAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Already Repaid</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={newLoanRepaid}
                    onChange={(e) => setNewLoanRepaid(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Interest Rate %</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="e.g. 5.5"
                    value={newLoanRate}
                    onChange={(e) => setNewLoanRate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newLoanDueDate}
                  onChange={(e) => setNewLoanDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewLoanModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-pink-700 hover:bg-pink-800 rounded-lg cursor-pointer"
                >
                  Track Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
