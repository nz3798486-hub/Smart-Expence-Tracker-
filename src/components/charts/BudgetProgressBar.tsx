import React from 'react';

interface BudgetProgressBarProps {
  percentage: number;
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  percentage,
  height = 'md',
  showLabel = false,
}) => {
  const clamped = Math.min(Math.max(percentage, 0), 100);

  let barColor = 'bg-emerald-500';
  let badgeColor = 'text-emerald-700';

  if (percentage >= 100) {
    barColor = 'bg-rose-500';
    badgeColor = 'text-rose-700';
  } else if (percentage >= 80) {
    barColor = 'bg-amber-500';
    badgeColor = 'text-amber-700';
  }

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }[height];

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClasses}`}>
        <div
          className={`${heightClasses} ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-[11px] font-mono tabular-nums mt-1 text-slate-500">
          <span>{percentage.toFixed(0)}% consumed</span>
          <span className={badgeColor}>
            {percentage >= 100 ? 'Over limit' : percentage >= 80 ? 'Near limit' : 'On track'}
          </span>
        </div>
      )}
    </div>
  );
};
