import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { useStore } from '../../store/useStore'

export const AppShell = ({ children }) => {
  const sidebarOpen = useStore(s => s.sidebarOpen)

  return (
    <div className="min-h-screen bg-deep-950 flex">
      <Sidebar />
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${sidebarOpen ? 'ml-60' : 'ml-0'}`}>
        <Navbar />
        <main className="flex-1 p-5 lg:p-6 overflow-y-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
