import { CheckCircle2, FilePlus2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useSearchParams } from 'react-router-dom';
import { ImageUploader } from '../components/ImageUploader';
import { MapSelector } from '../components/MapSelector';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { VILLAGE_CENTER } from '../data/seedData';
import { DashboardLayout } from '../layouts/DashboardLayout';
import type { Complaint, ComplaintPriority } from '../types';

export function SubmitComplaintPage() {
  const { user } = useAuth();
  const { categories, createComplaint } = useData();
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const preselectedCategory = searchParams.get('category') || categories[0]?.id || 'cat-road';

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(preselectedCategory);
  const [priority, setPriority] = useState<ComplaintPriority>('medium');
  const [villageArea, setVillageArea] = useState('');
  const [wardNumber, setWardNumber] = useState(String(user?.wardNumber || 1));
  const [landmark, setLandmark] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState(VILLAGE_CENTER[0]);
  const [longitude, setLongitude] = useState(VILLAGE_CENTER[1]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user) return;

    if (!title.trim() || !villageArea.trim() || !description.trim()) {
      setError(t.common.required);
      toast.error(t.common.required);
      return;
    }

    const created = createComplaint({
      userId: user.id,
      citizenName: user.fullName,
      citizenMobile: user.mobile,
      categoryId,
      title: title.trim(),
      description: description.trim(),
      priority,
      villageArea: villageArea.trim(),
      wardNumber: Number(wardNumber) || 1,
      landmark: landmark.trim(),
      latitude,
      longitude,
      imageUrl,
    });

    setSubmittedComplaint(created);
    toast.success(`${t.complaintForm.successTitle} (${created.referenceNumber})`);
  };

  const inputCls =
    'w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30';

  if (submittedComplaint) {
    return (
      <DashboardLayout
        title={t.complaintForm.pageTitle}
        subtitle={t.complaintForm.pageSubtitle}
      >
        <div className="max-w-xl mx-auto rounded-xl border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-900 p-8 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[#F0FDF4] dark:bg-emerald-950/60 text-[#14532D] dark:text-[#22C55E] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.complaintForm.successTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t.complaintForm.successRef}:{' '}
            <span className="font-mono font-bold text-[#14532D] dark:text-[#22C55E]">
              {submittedComplaint.referenceNumber}
            </span>
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={`/track?ref=${encodeURIComponent(submittedComplaint.referenceNumber)}`}
              className="px-5 py-2.5 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-sm font-semibold transition-colors"
            >
              {t.complaintForm.trackNow}
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmittedComplaint(null);
                setTitle('');
                setDescription('');
                setVillageArea('');
                setLandmark('');
                setImageUrl(null);
              }}
              className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              {t.nav.submitComplaint}
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={t.complaintForm.pageTitle}
      subtitle={t.complaintForm.pageSubtitle}
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6"
      >
        {error && (
          <div className="p-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-xs text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">
                {t.complaintForm.titleLabel} *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.complaintForm.titlePlaceholder}
                className={inputCls}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">
                  {t.complaintForm.categoryLabel}
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={inputCls}
                >
                  {categories
                    .filter((c) => c.isActive)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {language === 'mr' ? cat.nameMr : cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">
                  {t.complaintForm.priorityLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as ComplaintPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`h-10 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                        priority === p
                          ? 'bg-[#14532D] border-[#14532D] text-white dark:bg-[#22C55E] dark:border-[#22C55E] dark:text-slate-950'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {t.priority[p]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">
                  {t.complaintForm.areaLabel} *
                </label>
                <input
                  type="text"
                  value={villageArea}
                  onChange={(e) => setVillageArea(e.target.value)}
                  placeholder={t.complaintForm.areaPlaceholder}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">
                  {t.complaintForm.wardLabel}
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
              <div>
                <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">
                  {t.complaintForm.landmarkLabel}
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder={t.complaintForm.landmarkPlaceholder}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">
                {t.complaintForm.descLabel} *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.complaintForm.descPlaceholder}
                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30"
              />
            </div>

            <ImageUploader
              label={t.complaintForm.photoLabel}
              value={imageUrl}
              onChange={setImageUrl}
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
              {t.complaintForm.mapLabel}
            </label>
            <MapSelector
              latitude={latitude}
              longitude={longitude}
              onChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
              heightClass="h-[360px]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <Link
            to="/citizen"
            className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t.common.cancel}
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>{t.complaintForm.submitBtn}</span>
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
