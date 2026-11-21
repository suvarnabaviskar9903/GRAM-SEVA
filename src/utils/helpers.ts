import type { Complaint, Language } from '../types';

export function formatDate(isoString: string, lang: Language): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat(lang === 'mr' ? 'mr-IN' : 'en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString: string, lang: Language): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat(lang === 'mr' ? 'mr-IN' : 'en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function generateReferenceNumber(existingCount: number): string {
  const year = new Date().getFullYear();
  const seq = String(101 + existingCount + Math.floor(Math.random() * 5)).padStart(4, '0');
  return `GS-${year}-${seq}`;
}

export function exportComplaintsToCsv(complaints: Complaint[], filename = 'gram-seva-complaints.csv') {
  const headers = [
    'Reference Number',
    'Title',
    'Citizen Name',
    'Mobile',
    'Ward',
    'Village Area',
    'Priority',
    'Status',
    'Created At',
    'Resolved At',
  ];

  const escapeCell = (val: unknown) => {
    const str = String(val ?? '');
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = complaints.map((c) => [
    c.referenceNumber,
    c.title,
    c.citizenName,
    c.citizenMobile,
    `Ward ${c.wardNumber}`,
    c.villageArea,
    c.priority,
    c.status,
    c.createdAt,
    c.resolvedAt || '',
  ]);

  const csvContent = [headers, ...rows].map((row) => row.map(escapeCell).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
