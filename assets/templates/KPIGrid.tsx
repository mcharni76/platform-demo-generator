/**
 * KPIGrid.tsx — KPI card grid for Platform Overview and summary pages.
 * Shows 3-6 large metric cards with label, value, trend arrow, and description.
 *
 * Usage: <KPIGrid kpis={[{ label: "Total Patients", value: "142,305", trend: "+12%", description: "Active records" }]} />
 */

interface KPI {
  label: string
  value: string | number
  trend?: string
  description?: string
  icon?: string
}

interface KPIGridProps {
  kpis: KPI[]
  columns?: 2 | 3 | 4
}

function formatValue(v: string | number): string {
  if (typeof v === 'number') {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`
    return v.toLocaleString()
  }
  return v
}

export default function KPIGrid({ kpis, columns = 3 }: KPIGridProps) {
  const colClass = columns === 2 ? 'grid-cols-2' : columns === 4 ? 'grid-cols-4' : 'grid-cols-3'

  return (
    <div className={`grid ${colClass} gap-4`}>
      {kpis.map((kpi, i) => (
        <div key={i} className="border border-gray-700 rounded-xl p-5 bg-gray-800/50 hover:bg-gray-800 transition-colors">
          <p className="text-sm text-gray-400 mb-1">{kpi.label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{formatValue(kpi.value)}</span>
            {kpi.trend && (
              <span className={`text-sm font-medium ${
                kpi.trend.startsWith('+') ? 'text-green-400' :
                kpi.trend.startsWith('-') ? 'text-red-400' : 'text-gray-400'
              }`}>
                {kpi.trend}
              </span>
            )}
          </div>
          {kpi.description && (
            <p className="text-xs text-gray-500 mt-2">{kpi.description}</p>
          )}
        </div>
      ))}
    </div>
  )
}
