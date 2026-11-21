import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PublicLayout } from '../layouts/PublicLayout';

export function RegisterPage() {
  const { t } = useLanguage();
  const { registerCitizen } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    villageName: 'Shrirampur',
    wardNumber: '1',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      setError(t.common.required);
      return;
    }
    if (!/^\d{10}$/.test(form.mobile.trim())) {
      setError(t.auth.invalidMobile);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }

    const res = registerCitizen({
      fullName: form.fullName,
      email: form.email,
      mobile: form.mobile,
      password: form.password,
      villageName: form.villageName,
      wardNumber: Number(form.wardNumber),
    });

    if (!res.ok) {
      setError(res.error || t.common.required);
      return;
    }

    toast.success(t.auth.registerSuccess);
    navigate('/citizen');
  };

  const inputCls =
    'w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30';

  return (
    <PublicLayout>
      <div className="max-w-lg mx-auto px-4 py-10 sm:py-14">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t.auth.registerTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.auth.registerSubtitle}
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-xs text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.auth.fullName}
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                className={inputCls}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.auth.email}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.auth.mobile}
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={form.mobile}
                  onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                  placeholder="9876543210"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.auth.villageName}
                </label>
                <input
                  type="text"
                  value={form.villageName}
                  onChange={(e) => setForm((f) => ({ ...f, villageName: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.auth.wardNumber}
                </label>
                <select
                  value={form.wardNumber}
                  onChange={(e) => setForm((f) => ({ ...f, wardNumber: e.target.value }))}
                  className={inputCls}
                >
                  {[1, 2, 3, 4, 5, 6].map((w) => (
                    <option key={w} value={String(w)}>
                      {t.common.wardPrefix} {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.auth.password}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.auth.confirmPassword}
                </label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              {t.auth.registerBtn}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-600 dark:text-slate-400">
            {t.auth.hasAccount}{' '}
            <Link
              to="/login"
              className="font-semibold text-[#14532D] dark:text-[#22C55E] hover:underline"
            >
              {t.nav.login}
            </Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
