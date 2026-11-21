import { Bell, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { formatDateTime } from '../utils/helpers';

export function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  if (!user) return null;

  const myNotifs = notifications.filter((n) => n.userId === user.id);
  const unreadCount = myNotifs.filter((n) => !n.isRead).length;

  return (
    <DashboardLayout
      title={t.notificationsPage.title}
      subtitle={t.notificationsPage.subtitle}
      actions={
        unreadCount > 0 ? (
          <button
            type="button"
            onClick={() => markAllNotificationsRead(user.id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-[#14532D] dark:text-[#22C55E]" />
            <span>{t.notificationsPage.markAllRead}</span>
          </button>
        ) : undefined
      }
    >
      {myNotifs.length === 0 ? (
        <EmptyState title={t.notificationsPage.noNotifications} />
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
          {myNotifs.map((n) => (
            <div
              key={n.id}
              className={`p-5 flex flex-wrap items-start justify-between gap-4 ${
                !n.isRead ? 'bg-[#F0FDF4]/60 dark:bg-emerald-950/20' : ''
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-lg bg-[#F0FDF4] dark:bg-emerald-950/60 text-[#14532D] dark:text-[#22C55E] flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {language === 'mr' ? n.titleMr : n.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {language === 'mr' ? n.messageMr : n.message}
                  </p>
                  <p className="mt-1.5 text-xs text-slate-400 tabular-nums">
                    {formatDateTime(n.createdAt, language)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!n.isRead && (
                  <button
                    type="button"
                    onClick={() => markNotificationRead(n.id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    {t.notificationsPage.markRead}
                  </button>
                )}
                {n.referenceNumber && (
                  <button
                    type="button"
                    onClick={() => {
                      markNotificationRead(n.id);
                      navigate(`/track?ref=${encodeURIComponent(n.referenceNumber!)}`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#14532D] text-white text-xs font-semibold hover:bg-[#166534] cursor-pointer"
                  >
                    {t.common.viewDetails}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
