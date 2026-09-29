/**
 * LineageGraph.tsx — Data lineage visualization using pure CSS grid layout.
 * Shows a 3-column node graph: Sources → Transformations → Consumers.
 * No D3 or React Flow dependency — pure React + Tailwind.
 *
 * Usage: <LineageGraph nodes={nodes} />
 * where nodes = { sources: [...], transformations: [...], consumers: [...] }
 */

interface LineageNode {
  id: string
  name: string
  type: string
  details?: string
}

interface LineageGraphProps {
  sources: LineageNode[]
  transformations: LineageNode[]
  consumers: LineageNode[]
}

const NODE_COLORS = {
  source: { bg: 'bg-blue-900/50', border: 'border-blue-500', text: 'text-blue-300', dot: 'bg-blue-500' },
  transformation: { bg: 'bg-purple-900/50', border: 'border-purple-500', text: 'text-purple-300', dot: 'bg-purple-500' },
  consumer: { bg: 'bg-green-900/50', border: 'border-green-500', text: 'text-green-300', dot: 'bg-green-500' },
}

function NodeCard({ node, category }: { node: LineageNode; category: keyof typeof NODE_COLORS }) {
  const c = NODE_COLORS[category]
  return (
    <div className={`${c.bg} border ${c.border} rounded-lg p-3 relative`}>
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${c.dot}`} />
        <span className={`font-medium text-sm ${c.text}`}>{node.name}</span>
      </div>
      <span className="text-xs text-gray-400">{node.type}</span>
      {node.details && <p className="text-xs text-gray-500 mt-1">{node.details}</p>}
    </div>
  )
}

export default function LineageGraph({ sources, transformations, consumers }: LineageGraphProps) {
  return (
    <div className="space-y-4">
      {/* Column headers */}
      <div className="grid grid-cols-3 gap-8">
        <div className="text-center">
          <span className="text-sm font-semibold text-blue-400">SOURCES</span>
          <div className="h-0.5 bg-blue-500/30 mt-1" />
        </div>
        <div className="text-center">
          <span className="text-sm font-semibold text-purple-400">TRANSFORMATIONS</span>
          <div className="h-0.5 bg-purple-500/30 mt-1" />
        </div>
        <div className="text-center">
          <span className="text-sm font-semibold text-green-400">CONSUMERS</span>
          <div className="h-0.5 bg-green-500/30 mt-1" />
        </div>
      </div>

      {/* Node grid with connection lines */}
      <div className="grid grid-cols-3 gap-8">
        {/* Sources column */}
        <div className="space-y-3">
          {sources.map(node => (
            <NodeCard key={node.id} node={node} category="source" />
          ))}
        </div>

        {/* Transformations column */}
        <div className="space-y-3 relative">
          {/* Left connector line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-blue-500/50 -translate-x-4" />
          {/* Right connector line */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-green-500/50 to-purple-500/50 translate-x-4" />
          {transformations.map(node => (
            <NodeCard key={node.id} node={node} category="transformation" />
          ))}
        </div>

        {/* Consumers column */}
        <div className="space-y-3">
          {consumers.map(node => (
            <NodeCard key={node.id} node={node} category="consumer" />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 justify-center text-xs text-gray-400 pt-2 border-t border-gray-700">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Source Tables</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Dynamic Tables / Views</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Dashboards / ML Models</span>
      </div>
    </div>
  )
}
