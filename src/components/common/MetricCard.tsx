import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string; // hex or tailwind class
  gradientBorder?: boolean;
  trend?: {
    label: string;
    positive?: boolean;
  };
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = '#8b5cf6',
  gradientBorder = false,
  trend,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-5 border transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/20 ${
        onClick ? 'cursor-pointer hover:border-purple-500/50 hover:-translate-y-0.5' : 'border-slate-800'
      } ${gradientBorder ? 'border-purple-500/30 ring-1 ring-purple-500/20' : ''}`}
    >
      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-25"
        style={{ backgroundColor: iconColor }}
      />

      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight text-white font-['Outfit']">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>

        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${iconColor}18`, color: iconColor }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-slate-800/60 text-xs">
          <span
            className={`font-medium ${trend.positive ? 'text-emerald-400' : 'text-slate-400'}`}
          >
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
};
