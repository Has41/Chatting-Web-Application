import type { User } from "@shared/types"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export type AuthAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_AUTHENTICATED"; payload: boolean }
  | { type: "RESET" }

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false
}

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload }
    case "SET_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload }
    case "RESET":
      return initialAuthState
    default:
      return state
  }
}
