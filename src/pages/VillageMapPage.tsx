import L from 'leaflet';
import { List, Map as MapIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComplaintCard } from '../components/ComplaintCard';
import { FilterPanel } from '../components/FilterPanel';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { VILLAGE_CENTER } from '../data/seedData';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PublicLayout } from '../layouts/PublicLayout';
import type { ComplaintStatus } from '../types';

const STATUS_COLORS: Record<ComplaintStatus, string> = {
  submitted: '#D97706',
  assigned: '#2563EB',
  in_progress: '#4F46E5',
  resolved: '#16A34A',
  rejected: '#DC2626',
};

export function VillageMapPage() {
  const { user } = useAuth();
  const { complaints, categories } = useData();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [wardFilter, setWardFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const invalidateTimerRef = useRef<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return complaints.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && c.categoryId !== categoryFilter) return false;
      if (wardFilter !== 'all' && String(c.wardNumber) !== wardFilter) return false;
      if (
        q &&
        !c.referenceNumber.toLowerCase().includes(q) &&
        !c.title.toLowerCase().includes(q) &&
        !c.villageArea.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [complaints, search, statusFilter, categoryFilter, wardFilter]);

  useEffect(() => {
    if (viewMode === 'list' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: VILLAGE_CENTER,
        zoom: 14,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      invalidateTimerRef.current = window.setTimeout(() => {
        if (mapInstanceRef.current === map) {
          map.invalidateSize();
        }
      }, 200);
    }

    const layer = markersLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    filtered.forEach((cmp) => {
      const color = STATUS_COLORS[cmp.status] || '#14532D';
      const icon = L.divIcon({
        className: 'gram-seva-marker',
        html: `<div style="width:22px;height:22px;border-radius:9999px;background:${color};border:3px solid #ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const cat = categories.find((c) => c.id === cmp.categoryId);
      const catLabel = cat ? (language === 'mr' ? cat.nameMr : cat.name) : '';

      const marker = L.marker([cmp.latitude, cmp.longitude], { icon }).addTo(layer);
      const popupEl = document.createElement('div');
      popupEl.style.minWidth = '200px';
      popupEl.innerHTML = `
        <div style="font-size:11px;font-family:monospace;font-weight:700;color:${color}">${cmp.referenceNumber}</div>
        <div style="font-size:13px;font-weight:600;margin-top:4px">${cmp.title.replace(/</g, '&lt;')}</div>
        <div style="font-size:11px;opacity:0.8;margin-top:4px">${t.common.wardPrefix} ${cmp.wardNumber} · ${catLabel}</div>
        <div style="font-size:11px;font-weight:600;margin-top:6px;color:${color}">${t.status[cmp.status]}</div>
      `;
      const btn = document.createElement('button');
      btn.textContent = t.common.viewDetails;
      btn.style.cssText =
        'margin-top:8px;padding:4px 10px;border-radius:6px;background:#14532D;color:#fff;font-size:11px;font-weight:600;border:none;cursor:pointer;';
      btn.onclick = () => navigate(`/track?ref=${encodeURIComponent(cmp.referenceNumber)}`);
      popupEl.appendChild(btn);

      marker.bindPopup(popupEl);
    });
  }, [filtered, viewMode, categories, language, navigate, t]);

  useEffect(() => {
    return () => {
      if (invalidateTimerRef.current !== null) {
        window.clearTimeout(invalidateTimerRef.current);
        invalidateTimerRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, [viewMode]);

  const content = (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
          {(['submitted', 'assigned', 'in_progress', 'resolved', 'rejected'] as ComplaintStatus[]).map(
            (st) => (
              <span key={st} className="inline-flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[st] }}
                />
                <span>{t.status[st]}</span>
              </span>
            )
          )}
        </div>

        <div className="inline-flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
              viewMode === 'split'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Map + List
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
              viewMode === 'map'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>
      </div>

      <FilterPanel
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        wardFilter={wardFilter}
        onWardChange={setWardFilter}
        onReset={() => {
          setSearch('');
          setStatusFilter('all');
          setCategoryFilter('all');
          setWardFilter('all');
        }}
      />

      <div className="grid lg:grid-cols-12 gap-5">
        {viewMode !== 'list' && (
          <div className={viewMode === 'map' ? 'lg:col-span-12' : 'lg:col-span-7'}>
            <div
              ref={mapContainerRef}
              className="w-full h-[520px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800"
            />
          </div>
        )}

        {viewMode !== 'map' && (
          <div
            className={`${
              viewMode === 'list'
                ? 'lg:col-span-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'lg:col-span-5 space-y-3 max-h-[520px] overflow-y-auto pr-1'
            }`}
          >
            {filtered.map((cmp) => (
              <ComplaintCard
                key={cmp.id}
                complaint={cmp}
                onSelect={(item) =>
                  navigate(`/track?ref=${encodeURIComponent(item.referenceNumber)}`)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (user) {
    return (
      <DashboardLayout title={t.nav.villageMap} subtitle={t.brand.panchayat}>
        {content}
      </DashboardLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t.nav.villageMap}
        </h1>
        {content}
      </div>
    </PublicLayout>
  );
}
