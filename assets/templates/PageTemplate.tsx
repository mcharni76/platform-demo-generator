/**
 * PageTemplate.tsx — Standard single-action page pattern.
 * Based on the proven UX from MISK and Imam University projects.
 *
 * Structure:
 *   1. Header zone (title + FeatureBadge + QueryTimeBadge + SqlPreviewButton + action button)
 *   2. ScenarioHeader (business context — always visible pre-load, collapses post-load)
 *   3. Empty state card (pre-load — contextual icon + CTA)
 *   4. Post-load visualization (charts/KPIs/tables — NEVER JSON.stringify)
 *
 * Button states:
 *   Initial:  Play icon  + action verb ("Run Benchmark", "Explore Platform")
 *   Loading:  Loader2 spinning + same label
 *   Loaded:   RefreshCw icon + "Refresh"
 *   NEVER: "Done", "Loaded ✓", "Complete"
 *
 * Replace ALL {placeholders} with domain-specific content.
 */

import { useState } from 'react'
import { Play, RefreshCw, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import ScenarioHeader from '../shared/ScenarioHeader'
// import ChartCard from '../shared/ChartCard'
// import KPIGrid from '../shared/KPIGrid'
// import PanelCard from '../shared/PanelCard'
// import QueryTimeBadge from '../shared/QueryTimeBadge'
// import SqlPreviewButton from '../shared/SqlPreviewButton'
// import FeatureBadge from '../shared/FeatureBadge'
// import { apiFetch } from '../../lib/api'

interface DataState<T> {
  loading: boolean
  data: T | null
  error: string | null
  ms: number | null
  sql: string | null
}

interface PageProps {
  presenterMode?: boolean
}

export default function PageTemplate({ presenterMode = false }: PageProps) {
  const [state, setState] = useState<DataState<any>>({
    loading: false, data: null, error: null, ms: null, sql: null,
  })

  const loaded = !!state.data
  const loading = state.loading

  const load = async () => {
    setState({ loading: true, data: null, error: null, ms: null, sql: null })
    try {
      // const res = await apiFetch<ResponseType>('/api/{endpoint}')
      const res = { rows: [], execution_time_ms: 42.5, sql: 'SELECT ...' }
      setState({ loading: false, data: res, error: null, ms: res.execution_time_ms, sql: res.sql })
    } catch (e) {
      setState({ loading: false, data: null, error: String(e), ms: null, sql: null })
    }
  }

  return (
    <div className="space-y-6">
      {/* === HEADER ZONE === */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{'{Page Title}'}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{'{One-line subtitle}'}</p>
          {/* <FeatureBadge feature="{Snowflake Feature}" /> */}
        </div>
        <div className="flex items-center gap-2">
          {/* Show timing + SQL only AFTER data loads */}
          {loaded && state.ms && (
            <span className="text-xs px-2 py-1 rounded bg-green-900/30 text-green-400 font-mono">
              {state.ms.toFixed(1)}ms
            </span>
          )}
          {/* {loaded && state.sql && <SqlPreviewButton sql={state.sql} />} */}

          {/* ACTION BUTTON — the only button on the page */}
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-{slug}-primary text-white text-sm font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : loaded
              ? <RefreshCw className="w-4 h-4" />
              : <Play className="w-4 h-4" />}
            {loaded ? 'Refresh' : '{Action Verb}'}
          </button>
        </div>
      </div>

      {/* === SCENARIO HEADER (business context) === */}
      <ScenarioHeader
        painPoint="{customer-specific pain point}"
        businessValue="{concrete business outcome}"
        snowflakeFeature="{Snowflake Feature Name}"
        expectedOutcome="{what to watch after clicking the button}"
        presenterMode={presenterMode}
        talkingPoint="{one-liner hook}"
        demoSteps={[
          "Click '{Action Verb}' — point out the query time",
          "{Highlight the key metric or chart}",
          "{Explain the Snowflake feature powering it}",
        ]}
        transition="{transition to next page}"
      />

      {/* === EMPTY STATE (pre-load) === */}
      {!loaded && !loading && (
        <div className="border border-dashed border-gray-700 rounded-xl p-10 text-center">
          {/* Use contextual icon: Database, BarChart3, GitBranch, Shield, etc. */}
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-{slug}-primary/10 flex items-center justify-center">
            <Play className="w-6 h-6 text-{slug}-primary/40" />
          </div>
          <p className="text-sm text-gray-500">
            Click <span className="font-bold text-{slug}-primary">{'{Action Verb}'}</span> to {'{describe what happens}'}
          </p>
        </div>
      )}

      {/* === LOADING STATE === */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-{slug}-primary" />
        </div>
      )}

      {/* === ERROR STATE === */}
      {state.error && (
        <div className="border border-red-500/30 bg-red-950/30 rounded-lg p-4 text-red-400 text-sm">
          {state.error}
        </div>
      )}

      {/* === POST-LOAD CONTENT (animated fade-in) ===
       * Use the correct visualization for this page:
       * - KPIGrid for summary metrics
       * - ChartCard for bar/line/area/pie charts
       * - DrillDownTable for clickable data tables
       * - DataQualityPanel for quality metrics
       * NEVER use JSON.stringify. NEVER show a "Done" button.
       */}
      {loaded && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* <KPIGrid kpis={formatKPIs(state.data)} /> */}
          {/* <ChartCard type="bar" data={state.data.rows} xKey="name" yKey="value" title="..." /> */}
        </motion.div>
      )}
    </div>
  )
}
