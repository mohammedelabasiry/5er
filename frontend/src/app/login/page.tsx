'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { LogIn, HeartHandshake, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If already authenticated, redirect immediately
    if (isAuthenticated && user) {
      redirectUser(user.role);
    }
  }, [isAuthenticated, user]);

  const redirectUser = (role: string) => {
    if (['platform_admin', 'admin', 'charity_admin', 'charity_staff'].includes(role)) {
      router.push('/admin');
    } else if (role === 'donor') {
      router.push('/donor');
    } else if (role === 'beneficiary') {
      router.push('/beneficiary');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('من فضلك املأ جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedUser = await login(email, password);
      redirectUser(loggedUser.role);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'فشل تسجيل الدخول. تأكد من صحة البريد الإلكتروني وكلمة المرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-row-reverse font-sans" dir="rtl">
      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-right">
            <Link href="/" className="inline-flex items-center gap-2 group mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 font-bold text-slate-950">
                CG
              </div>
              <span className="text-lg font-bold text-slate-100">منصة تكافل</span>
            </Link>
            <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">تسجيل الدخول</h2>
            <p className="mt-2 text-sm text-slate-400">مرحباً بك مجدداً في منصة حوكمة وتنسيق الصدقات</p>
          </div>

          <Card hoverEffect={false} className="border-slate-800/80 bg-slate-900/40 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Input
                label="البريد الإلكتروني"
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="كلمة المرور"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </Button>
            </form>
          </Card>

          <p className="text-center text-xs text-slate-400">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>

      {/* Left Side: Branding/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 border-r border-slate-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/20 to-slate-950/40 z-0" />
        <div className="relative z-10 max-w-lg text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-100 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            حوكمة الخير وضمان الكرامة
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            نسق صدقتك مع باقي الجمعيات للتأكد من وصول الدعم للمستحقين الفعليين بالتساوي، وبدون كشف لبيانات وهوية الأسر المتعففة للعامة.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-6 text-right">
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/50">
              <h4 className="text-emerald-400 font-bold text-sm mb-1">منع تكرار الدعم</h4>
              <p className="text-slate-400 text-xs">حوكمة تمنع استهلاك الحالة لأكثر من نصابها الشهري.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/50">
              <h4 className="text-emerald-400 font-bold text-sm mb-1">خصوصية وحفظ كرامة</h4>
              <p className="text-slate-400 text-xs">رموز مبهمة وأسماء مستعارة تمثل الحالات للمانحين.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
