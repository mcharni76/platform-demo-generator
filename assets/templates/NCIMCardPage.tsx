/**
 * NCIMCardPage.tsx — Pattern for independent-card pages (ML/AI, Masking, Classification)
 * Each card has its OWN state, load button, and results.
 * Cards are fully independent — loading one does NOT affect others.
 *
 * Button states per card:
 *   Not loaded:  Play icon + "Run"
 *   Loading:     Loader2 spinning + "Running..."
 *   Loaded:      RefreshCw icon + "Re-run"
 *   NEVER: "Done", "Complete", "Finished"
 *
 * Post-load: each card shows chart/KPI/table — NEVER JSON.stringify
 *
 * Replace: {cards_config}, {endpoints}, {slug}
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

interface CardState {
  data: any | null
  error: string | null
  ms: number | null
  sql: string | null
}

interface CardConfig {
  id: string
  title: string
  description: string
  endpoint: string
  feature: string
}

const CARDS: CardConfig[] = [
  { id: 'card1', title: 'Card 1 Title', description: 'What this demonstrates', endpoint: '/api/page/card1', feature: 'FEATURE_1' },
  { id: 'card2', title: 'Card 2 Title', description: 'What this demonstrates', endpoint: '/api/page/card2', feature: 'FEATURE_2' },
  { id: 'card3', title: 'Card 3 Title', description: 'What this demonstrates', endpoint: '/api/page/card3', feature: 'FEATURE_3' },
]

interface PageProps {
  presenterMode?: boolean
}

export default function NCIMCardPage({ presenterMode = false }: PageProps) {
  const [cardStates, setCardStates] = useState<Record<string, CardState>>(
    Object.fromEntries(CARDS.map(c => [c.id, { data: null, error: null, ms: null, sql: null }]))
  )
  const [loadingCard, setLoadingCard] = useState<string | null>(null)

  const loadCard = async (card: CardConfig) => {
    setLoadingCard(card.id)
    try {
      // const res = await apiFetch(card.endpoint)
      const res = { result: 'chart data', execution_time_ms: 120.3, sql: 'SELECT ...' }
      setCardStates(prev => ({
        ...prev,
        [card.id]: { data: res, error: null, ms: res.execution_time_ms, sql: res.sql },
      }))
    } catch (e) {
      setCardStates(prev => ({
        ...prev,
        [card.id]: { data: null, error: String(e), ms: null, sql: null },
      }))
    }
    setLoadingCard(null)
  }

  return (
    <div className="space-y-6">
      {/* === HEADER ZONE === */}
      <div>
        <h2 className="text-xl font-bold">{'{Page Title}'}</h2>
        <p className="text-sm text-gray-400 mt-0.5">{'{subtitle — e.g. "Run each capability independently"}'}</p>
      </div>

      {/* === SCENARIO HEADER === */}
      <ScenarioHeader
        painPoint="{pain point}"
        businessValue="{business value}"
        snowflakeFeature="{feature}"
        expectedOutcome="{what to watch — e.g. 'Each card demonstrates an independent capability. Run them in any order.'}"
        presenterMode={presenterMode}
        talkingPoint="{hook from catalog}"
        demoSteps={[
          "Run Card 1 — {explain what it shows}",
          "Run Card 2 — {explain what it shows}",
          "Run Card 3 — {explain what it shows}",
        ]}
        transition="{transition to next page}"
      />

      {/* === INDEPENDENT CARDS === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {CARDS.map(card => {
          const state = cardStates[card.id]
          const isLoading = loadingCard === card.id
          const loaded = !!state.data

          return (
            <div key={card.id} className="border border-gray-700 rounded-xl p-5 space-y-4">
              {/* Card header */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{card.title}</h3>
                  <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-{slug}-primary/10 text-{slug}-primary rounded">
                    {card.feature}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{card.description}</p>
              </div>

              {/* Card action button — Play → Spinner → Refresh */}
              <button
                onClick={() => loadCard(card)}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-{slug}-primary text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-50"
              >
                {isLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : loaded
                  ? <RefreshCw className="w-4 h-4" />
                  : <Play className="w-4 h-4" />}
                {isLoading ? 'Running...' : loaded ? 'Re-run' : 'Run'}
              </button>

              {/* Error state */}
              {state.error && (
                <div className="text-red-400 text-xs bg-red-950/30 rounded p-2">
                  {state.error}
                </div>
              )}

              {/* Post-load result — NEVER JSON.stringify
               * Use the correct visualization for this card:
               * - ChartCard for bar/line/area/pie
               * - KPIGrid for key metrics
               * - Styled table for tabular data
               */}
              {loaded && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  {state.ms && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-900/30 text-green-400 font-mono">
                      {state.ms.toFixed(1)}ms
                    </span>
                  )}
                  {/* <ChartCard type="bar" data={state.data.rows} xKey="name" yKey="value" title={card.title} /> */}
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
