/**
 * DataQualityPanel.tsx — Quality metrics visualization for the Data Quality page.
 * Shows quality scores as colored gauges/bars, not tables.
 * Highlights issues (nulls, duplicates, stale data) with severity indicators.
 *
 * Usage:
 *   <DataQualityPanel metrics={[
 *     { table: "PATIENTS", metric: "null_rate", value: 0.03, threshold: 0.05, status: "pass" },
 *     { table: "PATIENTS", metric: "duplicate_rate", value: 0.08, threshold: 0.01, status: "fail" },
 *   ]} />
 */

interface QualityMetric {
  table: string
  metric: string
  value: number
  threshold: number
  status: 'pass' | 'warn' | 'fail'
  details?: string
}

interface DataQualityPanelProps {
  metrics: QualityMetric[]
}

function metricLabel(m: string): string {
  const labels: Record<string, string> = {
    null_rate: 'Null Rate',
    duplicate_rate: 'Duplicate Rate',
    freshness_hours: 'Freshness (hours)',
    row_count: 'Row Count',
    completeness: 'Completeness',
    uniqueness: 'Uniqueness',
  }
  return labels[m] || m
}

function statusColor(s: string): { bg: string; text: string; bar: string } {
  if (s === 'pass') return { bg: 'bg-green-900/30', text: 'text-green-400', bar: 'bg-green-500' }
  if (s === 'warn') return { bg: 'bg-yellow-900/30', text: 'text-yellow-400', bar: 'bg-yellow-500' }
  return { bg: 'bg-red-900/30', text: 'text-red-400', bar: 'bg-red-500' }
}

export default function DataQualityPanel({ metrics }: DataQualityPanelProps) {
  const tables = [...new Set(metrics.map(m => m.table))]
  const failCount = metrics.filter(m => m.status === 'fail').length
  const warnCount = metrics.filter(m => m.status === 'warn').length

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="flex gap-4 text-sm">
        <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400">
          {metrics.filter(m => m.status === 'pass').length} passing
        </span>
        {warnCount > 0 && (
          <span className="px-3 py-1 rounded-full bg-yellow-900/30 text-yellow-400">
            {warnCount} warnings
          </span>
        )}
        {failCount > 0 && (
          <span className="px-3 py-1 rounded-full bg-red-900/30 text-red-400 font-semibold">
            {failCount} failures
          </span>
        )}
      </div>

      {/* Per-table metrics */}
      {tables.map(table => (
        <div key={table} className="border border-gray-700 rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
            <span className="font-mono text-sm text-gray-300">{table}</span>
          </div>
          <div className="divide-y divide-gray-800">
            {metrics.filter(m => m.table === table).map((m, i) => {
              const c = statusColor(m.status)
              const pct = Math.min(m.value / Math.max(m.threshold * 2, 1), 1) * 100
              return (
                <div key={i} className={`px-4 py-3 ${c.bg}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{metricLabel(m.metric)}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-mono font-bold ${c.text}`}>
                        {typeof m.value === 'number' && m.value < 1
                          ? `${(m.value * 100).toFixed(1)}%`
                          : m.value.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        threshold: {m.threshold < 1 ? `${(m.threshold * 100).toFixed(1)}%` : m.threshold}
                      </span>
                    </div>
                  </div>
                  {/* Visual bar */}
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${c.bar} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  {m.details && <p className="text-xs text-gray-500 mt-1">{m.details}</p>}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
