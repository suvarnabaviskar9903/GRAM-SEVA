import { CheckCircle2, ClipboardList, Clock, Hammer, MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { ComplaintTable } from '../components/ComplaintTable';
import { DashboardCard } from '../components/DashboardCard';
import { FilterPanel } from '../components/FilterPanel';
import { ImageUploader } from '../components/ImageUploader';
import { MapSelector } from '../components/MapSelector';
import { Modal } from '../components/Modal';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import type { Complaint, ComplaintStatus } from '../types';

export function StaffDashboard({ mode = 'overview' }: { mode?: 'overview' | 'tasks' | 'completed' }) {
  const { user } = useAuth();
  const { complaints, categories, staffUpdateComplaint } = useData();
  const { t, language } = useLanguage();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [wardFilter, setWardFilter] = useState('all');

  const [selected, setSelected] = useState<Complaint | null>(null);
  const [nextStatus, setNextStatus] = useState<ComplaintStatus>('in_progress');
  const [remarks, setRemarks] = useState('');
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);

  const myAssigned = useMemo(
    () => complaints.filter((c) => c.assignedTo === user?.id),
    [complaints, user?.id]
  );

  const scoped = useMemo(() => {
    const base =
      mode === 'completed'
        ? myAssigned.filter((c) => c.status === 'resolved')
        : mode === 'tasks'
        ? myAssigned.filter((c) => c.status !== 'resolved' && c.status !== 'rejected')
        : myAssigned;

    const q = search.trim().toLowerCase();
    return base.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && c.categoryId !== categoryFilter) return false;
      if (wardFilter !== 'all' && String(c.wardNumber) !== wardFilter) return false;
      if (
        q &&
        !c.referenceNumber.toLowerCase().includes(q) &&
        !c.title.toLowerCase().includes(q) &&
        !c.villageArea.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [myAssigned, mode, search, statusFilter, categoryFilter, wardFilter]);

  const openTaskModal = (cmp: Complaint) => {
    setSelected(cmp);
    setNextStatus(cmp.status === 'assigned' ? 'in_progress' : cmp.status);
    setRemarks(cmp.resolutionDetails || '');
    setBeforePhoto(cmp.beforePhotoUrl || cmp.imageUrl);
    setAfterPhoto(cmp.resolutionPhoto);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !user) return;
    if (!remarks.trim()) {
      toast.error(t.common.required);
      return;
    }

    staffUpdateComplaint({
      complaintId: selected.id,
      staffUser: user,
      status: nextStatus,
      remarks: remarks.trim(),
      beforePhotoUrl: beforePhoto,
      resolutionPhoto: afterPhoto,
      resolutionDetails: nextStatus === 'resolved' ? remarks.trim() : null,
    });
    toast.success(t.staff.taskUpdated);
    setSelected(null);
  };

  const pendingCount = myAssigned.filter((c) => c.status === 'assigned').length;
  const inProgressCount = myAssigned.filter((c) => c.status === 'in_progress').length;
  const completedCount = myAssigned.filter((c) => c.status === 'resolved').length;

  const pageTitle =
    mode === 'completed'
      ? t.nav.completedTasks
      : mode === 'tasks'
      ? t.nav.assignedTasks
      : `${t.dashboard.welcome}, ${user?.fullName.split(' ')[0]}`;

  return (
    <DashboardLayout title={pageTitle} subtitle={t.dashboard.staffSubtitle}>
      {mode === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            label={t.dashboard.assignedTasks}
            value={myAssigned.length}
            icon={ClipboardList}
          />
          <DashboardCard
            label={t.dashboard.pendingTasks}
            value={pendingCount}
            icon={Clock}
            tone="amber"
          />
          <DashboardCard
            label={t.dashboard.inProgressComplaints}
            value={inProgressCount}
            icon={Hammer}
            tone="blue"
          />
          <DashboardCard
            label={t.dashboard.completedTasks}
            value={completedCount}
            icon={CheckCircle2}
            tone="green"
          />
        </div>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400">{t.staff.onlyAssignedNote}</p>

      <FilterPanel
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        wardFilter={wardFilter}
        onWardChange={setWardFilter}
        onReset={() => {
          setSearch('');
          setStatusFilter('all');
          setCategoryFilter('all');
          setWardFilter('all');
        }}
      />

      <ComplaintTable complaints={scoped} onViewDetails={openTaskModal} />

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.referenceNumber} — ${selected.title}` : ''}
        subtitle={
          selected
            ? `${t.common.wardPrefix} ${selected.wardNumber} · ${selected.villageArea}`
            : ''
        }
        maxWidthClass="max-w-3xl"
      >
        {selected && (
          <form onSubmit={handleSaveTask} className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{selected.citizenName}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{selected.citizenMobile}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {(() => {
                    const cat = categories.find((c) => c.id === selected.categoryId);
                    return cat ? (language === 'mr' ? cat.nameMr : cat.name) : '';
                  })()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selected.status} />
                <PriorityBadge priority={selected.priority} />
              </div>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300">{selected.description}</p>

            <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#14532D] dark:text-[#22C55E]" />
              <span>
                {selected.villageArea}, {t.common.wardPrefix} {selected.wardNumber}
                {selected.landmark ? ` (${selected.landmark})` : ''}
              </span>
            </div>

            <MapSelector
              latitude={selected.latitude}
              longitude={selected.longitude}
              readOnly
              heightClass="h-44"
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <ImageUploader
                label={t.staff.uploadBefore}
                value={beforePhoto}
                onChange={setBeforePhoto}
              />
              <ImageUploader
                label={t.staff.uploadAfter}
                value={afterPhoto}
                onChange={setAfterPhoto}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.staff.workStatus}
                </label>
                <select
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value as ComplaintStatus)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                >
                  <option value="assigned">{t.status.assigned}</option>
                  <option value="in_progress">{t.status.in_progress}</option>
                  <option value="resolved">{t.status.resolved}</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.staff.workRemarks} *
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={t.staff.workRemarksPlaceholder}
                  className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-xs font-semibold cursor-pointer"
              >
                {t.staff.markResolved}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  );
}
