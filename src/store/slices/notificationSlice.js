export const createNotificationSlice = (set, get) => ({
  notifications: [
    {
      id: 'notif-1',
      type: 'allergen',
      title: 'Allergen Alert',
      message: 'Aspartame detected! This may affect your brain and kidneys.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      severity: 'high'
    },
    {
      id: 'notif-2',
      type: 'price_drop',
      title: 'Price Drop!',
      message: 'Organic Quinoa is now $2.99 at Walmart (25% off)',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false,
      severity: 'low'
    },
    {
      id: 'notif-3',
      type: 'insight',
      title: 'Weekly Insight',
      message: 'You scanned 12 products this week. Your average hazard score decreased by 8%!',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true,
      severity: 'low'
    },
    {
      id: 'notif-4',
      type: 'badge',
      title: 'Badge Unlocked!',
      message: 'You earned the "Clean Eater" badge for scanning 10 clean products.',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      read: true,
      severity: 'low'
    }
  ],
  unreadCount: 2,

  addNotification: (notification) => {
    set(state => {
      const notif = { id: `notif-${Date.now()}`, timestamp: new Date().toISOString(), read: false, ...notification }
      return { notifications: [notif, ...state.notifications], unreadCount: state.unreadCount + 1 }
    })
  },

  markAsRead: (id) => {
    set(state => {
      const notifications = state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      return { notifications, unreadCount: notifications.filter(n => !n.read).length }
    })
  },

  markAllRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0
    }))
  },

  clearAll: () => set({ notifications: [], unreadCount: 0 })
})
