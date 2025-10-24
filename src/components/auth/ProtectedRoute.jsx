import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { PageLoading } from '@/components/ui/Loading'

const ProtectedRoute = ({ children, requireAdmin = false, requireUsher = false }) => {
  const { user, loading, isAuthenticated, isAdmin, isUsher } = useAuth()
  const location = useLocation()

  if (loading) {
    return <PageLoading />
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  if (requireUsher && !isUsher) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute