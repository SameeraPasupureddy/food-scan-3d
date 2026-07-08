import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'

const navItems = [
  { path: '/dashboard/overview', label: 'Overview', icon: '◉' },
  { path: '/scan/barcode', label: 'Scan', icon: '◈' },
  { path: '/dashboard/history', label: 'History', icon: '⊡' },
  { path: '/dashboard/analytics', label: 'Analytics', icon: '◐' },
  { path: '/dashboard/meal-plans', label: 'Meal Plans', icon: '◇' },
  { path: '/dashboard/achievements', label: 'Achievements', icon: '★' },
  { path: '/community/leaderboard', label: 'Community', icon: '◆' },
  { path: '/explore/search', label: 'Explore', icon: '◎' },
  { path: '/dashboard/settings', label: 'Settings', icon: '⚙' }
]

export const Sidebar = () => {
  const sidebarOpen = useStore(s => s.sidebarOpen)
  const unreadCount = useStore(s => s.unreadCount)

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 240, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed left-0 top-0 h-full bg-deep-900 border-r border-deep-800 z-40 overflow-hidden"
        >
          <div className="flex flex-col h-full">
            <div className="p-5 border-b border-deep-800">
              <NavLink to="/dashboard/overview" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-deep-950 font-bold text-sm">B</div>
                <div>
                  <h1 className="text-sm font-bold text-white">BioScan 3D</h1>
                  <p className="text-xs text-gray-500">Intelligent Analysis</p>
                </div>
              </NavLink>
            </div>

            <nav className="flex-1 py-4 overflow-y-auto">
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-5 py-2.5 mx-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-accent-cyan/10 text-accent-cyan'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-deep-800'
                    }`
                  }
                >
                  <span className="text-lg w-5 text-center">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.path === '/community/leaderboard' && unreadCount > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-hazard-high text-[10px] flex items-center justify-center text-white font-bold">{unreadCount}</span>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t border-deep-800">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>System Online</span>
                <span className="ml-auto">v3.0</span>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
