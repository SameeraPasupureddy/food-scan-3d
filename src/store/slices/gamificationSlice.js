import badgesData from '../../data/badges.json'
import { GAMIFICATION } from '../../utils/constants'

export const createGamificationSlice = (set, get) => ({
  points: 0,
  level: 1,
  levelName: 'Scanner Novice',
  badges: [],
  streak: { current: 0, longest: 0, lastScanDate: null },
  leaderboard: [],
  isLoading: false,

  fetchLeaderboard: async () => {
    set({ isLoading: true })
    await new Promise(r => setTimeout(r, 600))
    set({
      leaderboard: [
        { id: 'user-001', name: 'Alex Rivera', points: 2340, rank: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
        { id: 'user-002', name: 'Sarah Chen', points: 1890, rank: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
        { id: 'user-003', name: 'Marcus Johnson', points: 1420, rank: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus' },
        { id: 'user-004', name: 'Emily Park', points: 980, rank: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily' },
        { id: 'user-005', name: 'James Wilson', points: 670, rank: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james' },
        { id: 'user-006', name: 'You', points: 450, rank: 6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you' }
      ].sort((a, b) => b.points - a.points).map((u, i) => ({ ...u, rank: i + 1 })),
      isLoading: false
    })
  },

  awardPoints: (amount, reason) => {
    set(state => {
      const newPoints = state.points + amount
      let newLevel = state.level
      let newLevelName = state.levelName
      for (const lvl of GAMIFICATION.levels) {
        if (newPoints >= lvl.pointsNeeded) {
          newLevel = lvl.level
          newLevelName = lvl.name
        } else break
      }
      const newBadges = [...state.badges]
      if (reason === 'scan' && state.scanHistory?.length >= 1) {
        const firstScanBadge = badgesData.find(b => b.id === 'badge-001')
        if (firstScanBadge && !newBadges.find(b => b.id === 'badge-001')) {
          newBadges.push({ ...firstScanBadge, unlockedAt: new Date().toISOString() })
        }
      }
      return { points: newPoints, level: newLevel, levelName: newLevelName, badges: newBadges }
    })
  },

  checkBadges: () => {
    const state = get()
    const newBadges = [...state.badges]
    for (const badge of badgesData) {
      if (newBadges.find(b => b.id === badge.id)) continue
      if (state.points >= badge.pointsRequired) {
        newBadges.push({ ...badge, unlockedAt: new Date().toISOString() })
      }
    }
    if (newBadges.length !== state.badges.length) set({ badges: newBadges })
  },

  checkStreak: () => {
    const today = new Date().toISOString().split('T')[0]
    set(state => {
      const last = state.streak.lastScanDate
      if (last === today) return state
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const newCurrent = last === yesterday ? state.streak.current + 1 : 1
      const newLongest = Math.max(state.streak.longest, newCurrent)
      return { streak: { current: newCurrent, longest: newLongest, lastScanDate: today } }
    })
  },

  initFromUser: (userData) => {
    if (!userData) return
    set({
      points: userData.points || 0,
      level: userData.level || 1,
      streak: {
        current: userData.streakDays || 0,
        longest: userData.longestStreak || 0,
        lastScanDate: null
      }
    })
  }
})
