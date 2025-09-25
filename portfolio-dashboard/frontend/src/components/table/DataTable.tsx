import React from 'react';
import { Download } from 'lucide-react';

export type TableColumn = {
  key: string;
  label: string;
  numeric?: boolean;
};

export type TableRow = Record<string, string | number>;

function downloadBlob(filename: string, data: Blob) {
  const url = URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function toCsv(columns: TableColumn[], rows: TableRow[]) {
  const header = columns.map((column) => column.label).join(',');
  const lines = rows.map((row) => columns.map((column) => row[column.key]).join(','));
  return [header, ...lines].join('\n');
}

export type DataTableProps = {
  id: string;
  caption: string;
  columns: TableColumn[];
  rows: TableRow[];
};

export function DataTable({ id, caption, columns, rows }: DataTableProps) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <p style={{ margin: 0, fontWeight: 600 }}>{caption}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() =>
              downloadBlob(
                `${id}.csv`,
                new Blob([toCsv(columns, rows)], { type: 'text/csv;charset=utf-8;' })
              )
            }
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              borderRadius: 999,
              background: 'var(--surface-s1)',
              border: '1px solid var(--surface-border)',
            }}
          >
            <Download size={14} />
            CSV
          </button>
          <button
            type="button"
            onClick={() =>
              downloadBlob(
                `${id}.json`,
                new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' })
              )
            }
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              borderRadius: 999,
              background: 'var(--surface-s1)',
              border: '1px solid var(--surface-border)',
            }}
          >
            <Download size={14} />
            JSON
          </button>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="table" aria-labelledby={`${id}-caption`}>
          <caption id={`${id}-caption`} className="visually-hidden">
            {caption}
          </caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" style={{ textAlign: column.numeric ? 'right' : 'left' }}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${id}-row-${index}`} className="table-row-hover">
                {columns.map((column) => (
                  <td key={column.key} style={{ textAlign: column.numeric ? 'right' : 'left' }}>
                    {row[column.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-cards">
        {rows.map((row, index) => (
          <div key={`${id}-card-${index}`} className="table-card">
            {columns.map((column) => (
              <div key={column.key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--neutral-500)' }}>{column.label}</span>
                <span style={{ fontWeight: 600 }}>{row[column.key] as React.ReactNode}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
