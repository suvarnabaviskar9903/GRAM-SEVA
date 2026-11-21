import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { NotificationBell } from '../components/NotificationBell';
import { Sidebar } from '../components/Sidebar';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardLayout({
  title,
  subtitle,
  actions,
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-slate-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {t.brand.panchayat} · {user ? t.roles[user.role] : ''}
              </p>
              <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white truncate">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <LanguageSwitcher compact />
            <ThemeToggle />
            <NotificationBell />
            <Link
              to="/profile"
              className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#14532D] text-white text-xs font-bold shrink-0"
              title={user?.fullName}
            >
              {user?.fullName
                .split(' ')
                .map((w) => w[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto space-y-6">
          {(subtitle || actions) && (
            <div className="flex flex-wrap items-center justify-between gap-4">
              {subtitle ? (
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                  {subtitle}
                </p>
              ) : (
                <div />
              )}
              {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
