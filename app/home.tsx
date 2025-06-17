"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
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
import { FilterTabs } from "../components/filtertab"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width)
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

  const handleSearch = (query: string) => {
    PropertyBusinessLogic.handleSearchChange(query)
  }

  const handlePropertyPress = (property: any) => {
    console.log('Property pressed:', property)
  }

  const handleRefresh = async () => {
    await PropertyBusinessLogic.refreshProperties()
  }

  const availableCount = properties.filter(p => p.status === "available").length
  const rentedCount = properties.filter(p => p.status === "booked").length

  const renderProperty = ({ item }: { item: any }) => {
    const transformedProperty = PropertyUtils.transformToCardFormat(item)
    const propertyWithStringId = { ...transformedProperty, id: String(transformedProperty.id) }

    return (
      <PropertyCard
        property={propertyWithStringId}
        onPress={handlePropertyPress}
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
      <ActivityIndicator size="large" color="#007AFF" />
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

      {/* Search & Filter */}
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
                colors={['#007AFF']}
                tintColor="#007AFF"
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 10,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
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
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
    backgroundColor: '#ffebee',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    fontWeight: '500',
  },
})
