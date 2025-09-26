interface DataTableProps {
  columns: string[];
  rows: (string | number)[][];
  caption?: string;
  numericColumns?: number[];
  footer?: (string | number)[];
  variant?: 'data' | 'chart';
}

export function DataTable({ columns, rows, caption, numericColumns = [], footer, variant = 'data' }: DataTableProps) {
  return (
    <table className={variant === 'chart' ? 'data-table data-table--chart' : 'data-table'} role="table">
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th scope="col" key={column} className={numericColumns.includes(index) ? 'is-numeric' : undefined}>
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className={numericColumns.includes(cellIndex) ? 'is-numeric' : undefined}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {footer && (
        <tfoot>
          <tr>
            {footer.map((cell, index) => (
              <td key={index} className={numericColumns.includes(index) ? 'is-numeric' : undefined}>
                {cell}
              </td>
            ))}
          </tr>
        </tfoot>
      )}
    </table>
  );
}
