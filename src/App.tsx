import React, { useState, useEffect, useMemo } from 'react';
import {
  Transaction,
  BudgetLimit,
  SavingsGoal,
  LoanItem,
  ActiveTab,
  TimeFilter,
} from './types';
import {
  loadTransactions,
  saveTransactions,
  loadBudgets,
  saveBudgets,
  loadCurrency,
  saveCurrency,
  loadSavingsGoals,
  saveSavingsGoals,
  loadLoans,
  saveLoans,
  resetToDemoData,
  clearAllData,
} from './utils/storage';
import { computeFinancialSummary } from './utils/calculations';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { BudgetView } from './components/BudgetView';
import { AnalyticsView } from './components/AnalyticsView';
import { LoansAndSavingsView } from './components/LoansAndSavingsView';
import { SettingsView } from './components/SettingsView';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<BudgetLimit[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [loans, setLoans] = useState<LoanItem[]>([]);
  const [currency, setCurrency] = useState<string>('USD');

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    setTransactions(loadTransactions());
    setBudgets(loadBudgets());
    setSavingsGoals(loadSavingsGoals());
    setLoans(loadLoans());
    setCurrency(loadCurrency());
  }, []);

  // Compute live financial summary
  const summary = useMemo(() => {
    return computeFinancialSummary(transactions, budgets, timeFilter);
  }, [transactions, budgets, timeFilter]);

  // Handlers
  const handleSaveTransaction = (
    txData: Omit<Transaction, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      // Update existing
      const updated = transactions.map((t) =>
        t.id === existingId
          ? {
              ...t,
              ...txData,
            }
          : t
      );
      setTransactions(updated);
      saveTransactions(updated);
    } else {
      // Create new
      const newTx: Transaction = {
        ...txData,
        id: 'tx-' + Date.now(),
        createdAt: Date.now(),
      };
      const updated = [newTx, ...transactions];
      setTransactions(updated);
      saveTransactions(updated);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveTransactions(updated);
  };

  const handleSaveBudgets = (updatedBudgets: BudgetLimit[]) => {
    setBudgets(updatedBudgets);
    saveBudgets(updatedBudgets);
  };

  const handleCurrencyChange = (newCode: string) => {
    setCurrency(newCode);
    saveCurrency(newCode);
  };

  const handleAddSavingsFund = (goalId: string, amount: number) => {
    const goal = savingsGoals.find((g) => g.id === goalId);
    if (!goal) return;

    // Update goal amount
    const updatedGoals = savingsGoals.map((g) =>
      g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
    );
    setSavingsGoals(updatedGoals);
    saveSavingsGoals(updatedGoals);

    // Record savings transaction
    const now = new Date();
    const newTx: Transaction = {
      id: 'tx-' + Date.now(),
      amount,
      type: 'savings',
      category: 'other',
      description: `Deposit to ${goal.title}`,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      currency,
      createdAt: Date.now(),
    };
    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    saveTransactions(updatedTxs);
  };

  const handleAddLoanRepayment = (loanId: string, amount: number) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return;

    // Update loan repaid amount
    const updatedLoans = loans.map((l) =>
      l.id === loanId ? { ...l, repaidAmount: l.repaidAmount + amount } : l
    );
    setLoans(updatedLoans);
    saveLoans(updatedLoans);

    // Record loan repayment transaction
    const now = new Date();
    const newTx: Transaction = {
      id: 'tx-' + Date.now(),
      amount,
      type: 'loan_repayment',
      category: 'other',
      description: `Loan Repayment - ${loan.lenderOrBorrower}`,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      currency,
      createdAt: Date.now(),
    };
    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    saveTransactions(updatedTxs);
  };

  const handleSaveSavingsGoal = (goal: SavingsGoal) => {
    const updated = [goal, ...savingsGoals];
    setSavingsGoals(updated);
    saveSavingsGoals(updated);
  };

  const handleSaveLoan = (loan: LoanItem) => {
    const updated = [loan, ...loans];
    setLoans(updated);
    saveLoans(updated);
  };

  const handleResetDemoData = () => {
    const seeded = resetToDemoData();
    setTransactions(seeded.transactions);
    setBudgets(seeded.budgets);
    setSavingsGoals(seeded.savings);
    setLoans(seeded.loans);
  };

  const handleClearAllData = () => {
    clearAllData();
    setTransactions([]);
    setBudgets([]);
    setSavingsGoals([]);
    setLoans([]);
  };

  const handleImportData = (data: {
    transactions?: Transaction[];
    budgets?: BudgetLimit[];
    savings?: SavingsGoal[];
    loans?: LoanItem[];
  }) => {
    if (data.transactions) {
      setTransactions(data.transactions);
      saveTransactions(data.transactions);
    }
    if (data.budgets) {
      setBudgets(data.budgets);
      saveBudgets(data.budgets);
    }
    if (data.savings) {
      setSavingsGoals(data.savings);
      saveSavingsGoals(data.savings);
    }
    if (data.loans) {
      setLoans(data.loans);
      saveLoans(data.loans);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedTx(null);
    setIsAddModalOpen(true);
  };

  const handleSelectTransactionForEdit = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Bar adheres to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 md:px-8 py-5 md:py-8 max-w-6xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <DashboardView
            summary={summary}
            recentTransactions={transactions}
            currency={currency}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            setActiveTab={setActiveTab}
            onOpenAddModal={handleOpenAddModal}
            onSelectTransaction={handleSelectTransactionForEdit}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView
            transactions={transactions}
            currency={currency}
            onOpenAddModal={handleOpenAddModal}
            onSelectTransaction={handleSelectTransactionForEdit}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetView
            summary={summary}
            currency={currency}
            onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
            onOpenAddModal={handleOpenAddModal}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            summary={summary}
            transactions={transactions}
            currency={currency}
          />
        )}

        {activeTab === 'loans_savings' && (
          <LoansAndSavingsView
            savingsGoals={savingsGoals}
            loans={loans}
            currency={currency}
            onAddSavingsFund={handleAddSavingsFund}
            onAddLoanRepayment={handleAddLoanRepayment}
            onOpenAddModal={handleOpenAddModal}
            onSaveSavingsGoal={handleSaveSavingsGoal}
            onSaveLoan={handleSaveLoan}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            currency={currency}
            onCurrencyChange={handleCurrencyChange}
            transactions={transactions}
            budgets={budgets}
            savingsGoals={savingsGoals}
            loans={loans}
            onResetDemoData={handleResetDemoData}
            onClearAllData={handleClearAllData}
            onImportData={handleImportData}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation (Ergonomic Thumb-Zone) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={handleOpenAddModal}
        budgetAlertCount={summary.categoriesNearLimit.length + summary.categoriesOverBudget.length}
      />

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedTx(null);
        }}
        onSave={handleSaveTransaction}
        onDelete={handleDeleteTransaction}
        initialTransaction={selectedTx}
        defaultCurrency={currency}
      />

      {/* Budget Limit Setup Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        budgets={budgets}
        onSaveBudgets={handleSaveBudgets}
        currency={currency}
      />
    </div>
  );
}
