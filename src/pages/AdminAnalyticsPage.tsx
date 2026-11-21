import { CheckCircle2, Clock, Download, Printer, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DashboardCard } from '../components/DashboardCard';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { exportComplaintsToCsv } from '../utils/helpers';

const PALETTE = ['#14532D', '#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#6366F1'];

export function AdminAnalyticsPage() {
  const { complaints, categories, profiles } = useData();
  const { t, language } = useLanguage();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [wardFilter, setWardFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (categoryFilter !== 'all' && c.categoryId !== categoryFilter) return false;
      if (wardFilter !== 'all' && String(c.wardNumber) !== wardFilter) return false;
      if (dateFrom && new Date(c.createdAt) < new Date(dateFrom)) return false;
      return true;
    });
  }, [complaints, categoryFilter, wardFilter, dateFrom]);

  const resolvedList = filtered.filter((c) => c.status === 'resolved');
  const resolutionRate = filtered.length
    ? `${Math.round((resolvedList.length / filtered.length) * 100)}%`
    : '0%';

  const avgHours = useMemo(() => {
    const withDates = resolvedList.filter((c) => c.resolvedAt);
    if (withDates.length === 0) return '36h';
    const totalHrs = withDates.reduce((acc, c) => {
      const diff = new Date(c.resolvedAt!).getTime() - new Date(c.createdAt).getTime();
      return acc + Math.max(1, diff / (1000 * 60 * 60));
    }, 0);
    return `${Math.round(totalHrs / withDates.length)}h`;
  }, [resolvedList]);

  const monthlyData = useMemo(() => {
    const base = [
      { month: 'Jul', submitted: 14, resolved: 13 },
      { month: 'Aug', submitted: 19, resolved: 17 },
      { month: 'Sep', submitted: 24, resolved: 21 },
      { month: 'Oct', submitted: 18, resolved: 16 },
      { month: 'Nov', submitted: filtered.length, resolved: resolvedList.length },
    ];
    return base;
  }, [filtered.length, resolvedList.length]);

  const wardData = useMemo(
    () =>
      [1, 2, 3, 4, 5, 6].map((w) => ({
        ward: `${t.common.wardPrefix} ${w}`,
        total: filtered.filter((c) => c.wardNumber === w).length,
        resolved: filtered.filter((c) => c.wardNumber === w && c.status === 'resolved').length,
      })),
    [filtered, t]
  );

  const categoryData = useMemo(
    () =>
      categories.map((cat) => ({
        name: language === 'mr' ? cat.nameMr : cat.name,
        count: filtered.filter((c) => c.categoryId === cat.id).length,
      })),
    [categories, filtered, language]
  );

  const staffPerfData = useMemo(
    () =>
      profiles
        .filter((p) => p.role === 'staff')
        .map((s) => ({
          name: s.fullName.split(' ')[0],
          assigned: filtered.filter((c) => c.assignedTo === s.id).length,
          resolved: filtered.filter((c) => c.assignedTo === s.id && c.status === 'resolved')
            .length,
        })),
    [profiles, filtered]
  );

  const statusPie = [
    {
      name: t.status.submitted,
      value: filtered.filter((c) => c.status === 'submitted').length,
      color: '#F59E0B',
    },
    {
      name: t.status.assigned,
      value: filtered.filter((c) => c.status === 'assigned').length,
      color: '#3B82F6',
    },
    {
      name: t.status.in_progress,
      value: filtered.filter((c) => c.status === 'in_progress').length,
      color: '#6366F1',
    },
    {
      name: t.status.resolved,
      value: resolvedList.length,
      color: '#22C55E',
    },
    {
      name: t.status.rejected,
      value: filtered.filter((c) => c.status === 'rejected').length,
      color: '#EF4444',
    },
  ].filter((d) => d.value > 0);

  return (
    <DashboardLayout
      title={t.nav.analytics}
      subtitle={t.brand.panchayat}
      actions={
        <div className="flex items-center gap-2 no-print">
          <button
            type="button"
            onClick={() => exportComplaintsToCsv(filtered)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#14532D] dark:text-[#22C55E]" />
            <span>{t.common.exportCsv}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-xs font-semibold cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.common.printReport}</span>
          </button>
        </div>
      }
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 no-print">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
        >
          <option value="all">{t.common.category}: {t.common.all}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {language === 'mr' ? c.nameMr : c.name}
            </option>
          ))}
        </select>

        <select
          value={wardFilter}
          onChange={(e) => setWardFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
        >
          <option value="all">{t.common.ward}: {t.common.all}</option>
          {[1, 2, 3, 4, 5, 6].map((w) => (
            <option key={w} value={String(w)}>
              {t.common.wardPrefix} {w}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
        />

        <button
          type="button"
          onClick={() => {
            setCategoryFilter('all');
            setWardFilter('all');
            setDateFrom('');
          }}
          className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer"
        >
          {t.common.reset}
        </button>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          label={t.dashboard.totalComplaints}
          value={filtered.length}
          icon={TrendingUp}
        />
        <DashboardCard
          label={t.dashboard.resolutionRate}
          value={resolutionRate}
          icon={CheckCircle2}
          tone="green"
        />
        <DashboardCard
          label={t.dashboard.avgResolutionTime}
          value={avgHours}
          icon={Clock}
          tone="blue"
        />
        <DashboardCard
          label={t.dashboard.pendingComplaints}
          value={filtered.filter((c) => c.status !== 'resolved' && c.status !== 'rejected').length}
          icon={Clock}
          tone="amber"
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
            {t.admin.monthlyTrends}
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.4} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="submitted" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} />
                <Area type="monotone" dataKey="resolved" stroke="#16A34A" fill="#22C55E" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
            {t.admin.statusChart}
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusPie} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={3}>
                  {statusPie.map((s, idx) => (
                    <Cell key={idx} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
            {t.admin.wardChart}
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.4} />
                <XAxis dataKey="ward" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#14532D" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
            {t.admin.staffPerformance}
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffPerfData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.4} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="assigned" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
            {t.admin.categoryChart}
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.4} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
