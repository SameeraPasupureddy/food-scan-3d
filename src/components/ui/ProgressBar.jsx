export const ProgressBar = ({ value, max = 100, color = 'accent-cyan', label, showValue = true, size = 'md' }) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }
  const colorMap = {
    'accent-cyan': 'bg-accent-cyan',
    'green': 'bg-green-500',
    'amber': 'bg-amber-500',
    'red': 'bg-hazard-high',
    'purple': 'bg-accent-purple',
    'gradient': 'bg-gradient-to-r from-accent-cyan to-accent-purple'
  }

  return (
    <div className="space-y-1">
      {(label || showValue) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-gray-400">{label}</span>}
          {showValue && <span className="text-gray-300">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={`w-full bg-deep-700 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full transition-all duration-500 ease-out ${colorMap[color] || colorMap['accent-cyan']}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
