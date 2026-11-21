import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DashboardLayout } from '../layouts/DashboardLayout';

export function ProfilePage() {
  const { user, updateCurrentUser } = useAuth();
  const { t } = useLanguage();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [villageName, setVillageName] = useState(user?.villageName || 'Shrirampur');
  const [wardNumber, setWardNumber] = useState(String(user?.wardNumber || 1));

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !/^\d{10}$/.test(mobile.trim())) {
      toast.error(t.auth.invalidMobile);
      return;
    }
    updateCurrentUser({
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      villageName: villageName.trim(),
      wardNumber: Number(wardNumber),
    });
    toast.success(t.profilePage.saveSuccess);
  };

  const inputCls =
    'w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30';

  return (
    <DashboardLayout title={t.profilePage.title} subtitle={t.profilePage.subtitle}>
      <form
        onSubmit={handleSave}
        className="max-w-2xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              {user.fullName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
          <span className="px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-semibold text-[#14532D] dark:text-[#22C55E]">
            {t.roles[user.role]}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.auth.fullName}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.auth.villageName}
            </label>
            <input
              type="text"
              value={villageName}
              onChange={(e) => setVillageName(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.auth.wardNumber}
            </label>
            <select
              value={wardNumber}
              onChange={(e) => setWardNumber(e.target.value)}
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

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            {t.common.save}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
