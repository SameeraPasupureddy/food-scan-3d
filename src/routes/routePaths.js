export const ROUTES = {
  HOME: '/',
  AUTH: { LOGIN: '/auth/login', REGISTER: '/auth/register', FORGOT: '/auth/forgot-password' },
  DASHBOARD: { ROOT: '/dashboard', OVERVIEW: '/dashboard/overview', HISTORY: '/dashboard/history', ANALYTICS: '/dashboard/analytics', MEAL_PLANS: '/dashboard/meal-plans', ACHIEVEMENTS: '/dashboard/achievements', SETTINGS: '/dashboard/settings' },
  SCAN: { BARCODE: '/scan/barcode', VISUAL: '/scan/visual', MANUAL: '/scan/manual' },
  PRODUCT: (id) => `/product/${id}`,
  COMMUNITY: { LEADERBOARD: '/community/leaderboard', FEED: '/community/feed', USER: (id) => `/community/users/${id}` },
  EXPLORE: { SEARCH: '/explore/search' }
}
