"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import { supabase, clearSession } from "../lib/session"
import { DashboardHeader } from "../components/dashboardheader"
import { PropertyCard } from "../components/propertycard"
// import { AddPropertyModal } from "../components/addpropertymodal"
// import { SearchBar } from "../components/searchbar"
// import { FilterTabs } from "../components/filtertab"



export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  // const [properties, setProperties] = useState(mockProperties)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
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

    // Listen for screen size changes
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

  const isDesktop = screenWidth >= 1024
  const isTablet = screenWidth >= 768 && screenWidth < 1024
  const isMobile = screenWidth < 768

  return (
    <View style={styles.container}>
      <DashboardHeader user={user} onLogout={handleLogout} />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  mainContent: {
    flex: 1,
  },
  desktopLayout: {
    flexDirection: "row",
  },
  sidebar: {
    width: 280,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sidebarContent: {
    padding: 24,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  sidebarButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  sidebarButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  quickStats: {
    marginTop: 20,
  },
  sidebarStatCard: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  sidebarStatNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  sidebarStatLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  desktopContent: {
    padding: 32,
    maxWidth: 1200,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  desktopWelcome: {
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  desktopWelcomeText: {
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  desktopSubtitle: {
    fontSize: 18,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  tabletStats: {
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  searchFilterSection: {
    marginBottom: 20,
  },
  desktopSearchFilter: {
    marginBottom: 32,
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  propertiesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  desktopSectionTitle: {
    fontSize: 24,
    marginBottom: 24,
  },
  propertiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tabletGrid: {
    marginHorizontal: -8,
  },
  desktopGrid: {
    marginHorizontal: -12,
  },
  propertyCardWrapper: {
    width: "100%",
    marginBottom: 16,
  },
  tabletCardWrapper: {
    width: "48%",
    marginHorizontal: 8,
  },
  desktopCardWrapper: {
    width: "31%",
    marginHorizontal: 12,
    marginBottom: 24,
  },
})
