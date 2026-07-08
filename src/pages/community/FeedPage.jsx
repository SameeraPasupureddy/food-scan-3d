import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { timeAgo } from '../../utils/formatters'

const fullFeed = [
  { id: 'f1', userName: 'Alex Rivera', action: 'scanned', target: 'Organic Granola Bar', category: 'snacks', hazard: 35, time: new Date(Date.now() - 7200000).toISOString(), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
  { id: 'f2', userName: 'Sarah Chen', action: 'earned badge', target: 'Clean Eater', category: 'achievement', hazard: null, time: new Date(Date.now() - 14400000).toISOString(), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
  { id: 'f3', userName: 'Marcus Johnson', action: 'commented on', target: 'Frozen Chicken Nuggets', category: 'frozen', hazard: null, time: new Date(Date.now() - 21600000).toISOString(), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus' },
  { id: 'f4', userName: 'Emily Park', action: 'scanned', target: 'Green Tea', category: 'beverages', hazard: 8, time: new Date(Date.now() - 28800000).toISOString(), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily' },
  { id: 'f5', userName: 'James Wilson', action: 'found alternative', target: 'Salted Potato Chips', category: 'snacks', hazard: null, time: new Date(Date.now() - 36000000).toISOString(), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james' },
  { id: 'f6', userName: 'Alex Rivera', action: 'reached streak', target: '14 days', category: 'streak', hazard: null, time: new Date(Date.now() - 43200000).toISOString(), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
  { id: 'f7', userName: 'Sarah Chen', action: 'scanned', target: 'Organic Apple', category: 'produce', hazard: 5, time: new Date(Date.now() - 50400000).toISOString(), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' }
]

export const FeedPage = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Activity Feed</h1>
        <p className="text-gray-500 text-sm mt-1">Latest community actions</p>
      </div>

      <div className="space-y-3">
        {fullFeed.map(f => (
          <Card key={f.id}>
            <div className="flex items-start gap-3">
              <img src={f.avatar} alt="" className="w-10 h-10 rounded-full bg-deep-700 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                  <span className="font-medium">{f.userName}</span>
                  <span className="text-gray-500"> {f.action} </span>
                  <span className="text-accent-cyan">{f.target}</span>
                </p>
                <p className="text-xs text-gray-600 mt-0.5">{timeAgo(f.time)}</p>
              </div>
              {f.hazard !== null && (
                <Badge variant={f.hazard > 30 ? 'warning' : 'success'}>{f.hazard}</Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
