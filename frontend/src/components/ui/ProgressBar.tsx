import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabels?: boolean;
}

export default function ProgressBar({ value, max, className = '', showLabels = true }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className={`w-full ${className}`}>
      {showLabels && (
        <div className="flex justify-between items-center mb-1 text-xs text-slate-400">
          <span>{Math.round(percentage)}%</span>
          <span>
            {value.toLocaleString()} / {max.toLocaleString()} EGP
          </span>
        </div>
      )}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
        <div
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
