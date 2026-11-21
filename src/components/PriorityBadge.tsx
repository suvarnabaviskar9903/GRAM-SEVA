import { AlertTriangle, ArrowDown, Minus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { ComplaintPriority } from '../types';

const PRIORITY_STYLES: Record<ComplaintPriority, string> = {
  low: 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
  medium:
    'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
  high: 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60',
};

export function PriorityBadge({ priority }: { priority: ComplaintPriority }) {
  const { t } = useLanguage();

  const Icon =
    priority === 'high' ? AlertTriangle : priority === 'medium' ? Minus : ArrowDown;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md border whitespace-nowrap shrink-0 ${PRIORITY_STYLES[priority]}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{t.priority[priority]}</span>
    </span>
  );
}
