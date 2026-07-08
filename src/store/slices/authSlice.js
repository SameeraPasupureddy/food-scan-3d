import { hashPassword, comparePassword, generateToken } from '../../utils/crypto'
import usersData from '../../data/users.json'

const USERS_KEY = 'bioscan_users'
const SESSION_KEY = 'bioscan_session'

const loadUsers = () => {
  try {
    const stored = localStorage.getItem(USERS_KEY)
    return stored ? JSON.parse(stored) : usersData
  } catch { return usersData }
}

const saveUsers = (users) => {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)) } catch {}
}

export const createAuthSlice = (set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    await new Promise(r => setTimeout(r, 600))
    const users = loadUsers()
    const found = users.find(u => u.email === email.toLowerCase().trim())
    if (!found) {
      set({ isLoading: false, error: 'Invalid email or password' })
      return false
    }
    const match = await comparePassword(password, found.passwordHash)
    if (!match) {
      set({ isLoading: false, error: 'Invalid email or password' })
      return false
    }
    const token = generateToken()
    const session = { userId: found.id, token, expiresAt: Date.now() + 86400000 }
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)) } catch {}
    set({ user: found, isAuthenticated: true, isLoading: false, error: null })
    return true
  },

  register: async (data) => {
    set({ isLoading: true, error: null })
    await new Promise(r => setTimeout(r, 600))
    const users = loadUsers()
    if (users.find(u => u.email === data.email.toLowerCase().trim())) {
      set({ isLoading: false, error: 'Email already registered' })
      return false
    }
    const hash = await hashPassword(data.password)
    const newUser = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      passwordHash: hash,
      age: Number(data.age),
      weight: Number(data.weight),
      allergies: data.allergies || [],
      dietaryRestrictions: data.dietaryRestrictions || [],
      weightGoal: data.weightGoal || 'maintain',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      joinDate: new Date().toISOString().split('T')[0],
      points: 0,
      level: 1,
      totalScans: 0,
      streakDays: 0,
      longestStreak: 0
    }
    users.push(newUser)
    saveUsers(users)
    const token = generateToken()
    const session = { userId: newUser.id, token, expiresAt: Date.now() + 86400000 }
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)) } catch {}
    const { passwordHash, ...safeUser } = newUser
    set({ user: safeUser, isAuthenticated: true, isLoading: false, error: null })
    return true
  },

  logout: () => {
    try { localStorage.removeItem(SESSION_KEY) } catch {}
    set({ user: null, isAuthenticated: false, error: null })
  },

  checkSession: () => {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (!raw) return
      const session = JSON.parse(raw)
      if (session.expiresAt < Date.now()) {
        localStorage.removeItem(SESSION_KEY)
        return
      }
      const users = loadUsers()
      const found = users.find(u => u.id === session.userId)
      if (found) {
        const { passwordHash, ...safeUser } = found
        set({ user: safeUser, isAuthenticated: true })
      }
    } catch {}
  },

  updateProfile: async (updates) => {
    const { user } = get()
    if (!user) return
    set({ isLoading: true })
    await new Promise(r => setTimeout(r, 400))
    const users = loadUsers()
    const idx = users.findIndex(u => u.id === user.id)
    if (idx === -1) { set({ isLoading: false }); return }
    users[idx] = { ...users[idx], ...updates }
    saveUsers(users)
    const { passwordHash, ...safeUser } = users[idx]
    set({ user: safeUser, isLoading: false })
  }
})
