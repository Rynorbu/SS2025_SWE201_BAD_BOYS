"use client"

import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"

interface DashboardHeaderProps {
  user: any
  onLogout: () => void
}

export function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleProfileClick = () => {
    setShowDropdown(false)
    router.push("/profile")
  }

  const handleLogoutClick = () => {
    setShowDropdown(false)
    onLogout() // call parent prop function
  }

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.appName}>🏠 HouseRent</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <TouchableOpacity onPress={() => setShowDropdown(true)}>
          <Ionicons name="ellipsis-vertical" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowDropdown(false)}>
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={handleProfileClick} style={styles.dropdownItem}>
              <Ionicons name="person-outline" size={16} color="#007AFF" />
              <Text style={styles.dropdownText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogoutClick} style={styles.dropdownItem}>
              <Ionicons name="log-out-outline" size={16} color="#d32f2f" />
              <Text style={[styles.dropdownText, { color: "#d32f2f" }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  userEmail: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 90,
    paddingRight: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 6,
    width: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  dropdownText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#007AFF",
  },
})
