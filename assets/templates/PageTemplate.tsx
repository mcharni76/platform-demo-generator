/**
 * PageTemplate.tsx — Standard page component pattern for platform demos.
 * Every page follows this exact structure:
 *   1. ScenarioHeader (business context — ALWAYS visible, domain-specific)
 *   2. Load button (NO auto-fetch)
 *   3. Visualization (chart/table/graph — NEVER JSON.stringify)
 *
 * Replace ALL {placeholders} with domain-specific content.
 * The ScenarioHeader props come from the research context story arcs.
 */

import { useState } from 'react'
import ScenarioHeader from '../shared/ScenarioHeader'
// import ChartCard from '../shared/ChartCard'
// import KPIGrid from '../shared/KPIGrid'
// import DrillDownTable from '../shared/DrillDownTable'
// import SqlPreviewButton from '../shared/SqlPreviewButton'
// import QueryTimeBadge from '../shared/QueryTimeBadge'
// import { apiFetch } from '../../lib/api'

interface DataState<T> {
  loading: boolean
  data: T | null
  error: string | null
  ms: number | null
}

interface PageTemplateProps {
  presenterMode?: boolean
}

export default function PageTemplate({ presenterMode = false }: PageTemplateProps) {
  const [state, setState] = useState<DataState<any>>({
    loading: false,
    data: null,
    error: null,
    ms: null,
  })

  const load = async () => {
    setState({ loading: true, data: null, error: null, ms: null })
    try {
      // const res = await apiFetch<ResponseType>('/api/{endpoint}')
      // setState({ loading: false, data: res, error: null, ms: res.execution_time_ms })
      setState({ loading: false, data: { placeholder: true }, error: null, ms: 42.5 })
    } catch (e) {
      setState({ loading: false, data: null, error: String(e), ms: null })
    }
  }

  return (
    <div className="space-y-6">
      {/* SCENARIO HEADER — mandatory on every page.
       * All props must be filled with domain-specific content from the research context.
       * Generic text like "This shows performance" is NOT acceptable.
       */}
      <ScenarioHeader
        painPoint="{customer_name} struggles with {specific pain point from research}."
        businessValue="{One-sentence business outcome: what changes for the customer after seeing this.}"
        snowflakeFeature="{Snowflake Feature Name}"
        expectedOutcome="{What the audience should see after clicking Load — be specific: '10M records in under 2 seconds' not 'fast query'}"
        presenterMode={presenterMode}
        talkingPoint="{The one-liner to say out loud — from demo-pages-catalog.md Demo Hook}"
        demoSteps={[
          "Click 'Load Data' — point out the query time badge",
          "{Highlight the key metric or chart — explain what it means for the customer}",
          "{Show the SQL preview — explain the Snowflake feature powering it}",
        ]}
        transition="{What to say before navigating to the next page — connects this page's story to the next}"
      />

      {/* Load Button */}
      <button
        onClick={load}
        disabled={state.loading}
        className="px-4 py-2 rounded bg-{slug}-primary text-white hover:opacity-90 disabled:opacity-50"
      >
        {state.loading ? 'Loading...' : 'Load Data'}
      </button>

      {/* Error */}
      {state.error && (
        <div className="text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded">
          {state.error}
        </div>
      )}

      {/* VISUALIZATION — use the right component for this page.
       * See generate/SKILL.md visualization rules for the page-to-component mapping.
       * NEVER use JSON.stringify. */}
      {state.data && (
        <div className="space-y-4">
          {/* <QueryTimeBadge ms={state.ms} /> */}
          {/* <SqlPreviewButton sql="SELECT ..." /> */}
          {/* <KPIGrid kpis={formatKPIs(state.data)} /> */}
          {/* <ChartCard type="bar" data={state.data.breakdown} xKey="category" yKey="count" title="Distribution" /> */}
        </div>
      )}
    </div>
  )
}
