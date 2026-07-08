import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const mockUsers = {
  'user-001': { name: 'Alex Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', joinDate: '2025-11-15', points: 2340, level: 5, totalScans: 156, streakDays: 30, bio: 'Health enthusiast and clean eating advocate.' },
  'user-002': { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', joinDate: '2026-01-20', points: 1890, level: 4, totalScans: 89, streakDays: 14, bio: 'Gluten-free explorer. Love finding new alternatives.' },
  'user-003': { name: 'Marcus Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus', joinDate: '2025-08-03', points: 1420, level: 4, totalScans: 67, streakDays: 21, bio: 'Keto lifestyle. Scanning everything I eat.' }
}

export const UserProfilePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = mockUsers[id]

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-hazard-high text-lg">User not found</p>
        <Button variant="ghost" onClick={() => navigate('/community/leaderboard')} className="mt-4">Back to Leaderboard</Button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <Card>
        <div className="flex items-center gap-4">
          <img src={user.avatar} alt="" className="w-16 h-16 rounded-full bg-deep-700" />
          <div>
            <h1 className="text-xl font-bold text-white">{user.name}</h1>
            <p className="text-sm text-gray-500">Member since {user.joinDate}</p>
            <p className="text-xs text-gray-600 mt-1">{user.bio}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="text-center"><p className="text-2xl font-bold text-accent-cyan">{user.totalScans}</p><p className="text-xs text-gray-500">Scans</p></CardContent></Card>
        <Card><CardContent className="text-center"><p className="text-2xl font-bold text-accent-purple">{user.points.toLocaleString()}</p><p className="text-xs text-gray-500">Points</p></CardContent></Card>
        <Card><CardContent className="text-center"><p className="text-2xl font-bold text-gold">{user.streakDays}</p><p className="text-xs text-gray-500">Streak</p></CardContent></Card>
        <Card><CardContent className="text-center"><p className="text-2xl font-bold text-accent-cyan">{user.level}</p><p className="text-xs text-gray-500">Level</p></CardContent></Card>
      </div>

      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={() => navigate('/community/leaderboard')}>Leaderboard</Button>
        <Button variant="ghost" onClick={() => navigate('/community/feed')}>Activity Feed</Button>
      </div>
    </div>
  )
}
