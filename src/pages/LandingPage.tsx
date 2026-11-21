import {
  ArrowRight,
  ChevronDown,
  Droplets,
  HelpCircle,
  Landmark,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  Route,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  Waves,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { GENERATED_IMAGES } from '../data/seedData';
import { PublicLayout } from '../layouts/PublicLayout';
import { formatDate } from '../utils/helpers';

const CATEGORY_ICONS: Record<string, typeof Route> = {
  'road-problems': Route,
  'water-supply': Droplets,
  'garbage-collection': Trash2,
  'street-lights': Lightbulb,
  'drainage-problems': Waves,
  sanitation: Sparkles,
  'public-property': Landmark,
  other: Wrench,
};

export function LandingPage() {
  const { t, language } = useLanguage();
  const { categories, complaints, announcements, feedback } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactForm, setContactForm] = useState({ name: '', contact: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;
  const avgRating =
    feedback.length > 0
      ? (feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length).toFixed(1)
      : '4.8';

  const handleSubmitComplaintClick = (categoryId?: string) => {
    if (user?.role === 'citizen') {
      navigate(categoryId ? `/citizen/submit?category=${categoryId}` : '/citizen/submit');
    } else if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/staff');
    } else {
      navigate('/login?next=/citizen/submit');
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.contact.trim() || !contactForm.message.trim()) {
      toast.error(t.common.required);
      return;
    }
    setContactSent(true);
    toast.success(t.landing.contactFormSent);
    setContactForm({ name: '', contact: '', message: '' });
  };

  const faqs = [
    { q: t.landing.faq1Q, a: t.landing.faq1A },
    { q: t.landing.faq2Q, a: t.landing.faq2A },
    { q: t.landing.faq3Q, a: t.landing.faq3A },
    { q: t.landing.faq4Q, a: t.landing.faq4A },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-semibold tracking-wide text-[#166534] dark:text-[#22C55E]">
                {t.brand.panchayat} · {t.brand.portalTitle}
              </p>
              <h1
                className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12]"
                style={{ textWrap: 'balance' }}
              >
                {t.landing.heroTitle}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {t.landing.heroSubtitle}
              </p>
              <p className="mt-2 text-sm font-medium text-[#14532D] dark:text-[#22C55E]">
                {t.brand.tagline}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => handleSubmitComplaintClick()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>{t.landing.submitCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/track"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <span>{t.landing.trackCta}</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-72 sm:h-96 lg:h-full min-h-[320px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#F0FDF4] dark:bg-slate-900">
                <img
                  src={GENERATED_IMAGES.heroVillage}
                  alt={t.brand.panchayat}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                  <p className="text-xs font-medium text-emerald-300">
                    {t.brand.panchayat}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold">
                    {t.brand.tagline}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4-column KPI strip below Hero split */}
          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                {resolvedCount + 142}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                {t.landing.statsResolved}
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                36 hrs
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                {t.landing.statsResponse}
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                06 / 06
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                {t.landing.statsWards}
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-[#14532D] dark:text-[#22C55E] tabular-nums">
                {avgRating} / 5.0
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                {t.landing.statsSatisfaction}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complaint Categories */}
      <section id="services" className="py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.landing.categoriesTitle}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t.landing.categoriesSubtitle}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories
              .filter((c) => c.isActive)
              .map((cat) => {
                const Icon = CATEGORY_ICONS[cat.slug] || Wrench;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSubmitComplaintClick(cat.id)}
                    className="text-left p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#166534]/50 dark:hover:border-[#22C55E]/40 transition-colors cursor-pointer flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-[#F0FDF4] dark:bg-emerald-950/50 text-[#14532D] dark:text-[#22C55E] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                        {language === 'mr' ? cat.nameMr : cat.name}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {language === 'mr' ? cat.descriptionMr : cat.description}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#14532D] dark:text-[#22C55E]">
                      <span>{t.landing.submitCta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.landing.howTitle}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t.landing.howSubtitle}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: t.landing.step1Title, desc: t.landing.step1Desc },
              { title: t.landing.step2Title, desc: t.landing.step2Desc },
              { title: t.landing.step3Title, desc: t.landing.step3Desc },
              { title: t.landing.step4Title, desc: t.landing.step4Desc },
            ].map((step) => (
              <div
                key={step.title}
                className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900"
              >
                <h3 className="text-base font-semibold text-[#14532D] dark:text-[#22C55E]">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Village Development & Announcements */}
      <section id="about" className="py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t.landing.devTitle}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                {t.landing.devSubtitle}
              </p>
              <div className="pt-2 space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t.landing.devPoint1Title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    {t.landing.devPoint1Desc}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t.landing.devPoint2Title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    {t.landing.devPoint2Desc}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <img
                  src={GENERATED_IMAGES.waterStation}
                  alt={t.landing.devPoint1Title}
                  referrerPolicy="no-referrer"
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <p className="text-xs font-medium text-[#166534] dark:text-[#22C55E]">
                    {t.common.wardPrefix} 1–6
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {t.landing.devPoint1Title}
                  </p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <img
                  src={GENERATED_IMAGES.resolvedRoad}
                  alt={t.landing.devPoint2Title}
                  referrerPolicy="no-referrer"
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <p className="text-xs font-medium text-[#166534] dark:text-[#22C55E]">
                    {t.common.wardPrefix} 2 · {t.status.resolved}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {t.landing.devPoint2Title}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div>
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t.landing.announcementsTitle}
              </h2>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                {t.landing.announcementsSubtitle}
              </p>
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {announcements.map((ann) => (
                <article
                  key={ann.id}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between gap-3"
                >
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {language === 'mr' ? ann.categoryMr : ann.category} ·{' '}
                      {formatDate(ann.date, language)}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
                      {language === 'mr' ? ann.titleMr : ann.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {language === 'mr' ? ann.summaryMr : ann.summary}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + Contact */}
      <section className="py-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 text-[#14532D] dark:text-[#22C55E]">
              <HelpCircle className="w-5 h-5" />
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t.landing.faqTitle}
              </h2>
            </div>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              {t.landing.faqSubtitle}
            </p>

            <div className="mt-6 divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl bg-[#F8FAFC] dark:bg-slate-900">
              {faqs.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={item.q}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div id="contact" className="lg:col-span-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.landing.contactTitle}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              {t.landing.contactSubtitle}
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900">
                <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#14532D] dark:text-[#22C55E]" />
                  <span>{t.landing.officeAddressLabel}</span>
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.landing.officeAddress}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900">
                <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#14532D] dark:text-[#22C55E]" />
                  <span>{t.landing.helplineLabel}</span>
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">{t.landing.helpline}</p>
                <p className="mt-1 text-slate-500 dark:text-slate-400">{t.landing.officeHours}</p>
              </div>
            </div>

            <form
              onSubmit={handleContactSubmit}
              className="mt-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900 space-y-3.5"
            >
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder={t.landing.contactFormName}
                  className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30"
                />
                <input
                  type="text"
                  value={contactForm.contact}
                  onChange={(e) => setContactForm((f) => ({ ...f, contact: e.target.value }))}
                  placeholder={t.landing.contactFormEmail}
                  className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30"
                />
              </div>
              <textarea
                rows={3}
                value={contactForm.message}
                onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                placeholder={t.landing.contactFormMessage}
                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30"
              />
              <div className="flex items-center justify-between gap-3">
                {contactSent ? (
                  <p className="text-xs font-medium text-[#14532D] dark:text-[#22C55E]">
                    {t.landing.contactFormSent}
                  </p>
                ) : (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>helpdesk@gramseva.gov.in</span>
                  </span>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.landing.contactFormSend}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="py-10 bg-[#F8FAFC] dark:bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#14532D] dark:text-[#22C55E] font-bold text-base">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.brand.name}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {t.brand.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-slate-600 dark:text-slate-400">
            <Link to="/track" className="hover:text-slate-900 dark:hover:text-white">
              {t.nav.trackComplaint}
            </Link>
            <Link to="/map" className="hover:text-slate-900 dark:hover:text-white">
              {t.nav.villageMap}
            </Link>
            <Link to="/login" className="hover:text-slate-900 dark:hover:text-white">
              {t.nav.login}
            </Link>
            <Link to="/register" className="hover:text-slate-900 dark:hover:text-white">
              {t.nav.register}
            </Link>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} {t.brand.panchayat}. {t.landing.footerRights}
          </p>
        </div>
      </footer>
    </PublicLayout>
  );
}
