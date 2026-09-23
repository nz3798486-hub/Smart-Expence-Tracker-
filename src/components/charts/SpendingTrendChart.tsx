import React, { useState } from 'react';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/currencies';

interface SpendingTrendChartProps {
  transactions: Transaction[];
  currency: string;
}

export const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({
  transactions,
  currency,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; amount: number; x: number; y: number } | null>(null);

  // Group expenses by date for the last 14 days
  const days: { dateStr: string; label: string; amount: number }[] = [];
  const now = new Date();

  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString(undefined, { weekday: 'narrow', month: 'numeric', day: 'numeric' });
    days.push({ dateStr, label: dayLabel, amount: 0 });
  }

  // Populate amounts
  transactions.forEach((tx) => {
    if (tx.type === 'expense' || tx.type === 'credit' || tx.type === 'debit') {
      const match = days.find((d) => d.dateStr === tx.date);
      if (match) {
        match.amount += Number(tx.amount) || 0;
      }
    }
  });

  const maxAmount = Math.max(...days.map((d) => d.amount), 50);
  const width = 500;
  const height = 180;
  const paddingX = 35;
  const paddingY = 25;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const points = days.map((d, index) => {
    const x = paddingX + (index / (days.length - 1)) * chartWidth;
    const y = height - paddingY - (d.amount / maxAmount) * chartHeight;
    return { ...d, x, y };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="relative w-full overflow-hidden">
      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-44 overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid guide lines */}
        {[0, 0.5, 1].map((ratio) => {
          const y = height - paddingY - ratio * chartHeight;
          return (
            <line
              key={ratio}
              x1={paddingX}
              y1={y}
              x2={width - paddingX}
              y2={y}
              stroke="#e2e8f0"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#trendGradient)" />

        {/* Line stroke */}
        <path d={pathD} fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hoveredPoint?.date === p.dateStr ? 5 : 3}
            fill="#ffffff"
            stroke="#10b981"
            strokeWidth={2}
            className="cursor-pointer transition-all duration-150"
            onMouseEnter={() => setHoveredPoint({ date: p.dateStr, amount: p.amount, x: p.x, y: p.y })}
            onClick={() => setHoveredPoint({ date: p.dateStr, amount: p.amount, x: p.x, y: p.y })}
          />
        ))}
      </svg>

      {/* Hover tooltip */}
      {hoveredPoint && (
        <div
          className="absolute bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded-lg pointer-events-none shadow-lg -translate-x-1/2 -translate-y-full mb-2 font-mono tabular-nums"
          style={{
            left: `${(hoveredPoint.x / width) * 100}%`,
            top: `${(hoveredPoint.y / height) * 100}%`,
          }}
        >
          <div className="font-sans font-medium text-[10px] text-slate-300">{hoveredPoint.date}</div>
          <div className="font-bold">{formatCurrency(hoveredPoint.amount, currency)}</div>
        </div>
      )}

      {/* Date labels on bottom */}
      <div className="flex justify-between px-2 pt-1 text-[10px] text-slate-400 font-medium">
        <span>{days[0]?.label}</span>
        <span>{days[Math.floor(days.length / 2)]?.label}</span>
        <span>Today</span>
      </div>
    </div>
  );
};
