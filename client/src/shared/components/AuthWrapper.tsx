// @ts-nocheck
import { Navigate } from "react-router-dom"
import useAuth from "@auth/hooks/useAuth"

const AuthWrapper = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default AuthWrapper
