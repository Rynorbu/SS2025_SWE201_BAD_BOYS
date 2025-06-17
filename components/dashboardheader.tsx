"use client"

import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  Pressable,
  SafeAreaView,
  Platform
} from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { LinearGradient } from "expo-linear-gradient"

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
    onLogout()
  }

  const getUserDisplayName = () => {
    if (user?.email) {
      const namePart = user.email.split("@")[0]
      return namePart.charAt(0).toUpperCase() + namePart.slice(1)
    }
    return "User"
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          {/* App branding and user info */}
          <View style={styles.brandContainer}>
            <Text style={styles.appName}>🏠 HouseRent</Text>
            <Text style={styles.userGreeting}>Hello, {getUserDisplayName()}!</Text>
          </View>

          {/* Clear Menu Button */}
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setShowDropdown(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="menu" size={24} color="#fff" />
            <Text style={styles.menuText}>Menu</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDropdown(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowDropdown(false)}>
          <View style={styles.dropdown}>
            {/* User Info Section */}
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Account Menu</Text>
              <Text style={styles.dropdownSubtitle}>{user?.email}</Text>
            </View>

            <View style={styles.dropdownDivider} />

            {/* Menu Items */}

            <TouchableOpacity onPress={() => { setShowDropdown(false); router.push('/home'); }} style={styles.dropdownItem}>
              <Ionicons name="home-outline" size={22} color="#667eea" />
              <Text style={styles.dropdownText}>Home</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>


            <TouchableOpacity onPress={handleProfileClick} style={styles.dropdownItem}>
              <Ionicons name="person-outline" size={22} color="#667eea" />
              <Text style={styles.dropdownText}>My Profile</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogoutClick} style={styles.dropdownItem}>
              <Ionicons name="log-out-outline" size={22} color="#e74c3c" />
              <Text style={[styles.dropdownText, { color: "#e74c3c" }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#667eea",
  },
  header: {
    paddingTop: Platform.OS === "android" ? 50 : 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandContainer: {
    flex: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  userGreeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  menuText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dropdown: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  dropdownHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  dropdownTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  dropdownSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "500",
    marginLeft: 12,
  },
})