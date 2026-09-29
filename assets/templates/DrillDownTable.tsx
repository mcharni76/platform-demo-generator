/**
 * DrillDownTable.tsx — Interactive table with row-click drill-down.
 * Supports 3 levels: summary → detail → individual record.
 * Used by Analytics page for regional drill-down.
 *
 * Usage:
 *   <DrillDownTable
 *     data={regions}
 *     columns={[{ key: 'region', label: 'Region' }, { key: 'count', label: 'Records' }]}
 *     onDrillDown={(row) => loadDetail(row.region_id)}
 *     drillLabel="View details →"
 *   />
 */

interface Column {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  format?: (value: any) => string
}

interface DrillDownTableProps {
  data: Record<string, any>[]
  columns: Column[]
  onDrillDown?: (row: Record<string, any>) => void
  drillLabel?: string
  title?: string
}

function defaultFormat(v: any): string {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'number') return v.toLocaleString()
  return String(v)
}

export default function DrillDownTable({
  data, columns, onDrillDown, drillLabel = 'Drill down →', title,
}: DrillDownTableProps) {
  return (
    <div className="border rounded-lg dark:border-gray-700 overflow-hidden">
      {title && (
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
          <h4 className="font-medium text-sm">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-800/50">
            {columns.map(col => (
              <th
                key={col.key}
                className={`px-4 py-2 font-medium text-gray-400 text-${col.align || 'left'}`}
              >
                {col.label}
              </th>
            ))}
            {onDrillDown && <th className="px-4 py-2 w-32" />}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={`border-t border-gray-800 hover:bg-gray-800/30 transition-colors ${
                onDrillDown ? 'cursor-pointer' : ''
              }`}
              onClick={() => onDrillDown?.(row)}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className={`px-4 py-2.5 text-${col.align || 'left'}`}
                >
                  {(col.format || defaultFormat)(row[col.key])}
                </td>
              ))}
              {onDrillDown && (
                <td className="px-4 py-2.5 text-right">
                  <span className="text-xs text-blue-400 hover:text-blue-300">{drillLabel}</span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="px-4 py-8 text-center text-gray-500 text-sm">
          No data loaded. Click "Load Data" above.
        </div>
      )}
    </div>
  )
}
