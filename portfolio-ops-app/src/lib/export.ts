export const exportToCsv = <T extends Record<string, unknown>>(
  filename: string,
  data: T[],
  columns: { key: string; label: string }[]
) => {
  const header = columns.map((column) => column.label).join(',');
  const rows = data.map((row) =>
    columns
      .map((column) => {
        const value = row[column.key as keyof T];
        if (value === undefined || value === null) return '';
        const text = String(value).replace(/"/g, '""');
        return text.includes(',') ? `"${text}"` : text;
      })
      .join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
