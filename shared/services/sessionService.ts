import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthSession } from './authService'

const SESSION_KEY = 'supabase_session'

export class SessionService {
  /**
   * Save session to storage
   */
  static async saveSession(session: AuthSession): Promise<{ error: any }> {
    try {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session))
      return { error: null }
    } catch (error) {
      console.error('Error saving session:', error)
      return { error }
    }
  }

  /**
   * Get saved session
   */
  static async getSavedSession(): Promise<AuthSession | null> {
    try {
      const sessionData = await AsyncStorage.getItem(SESSION_KEY)
      return sessionData ? JSON.parse(sessionData) : null
    } catch (error) {
      console.error('Error getting saved session:', error)
      return null
    }
  }

  /**
   * Clear saved session
   */
  static async clearSession(): Promise<{ error: any }> {
    try {
      await AsyncStorage.removeItem(SESSION_KEY)
      return { error: null }
    } catch (error) {
      console.error('Error clearing session:', error)
      return { error }
    }
  }

  /**
   * Check if session is expired
   */
  static isSessionExpired(session: AuthSession): boolean {
    if (!session.expires_at) return false
    return Date.now() >= session.expires_at * 1000
  }
}