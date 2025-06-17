import { supabase } from '../../lib/session'

export interface AuthUser {
  id: string
  email: string
  [key: string]: any
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_at?: number
  user: AuthUser
}

export class AuthService {
  /**
   * Send magic link to email
   */
  static async sendMagicLink(email: string, redirectUrl?: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl || (typeof window !== "undefined" ? window.location.origin : "http://localhost:8081"),
        },
      })
      return { error }
    } catch (error) {
      console.error('Error sending magic link:', error)
      return { error }
    }
  }

  /**
   * Get current session
   */
  static async getCurrentSession(): Promise<{ session: any; error: any }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      return { session, error }
    } catch (error) {
      console.error('Error getting current session:', error)
      return { session: null, error }
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<{ user: AuthUser | null; error: any }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error }
    } catch (error) {
      console.error('Error getting current user:', error)
      return { user: null, error }
    }
  }

  /**
   * Set session
   */
  static async setSession(session: AuthSession): Promise<{ error: any }> {
    try {
      const { error } = await supabase.auth.setSession(session)
      return { error }
    } catch (error) {
      console.error('Error setting session:', error)
      return { error }
    }
  }

  /**
   * Sign out user
   */
  static async signOut(): Promise<{ error: any }> {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      console.error('Error signing out:', error)
      return { error }
    }
  }

  /**
   * Subscribe to auth state changes
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  /**
   * Check if URL is magic link callback
   */
  static isMagicLinkCallback(): boolean {
    if (typeof window === "undefined") return false
    const currentUrl = window.location.href
    return currentUrl.includes("#access_token") || currentUrl.includes("?access_token")
  }
}