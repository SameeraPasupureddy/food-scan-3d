import { useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Spinner'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { GAMIFICATION } from '../../utils/constants'

export const AchievementsPage = () => {
  const { points, level, levelName, badges, leaderboard, isLoading, fetchLeaderboard, streak } = useStore(s => ({
    points: s.points, level: s.level, levelName: s.levelName, badges: s.badges,
    leaderboard: s.leaderboard, isLoading: s.isLoading, fetchLeaderboard: s.fetchLeaderboard, streak: s.streak
  }))

  useEffect(() => { fetchLeaderboard() }, [])

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>

  const nextLevel = GAMIFICATION.levels.find(l => l.pointsNeeded > points)
  const progress = nextLevel ? (points / nextLevel.pointsNeeded) * 100 : 100

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Achievements</h1>
        <p className="text-gray-500 text-sm mt-1">Track your progress and compete</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader><CardTitle>Your Stats</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-2xl font-bold text-white">
                {level}
              </div>
              <div>
                <p className="text-lg font-bold text-white">{levelName}</p>
                <p className="text-sm text-gray-500">{points} points</p>
              </div>
            </div>

            <ProgressBar value={progress} color="gradient" label="Next Level" />
            {nextLevel && <p className="text-xs text-gray-600">{nextLevel.pointsNeeded - points} points to {nextLevel.name}</p>}

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-deep-900 rounded-lg text-center">
                <p className="text-lg font-bold text-gold">{streak.current}</p>
                <p className="text-xs text-gray-500">Current Streak</p>
              </div>
              <div className="p-3 bg-deep-900 rounded-lg text-center">
                <p className="text-lg font-bold text-accent-cyan">{streak.longest}</p>
                <p className="text-xs text-gray-500">Best Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Leaderboard</CardTitle></CardHeader>
          <CardContent className="space-y-2 max-h-80 overflow-y-auto">
            {leaderboard.map((u, i) => (
              <div key={u.id} className="flex items-center gap-3 p-2 bg-deep-900 rounded-lg">
                <span className={`w-6 text-center font-bold text-sm ${i < 3 ? 'text-gold' : 'text-gray-600'}`}>{u.rank}</span>
                <img src={u.avatar} alt="" className="w-6 h-6 rounded-full bg-deep-700" />
                <span className="flex-1 text-sm text-white">{u.name}</span>
                <span className="text-sm font-medium text-accent-cyan">{u.points.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Badges ({badges.length})</CardTitle></CardHeader>
        <CardContent>
          {badges.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No badges yet. Start scanning to earn achievements!</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {badges.map(b => (
                <div key={b.id} className="p-3 bg-deep-900 rounded-lg text-center hover:border-accent-cyan/30 border border-transparent transition">
                  <div className="text-3xl mb-2">{b.icon}</div>
                  <p className="text-sm font-medium text-white">{b.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{b.description}</p>
                  <Badge variant="default" size="sm" className="mt-2">{b.category}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
