import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { PublicLayout } from '../layouts/PublicLayout';

export function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error(t.common.required);
      return;
    }
    setSent(true);
    toast.success(t.auth.resetSent);
  };

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto px-4 py-14">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t.auth.forgotTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.auth.forgotSubtitle}
          </p>

          {sent ? (
            <div className="mt-6 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-[#F0FDF4] dark:bg-emerald-950/40 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#14532D] dark:text-[#22C55E] shrink-0 mt-0.5" />
              <p className="text-sm text-slate-800 dark:text-slate-200">{t.auth.resetSent}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.auth.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {t.auth.sendResetBtn}
              </button>
            </form>
          )}

          <Link
            to="/login"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#14532D] dark:text-[#22C55E] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.nav.login}</span>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
