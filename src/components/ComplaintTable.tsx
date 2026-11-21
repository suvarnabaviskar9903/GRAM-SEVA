import { ArrowUpDown, Eye } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import type { Complaint } from '../types';
import { formatDate } from '../utils/helpers';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';

interface ComplaintTableProps {
  complaints: Complaint[];
  onViewDetails: (complaint: Complaint) => void;
  showCitizenColumn?: boolean;
  pageSize?: number;
  emptyAction?: React.ReactNode;
}

export function ComplaintTable({
  complaints,
  onViewDetails,
  showCitizenColumn = true,
  pageSize = 8,
  emptyAction,
}: ComplaintTableProps) {
  const { t, language } = useLanguage();
  const { categories } = useData();
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'ward'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const priorityRank = { high: 3, medium: 2, low: 1 };

  const sorted = [...complaints].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortBy === 'date') {
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
    }
    if (sortBy === 'priority') {
      return (priorityRank[a.priority] - priorityRank[b.priority]) * dir;
    }
    return (a.wardNumber - b.wardNumber) * dir;
  });

  const safePage = Math.min(page, Math.max(1, Math.ceil(sorted.length / pageSize)));
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (col: 'date' | 'priority' | 'ward') => {
    if (sortBy === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(col);
      setSortDir('desc');
    }
  };

  if (complaints.length === 0) {
    return (
      <EmptyState
        title={t.common.noData}
        description={t.dashboard.noComplaintsYet}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <th className="py-3 px-4 whitespace-nowrap">Ref ID</th>
              {showCitizenColumn && (
                <th className="py-3 px-4 whitespace-nowrap">{t.roles.citizen}</th>
              )}
              <th className="py-3 px-4 whitespace-nowrap">{t.complaintForm.titleLabel}</th>
              <th className="py-3 px-4 whitespace-nowrap">{t.common.category}</th>
              <th className="py-3 px-4 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => toggleSort('ward')}
                  className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <span>{t.common.ward}</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => toggleSort('priority')}
                  className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <span>{t.common.priority}</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4 whitespace-nowrap">{t.common.status}</th>
              <th className="py-3 px-4 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => toggleSort('date')}
                  className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <span>{t.common.date}</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4 text-right whitespace-nowrap">{t.common.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
            {paged.map((c) => {
              const cat = categories.find((item) => item.id === c.categoryId);
              return (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-xs font-semibold text-[#14532D] dark:text-[#22C55E] tabular-nums whitespace-nowrap">
                    {c.referenceNumber}
                  </td>
                  {showCitizenColumn && (
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {c.citizenName}
                    </td>
                  )}
                  <td className="py-3 px-4 max-w-[260px]">
                    <p className="font-medium text-slate-900 dark:text-white truncate">
                      {c.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {c.villageArea}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {cat ? (language === 'mr' ? cat.nameMr : cat.name) : '-'}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-300 tabular-nums whitespace-nowrap">
                    {t.common.wardPrefix} {c.wardNumber}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <PriorityBadge priority={c.priority} />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
                    {formatDate(c.createdAt, language)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onViewDetails(c)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t.common.viewDetails}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 pb-4">
        <Pagination
          currentPage={safePage}
          totalItems={sorted.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
