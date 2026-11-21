import { CheckCircle2, Clock, FileCheck2, Hammer, XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { ComplaintStatus, ComplaintUpdate } from '../types';
import { formatDateTime } from '../utils/helpers';

interface ComplaintTimelineProps {
  status: ComplaintStatus;
  updates: ComplaintUpdate[];
  rejectionReason?: string | null;
}

const STEPS: { key: ComplaintStatus; icon: typeof Clock }[] = [
  { key: 'submitted', icon: Clock },
  { key: 'assigned', icon: FileCheck2 },
  { key: 'in_progress', icon: Hammer },
  { key: 'resolved', icon: CheckCircle2 },
];

const ORDER: Record<ComplaintStatus, number> = {
  submitted: 0,
  assigned: 1,
  in_progress: 2,
  resolved: 3,
  rejected: 1,
};

export function ComplaintTimeline({
  status,
  updates,
  rejectionReason,
}: ComplaintTimelineProps) {
  const { t, language } = useLanguage();
  const currentStep = ORDER[status] ?? 0;

  return (
    <div className="space-y-6">
      {status === 'rejected' ? (
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/30 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">
              {t.status.rejected}
            </p>
            <p className="mt-1 text-sm text-red-700 dark:text-red-200/90">
              {rejectionReason || t.tracking.rejectionReason}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const completed = idx <= currentStep;
            const isCurrent = idx === currentStep;
            const labelMap: Record<string, string> = {
              submitted: t.tracking.submittedStep,
              assigned: t.tracking.assignedStep,
              in_progress: t.tracking.inProgressStep,
              resolved: t.tracking.resolvedStep,
            };

            return (
              <div
                key={step.key}
                className={`p-3.5 rounded-xl border transition-colors ${
                  completed
                    ? 'border-[#166534]/40 dark:border-[#22C55E]/40 bg-[#F0FDF4]/70 dark:bg-emerald-950/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 opacity-65'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      completed
                        ? 'bg-[#14532D] dark:bg-[#22C55E] text-white dark:text-slate-950'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono tabular-nums text-slate-400">
                    0{idx + 1}
                  </span>
                </div>
                <p
                  className={`mt-2.5 text-xs font-semibold ${
                    isCurrent
                      ? 'text-[#14532D] dark:text-[#22C55E]'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {labelMap[step.key]}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {updates.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          {updates.map((upd) => (
            <div
              key={upd.id}
              className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-100 dark:border-slate-800/70 last:border-b-0"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {upd.updaterName}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{t.roles[upd.updaterRole]}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-[#14532D] dark:text-[#22C55E]">
                    {t.status[upd.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{upd.remarks}</p>
              </div>
              <span className="text-xs text-slate-400 tabular-nums whitespace-nowrap shrink-0">
                {formatDateTime(upd.createdAt, language)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
