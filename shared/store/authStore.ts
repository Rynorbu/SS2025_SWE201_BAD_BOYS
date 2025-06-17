import { create } from 'zustand'
import { AuthUser } from '../services/authService'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  debugInfo: string
  error: string | null
}

interface AuthActions {
  setUser: (user: AuthUser | null) => void
  setAuthenticated: (authenticated: boolean) => void
  setLoading: (loading: boolean) => void
  setDebugInfo: (info: string) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  debugInfo: "Starting...",
  error: null,
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setLoading: (isLoading) => set({ isLoading }),
  setDebugInfo: (debugInfo) => set({ debugInfo }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}))