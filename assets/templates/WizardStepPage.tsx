/**
 * WizardStepPage.tsx — Pattern for step-by-step demo pages (Time Travel, Recovery)
 * Fetches ALL steps at once, reveals them one-by-one on the client.
 * NEVER makes a per-step API call on reveal.
 *
 * Button states:
 *   Not started:    Play icon + "Start Demo"
 *   Loading:        Loader2 spinning + "Preparing..."
 *   In progress:    "Next Step (2/4)" — reveals one more step
 *   All revealed:   CheckCircle + "All steps completed!" + "Reset Demo" button
 *   NEVER: "Done" button
 *
 * Replace: {endpoint}, {slug}, scenario content
 */

import { useState } from 'react'
import { Play, Loader2, ChevronRight, RotateCcw, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ScenarioHeader from '../shared/ScenarioHeader'
// import SqlPreviewButton from '../shared/SqlPreviewButton'
// import QueryTimeBadge from '../shared/QueryTimeBadge'
// import { apiFetch } from '../../lib/api'

interface Step {
  title: string
  description: string
  sql: string
  result: Record<string, any>
  status: 'success' | 'warning' | 'error'
}

interface PageProps {
  presenterMode?: boolean
}

export default function WizardStepPage({ presenterMode = false }: PageProps) {
  const [steps, setSteps] = useState<Step[]>([])
  const [visibleCount, setVisibleCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [ms, setMs] = useState<number | null>(null)

  const allRevealed = steps.length > 0 && visibleCount >= steps.length
  const started = steps.length > 0

  const startDemo = async () => {
    setLoading(true)
    try {
      // const res = await apiFetch<{ steps: Step[], execution_time_ms: number }>('/api/{endpoint}/demo')
      const res = {
        execution_time_ms: 312.5,
        steps: [
          { title: 'Step 1', description: 'Insert test data', sql: 'INSERT INTO ...', result: { rows_affected: 10 }, status: 'success' as const },
          { title: 'Step 2', description: 'Verify data exists', sql: 'SELECT COUNT(*) ...', result: { count: 10 }, status: 'success' as const },
          { title: 'Step 3', description: 'Corrupt data', sql: 'UPDATE ... SET ...', result: { rows_affected: 10 }, status: 'warning' as const },
          { title: 'Step 4', description: 'Restore via Time Travel', sql: 'INSERT INTO ... SELECT ... AT(OFFSET => -60)', result: { restored: 10 }, status: 'success' as const },
        ],
      }
      setSteps(res.steps)
      setMs(res.execution_time_ms)
      setVisibleCount(1)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const nextStep = () => {
    if (visibleCount < steps.length) setVisibleCount(prev => prev + 1)
  }

  const reset = () => {
    setSteps([])
    setVisibleCount(0)
    setMs(null)
  }

  const STATUS_STYLES = {
    success: 'border-green-600/30 bg-green-950/30',
    warning: 'border-amber-600/30 bg-amber-950/30',
    error: 'border-red-600/30 bg-red-950/30',
  }
  const STATUS_DOTS = { success: 'bg-green-400', warning: 'bg-amber-400', error: 'bg-red-400' }

  return (
    <div className="space-y-6">
      {/* === HEADER ZONE === */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{'{Page Title}'}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{'{subtitle}'}</p>
        </div>
        <div className="flex items-center gap-2">
          {ms && (
            <span className="text-xs px-2 py-1 rounded bg-green-900/30 text-green-400 font-mono">
              {ms.toFixed(1)}ms
            </span>
          )}

          {!started ? (
            <button
              onClick={startDemo}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-{slug}-primary text-white text-sm font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {loading ? 'Preparing...' : 'Start Demo'}
            </button>
          ) : allRevealed ? (
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white text-sm font-bold rounded-lg hover:bg-gray-600 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Demo
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-4 py-2 bg-{slug}-primary text-white text-sm font-bold rounded-lg hover:opacity-90 transition"
            >
              <ChevronRight className="w-4 h-4" />
              Next Step ({visibleCount}/{steps.length})
            </button>
          )}
        </div>
      </div>

      {/* === SCENARIO HEADER === */}
      <ScenarioHeader
        painPoint="{pain point}"
        businessValue="{business value}"
        snowflakeFeature="{feature — e.g. 'Time Travel / AT(OFFSET) / BEFORE'}"
        expectedOutcome="{what to watch}"
        presenterMode={presenterMode}
        talkingPoint="{hook from catalog}"
        demoSteps={[
          "Click 'Start Demo' — all steps are fetched at once",
          "Click 'Next Step' to reveal each step — explain what happened",
          "At the final step, point out the restored data matches the original",
        ]}
        transition="{transition to next page}"
      />

      {/* === EMPTY STATE (pre-start) === */}
      {!started && !loading && (
        <div className="border border-dashed border-gray-700 rounded-xl p-10 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-{slug}-primary/10 flex items-center justify-center">
            <Play className="w-6 h-6 text-{slug}-primary/40" />
          </div>
          <p className="text-sm text-gray-500">
            Click <span className="font-bold text-{slug}-primary">Start Demo</span> to begin the step-by-step walkthrough
          </p>
        </div>
      )}

      {/* === LOADING STATE === */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-{slug}-primary" />
        </div>
      )}

      {/* === PROGRESS BAR === */}
      {started && (
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div
            className="bg-{slug}-primary h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(visibleCount / steps.length) * 100}%` }}
          />
        </div>
      )}

      {/* === STEPS (revealed progressively with animation) === */}
      <AnimatePresence>
        {steps.slice(0, visibleCount).map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`border rounded-lg p-4 ${STATUS_STYLES[step.status]}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${STATUS_DOTS[step.status]}`} />
              <h4 className="font-medium text-sm">{step.title}</h4>
              {/* <SqlPreviewButton sql={step.sql} /> */}
            </div>
            <p className="text-sm text-gray-400 mb-2">{step.description}</p>
            <div className="text-xs font-mono bg-gray-900/50 rounded p-2 text-gray-300 overflow-x-auto">
              {/* Render step.result as key-value pairs, not raw JSON */}
              {Object.entries(step.result).map(([k, v]) => (
                <div key={k}>
                  <span className="text-gray-500">{k}:</span> <span className="text-green-400">{String(v)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* === ALL COMPLETE indicator (not a "Done" button — just a status message + reset) === */}
      {allRevealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-green-400 text-sm font-medium"
        >
          <CheckCircle className="w-4 h-4" />
          All steps completed!
        </motion.div>
      )}
    </div>
  )
}
