export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
    ...options,
  }).format(value);
}

export function downloadAs(type: 'csv' | 'json', filename: string, rows: Record<string, unknown>[]) {
  if (typeof window === 'undefined') return;
  let blob: Blob;
  if (type === 'json') {
    blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
  } else {
    const headers = Object.keys(rows[0] ?? {});
    const csvLines = [headers.join(',')];
    for (const row of rows) {
      csvLines.push(headers.map((key) => JSON.stringify(row[key] ?? '')).join(','));
    }
    blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  }
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.rel = 'noopener';
  link.click();
  URL.revokeObjectURL(link.href);
}
