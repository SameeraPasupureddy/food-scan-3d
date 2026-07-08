import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { Spinner } from '../../components/ui/Spinner'
import { GAMIFICATION } from '../../utils/constants'

export const OverviewPage = () => {
  const { user, totalScans, averageHazardScore, streakDays, nutritionTrends, fetchAnalytics, points, level, levelName, badges } = useStore(s => ({
    user: s.user, totalScans: s.totalScans, averageHazardScore: s.averageHazardScore, streakDays: s.streakDays,
    nutritionTrends: s.nutritionTrends, fetchAnalytics: s.fetchAnalytics, points: s.points, level: s.level,
    levelName: s.levelName, badges: s.badges
  }))
  const isLoading = useStore(s => s.isLoading)
  const navigate = useNavigate()

  useEffect(() => { fetchAnalytics(user?.id) }, [])

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>
  if (!user) return null

  const nextLevel = GAMIFICATION.levels.find(l => l.pointsNeeded > points)
  const progress = nextLevel ? (points / nextLevel.pointsNeeded) * 100 : 100

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome, {user.name}</h1>
          <p className="text-gray-500 text-sm">Here's your health scan overview</p>
        </div>
        <Button onClick={() => navigate('/scan/barcode')}>New Scan</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-accent-cyan">{totalScans}</p>
            <p className="text-xs text-gray-500 mt-1">Total Scans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <p className={`text-3xl font-bold ${averageHazardScore > 50 ? 'text-hazard-high' : averageHazardScore > 30 ? 'text-amber-400' : 'text-green-400'}`}>
              {averageHazardScore}
            </p>
            <p className="text-xs text-gray-500 mt-1">Avg Hazard Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-gold">{streakDays}</p>
            <p className="text-xs text-gray-500 mt-1">Day Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-accent-purple">{points}</p>
            <p className="text-xs text-gray-500 mt-1">Points</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader><CardTitle>Level Progress</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center text-accent-purple font-bold">{level}</div>
              <div>
                <p className="text-sm font-medium text-white">{levelName}</p>
                <p className="text-xs text-gray-500">{points} total points</p>
              </div>
            </div>
            <ProgressBar value={progress} color="purple" />
            {nextLevel && <p className="text-xs text-gray-600">{nextLevel.pointsNeeded - points} points to {nextLevel.name}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Badges</CardTitle></CardHeader>
          <CardContent>
            {badges.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Scan more products to earn badges!</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {badges.slice(0, 4).map(b => (
                  <div key={b.id} className="flex items-center gap-2 p-2 bg-deep-900 rounded-lg">
                    <span className="text-lg">{b.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs text-white truncate">{b.name}</p>
                      <p className="text-[10px] text-gray-600">{b.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {nutritionTrends.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Nutrition Trend (14 Days)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-48 flex items-end gap-1">
              {nutritionTrends.map((d, i) => {
                const maxCals = Math.max(...nutritionTrends.map(x => x.calories))
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-gradient-to-t from-accent-cyan to-accent-purple rounded-t" style={{ height: `${(d.calories / maxCals) * 100}%`, minHeight: '4px' }} />
                    <span className="text-[8px] text-gray-600 rotate-45 origin-left">
                      {new Date(d.date).getDate()}/{new Date(d.date).getMonth() + 1}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        <Button variant="outline" onClick={() => navigate('/dashboard/analytics')}>View Full Analytics</Button>
        <Button variant="outline" onClick={() => navigate('/dashboard/meal-plans')}>Meal Planning</Button>
        <Button variant="outline" onClick={() => navigate('/dashboard/achievements')}>Leaderboard</Button>
      </div>
    </div>
  )
}
