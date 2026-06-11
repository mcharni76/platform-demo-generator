/**
 * App.tsx — Main application shell for platform demos.
 * Contains: page router, sidebar, header, theme, guided mode.
 *
 * Replace: {slug}, {display_name}, {brand_color}
 * Expand: Add all 17 page components to PAGE_MAP
 */

import { useState, useEffect } from 'react'

// --- Page imports (add all 17) ---
// import PagePlatform from './components/pages/PagePlatform'
// import PagePerformance from './components/pages/PagePerformance'
// ... (all 17 pages)

// --- Shared components ---
// import Header from './components/shared/Header'
// import Sidebar from './components/shared/Sidebar'

// --- Page Map ---
type PageId = 'architecture' | 'platform' | 'performance' | 'analytics' |
  'ml-ai' | 'time-travel' | 'recovery' | 'cortex-ai' | 'lineage' |
  'quality' | 'optimization' | 'pricing' | 'dynamic-tables' |
  'policy-intelligence' | 'data-masking' | 'data-classification' | `ask-{slug}`

// const PAGE_MAP: Record<PageId, React.FC> = {
//   'architecture': PageArchitecture,
//   'platform': PagePlatform,
//   ... (all 17)
// }

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('platform')
  const [darkMode, setDarkMode] = useState(true)

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
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* <Header
        title="{display_name} Data Platform"
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
      /> */}
      <div className="flex">
        {/* <Sidebar
          activePage={activePage}
          onPageChange={setActivePage}
        /> */}
        <main className="flex-1 p-6">
          {/* <ActiveComponent /> */}
          <p>Platform Demo — {activePage}</p>
        </main>
      </div>
    </div>
  )
}
