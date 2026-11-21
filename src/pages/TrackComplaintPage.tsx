import { MapPin, Search, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { ComplaintTimeline } from '../components/ComplaintTimeline';
import { EmptyState } from '../components/EmptyState';
import { MapSelector } from '../components/MapSelector';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PublicLayout } from '../layouts/PublicLayout';
import { formatDateTime } from '../utils/helpers';

export function TrackComplaintPage() {
  const { user } = useAuth();
  const { complaints, categories, departments, profiles, updates, feedback, submitFeedback } =
    useData();
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialRef = searchParams.get('ref') || complaints[0]?.referenceNumber || 'GS-2026-0101';
  const [query, setQuery] = useState(initialRef);
  const [activeRef, setActiveRef] = useState(initialRef);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const paramRef = searchParams.get('ref');
    if (paramRef) {
      setQuery(paramRef);
      setActiveRef(paramRef);
    }
  }, [searchParams]);

  const complaint = complaints.find(
    (c) => c.referenceNumber.toLowerCase() === activeRef.trim().toLowerCase()
  );

  const category = complaint
    ? categories.find((c) => c.id === complaint.categoryId)
    : undefined;
  const department = complaint?.departmentId
    ? departments.find((d) => d.id === complaint.departmentId)
    : undefined;
  const staff = complaint?.assignedTo
    ? profiles.find((p) => p.id === complaint.assignedTo)
    : undefined;
  const complaintUpdates = complaint
    ? updates
        .filter((u) => u.complaintId === complaint.id)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    : [];
  const existingFeedback = complaint
    ? feedback.find((f) => f.complaintId === complaint.id)
    : undefined;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setActiveRef(query.trim());
    setSearchParams({ ref: query.trim() });
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;
    if (!comment.trim()) {
      toast.error(t.common.required);
      return;
    }
    submitFeedback({
      complaintId: complaint.id,
      referenceNumber: complaint.referenceNumber,
      userId: user?.id || complaint.userId,
      citizenName: user?.fullName || complaint.citizenName,
      rating,
      comment: comment.trim(),
    });
    toast.success(t.tracking.feedbackSubmitted);
    setComment('');
  };

  const body = (
    <div className="space-y-6">
      <form
        onSubmit={handleLookup}
        className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      >
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.tracking.lookupPlaceholder}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30"
          />
        </div>
        <button
          type="submit"
          className="h-10 px-5 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          {t.tracking.lookupBtn}
        </button>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {complaints.slice(0, 4).map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => {
                setQuery(sample.referenceNumber);
                setActiveRef(sample.referenceNumber);
                setSearchParams({ ref: sample.referenceNumber });
              }}
              className={`px-2.5 py-1 rounded-md border font-mono cursor-pointer transition-colors ${
                activeRef.toLowerCase() === sample.referenceNumber.toLowerCase()
                  ? 'border-[#14532D] bg-[#F0FDF4] text-[#14532D] dark:border-[#22C55E] dark:bg-emerald-950/40 dark:text-[#22C55E]'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {sample.referenceNumber}
            </button>
          ))}
        </div>
      </form>

      {!complaint ? (
        <EmptyState title={t.tracking.notFound} />
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono font-bold text-[#14532D] dark:text-[#22C55E]">
                      {complaint.referenceNumber}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {category ? (language === 'mr' ? category.nameMr : category.name) : ''}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {t.tracking.submittedOn}: {formatDateTime(complaint.createdAt, language)}
                    </span>
                  </div>
                  <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                    {complaint.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={complaint.status} />
                  <PriorityBadge priority={complaint.priority} />
                </div>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {complaint.description}
              </p>

              <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <p className="text-slate-500 dark:text-slate-400">{t.common.location}</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#166534] dark:text-[#22C55E]" />
                    <span>
                      {t.common.wardPrefix} {complaint.wardNumber} · {complaint.villageArea}
                    </span>
                  </p>
                  {complaint.landmark && (
                    <p className="mt-0.5 text-slate-500">{complaint.landmark}</p>
                  )}
                </div>

                <div>
                  <p className="text-slate-500 dark:text-slate-400">{t.common.department}</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {department
                      ? language === 'mr'
                        ? department.nameMr
                        : department.name
                      : t.common.unassigned}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-slate-400">{t.common.assignedStaff}</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {staff ? staff.fullName : t.common.unassigned}
                  </p>
                </div>
              </div>

              {complaint.adminRemarks && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.tracking.adminRemarks}
                  </p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {complaint.adminRemarks}
                  </p>
                </div>
              )}

              {complaint.resolutionDetails && (
                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-[#F0FDF4]/80 dark:bg-emerald-950/30">
                  <p className="text-xs font-semibold text-[#14532D] dark:text-[#22C55E]">
                    {t.tracking.resolutionDetails}
                  </p>
                  <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                    {complaint.resolutionDetails}
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
                {t.tracking.timelineTitle}
              </h3>
              <ComplaintTimeline
                status={complaint.status}
                updates={complaintUpdates}
                rejectionReason={complaint.rejectionReason}
              />
            </div>

            {complaint.status === 'resolved' && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  {t.tracking.feedbackTitle}
                </h3>
                {existingFeedback ? (
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {t.tracking.yourRating}
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={`w-4 h-4 ${
                              n <= existingFeedback.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {existingFeedback.comment}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {t.tracking.feedbackPrompt}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setRating(n)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              n <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t.tracking.feedbackPlaceholder}
                      className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-xs font-semibold cursor-pointer"
                    >
                      {t.tracking.submitFeedback}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t.common.location}
              </h3>
              <MapSelector
                latitude={complaint.latitude}
                longitude={complaint.longitude}
                readOnly
                heightClass="h-56"
              />
            </div>

            {(complaint.imageUrl || complaint.beforePhotoUrl || complaint.resolutionPhoto) && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {t.tracking.beforeAfterTitle}
                </h3>
                {(complaint.beforePhotoUrl || complaint.imageUrl) && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {t.common.beforePhoto}
                    </p>
                    <img
                      src={complaint.beforePhotoUrl || complaint.imageUrl || ''}
                      alt={t.common.beforePhoto}
                      referrerPolicy="no-referrer"
                      className="w-full h-44 object-cover rounded-lg border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                )}
                {complaint.resolutionPhoto && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-[#14532D] dark:text-[#22C55E]">
                      {t.common.afterPhoto}
                    </p>
                    <img
                      src={complaint.resolutionPhoto}
                      alt={t.common.afterPhoto}
                      referrerPolicy="no-referrer"
                      className="w-full h-44 object-cover rounded-lg border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (user) {
    return (
      <DashboardLayout title={t.tracking.pageTitle} subtitle={t.tracking.pageSubtitle}>
        {body}
      </DashboardLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t.tracking.pageTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.tracking.pageSubtitle}
          </p>
        </div>
        {body}
      </div>
    </PublicLayout>
  );
}
