"use client";

import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  MapPin, 
  MessageSquare, 
  Users, 
  Database, 
  Activity, 
  Server, 
  Globe,
  CheckCircle2, 
  AlertCircle, 
  ArrowLeftRight 
} from "lucide-react";

interface HealthStatus {
  status: string;
  database: string;
  postgis: string;
  details: {
    postgis_version?: string;
    error?: string;
  };
}

export default function Home() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkHealth() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/api/v1/health");
        if (!res.ok) throw new Error("API server responded with error status");
        const data = await res.json();
        setHealth(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to reach API server");
        setHealth(null);
      } finally {
        setLoading(false);
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black tracking-wider text-xl shadow-lg shadow-emerald-500/20">
              CG
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                منصة التكافل والحوكمة
              </h1>
              <p className="text-xs text-slate-400 font-mono">Charity Governance Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Sprint 1 Ready
            </span>
            <a 
              href="#health-monitor" 
              className="text-sm font-medium hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4 animate-pulse" />
              مراقب النظام
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
            <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
            <span>نظام أهلي حوكمي موحد لتوجيه الصدقات والمساعدات</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            حوكمة الصدقات بشفافية تامة لتصل فعلاً لمستحقيها
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            أول منصة تنسيق أهلي تربط الجمعيات الخيرية والمتبرعين الأفراد بقاعدة بيانات مشتركة، تمنع تكرار الدعم وتضمن كرامة المستفيد.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 transition-all group hover:-translate-y-1 duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">حماية الكرامة والأمان</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                تسجيل المستفيدين بالبيانات الرسمية المشفرة، مع إظهارهم للمتبرعين بأكواد عامة عشوائية وأفاتار تعبيري لضمان الخصوصية والكرامة.
              </p>
            </div>
            <span className="text-xs text-emerald-500 font-mono mt-4 block">Privacy-First</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 transition-all group hover:-translate-y-1 duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">منع ازدواجية الدعم</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                لكل حالة استحقاق شهري محدد. في حال استيفاء الدعم بالكامل من عدة مصادر، يتم حظر الدعم الإضافي وتوجيه المتبرع لحالة أخرى محتاجة.
              </p>
            </div>
            <span className="text-xs text-emerald-500 font-mono mt-4 block">Anti-Double-Dipping</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 transition-all group hover:-translate-y-1 duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">خرائط ذكية تقريبية</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                تصفية الحالات القريبة بقطر بحث دائري (من 500م إلى 10كم) يشبه خرائط Uber، مع إحداثيات مشوشة تقريبية لحفظ خصوصية السكن.
              </p>
            </div>
            <span className="text-xs text-emerald-500 font-mono mt-4 block">PostGIS Proximity Map</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 transition-all group hover:-translate-y-1 duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">دفتر مالي محمي</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                سجل حسابات مالي تراكمي غير قابل للتعديل أو الحذف، مشفر بسلسلة هاشات متصلة، يضمن تتبع كل جنيه داخل أو خارج من الجمعيات.
              </p>
            </div>
            <span className="text-xs text-emerald-500 font-mono mt-4 block">Append-Only Ledger</span>
          </div>

        </section>

        {/* System Health Section */}
        <section id="health-monitor" className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl font-bold">مراقب صحة النظام (Health Monitor)</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Live Checking</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Frontend Status */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-indigo-400" />
                <div>
                  <h4 className="text-sm font-semibold">خادم الواجهة (Frontend)</h4>
                  <p className="text-xs text-slate-500">Next.js App Router</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                نشط
              </div>
            </div>

            {/* Backend API Status */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-sky-400" />
                <div>
                  <h4 className="text-sm font-semibold">خادم البرمجة (Backend API)</h4>
                  <p className="text-xs text-slate-500">FastAPI</p>
                </div>
              </div>
              {error ? (
                <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                  <AlertCircle className="w-3.5 h-3.5" />
                  غير متصل
                </div>
              ) : loading ? (
                <div className="text-xs text-slate-400 animate-pulse">جاري الفحص...</div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  متصل
                </div>
              )}
            </div>

            {/* Database Status */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-sm font-semibold">قاعدة البيانات (Database)</h4>
                  <p className="text-xs text-slate-500">PostgreSQL</p>
                </div>
              </div>
              {error || !health ? (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-800/40 px-2.5 py-1 rounded-full border border-slate-700/50">
                  <AlertCircle className="w-3.5 h-3.5" />
                  غير متصل
                </div>
              ) : health.database === "connected" ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  متصلة
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                  <AlertCircle className="w-3.5 h-3.5" />
                  فشل الاتصال
                </div>
              )}
            </div>

            {/* PostGIS Status */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-rose-400" />
                <div>
                  <h4 className="text-sm font-semibold">محرك الخرائط الجغرافية</h4>
                  <p className="text-xs text-slate-500">PostGIS Extension</p>
                </div>
              </div>
              {error || !health ? (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-800/40 px-2.5 py-1 rounded-full border border-slate-700/50">
                  <AlertCircle className="w-3.5 h-3.5" />
                  غير مثبت
                </div>
              ) : health.postgis === "installed" ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  مثبتة
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                  <AlertCircle className="w-3.5 h-3.5" />
                  غير مثبتة
                </div>
              )}
            </div>
          </div>

          {health && health.details && health.details.postgis_version && (
            <div className="text-xs font-mono text-slate-500 bg-slate-950 p-3 rounded-lg border border-slate-850 break-all text-center">
              PostGIS Version: {health.details.postgis_version}
            </div>
          )}

          {error && (
            <div className="text-xs font-mono text-red-400 bg-red-950/20 p-3 rounded-lg border border-red-900/30 text-center">
              تنبيه: {error}. يرجى تشغيل حاوية Docker والـ API لتفعيل الفحص المالي والجغرافي.
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Charity Governance platform. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-slate-400">تطوير: Antigravity Agent</span>
            <span>|</span>
            <span>بوابة حوكمة التكافل والصدقات</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
