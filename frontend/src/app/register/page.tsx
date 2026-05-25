'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { UserPlus, Heart, User, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  
  const [role, setRole] = useState<'donor' | 'beneficiary'>('donor');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!fullName || !email || !password) {
      setError('من فضلك املأ جميع الحقول الأساسية المطلوبة');
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.register({
        email,
        password,
        full_name: fullName,
        phone: phone || undefined,
        role
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'فشل التسجيل. تأكد من صحة البيانات أو حاول استخدام بريد آخر.');
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
            <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">إنشاء حساب جديد</h2>
            <p className="mt-2 text-sm text-slate-400">انضم إلينا للمساهمة في بناء شبكة تكافل مستدامة وعادلة</p>
          </div>

          <Card hoverEffect={false} className="border-slate-800/80 bg-slate-900/40 p-8">
            {success ? (
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">تم التسجيل بنجاح!</h3>
                <p className="text-xs text-slate-400">جاري توجيهك لصفحة تسجيل الدخول للدخول إلى حسابك...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Role Selector Card Grid */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase">نوع الحساب</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('donor')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 ${
                        role === 'donor'
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Heart className="w-5 h-5 mb-1.5" />
                      <span className="text-xs">فاعل خير (متبرع)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('beneficiary')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 ${
                        role === 'beneficiary'
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <User className="w-5 h-5 mb-1.5" />
                      <span className="text-xs">صاحب حالة (مستفيد)</span>
                    </button>
                  </div>
                </div>

                <Input
                  label="الاسم الكامل"
                  type="text"
                  placeholder="الاسم الرباعي"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />

                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="رقم الهاتف (اختياري)"
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <Input
                  label="كلمة المرور"
                  type="password"
                  placeholder="أدخل كلمة مرور قوية"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                  <UserPlus className="w-4 h-4" />
                  <span>تسجيل الحساب</span>
                </Button>
              </form>
            )}
          </Card>

          <p className="text-center text-xs text-slate-400">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>

      {/* Left Side: Branding/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 border-r border-slate-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/20 to-slate-950/40 z-0" />
        <div className="relative z-10 max-w-lg text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-100 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            ابدأ رحلة العطاء والحوكمة
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            من خلال تسجيلك كفاعل خير، ستمكن الحالات من الحصول على نصابها العادل دون زيادة أو نقصان. وإذا سجلت كمستحق، فستحصل على دعمك الشهري بكل كرامة وخصوصية.
          </p>
        </div>
      </div>
    </div>
  );
}
