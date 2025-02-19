import { Navigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const AuthWrapper = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return "Loading..."
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default AuthWrapper
