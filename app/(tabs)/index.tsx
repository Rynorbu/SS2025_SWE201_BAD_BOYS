"use client"

import { useEffect } from "react"
import { useRouter } from "expo-router"
import { LoadingScreen } from "../../components/loadingScreen"
import { useAuthStore } from "../../shared/store/authStore"
import { AuthBusinessLogic } from "../../shared/services/authBusinessLogic"

export default function Index() {
  const router = useRouter()
  const { isLoading, debugInfo, setLoading } = useAuthStore()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await AuthBusinessLogic.initializeAuth(router)
      } finally {
        setTimeout(() => setLoading(false), 2000)
      }
    }

    initializeApp()

    // Setup auth state listener
    const { data: { subscription } } = AuthBusinessLogic.setupAuthListener(router)

    return () => subscription.unsubscribe()
  }, [router])

  if (isLoading) {
    return <LoadingScreen debugInfo={debugInfo} />
  }

  return null
}