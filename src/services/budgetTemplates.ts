import type { BudgetCategory, CategoryAllocation, EventType, ExpenseItem } from '../types/event';

export const CATEGORY_METADATA: Record<
  BudgetCategory,
  { name: string; iconName: string; color: string; bgLight: string }
> = {
  venue: {
    name: 'Venue & Spaces',
    iconName: 'Building2',
    color: '#8b5cf6', // Violet
    bgLight: 'rgba(139, 92, 246, 0.15)',
  },
  catering: {
    name: 'Food & Catering',
    iconName: 'Utensils',
    color: '#f97316', // Orange
    bgLight: 'rgba(249, 115, 22, 0.15)',
  },
  decoration: {
    name: 'Decor & Ambience',
    iconName: 'Sparkles',
    color: '#ec4899', // Pink
    bgLight: 'rgba(236, 72, 153, 0.15)',
  },
  photography: {
    name: 'Photography & Cinema',
    iconName: 'Camera',
    color: '#06b6d4', // Cyan
    bgLight: 'rgba(6, 182, 212, 0.15)',
  },
  entertainment: {
    name: 'Entertainment & DJ',
    iconName: 'Music',
    color: '#eab308', // Amber/Gold
    bgLight: 'rgba(234, 179, 8, 0.15)',
  },
  invitations: {
    name: 'Invites & Favors',
    iconName: 'Mail',
    color: '#10b981', // Emerald
    bgLight: 'rgba(16, 185, 129, 0.15)',
  },
  logistics: {
    name: 'Logistics & Transport',
    iconName: 'Truck',
    color: '#3b82f6', // Blue
    bgLight: 'rgba(59, 130, 246, 0.15)',
  },
  miscellaneous: {
    name: 'Emergency & Misc',
    iconName: 'ShieldAlert',
    color: '#a855f7', // Purple
    bgLight: 'rgba(168, 85, 247, 0.15)',
  },
};

// Benchmark percentages tailored to event dynamics
export const DEFAULT_ALLOCATION_PERCENTAGES: Record<EventType, Record<BudgetCategory, number>> = {
  wedding: {
    venue: 25,
    catering: 35,
    decoration: 15,
    photography: 10,
    entertainment: 5,
    invitations: 2,
    logistics: 3,
    miscellaneous: 5,
  },
  birthday: {
    venue: 20,
    catering: 35,
    decoration: 16,
    photography: 8,
    entertainment: 12,
    invitations: 2,
    logistics: 2,
    miscellaneous: 5,
  },
  freshers: {
    venue: 15,
    catering: 25,
    decoration: 12,
    photography: 8,
    entertainment: 25, // Sound system & DJ are crucial for student party
    invitations: 4,
    logistics: 4,
    miscellaneous: 7,
  },
  college_fest: {
    venue: 15,
    catering: 20,
    decoration: 12,
    photography: 8,
    entertainment: 30, // Celebrity artists & sound stage
    invitations: 4,
    logistics: 4,
    miscellaneous: 7,
  },
  anniversary: {
    venue: 25,
    catering: 35,
    decoration: 15,
    photography: 10,
    entertainment: 7,
    invitations: 2,
    logistics: 3,
    miscellaneous: 3,
  },
  graduation: {
    venue: 20,
    catering: 35,
    decoration: 14,
    photography: 12,
    entertainment: 8,
    invitations: 3,
    logistics: 3,
    miscellaneous: 5,
  },
  community: {
    venue: 22,
    catering: 30,
    decoration: 12,
    photography: 6,
    entertainment: 15,
    invitations: 3,
    logistics: 5,
    miscellaneous: 7,
  },
  corporate: {
    venue: 30,
    catering: 30,
    decoration: 10,
    photography: 8,
    entertainment: 10,
    invitations: 2,
    logistics: 5,
    miscellaneous: 5,
  },
};

/**
 * Format currency into Indian Rupee format (e.g. ₹2,50,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Compute detailed category allocations based on budget and expenses
 */
export function calculateCategoryAllocations(
  totalBudget: number,
  eventType: EventType,
  expenses: ExpenseItem[]
): CategoryAllocation[] {
  const percentageMap = DEFAULT_ALLOCATION_PERCENTAGES[eventType] || DEFAULT_ALLOCATION_PERCENTAGES.birthday;
  const categories: BudgetCategory[] = [
    'venue',
    'catering',
    'decoration',
    'photography',
    'entertainment',
    'invitations',
    'logistics',
    'miscellaneous',
  ];

  return categories.map((cat) => {
    const meta = CATEGORY_METADATA[cat];
    const pct = percentageMap[cat] || 10;
    const allocated = Math.round((totalBudget * pct) / 100);
    const spent = expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + (e.actualAmount > 0 ? e.actualAmount : e.plannedAmount), 0);

    return {
      category: cat,
      name: meta.name,
      percentage: pct,
      allocatedAmount: allocated,
      spentAmount: spent,
      iconName: meta.iconName,
      color: meta.color,
    };
  });
}

/**
 * Calculate overall budget figures
 */
export function calculateBudgetSummary(totalBudget: number, expenses: ExpenseItem[]) {
  const totalPlanned = expenses.reduce((sum, e) => sum + (e.plannedAmount || 0), 0);
  const totalActual = expenses.reduce((sum, e) => sum + (e.actualAmount || 0), 0);
  const activeSpend = expenses.reduce(
    (sum, e) => sum + (e.actualAmount > 0 ? e.actualAmount : e.plannedAmount),
    0
  );
  const remaining = totalBudget - activeSpend;
  const utilizationPercentage = totalBudget > 0 ? Math.min(100, Math.round((activeSpend / totalBudget) * 100)) : 0;
  const isOverBudget = activeSpend > totalBudget;

  return {
    totalBudget,
    totalPlanned,
    totalActual,
    activeSpend,
    remaining,
    utilizationPercentage,
    isOverBudget,
    overAmount: isOverBudget ? activeSpend - totalBudget : 0,
  };
}
