import { createContext, ReactNode, useEffect, useMemo, useReducer } from "react"
import type { User } from "@shared/types"
import { authReducer, initialAuthState } from "@auth/states/authState"
import { useCurrentUserQuery } from "@auth/queries/authQueries"

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  setIsAuthenticated: (isAuthenticated: boolean) => void
  refetch: ReturnType<typeof useCurrentUserQuery>["refetch"]
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState)
  const { data, refetch, isLoading, isError } = useCurrentUserQuery()

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_USER", payload: data })
      dispatch({ type: "SET_AUTHENTICATED", payload: true })
      return
    }

    if (isError) {
      dispatch({ type: "RESET" })
    }
  }, [data, isError])

  const value = useMemo(
    () => ({
      user: state.user,
      setUser: (user: User | null) => dispatch({ type: "SET_USER", payload: user }),
      isAuthenticated: state.isAuthenticated,
      setIsAuthenticated: (isAuthenticated: boolean) => dispatch({ type: "SET_AUTHENTICATED", payload: isAuthenticated }),
      refetch,
      isLoading
    }),
    [isLoading, refetch, state.isAuthenticated, state.user]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
