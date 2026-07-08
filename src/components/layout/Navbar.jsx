import { useStore } from '../../store/useStore'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/Badge'

export const Navbar = () => {
  const toggleSidebar = useStore(s => s.toggleSidebar)
  const user = useStore(s => s.user)
  const logout = useStore(s => s.logout)
  const unreadCount = useStore(s => s.unreadCount)
  const markAllRead = useStore(s => s.markAllRead)
  const notifications = useStore(s => s.notifications)
  const navigate = useNavigate()

  const recentNotifs = notifications.filter(n => !n.read).slice(0, 3)

  return (
    <header className="sticky top-0 z-30 bg-deep-950/80 backdrop-blur-md border-b border-deep-800">
      <div className="flex items-center justify-between h-14 px-5">
        <button onClick={toggleSidebar} className="text-gray-500 hover:text-white transition p-1.5 rounded-lg hover:bg-deep-800">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="relative p-1.5 text-gray-500 hover:text-white transition rounded-lg hover:bg-deep-800">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-hazard-high text-[9px] flex items-center justify-center text-white font-bold">{unreadCount}</span>
              )}
            </button>
            {recentNotifs.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-deep-800 border border-deep-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-3 border-b border-deep-700 flex justify-between items-center">
                  <span className="text-sm font-medium text-white">Notifications</span>
                  <button onClick={markAllRead} className="text-xs text-accent-cyan hover:underline">Mark all read</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {recentNotifs.map(n => (
                    <div key={n.id} className={`p-3 border-b border-deep-700/50 ${n.severity === 'high' ? 'bg-hazard-high/5' : ''}`}>
                      <p className="text-sm text-white">{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {user && (
            <div className="relative group">
              <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-deep-800 transition">
                <img src={user.avatar} alt="" className="w-7 h-7 rounded-full bg-deep-700" />
                <span className="text-sm text-gray-300 hidden sm:block">{user.name}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-deep-800 border border-deep-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2">
                  <button onClick={() => navigate('/dashboard/settings')} className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-deep-700 rounded-lg transition">Settings</button>
                  <button onClick={() => { logout(); navigate('/') }} className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-hazard-high hover:bg-deep-700 rounded-lg transition">Sign Out</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
