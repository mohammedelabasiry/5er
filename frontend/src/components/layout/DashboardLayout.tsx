'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Spinner from '../ui/Spinner';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to their default dashboard if role not allowed
        if (user.role === 'donor') router.push('/donor');
        else if (user.role === 'beneficiary') router.push('/beneficiary');
        else router.push('/admin');
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <Spinner className="w-10 h-10 text-emerald-500 mb-4" />
        <p className="text-sm text-slate-400">جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
