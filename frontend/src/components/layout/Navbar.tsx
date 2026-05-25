'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Heart, User, LogOut, Menu, X, MessageSquare, ShieldAlert } from 'lucide-react';
import Button from '../ui/Button';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout, initialize } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getLinksByRole = () => {
    if (!user) return [];
    
    // Check role, make it flexible for platform_admin
    const isAdmin = ['admin', 'platform_admin', 'charity_admin', 'charity_staff'].includes(user.role);

    if (isAdmin) {
      return [
        { name: 'لوحة التحكم', href: '/admin' },
        { name: 'مراجعة الحالات', href: '/admin/applications' },
        { name: 'إدارة المستخدمين', href: '/admin/users' },
      ];
    } else if (user.role === 'donor') {
      return [
        { name: 'لوحة المتبرع', href: '/donor' },
        { name: 'تصفح الحالات', href: '/donor/browse' },
        { name: 'تبرعاتي', href: '/donor/donations' },
        { name: 'الرسائل', href: '/donor/chat' },
      ];
    } else if (user.role === 'beneficiary') {
      return [
        { name: 'لوحة المستفيد', href: '/beneficiary' },
        { name: 'بياناتي والطلب', href: '/beneficiary/profile' },
      ];
    }
    return [];
  };

  const links = getLinksByRole();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 font-bold text-slate-950 transition-transform group-hover:rotate-6">
                CG
              </div>
              <span className="hidden sm:block text-lg font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                منصة تكافل الخيرية
              </span>
            </Link>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-6">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-300 font-medium">{user?.full_name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold scale-90">
                    {user?.role === 'donor' ? 'متبرع' : user?.role === 'beneficiary' ? 'مستفيد' : 'إدارة'}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-400 hover:text-red-300">
                  <LogOut className="w-4 h-4" />
                  <span>خروج</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">دخول</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">تسجيل حساب جديد</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          {isAuthenticated ? (
            <>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-base font-medium text-slate-400 hover:text-slate-100 py-2"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-slate-300 text-sm py-1">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>{user?.full_name}</span>
                </div>
                <Button variant="danger" size="sm" onClick={handleLogout} className="w-full">
                  <LogOut className="w-4 h-4" />
                  <span>خروج</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="secondary" className="w-full">دخول</Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button variant="primary" className="w-full">تسجيل حساب جديد</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
