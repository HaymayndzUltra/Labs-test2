interface DataTableProps {
  columns: string[];
  rows: (string | number)[][];
  caption?: string;
}

export function DataTable({ columns, rows, caption }: DataTableProps) {
  return (
    <table className="chart-table" role="table">
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {columns.map((column) => (
            <th scope="col" key={column}>
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
