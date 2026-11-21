import {
  CheckCircle2,
  ClipboardList,
  Clock,
  Download,
  FilePlus2,
  Hammer,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import {
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
import { ComplaintTable } from '../components/ComplaintTable';
import { ComplaintTimeline } from '../components/ComplaintTimeline';
import { DashboardCard } from '../components/DashboardCard';
import { FilterPanel } from '../components/FilterPanel';
import { MapSelector } from '../components/MapSelector';
import { Modal } from '../components/Modal';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import type { Complaint, ComplaintPriority, ComplaintStatus } from '../types';
import { exportComplaintsToCsv } from '../utils/helpers';

const CHART_COLORS = ['#14532D', '#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#6366F1'];

export function AdminDashboard({ mode = 'overview' }: { mode?: 'overview' | 'complaints' }) {
  const { user } = useAuth();
  const { complaints, categories, departments, profiles, updates, adminUpdateComplaint } =
    useData();
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();

  const initialStatus = (searchParams.get('status') as ComplaintStatus | 'pending') || 'all';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>(
    initialStatus === 'pending' ? 'submitted' : initialStatus
  );
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [wardFilter, setWardFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState<ComplaintPriority | 'all'>('all');

  useEffect(() => {
    const s = searchParams.get('status');
    if (s === 'submitted' || s === 'assigned' || s === 'in_progress' || s === 'resolved' || s === 'rejected') {
      setStatusFilter(s);
    } else if (s === 'pending') {
      setStatusFilter('submitted');
    } else if (!s) {
      setStatusFilter('all');
    }
  }, [searchParams]);

  const [selected, setSelected] = useState<Complaint | null>(null);
  const [deptId, setDeptId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [nextStatus, setNextStatus] = useState<ComplaintStatus>('assigned');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const staffList = useMemo(
    () => profiles.filter((p) => p.role === 'staff' && p.isActive),
    [profiles]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return complaints.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && c.categoryId !== categoryFilter) return false;
      if (wardFilter !== 'all' && String(c.wardNumber) !== wardFilter) return false;
      if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
      if (
        q &&
        !c.referenceNumber.toLowerCase().includes(q) &&
        !c.title.toLowerCase().includes(q) &&
        !c.citizenName.toLowerCase().includes(q) &&
        !c.villageArea.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [complaints, search, statusFilter, categoryFilter, wardFilter, priorityFilter]);

  const counts = useMemo(
    () => ({
      total: complaints.length,
      submitted: complaints.filter((c) => c.status === 'submitted').length,
      assigned: complaints.filter((c) => c.status === 'assigned').length,
      inProgress: complaints.filter((c) => c.status === 'in_progress').length,
      resolved: complaints.filter((c) => c.status === 'resolved').length,
      rejected: complaints.filter((c) => c.status === 'rejected').length,
    }),
    [complaints]
  );

  const categoryChartData = useMemo(
    () =>
      categories.map((cat) => ({
        name: language === 'mr' ? cat.nameMr : cat.name,
        count: complaints.filter((c) => c.categoryId === cat.id).length,
      })),
    [categories, complaints, language]
  );

  const statusChartData = useMemo(
    () => [
      { name: t.status.submitted, value: counts.submitted, color: '#F59E0B' },
      { name: t.status.assigned, value: counts.assigned, color: '#3B82F6' },
      { name: t.status.in_progress, value: counts.inProgress, color: '#6366F1' },
      { name: t.status.resolved, value: counts.resolved, color: '#22C55E' },
      { name: t.status.rejected, value: counts.rejected, color: '#EF4444' },
    ],
    [counts, t]
  );

  const openModal = (cmp: Complaint) => {
    setSelected(cmp);
    setDeptId(cmp.departmentId || '');
    setStaffId(cmp.assignedTo || '');
    setNextStatus(cmp.status === 'submitted' ? 'assigned' : cmp.status);
    setAdminRemarks(cmp.adminRemarks || '');
    setRejectionReason(cmp.rejectionReason || '');
  };

  const handleAdminSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !user) return;
    if (nextStatus === 'rejected' && !rejectionReason.trim()) {
      toast.error(t.admin.rejectReasonPlaceholder);
      return;
    }

    adminUpdateComplaint({
      complaintId: selected.id,
      adminUser: user,
      departmentId: deptId || null,
      assignedTo: staffId || null,
      status: nextStatus,
      adminRemarks: adminRemarks.trim(),
      rejectionReason: rejectionReason.trim(),
    });
    toast.success(t.admin.updatedSuccess);
    setSelected(null);
  };

  return (
    <DashboardLayout
      title={mode === 'complaints' ? t.nav.allComplaints : t.nav.overview}
      subtitle={t.dashboard.adminSubtitle}
      actions={
        <button
          type="button"
          onClick={() => exportComplaintsToCsv(filtered)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap"
        >
          <Download className="w-4 h-4 text-[#14532D] dark:text-[#22C55E]" />
          <span>{t.common.exportCsv}</span>
        </button>
      }
    >
      {mode === 'overview' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <DashboardCard
              label={t.dashboard.totalComplaints}
              value={counts.total}
              icon={ClipboardList}
              onClick={() => setStatusFilter('all')}
            />
            <DashboardCard
              label={t.dashboard.newComplaints}
              value={counts.submitted}
              icon={FilePlus2}
              tone="amber"
              onClick={() => setStatusFilter('submitted')}
            />
            <DashboardCard
              label={t.dashboard.assignedComplaints}
              value={counts.assigned}
              icon={UserCheck}
              tone="blue"
              onClick={() => setStatusFilter('assigned')}
            />
            <DashboardCard
              label={t.dashboard.inProgressComplaints}
              value={counts.inProgress}
              icon={Hammer}
              tone="blue"
              onClick={() => setStatusFilter('in_progress')}
            />
            <DashboardCard
              label={t.dashboard.resolvedComplaints}
              value={counts.resolved}
              icon={CheckCircle2}
              tone="green"
              onClick={() => setStatusFilter('resolved')}
            />
            <DashboardCard
              label={t.dashboard.rejectedComplaints}
              value={counts.rejected}
              icon={XCircle}
              tone="red"
              onClick={() => setStatusFilter('rejected')}
            />
          </div>

          <div className="grid lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                {t.admin.categoryChart}
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ top: 8, right: 12, left: -16, bottom: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.4} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {categoryChartData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                {t.admin.statusChart}
              </h2>
              <div className="h-64 flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData.filter((d) => d.value > 0)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={82}
                      paddingAngle={3}
                    >
                      {statusChartData
                        .filter((d) => d.value > 0)
                        .map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      <FilterPanel
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        wardFilter={wardFilter}
        onWardChange={setWardFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        onReset={() => {
          setSearch('');
          setStatusFilter('all');
          setCategoryFilter('all');
          setWardFilter('all');
          setPriorityFilter('all');
        }}
      />

      <ComplaintTable complaints={filtered} onViewDetails={openModal} />

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.referenceNumber} — ${selected.title}` : ''}
        subtitle={selected ? `${selected.citizenName} (${selected.citizenMobile})` : ''}
        maxWidthClass="max-w-3xl"
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {t.common.wardPrefix} {selected.wardNumber} · {selected.villageArea}
                {selected.landmark ? ` · ${selected.landmark}` : ''}
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selected.status} />
                <PriorityBadge priority={selected.priority} />
              </div>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300">{selected.description}</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <MapSelector
                latitude={selected.latitude}
                longitude={selected.longitude}
                readOnly
                heightClass="h-44"
              />
              {selected.imageUrl ? (
                <img
                  src={selected.imageUrl}
                  alt={selected.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover rounded-xl border border-slate-200 dark:border-slate-800"
                />
              ) : (
                <div className="h-44 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs text-slate-400">
                  <Clock className="w-4 h-4 mr-1.5" />
                  <span>{t.common.noData}</span>
                </div>
              )}
            </div>

            <form
              onSubmit={handleAdminSave}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-4"
            >
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t.admin.assignTask}
              </h3>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    {t.admin.selectDepartment}
                  </label>
                  <select
                    value={deptId}
                    onChange={(e) => setDeptId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  >
                    <option value="">{t.common.unassigned}</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {language === 'mr' ? d.nameMr : d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    {t.admin.selectStaff}
                  </label>
                  <select
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  >
                    <option value="">{t.common.unassigned}</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    {t.admin.updateStatus}
                  </label>
                  <select
                    value={nextStatus}
                    onChange={(e) => setNextStatus(e.target.value as ComplaintStatus)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  >
                    <option value="submitted">{t.status.submitted}</option>
                    <option value="assigned">{t.status.assigned}</option>
                    <option value="in_progress">{t.status.in_progress}</option>
                    <option value="resolved">{t.status.resolved}</option>
                    <option value="rejected">{t.status.rejected}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t.common.remarks}
                </label>
                <textarea
                  rows={2}
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  placeholder={t.admin.remarksPlaceholder}
                  className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                />
              </div>

              {nextStatus === 'rejected' && (
                <div>
                  <label className="block text-xs font-medium text-red-600 dark:text-red-400 mb-1">
                    {t.tracking.rejectionReason} *
                  </label>
                  <textarea
                    rows={2}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder={t.admin.rejectReasonPlaceholder}
                    className="w-full p-3 rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-slate-900 text-sm"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-xs font-semibold cursor-pointer"
                >
                  {t.admin.saveUpdate}
                </button>
              </div>
            </form>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                {t.tracking.timelineTitle}
              </h4>
              <ComplaintTimeline
                status={selected.status}
                updates={updates.filter((u) => u.complaintId === selected.id)}
                rejectionReason={selected.rejectionReason}
              />
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
