import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  Building2,
  Utensils,
  Camera,
  Music,
  Mail,
  Truck,
  ShieldAlert,
  Sliders,
  DollarSign,
} from 'lucide-react';
import type { BudgetCategory, EventPlan, ExpenseItem } from '../../types/event';
import {
  calculateCategoryAllocations,
  calculateBudgetSummary,
  formatINR,
  CATEGORY_METADATA,
} from '../../services/budgetTemplates';
import { ProgressBar } from '../common/ProgressBar';
import { Modal } from '../common/Modal';
import { StatusBadge, CategoryBadge } from '../common/Badge';

interface BudgetPlannerProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
}

export const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ event, onUpdateEvent }) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<BudgetCategory | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // Form states for Add/Edit Expense
  const [expName, setExpName] = useState('');
  const [expCategory, setExpCategory] = useState<BudgetCategory>('catering');
  const [expPlanned, setExpPlanned] = useState<number>(0);
  const [expActual, setExpActual] = useState<number>(0);
  const [expStatus, setExpStatus] = useState<'pending' | 'deposit_paid' | 'paid_in_full'>('pending');
  const [expNotes, setExpNotes] = useState('');

  // Target Budget editing state
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [targetBudgetInput, setTargetBudgetInput] = useState<number>(event.totalBudget);

  const budgetSummary = calculateBudgetSummary(event.totalBudget, event.expenses);
  const categoryAllocations = calculateCategoryAllocations(event.totalBudget, event.type, event.expenses);

  const filteredExpenses =
    selectedCategoryFilter === 'all'
      ? event.expenses
      : event.expenses.filter((e) => e.category === selectedCategoryFilter);

  const handleOpenAddModal = (cat?: BudgetCategory) => {
    setEditingExpenseId(null);
    setExpName('');
    setExpCategory(cat || 'catering');
    setExpPlanned(5000);
    setExpActual(0);
    setExpStatus('pending');
    setExpNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (expense: ExpenseItem) => {
    setEditingExpenseId(expense.id);
    setExpName(expense.name);
    setExpCategory(expense.category);
    setExpPlanned(expense.plannedAmount);
    setExpActual(expense.actualAmount);
    setExpStatus(expense.status);
    setExpNotes(expense.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveExpense = () => {
    if (!expName.trim()) return;

    let updatedExpenses: ExpenseItem[];

    if (editingExpenseId) {
      updatedExpenses = event.expenses.map((e) =>
        e.id === editingExpenseId
          ? {
              ...e,
              name: expName.trim(),
              category: expCategory,
              plannedAmount: Number(expPlanned) || 0,
              actualAmount: Number(expActual) || 0,
              status: expStatus,
              notes: expNotes.trim(),
            }
          : e
      );
    } else {
      const newExp: ExpenseItem = {
        id: `exp-${Date.now()}`,
        name: expName.trim(),
        category: expCategory,
        plannedAmount: Number(expPlanned) || 0,
        actualAmount: Number(expActual) || 0,
        status: expStatus,
        notes: expNotes.trim(),
      };
      updatedExpenses = [...event.expenses, newExp];
    }

    onUpdateEvent({
      ...event,
      expenses: updatedExpenses,
    });
    setIsModalOpen(false);
  };

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = event.expenses.filter((e) => e.id !== id);
    onUpdateEvent({
      ...event,
      expenses: updatedExpenses,
    });
  };

  const handleSaveTargetBudget = () => {
    if (targetBudgetInput >= 1000) {
      onUpdateEvent({
        ...event,
        totalBudget: targetBudgetInput,
      });
      setIsEditingBudget(false);
    }
  };

  // One-click apply cost-saving tip
  const handleApplyCostSaving = (tip: { tip: string; estimatedSavingsINR: number }) => {
    // Reduce highest spent expense by the savings amount
    const sorted = [...event.expenses].sort((a, b) => b.plannedAmount - a.plannedAmount);
    if (sorted.length > 0) {
      const topExp = sorted[0];
      const newAmount = Math.max(1000, topExp.plannedAmount - tip.estimatedSavingsINR);
      const updatedExpenses = event.expenses.map((e) =>
        e.id === topExp.id
          ? { ...e, plannedAmount: newAmount, notes: `${e.notes || ''} [Saved ₹${tip.estimatedSavingsINR.toLocaleString('en-IN')}: ${tip.tip}]` }
          : e
      );
      onUpdateEvent({ ...event, expenses: updatedExpenses });
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return Building2;
      case 'Utensils':
        return Utensils;
      case 'Sparkles':
        return Sparkles;
      case 'Camera':
        return Camera;
      case 'Music':
        return Music;
      case 'Mail':
        return Mail;
      case 'Truck':
        return Truck;
      default:
        return ShieldAlert;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Budget Summary Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#121422] to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                INR Financial Control
              </span>
              <span className="text-xs text-slate-400">{event.guestCount} Guests Planned</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Smart Budget Architecture
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Calibrated allocation, planned vs actual expense tracking, and AI cost-saving optimizations.
            </p>
          </div>

          {/* Quick Target Budget Controls */}
          <div className="flex items-center gap-3">
            {isEditingBudget ? (
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 pl-2">₹</span>
                <input
                  type="number"
                  step="5000"
                  value={targetBudgetInput}
                  onChange={(e) => setTargetBudgetInput(Number(e.target.value))}
                  className="w-32 bg-transparent text-white text-sm font-bold focus:outline-none"
                />
                <button
                  onClick={handleSaveTargetBudget}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingBudget(false)}
                  className="px-2 py-1 text-slate-400 text-xs hover:text-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setTargetBudgetInput(event.totalBudget);
                  setIsEditingBudget(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500 text-xs text-slate-300 hover:text-white transition-colors"
              >
                <Sliders className="h-3.5 w-3.5 text-amber-400" />
                <span>Adjust Target Budget</span>
              </button>
            )}

            <button
              onClick={() => handleOpenAddModal()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-900/30 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
              Total Target Budget
            </span>
            <span className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] mt-1 block">
              {formatINR(budgetSummary.totalBudget)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
              Planned Expenses
            </span>
            <span className="text-xl sm:text-2xl font-bold text-purple-300 font-['Outfit'] mt-1 block">
              {formatINR(budgetSummary.totalPlanned)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
              Actual Paid / Logged
            </span>
            <span className="text-xl sm:text-2xl font-bold text-cyan-300 font-['Outfit'] mt-1 block">
              {formatINR(budgetSummary.totalActual)}
            </span>
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              budgetSummary.isOverBudget
                ? 'bg-rose-500/10 border-rose-500/30'
                : 'bg-emerald-500/10 border-emerald-500/30'
            }`}
          >
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider block ${
                budgetSummary.isOverBudget ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {budgetSummary.isOverBudget ? 'Budget Deficit' : 'Remaining Balance'}
            </span>
            <span
              className={`text-xl sm:text-2xl font-bold font-['Outfit'] mt-1 block ${
                budgetSummary.isOverBudget ? 'text-rose-300' : 'text-emerald-300'
              }`}
            >
              {formatINR(Math.abs(budgetSummary.remaining))}
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <ProgressBar
            value={budgetSummary.utilizationPercentage}
            label="Overall Utilization"
            subLabel={`${formatINR(budgetSummary.activeSpend)} of ${formatINR(event.totalBudget)}`}
            height="md"
          />
        </div>
      </div>

      {/* Over-budget Warning Alert */}
      {budgetSummary.isOverBudget && (
        <div className="rounded-2xl bg-rose-500/15 border border-rose-500/40 p-4 flex items-center justify-between text-xs text-rose-300 shadow-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
            <div>
              <p className="font-bold text-sm">Budget Warning: Projected Spend Exceeds Cap</p>
              <p className="mt-0.5 text-slate-200">
                Your planned allocations exceed the target budget by{' '}
                <strong className="text-rose-400">{formatINR(budgetSummary.overAmount)}</strong>. See AI cost-saving tips below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 8 Category Allocation Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
            <span>Category Budget Distribution</span>
            <span className="text-xs text-slate-400 font-normal">({categoryAllocations.length} categories)</span>
          </h2>
          <span className="text-xs text-slate-400">Click card to filter expenses</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryAllocations.map((cat) => {
            const Icon = getCategoryIcon(cat.iconName);
            const isSelected = selectedCategoryFilter === cat.category;
            const isCategoryOver = cat.spentAmount > cat.allocatedAmount;

            return (
              <div
                key={cat.category}
                onClick={() =>
                  setSelectedCategoryFilter(selectedCategoryFilter === cat.category ? 'all' : cat.category)
                }
                className={`group relative rounded-2xl bg-slate-900/90 p-4 border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-purple-500 ring-1 ring-purple-500/30 bg-slate-900'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200 truncate">{cat.name}</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {cat.percentage}%
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Allocated:</span>
                    <span className="font-semibold text-white">{formatINR(cat.allocatedAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Logged Spend:</span>
                    <span
                      className={`font-semibold ${
                        isCategoryOver ? 'text-rose-400 font-bold' : 'text-slate-300'
                      }`}
                    >
                      {formatINR(cat.spentAmount)}
                    </span>
                  </div>
                </div>

                <ProgressBar
                  value={cat.allocatedAmount > 0 ? Math.round((cat.spentAmount / cat.allocatedAmount) * 100) : 0}
                  colorOverride={cat.color}
                  height="sm"
                  showPercent={false}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Cost-Saving Alternatives Panel */}
      {event.aiPlan?.costSavingTips && event.aiPlan.costSavingTips.length > 0 && (
        <div className="rounded-3xl bg-gradient-to-r from-purple-950/30 to-slate-900 border border-purple-500/20 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              <span>AI Cost-Saving Recommendations for {event.title}</span>
            </h3>
            <span className="text-xs text-purple-300 font-semibold">1-Click Savings Optimizer</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {event.aiPlan.costSavingTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 mb-1.5">
                    <span>💡 Actionable Tip #{idx + 1}</span>
                    <span>Save ~{formatINR(tip.estimatedSavingsINR)}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{tip.tip}</p>
                </div>

                <button
                  onClick={() => handleApplyCostSaving(tip)}
                  className="w-full py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>Apply Savings to Budget</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Itemized Expenses Table */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Itemized Expenses ({filteredExpenses.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedCategoryFilter === 'all'
                ? 'Showing all categories'
                : `Filtered by: ${selectedCategoryFilter.toUpperCase()}`}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
                selectedCategoryFilter === 'all'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Categories
            </button>
            {Object.keys(CATEGORY_METADATA).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat as BudgetCategory)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-colors ${
                  selectedCategoryFilter === cat
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {CATEGORY_METADATA[cat as BudgetCategory].name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Expenses Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th className="pb-3 pl-2">Expense Item</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Planned</th>
                <th className="pb-3">Actual Paid</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No expenses found in this category.{' '}
                    <button
                      onClick={() => handleOpenAddModal(selectedCategoryFilter === 'all' ? undefined : selectedCategoryFilter)}
                      className="text-purple-400 underline font-semibold ml-1"
                    >
                      Add one now
                    </button>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 pl-2 font-medium text-slate-100 max-w-[200px] truncate">
                      <p className="truncate font-semibold">{exp.name}</p>
                      {exp.notes && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{exp.notes}</p>
                      )}
                    </td>
                    <td className="py-3.5">
                      <CategoryBadge category={exp.category} />
                    </td>
                    <td className="py-3.5 font-semibold text-purple-300">
                      {formatINR(exp.plannedAmount)}
                    </td>
                    <td className="py-3.5 font-semibold text-cyan-300">
                      {formatINR(exp.actualAmount)}
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={exp.status} />
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditModal(exp)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit Expense"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete Expense"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpenseId ? 'Edit Expense Item' : 'Add New Expense Item'}
        subtitle="Manage financial itemization and payment tracking"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Expense Name / Description *
            </label>
            <input
              type="text"
              value={expName}
              onChange={(e) => setExpName(e.target.value)}
              placeholder="e.g. Lawn Rental Deposit, DJ Rayne Advance, Photo Booth Booking"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={expCategory}
              onChange={(e) => setExpCategory(e.target.value as BudgetCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
            >
              {Object.keys(CATEGORY_METADATA).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_METADATA[cat as BudgetCategory].name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Planned Amount (INR) *
              </label>
              <input
                type="number"
                step="500"
                value={expPlanned}
                onChange={(e) => setExpPlanned(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Actual Amount Paid (INR)
              </label>
              <input
                type="number"
                step="500"
                value={expActual}
                onChange={(e) => setExpActual(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Payment Status
            </label>
            <select
              value={expStatus}
              onChange={(e) => setExpStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
            >
              <option value="pending">Pending</option>
              <option value="deposit_paid">Deposit Paid</option>
              <option value="paid_in_full">Paid in Full</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Notes / Vendor References
            </label>
            <input
              type="text"
              value={expNotes}
              onChange={(e) => setExpNotes(e.target.value)}
              placeholder="e.g. 50% advance via UPI, balance on event day"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveExpense}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
            >
              Save Expense
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
