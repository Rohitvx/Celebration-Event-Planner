import React from 'react';
import type { TaskPriority, BudgetCategory } from '../../types/event';
import { CATEGORY_METADATA } from '../../services/budgetTemplates';

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const styles: Record<TaskPriority, { text: string; bg: string; border: string }> = {
    high: {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
    },
    medium: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    },
    low: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
    },
  };

  const style = styles[priority] || styles.medium;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
    </span>
  );
};

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let label = status.replace(/_/g, ' ');
  label = label.charAt(0).toUpperCase() + label.slice(1);

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  if (status === 'booked' || status === 'paid_in_full' || status === 'completed') {
    colorClasses = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  } else if (status === 'deposit_paid' || status === 'quote_received' || status === 'shortlisted') {
    colorClasses = 'bg-blue-500/15 text-blue-300 border-blue-500/30';
  } else if (status === 'pending' || status === 'inquiry') {
    colorClasses = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  } else if (status === 'overdue' || status === 'rejected') {
    colorClasses = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}
    >
      {label}
    </span>
  );
};

interface CategoryBadgeProps {
  category: BudgetCategory;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const meta = CATEGORY_METADATA[category] || {
    name: category,
    color: '#8b5cf6',
  };

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border"
      style={{
        backgroundColor: `${meta.color}15`,
        borderColor: `${meta.color}35`,
        color: meta.color,
      }}
    >
      {meta.name}
    </span>
  );
};
