import React from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native"
import { DashboardHeader } from "./dashboardheader"
import { PropertyCard } from "./propertycard"
import { AddPropertyModal } from "./addpropertymodal"
import { SearchBar } from "./searchbar"
import { FilterTabs } from "./filtertab"

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
  onDeleteProperty, // Receive the onDeleteProperty callback
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
        <Text>Loading properties...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <DashboardHeader user={user} onLogout={onLogout} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back, {user?.email?.split("@")[0]}!</Text>
          <Text style={styles.subtitle}>Manage your rental properties</Text>
        </View>

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

        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButtonText}>+ Add New Property</Text>
        </TouchableOpacity>

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
            filteredProperties.map((property: any) => (
              <View key={property.id} style={{ marginBottom: 20 }}>
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
                  onDelete={onDeleteProperty} // Pass the delete handler
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
    marginTop: 20,
    paddingHorizontal: 16,
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
