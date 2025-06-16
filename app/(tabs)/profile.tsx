"use client"

import { useState, useEffect } from "react"
import { Alert } from "react-native"
import { useRouter } from "expo-router"
import { supabase, clearSession } from "../../lib/session"
import { DashboardView } from "../../components/profile"

export default function DashboardContainer() {
  const [user, setUser] = useState<any>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [showAddModal, setShowAddModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        fetchProperties(user.id)
      }
    }

    getUser()
  }, [])

  const fetchProperties = async (userId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("houses")
        .select("*")
        .eq("owner_id", userId)

      if (error) {
        Alert.alert("Error", "Failed to load properties")
        return
      }

      setProperties(data || [])
    } catch {
      Alert.alert("Error", "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    await clearSession()
    router.replace("/login")
  }

  const handleAddProperty = async (propertyData: any) => {
    try {
      if (!user) {
        Alert.alert("Error", "User not authenticated")
        return
      }

      const { data, error } = await supabase
        .from("houses")
        .insert([{ ...propertyData, owner_id: user.id }])
        .select()

      if (error) {
        Alert.alert("Error", "Failed to add property")
        return
      }

      if (data && data[0]) {
        setProperties(prev => [data[0], ...prev])
        setShowAddModal(false)
        Alert.alert("Success", "Property added successfully!")
      }
    } catch {
      Alert.alert("Error", "Something went wrong")
    }
  }

  return (
    <DashboardView
      user={user}
      properties={properties}
      loading={loading}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
      onLogout={handleLogout}
      onAddProperty={handleAddProperty}
      showAddModal={showAddModal}
      setShowAddModal={setShowAddModal}
    />
  )
}
