import { Plus, RotateCcw, Star } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import type { Category, Department } from '../types';
import { formatDate } from '../utils/helpers';

export function AdminStaffPage() {
  const { profiles, staffDetails, departments, addStaffMember, toggleUserActive } = useData();
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    departmentId: departments[0]?.id || '',
    designation: '',
    designationMr: '',
    assignedWard: 'Ward 1, Ward 2',
  });

  const staffUsers = profiles.filter((p) => p.role === 'staff');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !/^\d{10}$/.test(form.mobile.trim())) {
      toast.error(t.auth.invalidMobile);
      return;
    }
    addStaffMember(form);
    toast.success(t.common.save);
    setOpen(false);
    setForm({
      fullName: '',
      email: '',
      mobile: '',
      departmentId: departments[0]?.id || '',
      designation: '',
      designationMr: '',
      assignedWard: 'Ward 1, Ward 2',
    });
  };

  return (
    <DashboardLayout
      title={t.admin.staffListTitle}
      actions={
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.admin.addStaff}</span>
        </button>
      }
    >
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <th className="py-3 px-4">{t.auth.fullName}</th>
              <th className="py-3 px-4">{t.common.department}</th>
              <th className="py-3 px-4">{t.common.ward}</th>
              <th className="py-3 px-4">{t.auth.mobile}</th>
              <th className="py-3 px-4">{t.common.status}</th>
              <th className="py-3 px-4 text-right">{t.common.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {staffUsers.map((s) => {
              const detail = staffDetails.find((sd) => sd.userId === s.id);
              const dept = departments.find((d) => d.id === detail?.departmentId);
              return (
                <tr key={s.id}>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{s.fullName}</p>
                    <p className="text-xs text-slate-500">
                      {language === 'mr' ? detail?.designationMr : detail?.designation}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-300">
                    {dept ? (language === 'mr' ? dept.nameMr : dept.name) : '-'}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">
                    {detail?.assignedWard || `${t.common.wardPrefix} ${s.wardNumber}`}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs tabular-nums">{s.mobile}</td>
                  <td className="py-3 px-4 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded-md border font-medium ${
                        s.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      }`}
                    >
                      {s.isActive ? t.common.active : t.common.inactive}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleUserActive(s.id)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      {t.admin.toggleStatus}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={t.admin.addStaff}>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder={t.auth.fullName}
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
            />
            <input
              type="email"
              placeholder={t.auth.email}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
            />
            <input
              type="tel"
              maxLength={10}
              placeholder={t.auth.mobile}
              value={form.mobile}
              onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
              className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
            />
            <select
              value={form.departmentId}
              onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))}
              className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {language === 'mr' ? d.nameMr : d.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Designation (English)"
              value={form.designation}
              onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
              className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
            />
            <input
              type="text"
              placeholder="Assigned Wards (e.g., Ward 1, Ward 2)"
              value={form.assignedWard}
              onChange={(e) => setForm((f) => ({ ...f, assignedWard: e.target.value }))}
              className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#14532D] text-white text-xs font-semibold cursor-pointer"
            >
              {t.common.save}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

export function AdminCitizensPage() {
  const { profiles, complaints, toggleUserActive } = useData();
  const { t, language } = useLanguage();
  const citizens = profiles.filter((p) => p.role === 'citizen');

  return (
    <DashboardLayout title={t.admin.citizenListTitle}>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <th className="py-3 px-4">{t.auth.fullName}</th>
              <th className="py-3 px-4">{t.auth.email}</th>
              <th className="py-3 px-4">{t.auth.mobile}</th>
              <th className="py-3 px-4">{t.common.ward}</th>
              <th className="py-3 px-4">{t.nav.complaints}</th>
              <th className="py-3 px-4">{t.common.date}</th>
              <th className="py-3 px-4 text-right">{t.common.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {citizens.map((c) => {
              const count = complaints.filter((cmp) => cmp.userId === c.id).length;
              return (
                <tr key={c.id}>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    {c.fullName}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">
                    {c.email}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs tabular-nums">{c.mobile}</td>
                  <td className="py-3 px-4 text-xs tabular-nums">
                    {t.common.wardPrefix} {c.wardNumber}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs tabular-nums">{count}</td>
                  <td className="py-3 px-4 text-xs text-slate-500 tabular-nums">
                    {formatDate(c.createdAt, language)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleUserActive(c.id)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer"
                    >
                      {c.isActive ? t.common.active : t.common.inactive}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export function AdminDepartmentsPage() {
  const { departments, saveDepartment } = useData();
  const { t, language } = useLanguage();
  const [editing, setEditing] = useState<Partial<Department> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.name?.trim()) {
      toast.error(t.common.required);
      return;
    }
    saveDepartment({
      id: editing.id,
      name: editing.name.trim(),
      nameMr: editing.nameMr?.trim() || editing.name.trim(),
      headName: editing.headName?.trim() || 'Gram Sevak',
      contactNumber: editing.contactNumber?.trim() || '9822000000',
      description: editing.description?.trim() || '',
      descriptionMr: editing.descriptionMr?.trim() || editing.description?.trim() || '',
      isActive: editing.isActive ?? true,
    });
    toast.success(t.common.save);
    setEditing(null);
  };

  return (
    <DashboardLayout
      title={t.admin.deptListTitle}
      actions={
        <button
          type="button"
          onClick={() => setEditing({ isActive: true })}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#14532D] text-white text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.admin.addDepartment}</span>
        </button>
      }
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((d) => (
          <div
            key={d.id}
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between gap-4"
          >
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {language === 'mr' ? d.nameMr : d.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {d.headName} · {d.contactNumber}
              </p>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'mr' ? d.descriptionMr : d.description}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-medium text-[#14532D] dark:text-[#22C55E]">
                {d.isActive ? t.common.active : t.common.inactive}
              </span>
              <button
                type="button"
                onClick={() => setEditing(d)}
                className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:underline cursor-pointer"
              >
                {t.common.edit}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={t.admin.addDepartment}>
        {editing && (
          <form onSubmit={handleSave} className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Department Name (English)"
                value={editing.name || ''}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
              />
              <input
                type="text"
                placeholder="विभागाचे नाव (मराठी)"
                value={editing.nameMr || ''}
                onChange={(e) => setEditing({ ...editing, nameMr: e.target.value })}
                className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
              />
              <input
                type="text"
                placeholder="Department Head"
                value={editing.headName || ''}
                onChange={(e) => setEditing({ ...editing, headName: e.target.value })}
                className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
              />
              <input
                type="text"
                placeholder={t.auth.mobile}
                value={editing.contactNumber || ''}
                onChange={(e) => setEditing({ ...editing, contactNumber: e.target.value })}
                className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
              />
            </div>
            <textarea
              rows={3}
              placeholder={t.common.description}
              value={editing.description || ''}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#14532D] text-white text-xs font-semibold cursor-pointer"
              >
                {t.common.save}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  );
}

export function AdminCategoriesPage() {
  const { categories, departments, saveCategory } = useData();
  const { t, language } = useLanguage();
  const [editing, setEditing] = useState<Partial<Category> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.name?.trim()) {
      toast.error(t.common.required);
      return;
    }
    saveCategory({
      id: editing.id,
      slug: editing.slug || editing.name.toLowerCase().replace(/\s+/g, '-'),
      name: editing.name.trim(),
      nameMr: editing.nameMr?.trim() || editing.name.trim(),
      description: editing.description?.trim() || '',
      descriptionMr: editing.descriptionMr?.trim() || editing.description?.trim() || '',
      defaultDepartmentId: editing.defaultDepartmentId || departments[0]?.id || '',
      isActive: editing.isActive ?? true,
    });
    toast.success(t.common.save);
    setEditing(null);
  };

  return (
    <DashboardLayout
      title={t.admin.catListTitle}
      actions={
        <button
          type="button"
          onClick={() => setEditing({ isActive: true, defaultDepartmentId: departments[0]?.id })}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#14532D] text-white text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.admin.addCategory}</span>
        </button>
      }
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between gap-3"
          >
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {language === 'mr' ? cat.nameMr : cat.name}
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
                {language === 'mr' ? cat.descriptionMr : cat.description}
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-[#14532D] dark:text-[#22C55E]">
                {cat.isActive ? t.common.active : t.common.inactive}
              </span>
              <button
                type="button"
                onClick={() => setEditing(cat)}
                className="text-xs font-semibold hover:underline cursor-pointer"
              >
                {t.common.edit}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={t.admin.addCategory}>
        {editing && (
          <form onSubmit={handleSave} className="space-y-3">
            <input
              type="text"
              placeholder="Category Name (English)"
              value={editing.name || ''}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
            />
            <input
              type="text"
              placeholder="तक्रार प्रकार (मराठी)"
              value={editing.nameMr || ''}
              onChange={(e) => setEditing({ ...editing, nameMr: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
            />
            <select
              value={editing.defaultDepartmentId || ''}
              onChange={(e) => setEditing({ ...editing, defaultDepartmentId: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {language === 'mr' ? d.nameMr : d.name}
                </option>
              ))}
            </select>
            <textarea
              rows={2}
              placeholder={t.common.description}
              value={editing.description || ''}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#14532D] text-white text-xs font-semibold cursor-pointer"
              >
                {t.common.save}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  );
}

export function AdminFeedbackPage() {
  const { feedback } = useData();
  const { t, language } = useLanguage();

  return (
    <DashboardLayout title={t.admin.feedbackListTitle}>
      {feedback.length === 0 ? (
        <EmptyState title={t.common.noData} />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {feedback.map((f) => (
            <div
              key={f.id}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-[#14532D] dark:text-[#22C55E]">
                  {f.referenceNumber}
                </span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`w-4 h-4 ${
                        n <= f.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">{f.comment}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {f.citizenName} · {formatDate(f.createdAt, language)}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export function AdminSettingsPage() {
  const { resetDemoData } = useData();
  const { t } = useLanguage();

  return (
    <DashboardLayout title={t.admin.settingsTitle}>
      <div className="max-w-2xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          {t.brand.panchayat}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t.brand.portalTitle} · {t.brand.tagline}
        </p>
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.admin.resetDemoData}
          </p>
          <button
            type="button"
            onClick={() => {
              resetDemoData();
              toast.success(t.admin.resetConfirm);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.admin.resetDemoData}</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
