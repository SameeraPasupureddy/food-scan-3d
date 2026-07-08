import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { findCheapestStore, getHistoricalTrend } from '../../services/priceService'
import { formatCurrency, formatDate } from '../../utils/formatters'

export const PricePanel = ({ product }) => {
  if (!product?.prices || product.prices.length === 0) return null

  const cheapest = findCheapestStore(product.prices)
  const trend = getHistoricalTrend(product.id, product.prices)

  return (
    <Card>
      <CardHeader><CardTitle>Price Comparison</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {cheapest && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <p className="text-xs text-green-400">Best Price</p>
            <p className="text-lg font-bold text-white">{cheapest.store}</p>
            <p className="text-2xl font-bold text-green-400">{formatCurrency(cheapest.price)}</p>
          </div>
        )}

        <div className="space-y-2">
          {product.prices.sort((a, b) => a.price - b.price).map((p, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-deep-900 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-green-400' : 'bg-gray-600'}`} />
                <span className="text-gray-300">{p.store}</span>
              </div>
              <span className="font-medium text-white">{formatCurrency(p.price)}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Trend: <span className={`font-medium ${trend.trend === 'rising' ? 'text-hazard-high' : trend.trend === 'falling' ? 'text-green-400' : 'text-gray-400'}`}>{trend.trend}</span></span>
          <span>{trend.change > 0 ? '+' : ''}{trend.change}%</span>
        </div>

        <a
          href={`https://www.google.com/search?q=buy+${encodeURIComponent(product.name)}+online`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-xs text-accent-cyan hover:underline pt-2"
        >
          Find nearby stores →
        </a>
      </CardContent>
    </Card>
  )
}
