import { ArrowRight, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import type { Complaint } from '../types';
import { formatDate } from '../utils/helpers';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';

interface ComplaintCardProps {
  complaint: Complaint;
  onSelect: (complaint: Complaint) => void;
}

export function ComplaintCard({ complaint, onSelect }: ComplaintCardProps) {
  const { t, language } = useLanguage();
  const { categories } = useData();
  const cat = categories.find((c) => c.id === complaint.categoryId);

  return (
    <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between gap-4 hover:border-[#166534]/40 dark:hover:border-[#22C55E]/40 transition-colors">
      <div>
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="font-mono font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
              {complaint.referenceNumber}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">
              {cat ? (language === 'mr' ? cat.nameMr : cat.name) : ''}
            </span>
          </div>
          <span className="tabular-nums shrink-0">{formatDate(complaint.createdAt, language)}</span>
        </div>

        <h3 className="mt-2.5 text-base font-semibold text-slate-900 dark:text-white line-clamp-2">
          {complaint.title}
        </h3>

        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {complaint.description}
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-[#166534] dark:text-[#22C55E]" />
          <span className="truncate">
            {t.common.wardPrefix} {complaint.wardNumber} · {complaint.villageArea}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <StatusBadge status={complaint.status} />
          <PriorityBadge priority={complaint.priority} />
        </div>
        <button
          type="button"
          onClick={() => onSelect(complaint)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#14532D] dark:text-[#22C55E] hover:underline cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>{t.common.viewDetails}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
}
