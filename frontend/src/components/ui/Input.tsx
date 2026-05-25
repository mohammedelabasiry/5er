import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="w-full flex flex-col gap-2">
      <label htmlFor={inputId} className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full bg-slate-950 border text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 placeholder-slate-600 ${
          error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-emerald-500/80 hover:border-slate-700'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-400 font-medium mt-0.5">{error}</span>}
    </div>
  );
}
