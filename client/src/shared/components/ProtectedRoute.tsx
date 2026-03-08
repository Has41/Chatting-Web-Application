import { Navigate } from "react-router-dom"
import useAuth from "@auth/hooks/useAuth"
import type { AppWrapperProps } from "@shared/types/components"

const ProtectedRoute = ({ children }: AppWrapperProps) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return children
}

export default ProtectedRoute
