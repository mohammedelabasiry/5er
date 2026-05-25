'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { LayoutDashboard, Users, UserCheck, Inbox, Heart, MessageSquare } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) return null;

  const isAdmin = ['admin', 'platform_admin', 'charity_admin', 'charity_staff'].includes(user.role);

  const getMenuItems = () => {
    if (isAdmin) {
      return [
        { name: 'الرئيسية', href: '/admin', icon: LayoutDashboard },
        { name: 'مراجعة الطلبات', href: '/admin/applications', icon: UserCheck },
        { name: 'إدارة الأعضاء', href: '/admin/users', icon: Users },
      ];
    } else if (user.role === 'donor') {
      return [
        { name: 'لوحة التحكم', href: '/donor', icon: LayoutDashboard },
        { name: 'تصفح الحالات', href: '/donor/browse', icon: Heart },
        { name: 'تبرعاتي الحالية', href: '/donor/donations', icon: Inbox },
        { name: 'الرسائل الفورية', href: '/donor/chat', icon: MessageSquare },
      ];
    } else if (user.role === 'beneficiary') {
      return [
        { name: 'لوحة المستفيد', href: '/beneficiary', icon: LayoutDashboard },
        { name: 'الملف الاجتماعي والطلب', href: '/beneficiary/profile', icon: Users },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 hidden md:block">
      <div className="p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
