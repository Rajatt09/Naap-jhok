import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loader from '../common/Loader'

const TailorRoute = ({ children }) => {
  const { isAuthenticated, isTailor, isLoading } = useAuth()

  if (isLoading) {
    return <Loader fullScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login\" replace />
  }

  if (!isTailor) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default TailorRoute