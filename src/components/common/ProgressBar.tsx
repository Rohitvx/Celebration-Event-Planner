import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  subLabel?: string;
  height?: 'sm' | 'md' | 'lg';
  colorOverride?: string;
  showPercent?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  subLabel,
  height = 'md',
  colorOverride,
  showPercent = true,
}) => {
  const clamped = Math.max(0, Math.min(100, isNaN(value) ? 0 : value));

  // Determine dynamic health color if not overridden
  const defaultBarColor =
    clamped > 100
      ? 'from-rose-500 to-red-600'
      : clamped > 85
      ? 'from-amber-400 to-orange-500'
      : clamped > 50
      ? 'from-purple-500 to-indigo-500'
      : 'from-blue-500 to-cyan-400';

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }[height];

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
          {label && <span className="text-slate-300">{label}</span>}
          {subLabel && <span className="text-slate-400 text-xs">{subLabel}</span>}
          {showPercent && (
            <span
              className={`font-semibold ml-auto ${
                clamped > 100 ? 'text-rose-400' : clamped > 85 ? 'text-amber-400' : 'text-slate-300'
              }`}
            >
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50 ${heightClasses}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r relative ${
            colorOverride ? '' : defaultBarColor
          }`}
          style={{
            width: `${clamped}%`,
            backgroundColor: colorOverride,
          }}
        >
          {/* Subtle light shimmer sweep */}
          <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
};
