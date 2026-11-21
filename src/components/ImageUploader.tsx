import { ImagePlus, Trash2 } from 'lucide-react';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

interface ImageUploaderProps {
  label: string;
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  hint?: string;
}

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageUploader({ label, value, onChange, hint }: ImageUploaderProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_BYTES) {
      toast.error(t.complaintForm.invalidImage);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
        {label}
      </label>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
          <img
            src={value}
            alt={label}
            referrerPolicy="no-referrer"
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 text-white text-xs font-medium hover:bg-red-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.common.delete}</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full py-7 px-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#166534] dark:hover:border-[#22C55E] bg-slate-50/70 dark:bg-slate-900/50 flex flex-col items-center justify-center gap-2 text-center transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F0FDF4] dark:bg-emerald-950/60 text-[#14532D] dark:text-[#22C55E] flex items-center justify-center">
            <ImagePlus className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {label}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {hint || t.complaintForm.photoHint}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}
