import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'
import { useStore } from './store/useStore'
import { ErrorBoundary } from './components/ui/ErrorBoundary'

export const App = () => {
  const checkSession = useStore(s => s.checkSession)
  const initFromUser = useStore(s => s.initFromUser)
  const user = useStore(s => s.user)

  useEffect(() => {
    checkSession()
  }, [])

  useEffect(() => {
    initFromUser(user)
  }, [user])

  return (
    <ErrorBoundary message="Application failed to initialize. Please refresh the page.">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
