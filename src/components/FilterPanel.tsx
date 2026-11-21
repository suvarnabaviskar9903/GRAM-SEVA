import { RotateCcw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import type { ComplaintPriority, ComplaintStatus } from '../types';
import { SearchBar } from './SearchBar';

interface FilterPanelProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: ComplaintStatus | 'all';
  onStatusChange: (val: ComplaintStatus | 'all') => void;
  categoryFilter: string;
  onCategoryChange: (val: string) => void;
  wardFilter: string;
  onWardChange: (val: string) => void;
  priorityFilter?: ComplaintPriority | 'all';
  onPriorityChange?: (val: ComplaintPriority | 'all') => void;
  onReset: () => void;
}

export function FilterPanel({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  wardFilter,
  onWardChange,
  priorityFilter = 'all',
  onPriorityChange,
  onReset,
}: FilterPanelProps) {
  const { t, language } = useLanguage();
  const { categories } = useData();

  const selectCls =
    'h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 dark:focus:ring-[#22C55E]/30';

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <SearchBar value={search} onChange={onSearchChange} />

      <select
        aria-label={t.common.status}
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as ComplaintStatus | 'all')}
        className={selectCls}
      >
        <option value="all">{t.common.status}: {t.common.all}</option>
        <option value="submitted">{t.status.submitted}</option>
        <option value="assigned">{t.status.assigned}</option>
        <option value="in_progress">{t.status.in_progress}</option>
        <option value="resolved">{t.status.resolved}</option>
        <option value="rejected">{t.status.rejected}</option>
      </select>

      <select
        aria-label={t.common.category}
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={selectCls}
      >
        <option value="all">{t.common.category}: {t.common.all}</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {language === 'mr' ? cat.nameMr : cat.name}
          </option>
        ))}
      </select>

      <select
        aria-label={t.common.ward}
        value={wardFilter}
        onChange={(e) => onWardChange(e.target.value)}
        className={selectCls}
      >
        <option value="all">{t.common.ward}: {t.common.all}</option>
        {[1, 2, 3, 4, 5, 6].map((w) => (
          <option key={w} value={String(w)}>
            {t.common.wardPrefix} {w}
          </option>
        ))}
      </select>

      {onPriorityChange && (
        <select
          aria-label={t.common.priority}
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value as ComplaintPriority | 'all')}
          className={selectCls}
        >
          <option value="all">{t.common.priority}: {t.common.all}</option>
          <option value="high">{t.priority.high}</option>
          <option value="medium">{t.priority.medium}</option>
          <option value="low">{t.priority.low}</option>
        </select>
      )}

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>{t.common.reset}</span>
      </button>
    </div>
  );
}
