/**
 * PageTemplate.tsx — Standard page component pattern for platform demos.
 * Every page follows this exact structure:
 *   1. HeroSection with feature badge
 *   2. Business Scenario box (always visible, never gated)
 *   3. Load button (NO auto-fetch)
 *   4. Results with SqlPreviewButton + DataPreview
 *
 * Replace: {feature}, {endpoint}, {business_scenario}
 */

import { useState } from 'react'
// import HeroSection from '../shared/HeroSection'
// import SqlPreviewButton from '../shared/SqlPreviewButton'
// import DataPreview from '../shared/DataPreview'
// import QueryTimeBadge from '../shared/QueryTimeBadge'
// import { apiFetch } from '../../lib/api'

interface DataState<T> {
  loading: boolean
  data: T | null
  error: string | null
  ms: number | null
}

export default function PageTemplate() {
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
      {/* Hero Section */}
      {/* <HeroSection
        title="Page Title"
        subtitle="One-line business benefit"
        feature="{Snowflake Feature Name}"
      /> */}

      {/* Business Scenario — ALWAYS visible, never behind a load button */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100">Business Scenario</h3>
        <p className="text-blue-800 dark:text-blue-200 mt-1">
          {/* {business_scenario_text} */}
          Describe the real-world problem this page solves for the customer.
        </p>
      </div>

      {/* Load Button — MANDATORY, no auto-fetch */}
      <button
        onClick={load}
        disabled={state.loading}
        className="px-4 py-2 rounded bg-{slug}-primary text-white hover:opacity-90 disabled:opacity-50"
      >
        {state.loading ? 'Loading...' : 'Load Data'}
      </button>

      {/* Results */}
      {state.error && (
        <div className="text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded">
          {state.error}
        </div>
      )}

      {state.data && (
        <div className="space-y-4">
          {/* <QueryTimeBadge ms={state.ms} /> */}
          {/* <SqlPreviewButton sql="SELECT ..." /> */}
          {/* <DataPreview data={state.data} /> */}
          <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
            {JSON.stringify(state.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
