import { Navigate } from "react-router-dom"
import useAuth from "@auth/hooks/useAuth"
import type { ReactNode } from "react"

interface AuthWrapperProps {
  children: ReactNode
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
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
