import { useNavigate } from "react-router-dom"
import useAuth from "@auth/hooks/useAuth"
import { useLogoutMutation } from "@auth/queries/authQueries"

export const useSettingsLogout = () => {
  const { setUser, setIsAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation()

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        setUser(null)
        setIsAuthenticated(false)
        navigate("/auth", { replace: true })
      },
      onError: (error: unknown) => {
        console.error("Error logging out:", error)
      }
    })
  }

  return {
    handleLogout,
    isLoggingOut
  }
}
