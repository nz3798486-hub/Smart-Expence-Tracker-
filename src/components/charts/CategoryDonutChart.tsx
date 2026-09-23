import React, { useState } from 'react';
import { CategorySummary } from '../../utils/calculations';
import { getCategoryInfo } from '../../utils/categorizer';
import { formatCurrency } from '../../utils/currencies';

interface CategoryDonutChartProps {
  categorySummaries: CategorySummary[];
  currency: string;
  totalSpent: number;
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  categorySummaries,
  currency,
  totalSpent,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategorySummary | null>(null);

  // Filter only categories with spending > 0
  const activeCategories = categorySummaries.filter((c) => c.spent > 0);

  if (activeCategories.length === 0 || totalSpent === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
        <p>No expense data recorded for this period</p>
      </div>
    );
  }

  const size = 200;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulatedPercent = 0;

  const slices = activeCategories.map((item) => {
    const percent = item.spent / totalSpent;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += percent;
    const info = getCategoryInfo(item.categoryId);

    return {
      item,
      info,
      percent,
      strokeDasharray,
      strokeDashoffset,
      color: info.color,
    };
  });

  const displayedItem = activeCategory || slices[0]?.item;
  const displayedInfo = displayedItem ? getCategoryInfo(displayedItem.categoryId) : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* Donut graphic */}
      <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {slices.map((s, idx) => (
            <circle
              key={idx}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={s.color}
              strokeWidth={activeCategory?.categoryId === s.item.categoryId ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={s.strokeDasharray}
              strokeDashoffset={s.strokeDashoffset}
              className="cursor-pointer transition-all duration-300 hover:opacity-85"
              onMouseEnter={() => setActiveCategory(s.item)}
              onClick={() => setActiveCategory(s.item)}
            />
          ))}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {displayedInfo?.label || 'Total Spent'}
          </span>
          <span className="text-base font-bold font-mono tabular-nums text-slate-900 mt-0.5">
            {formatCurrency(displayedItem ? displayedItem.spent : totalSpent, currency, true)}
          </span>
          {displayedItem && totalSpent > 0 && (
            <span className="text-[11px] font-semibold text-slate-500 font-mono tabular-nums">
              {((displayedItem.spent / totalSpent) * 100).toFixed(0)}% of total
            </span>
          )}
        </div>
      </div>

      {/* Slices legend list */}
      <div className="w-full space-y-2 max-h-56 overflow-y-auto pr-1">
        {slices.map((s) => {
          const isSelected = activeCategory?.categoryId === s.item.categoryId;
          return (
            <div
              key={s.item.categoryId}
              onClick={() => setActiveCategory(s.item)}
              className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                isSelected ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="truncate">{s.info.label}</span>
              </div>
              <div className="flex items-center gap-2 font-mono tabular-nums shrink-0">
                <span className="text-slate-500 text-[11px]">
                  {(s.percent * 100).toFixed(1)}%
                </span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(s.item.spent, currency)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
