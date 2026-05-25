import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all duration-300';

  const variants = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    danger: 'bg-red-500/10 text-red-400 border-red-500/25',
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/25',
    neutral: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  const dots = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-red-400',
    info: 'bg-sky-400',
    neutral: 'bg-slate-500',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[variant]} animate-pulse`} />
      {children}
    </span>
  );
}
