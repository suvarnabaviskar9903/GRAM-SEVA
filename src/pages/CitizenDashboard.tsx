import { CheckCircle2, ClipboardList, Clock, FilePlus2, Hammer } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ComplaintCard } from '../components/ComplaintCard';
import { ComplaintTable } from '../components/ComplaintTable';
import { DashboardCard } from '../components/DashboardCard';
import { FilterPanel } from '../components/FilterPanel';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import type { ComplaintPriority, ComplaintStatus } from '../types';

export function CitizenDashboard({ mode = 'overview' }: { mode?: 'overview' | 'list' }) {
  const { user } = useAuth();
  const { complaints } = useData();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [wardFilter, setWardFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState<ComplaintPriority | 'all'>('all');

  const myComplaints = useMemo(
    () => complaints.filter((c) => c.userId === user?.id),
    [complaints, user?.id]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return myComplaints.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && c.categoryId !== categoryFilter) return false;
      if (wardFilter !== 'all' && String(c.wardNumber) !== wardFilter) return false;
      if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
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
  }, [myComplaints, search, statusFilter, categoryFilter, wardFilter, priorityFilter]);

  const pendingCount = myComplaints.filter(
    (c) => c.status === 'submitted' || c.status === 'assigned'
  ).length;
  const inProgressCount = myComplaints.filter((c) => c.status === 'in_progress').length;
  const resolvedCount = myComplaints.filter((c) => c.status === 'resolved').length;

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setWardFilter('all');
    setPriorityFilter('all');
  };

  return (
    <DashboardLayout
      title={
        mode === 'list'
          ? t.nav.myComplaints
          : `${t.dashboard.welcome}, ${user?.fullName.split(' ')[0]}`
      }
      subtitle={t.dashboard.citizenSubtitle}
      actions={
        <Link
          to="/citizen/submit"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-xs font-semibold transition-colors whitespace-nowrap"
        >
          <FilePlus2 className="w-4 h-4" />
          <span>{t.nav.submitComplaint}</span>
        </Link>
      }
    >
      {mode === 'overview' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard
              label={t.dashboard.totalComplaints}
              value={myComplaints.length}
              icon={ClipboardList}
              tone="default"
              onClick={() => setStatusFilter('all')}
            />
            <DashboardCard
              label={t.dashboard.pendingComplaints}
              value={pendingCount}
              icon={Clock}
              tone="amber"
              onClick={() => setStatusFilter('submitted')}
            />
            <DashboardCard
              label={t.dashboard.inProgressComplaints}
              value={inProgressCount}
              icon={Hammer}
              tone="blue"
              onClick={() => setStatusFilter('in_progress')}
            />
            <DashboardCard
              label={t.dashboard.resolvedComplaints}
              value={resolvedCount}
              icon={CheckCircle2}
              tone="green"
              onClick={() => setStatusFilter('resolved')}
            />
          </div>

          {myComplaints.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  {t.dashboard.recentComplaints}
                </h2>
                <Link
                  to="/citizen/complaints"
                  className="text-xs font-semibold text-[#14532D] dark:text-[#22C55E] hover:underline"
                >
                  {t.nav.myComplaints}
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {myComplaints.slice(0, 3).map((cmp) => (
                  <ComplaintCard
                    key={cmp.id}
                    complaint={cmp}
                    onSelect={(item) =>
                      navigate(`/track?ref=${encodeURIComponent(item.referenceNumber)}`)
                    }
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section className="space-y-4">
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
          onReset={resetFilters}
        />

        <ComplaintTable
          complaints={filtered}
          showCitizenColumn={false}
          onViewDetails={(item) =>
            navigate(`/track?ref=${encodeURIComponent(item.referenceNumber)}`)
          }
          emptyAction={
            <Link
              to="/citizen/submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#14532D] text-white text-xs font-semibold"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>{t.dashboard.createFirstComplaint}</span>
            </Link>
          }
        />
      </section>
    </DashboardLayout>
  );
}
