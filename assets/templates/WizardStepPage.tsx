/**
 * WizardStepPage.tsx — Pattern for step-by-step demo pages (Time Travel, Recovery)
 * Fetches ALL steps at once, reveals them one-by-one on the client.
 * NEVER makes a per-step API call on reveal.
 *
 * Replace: {endpoint}, {steps_description}
 */

import { useState } from 'react'
import ScenarioHeader from '../shared/ScenarioHeader'
// import { apiFetch } from '../../lib/api'
// import SqlPreviewButton from '../shared/SqlPreviewButton'

interface Step {
  title: string
  description: string
  sql: string
  result: any
  status: 'success' | 'warning' | 'error'
}

export default function WizardStepPage({ presenterMode = false }: { presenterMode?: boolean }) {
  const [steps, setSteps] = useState<Step[]>([])
  const [visibleCount, setVisibleCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const startDemo = async () => {
    setLoading(true)
    try {
      // Fetch ALL steps at once
      // const res = await apiFetch<{ steps: Step[] }>('/api/{endpoint}/demo')
      const res = {
        steps: [
          { title: 'Step 1', description: 'Insert test data', sql: 'INSERT INTO ...', result: { rows_affected: 10 }, status: 'success' as const },
          { title: 'Step 2', description: 'Verify data exists', sql: 'SELECT COUNT(*) ...', result: { count: 10 }, status: 'success' as const },
          { title: 'Step 3', description: 'Corrupt data', sql: 'UPDATE ... SET ...', result: { rows_affected: 10 }, status: 'warning' as const },
          { title: 'Step 4', description: 'Restore via Time Travel', sql: 'INSERT INTO ... SELECT ... AT(OFFSET => -60)', result: { restored: 10 }, status: 'success' as const },
        ],
      }
      setSteps(res.steps)
      setVisibleCount(1) // Reveal first step
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const nextStep = () => {
    if (visibleCount < steps.length) {
      setVisibleCount(prev => prev + 1)
    }
  }

  const reset = () => {
    setSteps([])
    setVisibleCount(0)
  }

  return (
    <div className="space-y-6">
      {/* Scenario Header — domain-specific, NEVER generic */}
      <ScenarioHeader
        painPoint="{pain point — e.g. 'Data corruption can happen anytime. Without point-in-time recovery, production data is lost.'}"
        businessValue="{value — e.g. 'Restore any table to any point in time — no backup infrastructure, no DBA.'}"
        snowflakeFeature="{feature — e.g. 'Time Travel / AT(OFFSET) / BEFORE'}"
        expectedOutcome="{outcome — e.g. 'Watch as we corrupt data, then restore it to the exact state before corruption — in seconds.'}"
        presenterMode={presenterMode}
        talkingPoint="{hook from catalog}"
        demoSteps={[
          "Click 'Start Demo' — all steps are fetched at once",
          "Click 'Next Step' to reveal each step — explain what happened",
          "At the final step, point out the restored data matches the original",
        ]}
        transition="{transition to next page}"
      />

      {/* Controls */}
      <div className="flex gap-3">
        {steps.length === 0 ? (
          <button onClick={startDemo} disabled={loading} className="px-4 py-2 rounded bg-green-600 text-white">
            {loading ? 'Preparing...' : 'Start Demo'}
          </button>
        ) : (
          <>
            <button
              onClick={nextStep}
              disabled={visibleCount >= steps.length}
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
            >
              Next Step ({visibleCount}/{steps.length})
            </button>
            <button onClick={reset} className="px-4 py-2 rounded bg-gray-600 text-white">
              Reset
            </button>
          </>
        )}
      </div>

      {/* Progress Bar */}
      {steps.length > 0 && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${(visibleCount / steps.length) * 100}%` }}
          />
        </div>
      )}

      {/* Steps revealed one by one */}
      <div className="space-y-4">
        {steps.slice(0, visibleCount).map((step, i) => (
          <div
            key={i}
            className={`border rounded-lg p-4 ${
              step.status === 'success' ? 'border-green-300 bg-green-50 dark:bg-green-950' :
              step.status === 'warning' ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-950' :
              'border-red-300 bg-red-50 dark:bg-red-950'
            }`}
          >
            <h4 className="font-medium">{step.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
            {/* <SqlPreviewButton sql={step.sql} /> */}
            <pre className="text-xs mt-2 bg-gray-800 text-green-400 p-2 rounded">
              {JSON.stringify(step.result, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}
