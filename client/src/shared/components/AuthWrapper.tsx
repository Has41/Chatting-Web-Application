import { Navigate } from "react-router-dom"
import useAuth from "@auth/hooks/useAuth"
import type { AppWrapperProps } from "@shared/types/components"

const AuthWrapper = ({ children }: AppWrapperProps) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default AuthWrapper
