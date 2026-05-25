import React from 'react';
import { HelpCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/20 backdrop-blur-sm">
      <div className="p-4 bg-slate-900/80 rounded-full border border-slate-800 text-slate-500 mb-4 animate-bounce">
        {icon || <HelpCircle className="w-8 h-8 text-slate-400" />}
      </div>
      <h3 className="text-base font-bold text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm">{description}</p>
    </div>
  );
}
