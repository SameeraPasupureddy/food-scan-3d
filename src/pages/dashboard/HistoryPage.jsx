import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { formatDate, timeAgo } from '../../utils/formatters'

const scanHistoryData = [
  { id: 'hist-1', productId: 'prod-001', productName: 'Organic Granola Bar', brand: 'NatureFuel', barcode: '4901234567890', method: 'barcode', timestamp: new Date(Date.now() - 3600000).toISOString(), hazardScore: 35 },
  { id: 'hist-2', productId: 'prod-003', productName: 'Organic Apple', brand: 'Fresh Farms', barcode: null, method: 'visual', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), hazardScore: 5 },
  { id: 'hist-3', productId: 'prod-002', productName: 'Sugar-Free Energy Drink', brand: 'VoltX', barcode: '4801234567890', method: 'barcode', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), hazardScore: 62 },
  { id: 'hist-4', productId: 'prod-005', productName: 'Organic Quinoa', brand: 'TerraViva', barcode: '8901234567890', method: 'manual', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), hazardScore: 8 },
  { id: 'hist-5', productId: 'prod-010', productName: 'Salted Potato Chips', brand: 'CrunchCo', barcode: '5901234567890', method: 'barcode', timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), hazardScore: 58 }
]

const methodIcons = { barcode: '📷', visual: '🔍', manual: '⌨️' }

export const HistoryPage = () => {
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  const filtered = filter === 'all' ? scanHistoryData : scanHistoryData.filter(h => h.method === filter)

  const hazardColor = (score) => {
    if (score > 50) return 'danger'
    if (score > 20) return 'warning'
    return 'success'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Scan History</h1>
          <p className="text-gray-500 text-sm mt-1">Your recent product scans</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/scan/barcode')}>New Scan</Button>
      </div>

      <div className="flex gap-2 mb-4">
        {['all', 'barcode', 'visual', 'manual'].map(m => (
          <button
            key={m}
            onClick={() => setFilter(m)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize ${
              filter === m ? 'bg-accent-cyan text-deep-950' : 'bg-deep-800 text-gray-400 hover:text-white'
            }`}
          >
            {m === 'all' ? 'All' : methodIcons[m]} {m === 'all' ? '' : m}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(h => (
          <Card key={h.id} hover onClick={() => navigate(`/product/${h.barcode || h.productId}`)}>
            <div className="flex items-center gap-4">
              <span className="text-xl">{methodIcons[h.method]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{h.productName}</p>
                <p className="text-xs text-gray-500">{h.brand} &middot; {timeAgo(h.timestamp)}</p>
              </div>
              <Badge variant={hazardColor(h.hazardScore)}>{h.hazardScore}</Badge>
              <span className="text-xs text-gray-600">{formatDate(h.timestamp)}</span>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No scans found</p>
            <Button variant="ghost" onClick={() => navigate('/scan/barcode')} className="mt-3">Start Scanning</Button>
          </div>
        )}
      </div>
    </div>
  )
}
