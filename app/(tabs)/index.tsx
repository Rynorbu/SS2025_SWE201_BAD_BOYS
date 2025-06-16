"use client"

import { useEffect, useState } from "react"
import { View, Text, ActivityIndicator, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { getSavedSession, supabase } from "../../lib/session"

export default function Index() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [debugInfo, setDebugInfo] = useState("Starting...")

  useEffect(() => {
    const handleInitialLoad = async () => {
      try {
        // Check if this is a callback from magic link
        const currentUrl = typeof window !== "undefined" ? window.location.href : ""
        const isCallback = currentUrl.includes("#access_token") || currentUrl.includes("?access_token")

        console.log(" Initial load - URL:", currentUrl)
        console.log(" Is callback:", isCallback)

        if (isCallback) {
          setDebugInfo("Processing magic link...")
          console.log("🔗 Magic link callback detected")

          // Wait for Supabase to process the URL
          await new Promise((resolve) => setTimeout(resolve, 1500))

          const {
            data: { session },
            error,
          } = await supabase.auth.getSession()

          if (session && !error) {
            console.log("Magic link authentication successful")
            setDebugInfo(`Welcome, ${session.user.email}!`)
            setTimeout(() => router.replace("/home"), 1000)
            return
          } else {
            console.log("Magic link authentication failed")
            setDebugInfo("Authentication failed, redirecting...")
            setTimeout(() => router.replace("/login"), 2000)
            return
          }
        }

        // Normal session check
        setDebugInfo("Checking saved session...")
        const savedSession = await getSavedSession()

        if (savedSession) {
          setDebugInfo("Validating saved session...")
          const { error: setError } = await supabase.auth.setSession(savedSession)

          if (!setError) {
            const {
              data: { user },
              error: userError,
            } = await supabase.auth.getUser()

            if (user && !userError) {
              console.log("Valid saved session")
              setDebugInfo("Session valid, redirecting...")
              router.replace("/home")
              return
            }
          }
        }

        // Check for current session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          console.log(" Current session found")
          router.replace("/home")
        } else {
          console.log(" No session, redirecting to login")
          router.replace("/login")
        }
      } catch (error) {
        console.error(" Initial load error:", error)
        setDebugInfo(`Error: ${error.message}`)
        router.replace("/login")
      } finally {
        setTimeout(() => setChecking(false), 2000)
      }
    }

    handleInitialLoad()

    // Auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event)

      if (event === "SIGNED_IN" && session) {
        setDebugInfo("Sign in detected!")
        router.replace("/home")
      } else if (event === "SIGNED_OUT") {
        router.replace("/login")
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (checking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Loading...</Text>
        <Text style={styles.debugText}>{debugInfo}</Text>
      </View>
    )
  }

  return null
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  debugText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
})
