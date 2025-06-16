"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { useRouter } from "expo-router"
import { supabase, clearSession } from "../../lib/session"
import { DashboardHeader } from "../../components/dashboardheader"
import { PropertyCard } from "../../components/propertycard"
import { AddPropertyModal } from "../../components/addpropertymodal"
import { SearchBar } from "../../components/searchbar"
import { FilterTabs } from "../../components/filtertab"
import { Ionicons } from '@expo/vector-icons'

interface Property {
  id: string
  title: string
  description: string
  location: string
  price: number
  room: number
  bathroom: number
  image_url: string
  status: string
  created_at: string
  owner_id: string
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
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
        .from('houses')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching properties:', error)
        Alert.alert('Error', 'Failed to load properties')
        return
      }

      setProperties(data || [])
    } catch (error) {
      console.error('Error:', error)
      Alert.alert('Error', 'Something went wrong')
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
        Alert.alert('Error', 'User not authenticated')
        return
      }

      // Insert the property into Supabase
      const { data, error } = await supabase
        .from('houses')
        .insert([
          {
            ...propertyData,
            owner_id: user.id
          }
        ])
        .select()

      if (error) {
        console.error('Error adding property:', error)
        Alert.alert('Error', 'Failed to add property')
        return
      }

      // Add the new property to local state
      if (data && data[0]) {
        setProperties(prev => [data[0], ...prev])
        setShowAddModal(false)
        Alert.alert('Success', 'Property added successfully!')
      }
    } catch (error) {
      console.error('Error:', error)
      Alert.alert('Error', 'Something went wrong')
    }
  }

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Filter by status instead of type since we removed type from schema
    const matchesFilter = activeFilter === "All" || 
                         (activeFilter === "Available" && property.status === "available") ||
                         (activeFilter === "Rented" && property.status === "booked") ||
                         (activeFilter === "Pending" && property.status === "pending")
    
    return matchesSearch && matchesFilter
  })

  const availableCount = properties.filter(p => p.status === 'available').length
  const rentedCount = properties.filter(p => p.status === 'booked').length

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading properties...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <DashboardHeader user={user} onLogout={handleLogout} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back, {user?.email?.split('@')[0]}!</Text>
          <Text style={styles.subtitle}>Manage your rental properties</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{properties.length}</Text>
            <Text style={styles.statLabel}>Total Properties</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{availableCount}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{rentedCount}</Text>
            <Text style={styles.statLabel}>Rented</Text>
          </View>
        </View>

        {/* Search and Filter */}
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* Add Property Button */}
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButtonText}>+ Add New Property</Text>
        </TouchableOpacity>

        {/* Properties List */}
        <View style={styles.propertiesSection}>
          <Text style={styles.sectionTitle}>Your Properties ({filteredProperties.length})</Text>
          {filteredProperties.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No properties found</Text>
              <Text style={styles.emptySubtext}>
                {properties.length === 0 
                  ? "Add your first property to get started" 
                  : "Try adjusting your search or filter"}
              </Text>
            </View>
          ) : (
            filteredProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={{
                  id: Number(property.id),
                  title: property.title,
                  location: property.location,
                  price: property.price,
                  bedrooms: property.room,
                  bathrooms: property.bathroom,
                  area: 0, // We removed area from schema
                  type: 'Property', // Since we removed type from schema
                  image: property.image_url,
                  isAvailable: property.status === 'available',
                  rating: 0, // You might want to add rating to your schema later
                }} 
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Property Modal */}
      <AddPropertyModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProperty}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
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
  emptyState: {
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
})