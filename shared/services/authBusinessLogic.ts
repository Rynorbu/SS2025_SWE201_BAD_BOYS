import { Alert } from 'react-native'
import { Router } from 'expo-router'
import { AuthService } from './authService'
import { SessionService } from './sessionService'
import { useAuthStore } from '../store/authStore'

export class AuthBusinessLogic {
  /**
   * Handle magic link login
   */
  static async handleMagicLinkLogin(email: string): Promise<{ success: boolean; message: string }> {
    if (!email.trim()) {
      return { success: false, message: "Please enter your email address" }
    }

    const { error } = await AuthService.sendMagicLink(email)

    if (error) {
      return { success: false, message: error.message }
    }

    return { 
      success: true, 
      message: `We sent a magic link to ${email}. Click the link in your email to sign in.` 
    }
  }

  /**
   * Handle magic link callback
   */
  static async handleMagicLinkCallback(router: Router): Promise<boolean> {
    const { setDebugInfo } = useAuthStore.getState()
    
    try {
      setDebugInfo("Processing magic link...")
      
      // Wait for Supabase to process the URL
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const { session, error } = await AuthService.getCurrentSession()

      if (session && !error) {
        setDebugInfo(`Welcome, ${session.user.email}!`)
        await SessionService.saveSession(session)
        setTimeout(() => router.replace("/home"), 1000)
        return true
      } else {
        setDebugInfo("Authentication failed, redirecting...")
        setTimeout(() => router.replace("/login"), 2000)
        return false
      }
    } catch (error) {
      console.error("Magic link callback error:", error)
      setDebugInfo("Authentication failed")
      router.replace("/login")
      return false
    }
  }

  /**
   * Handle saved session validation
   */
  static async handleSavedSession(router: Router): Promise<boolean> {
    const { setDebugInfo } = useAuthStore.getState()
    
    try {
      setDebugInfo("Checking saved session...")
      const savedSession = await SessionService.getSavedSession()

      if (!savedSession) return false

      if (SessionService.isSessionExpired(savedSession)) {
        await SessionService.clearSession()
        return false
      }

      setDebugInfo("Validating saved session...")
      const { error: setError } = await AuthService.setSession(savedSession)

      if (!setError) {
        const { user, error: userError } = await AuthService.getCurrentUser()

        if (user && !userError) {
          setDebugInfo("Session valid, redirecting...")
          router.replace("/home")
          return true
        }
      }

      await SessionService.clearSession()
      return false
    } catch (error) {
      console.error("Saved session validation error:", error)
      await SessionService.clearSession()
      return false
    }
  }

  /**
   * Handle current session check
   */
  static async handleCurrentSession(router: Router): Promise<boolean> {
    try {
      const { session } = await AuthService.getCurrentSession()

      if (session) {
        router.replace("/home")
        return true
      } else {
        router.replace("/login")
        return false
      }
    } catch (error) {
      console.error("Current session check error:", error)
      router.replace("/login")
      return false
    }
  }

  /**
   * Handle logout
   */
  static async handleLogout(router: Router): Promise<void> {
    try {
      await AuthService.signOut()
      await SessionService.clearSession()
      router.replace("/login")
    } catch (error) {
      console.error("Logout error:", error)
      Alert.alert("Error", "Failed to logout")
    }
  }

  /**
   * Initialize authentication
   */
  static async initializeAuth(router: Router): Promise<void> {
    const { setDebugInfo, setError, setUser } = useAuthStore.getState()
    
    try {
      // Check if this is a magic link callback
      if (AuthService.isMagicLinkCallback()) {
        await this.handleMagicLinkCallback(router)
        return
      }

      // Try saved session first
      const savedSessionValid = await this.handleSavedSession(router)
      if (savedSessionValid) return

      // Fall back to current session check
      await this.handleCurrentSession(router)
      
    } catch (error) {
      console.error("Auth initialization error:", error)
      setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setError(error instanceof Error ? error.message : 'Unknown error')
      router.replace("/login")
    }
  }

  /**
   * Setup auth state listener
   */
  static setupAuthListener(router: Router) {
    const { setDebugInfo, setUser } = useAuthStore.getState()
    
    return AuthService.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event)

      if (event === "SIGNED_IN" && session) {
        setDebugInfo("Sign in detected!")
        setUser(session.user)
        router.replace("/home")
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        router.replace("/login")
      }
    })
  }
}