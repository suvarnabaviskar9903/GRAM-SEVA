import { Bell, CheckCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatDateTime } from '../utils/helpers';

export function NotificationBell() {
  const { user } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const userNotifications = user
    ? notifications.filter((n) => n.userId === user.id)
    : [];
  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.nav.notifications}
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg z-40 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {t.notificationsPage.title}
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllNotificationsRead(user.id)}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#14532D] dark:text-[#22C55E] hover:underline cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{t.notificationsPage.markAllRead}</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {userNotifications.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                {t.notificationsPage.noNotifications}
              </p>
            ) : (
              userNotifications.slice(0, 6).map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    markNotificationRead(n.id);
                    setOpen(false);
                    if (n.referenceNumber) {
                      navigate(`/track?ref=${encodeURIComponent(n.referenceNumber)}`);
                    } else {
                      navigate('/notifications');
                    }
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                    !n.isRead ? 'bg-[#F0FDF4]/60 dark:bg-emerald-950/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      {language === 'mr' ? n.titleMr : n.title}
                    </p>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#166534] dark:bg-[#22C55E] mt-1 shrink-0" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {language === 'mr' ? n.messageMr : n.message}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400 tabular-nums">
                    {formatDateTime(n.createdAt, language)}
                  </p>
                </button>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate('/notifications');
            }}
            className="w-full py-2.5 text-center text-xs font-semibold text-[#14532D] dark:text-[#22C55E] border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {t.common.viewDetails}
          </button>
        </div>
      )}
    </div>
  );
}
