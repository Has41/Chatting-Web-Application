// @ts-nocheck
import { createContext, ReactNode, useEffect, useReducer } from "react"
import type { User } from "@shared/types"
import { authReducer, initialAuthState } from "@auth/states/authState"
import { useCurrentUserQuery } from "@auth/queries/authQueries"

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  setIsAuthenticated: (isAuthenticated: boolean) => void
  refetch: () => void
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

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        setUser: (user) => dispatch({ type: "SET_USER", payload: user }),
        isAuthenticated: state.isAuthenticated,
        setIsAuthenticated: (isAuthenticated) => dispatch({ type: "SET_AUTHENTICATED", payload: isAuthenticated }),
        refetch,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
