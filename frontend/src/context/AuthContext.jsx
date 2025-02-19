import { createContext, useState } from "react"
import { useQuery } from "react-query"
import axiosInstance from "../utils/axiosInstance"
import { USER_PATHS } from "../constants/apiPaths"

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const { refetch, isLoading } = useQuery({
    queryKey: USER_PATHS.GET_INFO,
    queryFn: async () => {
      const { data } = await axiosInstance.get(USER_PATHS.GET_INFO)
      return data
    },
    onSuccess: (data) => {
      setUser(data?.data)
      setIsAuthenticated(true)
    },
    onError: (error) => {
      console.error("Failed to fetch user data:", error)
      setIsAuthenticated(false)
      setUser(null)
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 24 * 60 * 60 * 1000
  })

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setIsAuthenticated, refetch, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
