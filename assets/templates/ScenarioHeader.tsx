/**
 * ScenarioHeader.tsx — Business context block that appears at the TOP of every page.
 * This is NOT optional. Every page MUST use this component.
 *
 * It tells the presenter AND the audience:
 * - WHAT business problem this page solves (pain point)
 * - WHY it matters to the customer (business value)
 * - WHAT Snowflake feature powers it (feature badge)
 * - WHAT to look for after loading data (expected outcome)
 *
 * In Presenter Mode (toggled in App.tsx), it also shows:
 * - Talking point (the one-liner to say out loud)
 * - Demo steps (what to click, in what order)
 * - Transition (what to say before moving to the next page)
 *
 * Replace: all {placeholders} with domain-specific content from research context
 */

interface ScenarioHeaderProps {
  /** The customer pain point this page addresses */
  painPoint: string
  /** One-sentence business value statement */
  businessValue: string
  /** The Snowflake feature being demonstrated */
  snowflakeFeature: string
  /** What the audience should observe after data loads */
  expectedOutcome: string
  /** Presenter-only: the hook to say out loud */
  talkingPoint?: string
  /** Presenter-only: step-by-step demo instructions */
  demoSteps?: string[]
  /** Presenter-only: transition to next page */
  transition?: string
  /** Whether presenter mode is active (from App.tsx context) */
  presenterMode?: boolean
}

export default function ScenarioHeader({
  painPoint,
  businessValue,
  snowflakeFeature,
  expectedOutcome,
  talkingPoint,
  demoSteps,
  transition,
  presenterMode = false,
}: ScenarioHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Feature badge — always visible */}
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
          {snowflakeFeature}
        </span>
      </div>

      {/* Business context — always visible */}
      <div className="rounded-lg border border-blue-500/20 bg-gradient-to-r from-blue-950/50 to-slate-900/50 p-5">
        {/* Pain point */}
        <div className="mb-3">
          <span className="text-xs font-medium text-red-400 uppercase tracking-wider">Challenge</span>
          <p className="text-sm text-gray-300 mt-1">{painPoint}</p>
        </div>

        {/* Business value */}
        <div className="mb-3">
          <span className="text-xs font-medium text-green-400 uppercase tracking-wider">Business Value</span>
          <p className="text-sm text-white font-medium mt-1">{businessValue}</p>
        </div>

        {/* Expected outcome */}
        <div>
          <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">What to Watch</span>
          <p className="text-sm text-gray-300 mt-1">{expectedOutcome}</p>
        </div>
      </div>

      {/* Presenter mode — only visible when toggled on */}
      {presenterMode && talkingPoint && (
        <div className="rounded-lg border border-purple-500/30 bg-purple-950/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Presenter Notes</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">audience can't see this</span>
          </div>

          {/* Talking point */}
          <blockquote className="text-sm text-purple-200 italic border-l-2 border-purple-500 pl-3 mb-3">
            "{talkingPoint}"
          </blockquote>

          {/* Demo steps */}
          {demoSteps && demoSteps.length > 0 && (
            <div className="mb-3">
              <span className="text-xs text-purple-400 font-medium">Demo steps:</span>
              <ol className="text-xs text-purple-300 mt-1 space-y-1 list-decimal list-inside">
                {demoSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Transition */}
          {transition && (
            <div>
              <span className="text-xs text-purple-400 font-medium">Transition to next page:</span>
              <p className="text-xs text-purple-300 mt-1 italic">"{transition}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
