"use client"

import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useRouter } from "expo-router"

interface DashboardHeaderProps {
  user: any
  onLogout: () => void
}

export function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  const router = useRouter()

  const handleProfileClick = () => {
    router.push("/profile")
  }

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.appName}>House-Renting</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfileClick}>
            <Text style={styles.profileText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#007AFF",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  userEmail: {
    fontSize: 14,
    color: "#E3F2FD",
    marginTop: 2,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  profileText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
})
