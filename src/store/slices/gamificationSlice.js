import badgesData from '../../data/badges.json'
import { GAMIFICATION } from '../../utils/constants'

const STREAK_KEY = 'bioscan_streak'

const loadStreak = () => {
  try {
    const raw = localStorage.getItem(STREAK_KEY)
    return raw ? JSON.parse(raw) : { current: 0, longest: 0, lastScanDate: null }
  } catch { return { current: 0, longest: 0, lastScanDate: null } }
}

const saveStreak = (streak) => {
  try { localStorage.setItem(STREAK_KEY, JSON.stringify(streak)) } catch {}
}

export const createGamificationSlice = (set, get) => ({
  points: 0,
  level: 1,
  levelName: 'Scanner Novice',
  badges: [],
  streak: loadStreak(),
  leaderboard: [],
  isLoading: false,
  scanCount: 0,
  cleanScanCount: 0,
  totalSavings: 0,

  fetchLeaderboard: async () => {
    set({ isLoading: true })
    await new Promise(r => setTimeout(r, 600))
    set({
      leaderboard: [
        { id: 'user-001', name: 'Alex Rivera', points: 2340, rank: 1, level: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', badges: 8 },
        { id: 'user-002', name: 'Sarah Chen', points: 1890, rank: 2, level: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', badges: 6 },
        { id: 'user-003', name: 'Marcus Johnson', points: 1420, rank: 3, level: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus', badges: 5 },
        { id: 'user-004', name: 'Emily Park', points: 980, rank: 4, level: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily', badges: 4 },
        { id: 'user-005', name: 'James Wilson', points: 670, rank: 5, level: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james', badges: 3 },
        { id: 'user-006', name: 'You', points: 450, rank: 6, level: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you', badges: 2 }
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

      const newScanCount = reason === 'scan' ? state.scanCount + 1 : state.scanCount
      const newCleanCount = reason === 'clean_scan' ? state.cleanScanCount + 1 : state.cleanScanCount
      const newSavings = reason === 'savings' ? state.totalSavings + (amount || 0) : state.totalSavings

      const newBadges = [...state.badges]
      const allBadges = badgesData

      for (const badge of allBadges) {
        if (newBadges.find(b => b.id === badge.id)) continue
        let earned = false
        if (badge.id === 'badge-001' && newScanCount >= 1) earned = true
        if (badge.id === 'badge-002' && newScanCount >= 10) earned = true
        if (badge.id === 'badge-003' && newScanCount >= 50) earned = true
        if (badge.id === 'badge-004' && newCleanCount >= 10) earned = true
        if (badge.id === 'badge-005' && state.streak.current >= 3) earned = true
        if (badge.id === 'badge-006' && state.streak.current >= 7) earned = true
        if (badge.id === 'badge-007' && state.streak.current >= 30) earned = true
        if (badge.id === 'badge-008' && reason === 'alternative_found') earned = true
        if (badge.id === 'badge-010') { const mp = state.weeklyPlan; if (mp?.length >= 7) earned = true }
        if (badge.id === 'badge-011' && newSavings >= 50) earned = true
        if (badge.id === 'badge-012' && newLevel >= 7) earned = true
        if (newPoints >= badge.pointsRequired && !earned) earned = true
        if (earned) newBadges.push({ ...badge, unlockedAt: new Date().toISOString() })
      }

      return {
        points: newPoints, level: newLevel, levelName: newLevelName,
        badges: newBadges, scanCount: newScanCount, cleanScanCount: newCleanCount,
        totalSavings: newSavings
      }
    })
  },

  checkStreak: () => {
    const today = new Date().toISOString().split('T')[0]
    set(state => {
      const last = state.streak.lastScanDate
      if (last === today) return state
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const newCurrent = last === yesterday ? state.streak.current + 1 : 1
      const newLongest = Math.max(state.streak.longest, newCurrent)
      const newStreak = { current: newCurrent, longest: newLongest, lastScanDate: today }
      saveStreak(newStreak)
      return { streak: newStreak }
    })
  },

  initFromUser: (userData) => {
    if (!userData) return
    set({
      points: userData.points || 0,
      level: userData.level || 1,
      scanCount: userData.totalScans || 0
    })
  }
})
