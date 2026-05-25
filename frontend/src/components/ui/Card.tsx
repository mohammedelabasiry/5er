import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  children: React.ReactNode;
}

export default function Card({ hoverEffect = true, children, className = '', ...props }: CardProps) {
  const baseStyle = 'bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl';
  const hoverStyle = hoverEffect ? 'hover:-translate-y-1 hover:border-slate-700/80 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/10' : '';

  return (
    <div className={`${baseStyle} ${hoverStyle} ${className}`} {...props}>
      {children}
    </div>
  );
}
