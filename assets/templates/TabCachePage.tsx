/**
 * TabCachePage.tsx — Pattern for multi-tab pages (Analytics, Quality, etc.)
 * Uses Partial<Record<TabKey, DataState>> to prevent re-fetch on tab switch.
 *
 * Replace: {tabs}, {endpoints}
 */

import { useState } from 'react'
// import { apiFetch } from '../../lib/api'

type TabKey = 'tab1' | 'tab2' | 'tab3'

interface TabDataState {
  loading: boolean
  data: any | null
  error: string | null
  ms: number | null
}

const TAB_CONFIG: Record<TabKey, { label: string; endpoint: string; feature: string }> = {
  tab1: { label: 'First Tab', endpoint: '/api/page/tab1', feature: 'Feature A' },
  tab2: { label: 'Second Tab', endpoint: '/api/page/tab2', feature: 'Feature B' },
  tab3: { label: 'Third Tab', endpoint: '/api/page/tab3', feature: 'Feature C' },
}

export default function TabCachePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('tab1')
  const [tabData, setTabData] = useState<Partial<Record<TabKey, TabDataState>>>({})

  const loadTab = async (tab: TabKey) => {
    // Skip if already loaded (cache hit)
    if (tabData[tab]?.data) return

    setTabData(prev => ({ ...prev, [tab]: { loading: true, data: null, error: null, ms: null } }))
    try {
      // const res = await apiFetch(TAB_CONFIG[tab].endpoint)
      const res = { placeholder: true, execution_time_ms: 55.2 }
      setTabData(prev => ({
        ...prev,
        [tab]: { loading: false, data: res, error: null, ms: res.execution_time_ms },
      }))
    } catch (e) {
      setTabData(prev => ({
        ...prev,
        [tab]: { loading: false, data: null, error: String(e), ms: null },
      }))
    }
  }

  const current = tabData[activeTab]

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {(Object.keys(TAB_CONFIG) as TabKey[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-{slug}-primary text-{slug}-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {TAB_CONFIG[tab].label}
            {tabData[tab]?.data && <span className="ml-1 text-green-500">●</span>}
          </button>
        ))}
      </div>

      {/* Load Button for Current Tab */}
      <button
        onClick={() => loadTab(activeTab)}
        disabled={current?.loading}
        className="px-4 py-2 rounded bg-{slug}-primary text-white disabled:opacity-50"
      >
        {current?.loading ? 'Loading...' : current?.data ? 'Loaded ✓' : 'Load Data'}
      </button>

      {/* Tab Content */}
      {current?.data && (
        <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
          {JSON.stringify(current.data, null, 2)}
        </pre>
      )}
    </div>
  )
}
