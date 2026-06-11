/**
 * NCIMCardPage.tsx — Pattern for independent-card pages (ML/AI, Masking, Classification)
 * Each card has its OWN state, load button, and results.
 * Cards are fully independent — loading one does NOT affect others.
 *
 * Replace: {cards_config}, {endpoints}
 */

import { useState } from 'react'
// import { apiFetch } from '../../lib/api'
// import SqlPreviewButton from '../shared/SqlPreviewButton'
// import QueryTimeBadge from '../shared/QueryTimeBadge'

interface CardState {
  loading: boolean
  data: any | null
  error: string | null
  ms: number | null
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

export default function NCIMCardPage() {
  const [cardStates, setCardStates] = useState<Record<string, CardState>>(
    Object.fromEntries(CARDS.map(c => [c.id, { loading: false, data: null, error: null, ms: null }]))
  )

  const loadCard = async (card: CardConfig) => {
    setCardStates(prev => ({
      ...prev,
      [card.id]: { loading: true, data: null, error: null, ms: null },
    }))
    try {
      // const res = await apiFetch(card.endpoint)
      const res = { result: `Data from ${card.title}`, execution_time_ms: 120.3 }
      setCardStates(prev => ({
        ...prev,
        [card.id]: { loading: false, data: res, error: null, ms: res.execution_time_ms },
      }))
    } catch (e) {
      setCardStates(prev => ({
        ...prev,
        [card.id]: { loading: false, data: null, error: String(e), ms: null },
      }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Business Scenario — always visible */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100">Business Scenario</h3>
        <p className="text-blue-800 dark:text-blue-200 mt-1">
          Each card demonstrates an independent capability. Run them in any order.
        </p>
      </div>

      {/* Independent Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {CARDS.map(card => {
          const state = cardStates[card.id]
          return (
            <div key={card.id} className="border rounded-lg p-4 dark:border-gray-700 space-y-3">
              <div>
                <h3 className="font-semibold">{card.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                  {card.feature}
                </span>
              </div>

              <button
                onClick={() => loadCard(card)}
                disabled={state.loading}
                className="w-full px-3 py-2 rounded bg-{slug}-primary text-white text-sm disabled:opacity-50"
              >
                {state.loading ? 'Running...' : state.data ? 'Run Again' : 'Run'}
              </button>

              {state.error && (
                <p className="text-red-500 text-sm">{state.error}</p>
              )}

              {state.data && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 text-xs">
                  {/* <QueryTimeBadge ms={state.ms} /> */}
                  <pre className="overflow-auto">{JSON.stringify(state.data, null, 2)}</pre>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
