import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80 p-0.5 shrink-0"
      role="group"
      aria-label="Language switcher"
    >
      {!compact && (
        <Languages className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ml-2 mr-1 hidden sm:block" />
      )}
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
          language === 'en'
            ? 'bg-white dark:bg-slate-900 text-[#14532D] dark:text-[#22C55E] shadow-xs'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('mr')}
        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
          language === 'mr'
            ? 'bg-white dark:bg-slate-900 text-[#14532D] dark:text-[#22C55E] shadow-xs'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        मराठी
      </button>
    </div>
  );
}
