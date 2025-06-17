"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import { useRouter } from "expo-router"
import { supabase, clearSession } from "../lib/session"
import { DashboardHeader } from "../components/dashboardheader"
import { SearchBar } from "../components/searchbar"
import { PropertyCard } from "../components/propertycard"
import { usePropertyStore } from "../shared/store/propertyStore"
import { PropertyBusinessLogic } from "../shared/services/businessLayer"
import { PropertyUtils } from "../shared/utils/propertyUtils"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const {
    properties,
    filteredProperties,
    loading,
    error,
    searchQuery,
    refreshing,
    setSearchQuery,
  } = usePropertyStore()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
    PropertyBusinessLogic.loadProperties()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    await clearSession()
    router.replace("/login")
  }

  const handleSearch = (query: string) => {
    PropertyBusinessLogic.handleSearchChange(query)
  }

  const handlePropertyPress = (property: any) => {
    console.log('Property pressed:', property)
  }

  const handleRefresh = async () => {
    await PropertyBusinessLogic.refreshProperties()
  }

  const handleDeleteProperty = (propertyId: string) => {
    usePropertyStore.setState((state) => ({
      properties: state.properties.filter((p) => p.id !== propertyId),
      filteredProperties: state.filteredProperties.filter((p) => p.id !== propertyId),
    }));
  };

  const availableCount = properties.filter(p => p.status === "available").length
  const rentedCount = properties.filter(p => p.status === "booked").length

  const renderProperty = ({ item }: { item: any }) => {
    const transformedProperty = PropertyUtils.transformToCardFormat(item)
    const propertyWithStringId = { ...transformedProperty, id: String(transformedProperty.id) }

    return (
      <PropertyCard
        property={propertyWithStringId}
        onPress={handlePropertyPress}
        onDelete={handleDeleteProperty}
      />
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No Properties Found' : 'No Properties Available'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'Try adjusting your search terms'
          : 'Check back later for new listings'}
      </Text>
    </View>
  )

  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <ActivityIndicator size="large" color="#667eea" />
      <Text style={styles.loadingText}>Loading properties...</Text>
    </View>
  )

  const avatarImage = require("../assets/images/rent.jpg")

  return (
    <ScrollView style={styles.container}>
      <DashboardHeader user={user} onLogout={handleLogout} />

      <View style={styles.welcomeSection}>
        <Image source={avatarImage} style={styles.avatarImage} />
        <View style={styles.welcomeTextWrapper}>
          <Text style={styles.welcomeText}>
            Welcome to <Text style={styles.brandHighlight}>House Renting</Text>
          </Text>
          <Text style={styles.subWelcomeText}>Find your dream house now</Text>
        </View>
      </View>

      {/* Stats */}
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

      {/* Search */}
      <View style={styles.searchWrapper}>
        <SearchBar value={searchQuery} onChangeText={handleSearch} />
      </View>

      <View style={styles.propertiesSection}>
        <Text style={styles.sectionTitle}>
          Available Properties ({filteredProperties.length})
        </Text>

        {loading && filteredProperties.length === 0 ? (
          renderLoadingState()
        ) : (
          <FlatList
            data={filteredProperties}
            renderItem={renderProperty}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#667eea']}
                tintColor="#667eea"
              />
            }
          />
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  welcomeSection: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginHorizontal: 16,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  welcomeTextWrapper: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  brandHighlight: {
    color: "#667eea",
  },
  subWelcomeText: {
    fontSize: 14,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
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
    fontWeight: "700",
    color: "#667eea",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
  searchWrapper: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  propertiesSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  errorContainer: {
    backgroundColor: '#fdf2f2',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '500',
  },
})