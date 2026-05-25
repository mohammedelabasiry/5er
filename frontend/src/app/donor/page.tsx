'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { donationApi } from '@/services/api';
import type { Donation } from '@/types';
import { Heart, Search, MessageSquare, HandHeart, Calendar } from 'lucide-react';

export default function DonorDashboard() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    donationApi
      .getMyDonations({ limit: 5 })
      .then((data) => {
        setDonations(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalDonated = donations
    .filter((d) => d.status === 'confirmed')
    .reduce((sum, d) => sum + d.amount, 0);

  const activePledges = donations.filter((d) => d.status === 'pledged');

  return (
    <DashboardLayout allowedRoles={['donor']}>
      <div className="space-y-8 font-sans">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              مرحباً بك، فاعل الخير
            </h1>
            <p className="text-slate-400 text-sm mt-1">تتبع مساهماتك الخيرية وحالة الحالات التي دعمتها.</p>
          </div>
          <Link href="/donor/browse">
            <Button variant="primary">
              <Search className="w-4 h-4" />
              <span>تصفح الحالات المستحقة</span>
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card hoverEffect={false} className="flex items-center gap-4 bg-emerald-950/10 border-emerald-900/30">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <HandHeart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">إجمالي تبرعاتك</span>
              <span className="text-2xl font-black text-emerald-400">{totalDonated.toLocaleString()} EGP</span>
            </div>
          </Card>

          <Card hoverEffect={false} className="flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">حالات ساعدتها</span>
              <span className="text-2xl font-black text-teal-400">
                {new Set(donations.filter((d) => d.status === 'confirmed').map((d) => d.beneficiary_id)).size} حالة
              </span>
            </div>
          </Card>

          <Card hoverEffect={false} className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">تعهدات معلقة</span>
              <span className="text-2xl font-black text-amber-400">{activePledges.length} تعهد</span>
            </div>
          </Card>
        </div>

        {/* Action Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Active Pledges Section */}
          <Card hoverEffect={false} className="space-y-4">
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>تعهدات معلقة (بحاجة لتأكيد الدفع)</span>
            </h3>
            {loading ? (
              <div className="py-8 flex justify-center"><Spinner /></div>
            ) : activePledges.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">لا توجد تعهدات معلقة حالياً.</p>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {activePledges.map((pledge) => (
                  <div key={pledge.id} className="flex items-center justify-between py-3">
                    <div>
                      <span className="text-xs text-slate-400 block">كود الحالة: {pledge.beneficiary_code}</span>
                      <span className="text-sm font-bold text-slate-200">{pledge.amount.toLocaleString()} EGP</span>
                    </div>
                    <Link href={`/donor/donate/${pledge.beneficiary_code}`}>
                      <Button variant="secondary" size="sm">تأكيد الدفع الآن</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Confirmed Donations */}
          <Card hoverEffect={false} className="space-y-4">
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-400" />
              <span>آخر التبرعات المؤكدة</span>
            </h3>
            {loading ? (
              <div className="py-8 flex justify-center"><Spinner /></div>
            ) : donations.filter((d) => d.status === 'confirmed').length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">لم تقم بأي تبرعات مؤكدة بعد.</p>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {donations
                  .filter((d) => d.status === 'confirmed')
                  .map((d) => (
                    <div key={d.id} className="flex items-center justify-between py-3">
                      <div>
                        <span className="text-xs text-slate-400 block">
                          كود الحالة: {d.beneficiary_code} ({d.beneficiary_alias})
                        </span>
                        <span className="text-xs text-slate-500">{new Date(d.created_at).toLocaleDateString('ar-EG')}</span>
                      </div>
                      <span className="text-sm font-black text-emerald-400">+{d.amount.toLocaleString()} EGP</span>
                    </div>
                  ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
