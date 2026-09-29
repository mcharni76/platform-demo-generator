/**
 * TabCachePage.tsx — Pattern for multi-tab pages (Analytics, Quality, etc.)
 * Uses Partial<Record<TabKey, DataState>> to prevent re-fetch on tab switch.
 *
 * Button states per tab:
 *   Not loaded:  Play icon + "Load Data"
 *   Loading:     Loader2 spinning
 *   Loaded:      RefreshCw icon + "Refresh"
 *   NEVER: "Done", "Loaded ✓", "Complete"
 *
 * Green dot on tab label = cached (data already loaded for that tab).
 *
 * Replace: {tabs}, {endpoints}, {slug}
 */

import { useState } from 'react'
import { Play, RefreshCw, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import ScenarioHeader from '../shared/ScenarioHeader'
// import ChartCard from '../shared/ChartCard'
// import KPIGrid from '../shared/KPIGrid'
// import QueryTimeBadge from '../shared/QueryTimeBadge'
// import SqlPreviewButton from '../shared/SqlPreviewButton'
// import FeatureBadge from '../shared/FeatureBadge'
// import { apiFetch } from '../../lib/api'

type TabKey = 'tab1' | 'tab2' | 'tab3'

interface TabDataState {
  data: any | null
  ms: number | null
  sql: string | null
}

const TAB_CONFIG: Record<TabKey, { label: string; endpoint: string; feature: string; icon: string }> = {
  tab1: { label: 'First Tab', endpoint: '/api/page/tab1', feature: 'Feature A', icon: 'BarChart3' },
  tab2: { label: 'Second Tab', endpoint: '/api/page/tab2', feature: 'Feature B', icon: 'TrendingUp' },
  tab3: { label: 'Third Tab', endpoint: '/api/page/tab3', feature: 'Feature C', icon: 'PieChart' },
}

interface PageProps {
  presenterMode?: boolean
}

export default function TabCachePage({ presenterMode = false }: PageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('tab1')
  const [cache, setCache] = useState<Partial<Record<TabKey, TabDataState>>>({})
  const [loading, setLoading] = useState(false)

  const current = cache[activeTab]
  const loaded = !!current?.data

  const loadTab = async () => {
    setLoading(true)
    try {
      // const res = await apiFetch(TAB_CONFIG[activeTab].endpoint)
      const res = { rows: [], execution_time_ms: 55.2, sql: 'SELECT ...' }
      setCache(prev => ({
        ...prev,
        [activeTab]: { data: res, ms: res.execution_time_ms, sql: res.sql },
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* === HEADER ZONE === */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{'{Page Title}'}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{'{subtitle}'}</p>
          {/* <FeatureBadge feature="{Snowflake Feature}" /> */}
        </div>
        <div className="flex items-center gap-2">
          {loaded && current?.ms && (
            <span className="text-xs px-2 py-1 rounded bg-green-900/30 text-green-400 font-mono">
              {current.ms.toFixed(1)}ms
            </span>
          )}
          {/* {loaded && current?.sql && <SqlPreviewButton sql={current.sql} />} */}

          {/* ACTION BUTTON — Play → Spinner → Refresh */}
          <button
            onClick={loadTab}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-{slug}-primary text-white text-sm font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : loaded
              ? <RefreshCw className="w-4 h-4" />
              : <Play className="w-4 h-4" />}
            {loaded ? 'Refresh' : 'Load Data'}
          </button>
        </div>
      </div>

      {/* === SCENARIO HEADER === */}
      <ScenarioHeader
        painPoint="{pain point for this page}"
        businessValue="{business value}"
        snowflakeFeature="{feature}"
        expectedOutcome="{what to watch — e.g. 'Each tab shows a different view. Green dot = cached tab.'}"
        presenterMode={presenterMode}
        talkingPoint="{hook from catalog}"
        demoSteps={[
          "Load the first tab — point out the chart and key metric",
          "Switch to tab 2 — note the green dot (cached, no re-fetch)",
          "Switch to tab 3 — show a different analytical dimension",
        ]}
        transition="{transition to next page}"
      />

      {/* === TAB BAR === */}
      <div className="flex border-b border-gray-700">
        {(Object.keys(TAB_CONFIG) as TabKey[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-{slug}-primary text-{slug}-primary'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {TAB_CONFIG[tab].label}
            {cache[tab]?.data && <span className="ml-1.5 text-green-400 text-[8px]">●</span>}
          </button>
        ))}
      </div>

      {/* === EMPTY STATE (pre-load for current tab) === */}
      {!loaded && !loading && (
        <div className="border border-dashed border-gray-700 rounded-xl p-10 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-{slug}-primary/10 flex items-center justify-center">
            <Play className="w-6 h-6 text-{slug}-primary/40" />
          </div>
          <p className="text-sm text-gray-500">
            Click <span className="font-bold text-{slug}-primary">Load Data</span> to load the <span className="font-medium">{TAB_CONFIG[activeTab].label}</span> view
          </p>
        </div>
      )}

      {/* === LOADING STATE === */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-{slug}-primary" />
        </div>
      )}

      {/* === POST-LOAD (animated) ===
       * Use the correct visualization per tab:
       * - ChartCard for bar/line/area/pie charts
       * - KPIGrid for summary metrics
       * - DrillDownTable for clickable rows
       * NEVER use JSON.stringify. NEVER show a "Done" button.
       */}
      {loaded && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* <ChartCard type="bar" data={current.data.rows} xKey="name" yKey="value" title={TAB_CONFIG[activeTab].label} /> */}
        </motion.div>
      )}
    </div>
  )
}
