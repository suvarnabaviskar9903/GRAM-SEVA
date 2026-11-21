import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardPath =
    user?.role === 'admin'
      ? '/admin'
      : user?.role === 'staff'
      ? '/staff'
      : '/citizen';

  const scrollOrGo = (hash: string) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate(`/${hash}`);
      return;
    }
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand wordmark */}
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-[#14532D] dark:text-[#22C55E] whitespace-nowrap shrink-0"
        >
          {t.brand.name}
        </Link>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link
            to="/"
            className="hover:text-[#14532D] dark:hover:text-[#22C55E] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {t.nav.home}
          </Link>
          <button
            type="button"
            onClick={() => scrollOrGo('#services')}
            className="hover:text-[#14532D] dark:hover:text-[#22C55E] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.nav.services}
          </button>
          <button
            type="button"
            onClick={() => scrollOrGo('#how-it-works')}
            className="hover:text-[#14532D] dark:hover:text-[#22C55E] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.nav.howItWorks}
          </button>
          <Link
            to="/track"
            className="hover:text-[#14532D] dark:hover:text-[#22C55E] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {t.nav.trackComplaint}
          </Link>
          <button
            type="button"
            onClick={() => scrollOrGo('#contact')}
            className="hover:text-[#14532D] dark:hover:text-[#22C55E] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.nav.contact}
          </button>
        </nav>

        {/* Zone 3: Language Switcher, Theme Toggle, and Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <LanguageSwitcher />
          <ThemeToggle />
          {user ? (
            <Link
              to={dashboardPath}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.dashboard}
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.login}
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {t.nav.home}
          </Link>
          <button
            type="button"
            onClick={() => scrollOrGo('#services')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {t.nav.services}
          </button>
          <button
            type="button"
            onClick={() => scrollOrGo('#how-it-works')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {t.nav.howItWorks}
          </button>
          <Link
            to="/track"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {t.nav.trackComplaint}
          </Link>
          <button
            type="button"
            onClick={() => scrollOrGo('#contact')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {t.nav.contact}
          </button>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            {user ? (
              <Link
                to={dashboardPath}
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 rounded-lg bg-[#14532D] text-white text-sm font-semibold"
              >
                {t.nav.dashboard}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg bg-[#14532D] text-white text-sm font-semibold"
                >
                  {t.nav.login}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm font-semibold"
                >
                  {t.nav.register}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
