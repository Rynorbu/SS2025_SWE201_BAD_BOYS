"use client"

import { useEffect, useState } from "react"
import { View, Text, ActivityIndicator, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { supabase } from "../../lib/session"

export default function AuthCallback() {
  const router = useRouter()
  const [debugInfo, setDebugInfo] = useState("Initializing callback...")

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("🔄 Auth callback page loaded")
        console.log("🌐 Current URL:", typeof window !== "undefined" ? window.location.href : "Not available")

        setDebugInfo("Processing magic link...")

        // Give Supabase time to process the URL
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get the current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        console.log("🔍 Session after callback:", {
          hasSession: !!session,
          userEmail: session?.user?.email,
          error: error?.message,
        })

        if (error) {
          console.error("❌ Callback error:", error)
          setDebugInfo(`Authentication failed: ${error.message}`)
          setTimeout(() => router.replace("/login"), 3000)
          return
        }

        if (session && session.user) {
          console.log("✅ Authentication successful!")
          setDebugInfo(`Welcome back, ${session.user.email}!`)
          setTimeout(() => router.replace("/home"), 2000)
        } else {
          console.log("❌ No session found after callback")
          setDebugInfo("No session found. Redirecting to login...")
          setTimeout(() => router.replace("/login"), 3000)
        }
      } catch (err) {
        console.error("💥 Callback processing error:", err)
        setDebugInfo(`Error: ${err instanceof Error ? err.message : String(err)}`)
        setTimeout(() => router.replace("/login"), 3000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.title}>Completing Sign In</Text>
      <Text style={styles.debugText}>{debugInfo}</Text>
      <Text style={styles.helpText}>Please wait while we complete your authentication...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  debugText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  helpText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
})
