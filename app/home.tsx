"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Dimensions, Image } from "react-native"
import { useRouter } from "expo-router"
import { supabase, clearSession } from "../lib/session"
import { DashboardHeader } from "../components/dashboardheader"
import { SearchBar } from "../components/searchbar"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenWidth(window.width)
    })

    return () => subscription?.remove()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    await clearSession()
    router.replace("/login")
  }

  const avatarImage = require("../assets/images/rent.jpg")

  return (
    <View style={styles.container}>
      <DashboardHeader user={user} onLogout={handleLogout} />

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Image source={avatarImage} style={styles.avatarImage} />
        <View style={styles.welcomeTextWrapper}>
          <Text style={styles.welcomeText}>
            Welcome to <Text style={styles.brandHighlight}>House Renting</Text>
          </Text>
          <Text style={styles.subWelcomeText}>Find your dream house now</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  welcomeSection: {
    marginTop: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginHorizontal: 16,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  welcomeTextWrapper: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  brandHighlight: {
    color: "#007AFF",
  },
  subWelcomeText: {
    fontSize: 17,
    color: "#888",
    fontStyle: "italic",
  },

  searchWrapper: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
})
