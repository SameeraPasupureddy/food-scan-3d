import { Navigate, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useStore(s => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
  }

  return children
}
