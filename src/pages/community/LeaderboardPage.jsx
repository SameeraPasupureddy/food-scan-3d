import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'

const communityFeed = [
  { id: 'feed-1', userName: 'Alex Rivera', action: 'scanned', target: 'Organic Granola Bar', points: 10, time: '2h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
  { id: 'feed-2', userName: 'Sarah Chen', action: 'earned badge', target: 'Clean Eater', points: 0, time: '4h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
  { id: 'feed-3', userName: 'Marcus Johnson', action: 'commented on', target: 'Frozen Chicken Nuggets', points: 5, time: '6h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus' },
  { id: 'feed-4', userName: 'Emily Park', action: 'scanned', target: 'Green Tea', points: 10, time: '8h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily' },
  { id: 'feed-5', userName: 'James Wilson', action: 'found alternative for', target: 'Salted Potato Chips', points: 25, time: '10h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james' }
]

export const LeaderboardPage = () => {
  const { leaderboard, isLoading, fetchLeaderboard } = useStore(s => ({
    leaderboard: s.leaderboard, isLoading: s.isLoading, fetchLeaderboard: s.fetchLeaderboard
  }))
  const [tab, setTab] = useState('leaderboard')
  const navigate = useNavigate()

  useEffect(() => { fetchLeaderboard() }, [])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Community</h1>
        <p className="text-gray-500 text-sm mt-1">Connect with other health-conscious scanners</p>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('leaderboard')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${tab === 'leaderboard' ? 'bg-accent-cyan text-deep-950' : 'bg-deep-800 text-gray-400'}`}>Leaderboard</button>
        <button onClick={() => setTab('feed')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${tab === 'feed' ? 'bg-accent-cyan text-deep-950' : 'bg-deep-800 text-gray-400'}`}>Activity Feed</button>
      </div>

      {tab === 'leaderboard' ? (
        <Card>
          <CardHeader><CardTitle>🏆 Top Scanners</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <Spinner className="mx-auto" /> : (
              <div className="space-y-2">
                {leaderboard.map((u, i) => (
                  <div key={u.id} className="flex items-center gap-4 p-3 bg-deep-900 rounded-lg cursor-pointer hover:bg-deep-800 transition" onClick={() => navigate(`/community/users/${u.id}`)}>
                    <span className={`w-8 text-center text-lg font-bold ${i === 0 ? 'text-gold' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-gray-600'}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${u.rank}`}
                    </span>
                    <img src={u.avatar} alt="" className="w-8 h-8 rounded-full bg-deep-700" />
                    <span className="flex-1 text-sm font-medium text-white">{u.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="info">{u.points.toLocaleString()} pts</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader><CardTitle>📡 Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {communityFeed.map(f => (
              <div key={f.id} className="flex items-center gap-3 p-3 bg-deep-900 rounded-lg">
                <img src={f.avatar} alt="" className="w-8 h-8 rounded-full bg-deep-700" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    <span className="font-medium">{f.userName}</span>{' '}
                    <span className="text-gray-500">{f.action}</span>{' '}
                    <span className="text-accent-cyan">{f.target}</span>
                  </p>
                  <p className="text-xs text-gray-600">{f.time}</p>
                </div>
                {f.points > 0 && <Badge variant="gold">+{f.points}</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={() => navigate('/community/feed')}>View Full Feed</Button>
        <Button variant="ghost" onClick={() => navigate('/dashboard/achievements')}>Your Achievements</Button>
      </div>
    </div>
  )
}
