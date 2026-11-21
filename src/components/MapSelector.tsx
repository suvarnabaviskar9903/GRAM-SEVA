import { Crosshair } from 'lucide-react';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

interface MapSelectorProps {
  latitude: number;
  longitude: number;
  onChange?: (lat: number, lng: number) => void;
  readOnly?: boolean;
  heightClass?: string;
}

function createPinIcon() {
  return L.divIcon({
    className: 'gram-seva-pin',
    html: `<div style="width:26px;height:26px;border-radius:9999px;background:#14532D;border:3px solid #ffffff;box-shadow:0 3px 10px rgba(0,0,0,0.35);"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

export function MapSelector({
  latitude,
  longitude,
  onChange,
  readOnly = false,
  heightClass = 'h-64',
}: MapSelectorProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [latitude, longitude],
      zoom: 15,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([latitude, longitude], {
      icon: createPinIcon(),
      draggable: !readOnly,
    }).addTo(map);

    if (!readOnly) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const nextLat = Number(e.latlng.lat.toFixed(6));
        const nextLng = Number(e.latlng.lng.toFixed(6));
        marker.setLatLng([nextLat, nextLng]);
        onChangeRef.current?.(nextLat, nextLng);
      });

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onChangeRef.current?.(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
      });
    }

    mapRef.current = map;
    markerRef.current = marker;

    const timer = window.setTimeout(() => {
      if (mapRef.current === map) {
        map.invalidateSize();
      }
    }, 200);

    return () => {
      window.clearTimeout(timer);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [readOnly]);

  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapRef.current.panTo([latitude, longitude], { animate: true });
    }
  }, [latitude, longitude]);

  const detectGps = () => {
    if (!navigator.geolocation) {
      toast.error(t.complaintForm.gpsUnavailable);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        onChange?.(lat, lng);
        toast.success(t.complaintForm.gpsDetected);
      },
      () => {
        toast.error(t.complaintForm.gpsUnavailable);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
          {t.common.coordinates}: {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </span>
        {!readOnly && (
          <button
            type="button"
            onClick={detectGps}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-[#14532D] dark:text-[#22C55E] hover:bg-[#F0FDF4] dark:hover:bg-emerald-950/40 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{t.complaintForm.detectGps}</span>
          </button>
        )}
      </div>
      <div
        ref={containerRef}
        className={`w-full ${heightClass} rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800`}
      />
    </div>
  );
}
