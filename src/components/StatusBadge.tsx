import { CheckCircle2, Clock, FileCheck2, Loader2, XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { ComplaintStatus } from '../types';

const STATUS_STYLES: Record<
  ComplaintStatus,
  { text: string; bg: string; border: string }
> = {
  submitted: {
    text: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    border: 'border-amber-200 dark:border-amber-800/70',
  },
  assigned: {
    text: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    border: 'border-blue-200 dark:border-blue-800/70',
  },
  in_progress: {
    text: 'text-indigo-700 dark:text-indigo-300',
    bg: 'bg-indigo-50 dark:bg-indigo-950/50',
    border: 'border-indigo-200 dark:border-indigo-800/70',
  },
  resolved: {
    text: 'text-emerald-800 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    border: 'border-emerald-200 dark:border-emerald-800/70',
  },
  rejected: {
    text: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-50 dark:bg-red-950/50',
    border: 'border-red-200 dark:border-red-800/70',
  },
};

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const { t } = useLanguage();
  const style = STATUS_STYLES[status] || STATUS_STYLES.submitted;

  const renderIcon = () => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-3.5 h-3.5 shrink-0" />;
      case 'assigned':
        return <FileCheck2 className="w-3.5 h-3.5 shrink-0" />;
      case 'in_progress':
        return <Loader2 className="w-3.5 h-3.5 shrink-0" />;
      case 'resolved':
        return <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />;
      case 'rejected':
        return <XCircle className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md border whitespace-nowrap shrink-0 ${style.bg} ${style.text} ${style.border}`}
    >
      {renderIcon()}
      <span>{t.status[status]}</span>
    </span>
  );
}
