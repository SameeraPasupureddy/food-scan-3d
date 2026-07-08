import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { calculateSustainabilityScore, getCertificationBadges } from '../../services/sustainabilityService'

export const SustainabilityPanel = ({ product }) => {
  if (!product) return null

  const score = calculateSustainabilityScore(product)
  const badges = getCertificationBadges(product)
  const carbonEst = product.sustainability?.carbonFootprint || 0
  const waterEst = product.sustainability?.waterUsage || 0

  return (
    <Card>
      <CardHeader><CardTitle>Sustainability Score</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-3xl font-bold ${score >= 70 ? 'text-green-400' : score >= 40 ? 'text-amber-400' : 'text-hazard-high'}`}>
            {score}
          </div>
          <p className="text-xs text-gray-500">out of 100</p>
        </div>

        <ProgressBar value={score} color={score >= 70 ? 'green' : score >= 40 ? 'amber' : 'red'} size="sm" />

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-deep-900 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-accent-cyan">{carbonEst}kg</p>
            <p className="text-xs text-gray-500">CO₂ Footprint</p>
          </div>
          <div className="bg-deep-900 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-accent-cyan">{waterEst}L</p>
            <p className="text-xs text-gray-500">Water Usage</p>
          </div>
        </div>

        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {badges.map(b => (
              <Badge key={b.label} variant={b.color === 'green' ? 'success' : b.color === 'blue' ? 'info' : 'warning'}>
                {b.icon} {b.label}
              </Badge>
            ))}
          </div>
        )}

        {product.sustainability?.packaging && (
          <p className="text-xs text-gray-600">Packaging: {product.sustainability.packaging}</p>
        )}
      </CardContent>
    </Card>
  )
}
