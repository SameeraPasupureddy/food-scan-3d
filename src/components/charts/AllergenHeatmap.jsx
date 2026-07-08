import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'

const severityColor = (severity) => {
  switch (severity) {
    case 'high': return 'bg-hazard-high/30 text-hazard-high border-hazard-high/40'
    case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    case 'low': return 'bg-green-500/15 text-green-400 border-green-500/20'
    default: return 'bg-deep-700 text-gray-400 border-deep-600'
  }
}

export const AllergenHeatmap = ({ data }) => {
  if (!data || data.length === 0) return null

  const maxCount = Math.max(...data.map(d => d.count))

  return (
    <Card>
      <CardHeader><CardTitle>Allergen Exposure Heatmap</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {data.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{item.allergen}</span>
              <span className="text-gray-500">{item.count} exposures</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex-1 h-2 bg-deep-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${item.severity === 'high' ? 'bg-hazard-high' : item.severity === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
              <span className={`text-xs px-1.5 py-0.5 rounded border ${severityColor(item.severity)}`}>
                {item.severity}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
