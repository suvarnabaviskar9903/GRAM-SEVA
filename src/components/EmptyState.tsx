import { Loader2, Inbox } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function LoadingSpinner({ label }: { label?: string }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500 dark:text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin text-[#14532D] dark:text-[#22C55E]" />
      <p className="text-sm font-medium">{label || t.common.loading}</p>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40">
      <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
        <Inbox className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-md">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
