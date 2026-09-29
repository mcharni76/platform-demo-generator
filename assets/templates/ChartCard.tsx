/**
 * ChartCard.tsx — Reusable chart visualization component using Recharts.
 * Every page that shows data trends, comparisons, or distributions MUST use this
 * instead of JSON.stringify. Supports: bar, line, area, pie.
 *
 * Dependencies: recharts (in package.json)
 * Usage: <ChartCard type="bar" data={data} xKey="region" yKey="count" title="By Region" />
 */

import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const COLORS = [
  '#29B5E8', '#6366F1', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#06B6D4',
]

interface ChartCardProps {
  type: 'bar' | 'line' | 'area' | 'pie'
  data: Record<string, any>[]
  xKey: string
  yKey: string | string[]
  title: string
  height?: number
  colors?: string[]
}

export default function ChartCard({
  type, data, xKey, yKey, title, height = 320, colors = COLORS,
}: ChartCardProps) {
  const yKeys = Array.isArray(yKey) ? yKey : [yKey]

  return (
    <div className="border rounded-lg p-4 dark:border-gray-700">
      <h4 className="font-medium text-sm mb-3">{title}</h4>
      <ResponsiveContainer width="100%" height={height}>
        {type === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
            <Legend />
            {yKeys.map((key, i) => (
              <Bar key={key} dataKey={key} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        ) : type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
            <Legend />
            {yKeys.map((key, i) => (
              <Line key={key} type="monotone" dataKey={key} stroke={colors[i % colors.length]} strokeWidth={2} dot={{ r: 3 }} />
            ))}
          </LineChart>
        ) : type === 'area' ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
            {yKeys.map((key, i) => (
              <Area key={key} type="monotone" dataKey={key} fill={colors[i % colors.length]} fillOpacity={0.3} stroke={colors[i % colors.length]} />
            ))}
          </AreaChart>
        ) : (
          <PieChart>
            <Pie data={data} dataKey={yKeys[0]} nameKey={xKey} cx="50%" cy="50%" outerRadius={height / 3} label>
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
