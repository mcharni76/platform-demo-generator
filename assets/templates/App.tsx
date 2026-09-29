/**
 * App.tsx — Main application shell for platform demos.
 * Contains: page router, sidebar, header, theme toggle, presenter mode toggle.
 *
 * Presenter Mode: when ON, every page shows inline talking points, demo steps,
 * and transition text in a purple panel. When OFF (default), only the business
 * context (pain point, value, outcome) is visible.
 *
 * Replace: {slug}, {display_name}, {brand_color}
 * Expand: Add all selected page components to PAGE_MAP
 */

import { useState, useEffect, createContext, useContext } from 'react'

// --- Presenter Mode Context ---
// Passed to all pages so ScenarioHeader knows whether to show presenter notes.
export const PresenterModeContext = createContext(false)
export const usePresenterMode = () => useContext(PresenterModeContext)

// --- Page imports (add all selected pages) ---
// import PagePlatform from './components/pages/PagePlatform'
// import PagePerformance from './components/pages/PagePerformance'
// ... (all selected pages)

// --- Shared components ---
// import Header from './components/shared/Header'
// import Sidebar from './components/shared/Sidebar'

// --- Scenarios (from scenarios.ts) ---
// import { SCENARIOS } from './lib/scenarios'

// --- Page Map ---
// type PageId = 'platform' | 'performance' | 'analytics' | ...
// const PAGE_MAP: Record<PageId, React.FC<{ presenterMode: boolean }>> = {
//   'platform': PagePlatform,
//   'performance': PagePerformance,
//   ... (all selected pages)
// }

type PageId = string

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('platform')
  const [darkMode, setDarkMode] = useState(true)
  const [presenterMode, setPresenterMode] = useState(false)

  // Listen for custom navigation events (from Architecture page nodes)
  useEffect(() => {
    const handler = (e: CustomEvent) => setActivePage(e.detail as PageId)
    window.addEventListener('{slug}:navigate', handler as EventListener)
    return () => window.removeEventListener('{slug}:navigate', handler as EventListener)
  }, [])

  // Apply dark mode class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // const ActiveComponent = PAGE_MAP[activePage]

  return (
    <PresenterModeContext.Provider value={presenterMode}>
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        {/* Header with presenter mode toggle */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-900/95 backdrop-blur">
          <div className="flex items-center gap-3">
            {/* Logo placeholder */}
            <div className="w-8 h-8 rounded bg-{slug}-primary flex items-center justify-center text-white font-bold text-sm">
              {'{display_name}'[0]}
            </div>
            <h1 className="text-lg font-semibold">{'{display_name}'} Data Platform</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Presenter Mode toggle */}
            <button
              onClick={() => setPresenterMode(!presenterMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                presenterMode
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-gray-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${presenterMode ? 'bg-purple-400' : 'bg-gray-600'}`} />
              Presenter Mode
            </button>
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1.5 rounded-lg text-xs bg-gray-800 text-gray-400 border border-gray-700"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar placeholder */}
          {/* <Sidebar activePage={activePage} onPageChange={setActivePage} presenterMode={presenterMode} /> */}

          <main className="flex-1 p-6 max-w-7xl mx-auto">
            {/* Pass presenterMode to the active page */}
            {/* <ActiveComponent presenterMode={presenterMode} /> */}
            <p>Platform Demo — {activePage}</p>
          </main>
        </div>
      </div>
    </PresenterModeContext.Provider>
  )
}
