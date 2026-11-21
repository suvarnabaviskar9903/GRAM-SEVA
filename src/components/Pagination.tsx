import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const { t } = useLanguage();
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalItems <= pageSize) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(totalItems, currentPage * pageSize);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
      <span className="tabular-nums">
        {t.common.showing} {start}–{end} {t.common.of} {totalItems} {t.common.entries}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>{t.common.previous}</span>
        </button>
        <span className="px-2 tabular-nums font-medium text-slate-900 dark:text-slate-100">
          {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
        >
          <span>{t.common.next}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
