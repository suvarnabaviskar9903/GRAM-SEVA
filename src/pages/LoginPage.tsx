import { ShieldCheck, User, UserCog, Wrench } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PublicLayout } from '../layouts/PublicLayout';
import type { UserRole } from '../types';

export function LoginPage() {
  const { t } = useLanguage();
  const { login, loginAsRole } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextPath = searchParams.get('next');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const redirectForRole = (role: UserRole) => {
    if (nextPath && role === 'citizen') {
      navigate(nextPath);
      return;
    }
    if (role === 'admin') navigate('/admin');
    else if (role === 'staff') navigate('/staff');
    else navigate('/citizen');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError(t.common.required);
      return;
    }
    const res = login(email, password);
    if (!res.ok || !res.user) {
      setError(t.auth.invalidCredentials);
      return;
    }
    toast.success(t.auth.loginSuccess);
    redirectForRole(res.user.role);
  };

  const handleQuickRole = (role: UserRole) => {
    const profile = loginAsRole(role);
    toast.success(t.auth.loginSuccess);
    redirectForRole(profile.role);
  };

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[#14532D] dark:text-[#22C55E] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.brand.panchayat}</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {t.auth.loginTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.auth.loginSubtitle}
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-xs text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.auth.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@gramseva.in"
                className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.auth.password}
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-[#14532D] dark:text-[#22C55E] hover:underline"
                >
                  {t.auth.forgotLink}
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              {t.auth.signInBtn}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-600 dark:text-slate-400">
            {t.auth.noAccount}{' '}
            <Link
              to="/register"
              className="font-semibold text-[#14532D] dark:text-[#22C55E] hover:underline"
            >
              {t.nav.register}
            </Link>
          </p>

          {/* Quick Role Preview Access */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              {t.auth.quickDemoTitle}
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.auth.quickDemoDesc}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRole('citizen')}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#166534] dark:hover:border-[#22C55E] text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
              >
                <User className="w-4 h-4 text-[#14532D] dark:text-[#22C55E]" />
                <span>{t.roles.citizen}</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('staff')}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#166534] dark:hover:border-[#22C55E] text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
              >
                <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{t.roles.staff}</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('admin')}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#166534] dark:hover:border-[#22C55E] text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
              >
                <UserCog className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
