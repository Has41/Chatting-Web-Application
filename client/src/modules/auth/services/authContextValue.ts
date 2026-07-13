import { createContext } from "react"
import type { User } from "@shared/types"
import type { useCurrentUserQuery } from "@auth/queries/authQueries"

export interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  setIsAuthenticated: (isAuthenticated: boolean) => void
  refetch: ReturnType<typeof useCurrentUserQuery>["refetch"]
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
