import { ReactNode, useEffect, useMemo, useReducer } from "react"
import type { User } from "@shared/types"
import { authReducer, initialAuthState } from "@auth/states/authState"
import { useCurrentUserQuery } from "@auth/queries/authQueries"
import { AuthContext } from "./authContextValue"

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
