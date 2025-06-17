import React from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import { DashboardHeader } from "./dashboardheader"
import { PropertyCard } from "./propertycard"
import { AddPropertyModal } from "./addpropertymodal"
import { SearchBar } from "./searchbar"
import { FilterTabs } from "./filtertab"
import { Ionicons } from "@expo/vector-icons"

export function DashboardView({
  user,
  properties,
  loading,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  onLogout,
  onAddProperty,
  showAddModal,
  setShowAddModal,
  onDeleteProperty,
}: any) {
  const filteredProperties = properties.filter((property: any) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Available" && property.status === "available") ||
      (activeFilter === "Rented" && property.status === "booked") ||
      (activeFilter === "Pending" && property.status === "pending")

    return matchesSearch && matchesFilter
  })

  const availableCount = properties.filter((p: any) => p.status === "available").length
  const rentedCount = properties.filter((p: any) => p.status === "booked").length

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading properties...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <DashboardHeader user={user} onLogout={onLogout} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Hello, {user?.email?.split("@")[0]}! 👋
          </Text>
          <Text style={styles.subtitle}>Manage your properties</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{properties.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
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
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Property</Text>
        </TouchableOpacity>

        {/* Properties List */}
        <View style={styles.propertiesSection}>
          <Text style={styles.sectionTitle}>
            Properties ({filteredProperties.length})
          </Text>
          
          {filteredProperties.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="home-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>
                {properties.length === 0 ? "No properties yet" : "No properties found"}
              </Text>
              <Text style={styles.emptySubtext}>
                {properties.length === 0
                  ? "Add your first property to get started"
                  : "Try different search terms or filters"}
              </Text>
              {properties.length === 0 && (
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={() => setShowAddModal(true)}
                >
                  <Text style={styles.emptyButtonText}>Add First Property</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filteredProperties.map((property: any) => (
              <View key={property.id} style={styles.propertyItem}>
                <PropertyCard
                  property={{
                    id: String(property.id),
                    title: property.title,
                    location: property.location,
                    price: property.price,
                    bedrooms: property.room,
                    bathrooms: property.bathroom,
                    area: 0,
                    type: "Property",
                    image: property.image_url,
                    isAvailable: property.status === "available",
                    rating: 0,
                  }}
                  onDelete={onDeleteProperty}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <AddPropertyModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={onAddProperty}
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
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
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
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#667eea",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#667eea",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  propertiesSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  propertyItem: {
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: "#667eea",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
})