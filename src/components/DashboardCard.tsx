import type { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  label: string;
  value: string | number;
  helper?: string;
  icon: LucideIcon;
  tone?: 'default' | 'green' | 'amber' | 'blue' | 'red';
  onClick?: () => void;
}

const TONE_MAP = {
  default: 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800',
  green: 'text-[#14532D] dark:text-[#22C55E] bg-[#F0FDF4] dark:bg-emerald-950/60',
  amber: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50',
  blue: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50',
  red: 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50',
};

export function DashboardCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = 'default',
  onClick,
}: DashboardCardProps) {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`w-full text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors ${
        onClick ? 'hover:border-[#166534]/50 dark:hover:border-[#22C55E]/40 cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {value}
          </p>
          {helper && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">{helper}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${TONE_MAP[tone]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Wrapper>
  );
}
