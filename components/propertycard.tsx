"use client"

import { useState } from "react"
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from "react-native"
import { PropertyService } from "../shared/services/propertyservice"
import { MaterialIcons } from "@expo/vector-icons"

interface PropertyCardProps {
  property: {
    id: string
    title: string
    location: string
    price: number
    bedrooms: number
    bathrooms: number
    area: number
    type: string
    image: string
    isAvailable: boolean
    rating: number
  }
  onPress?: (property: any) => void
  onDelete?: (id: string) => void
}

export function PropertyCard({ property, onPress, onDelete }: PropertyCardProps) {
  const screenWidth = Dimensions.get("window").width
  const isDesktop = screenWidth >= 1024
  const [isAvailable, setIsAvailable] = useState(property.isAvailable)

  const handleBookNow = async () => {
    const result = await PropertyService.bookProperty(property.id)
    if (result.success) {
      Alert.alert("Success", "Property booked successfully!")
      setIsAvailable(false)
    } else {
      Alert.alert("Error", result.error || "Could not book property.")
    }
  }

  const handleDelete = async () => {
    const result = await PropertyService.deleteProperty(property.id)
    if (result.success) {
      Alert.alert("Success", "Property deleted successfully!")
      if (onDelete) onDelete(property.id) // Notify parent component
    } else {
      Alert.alert("Error", result.error || "Could not delete property.")
    }
  }

  const handlePress = () => {
    if (onPress) onPress(property)
  }

  return (
    <TouchableOpacity
      style={[styles.card, isDesktop && styles.desktopCard]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: property.image }} style={[styles.image, isDesktop && styles.desktopImage]} />
      <View style={[styles.content, isDesktop && styles.desktopContent]}>
        <View style={styles.header}>
          <Text style={[styles.title, isDesktop && styles.desktopTitle]} numberOfLines={2}>
            {property.title}
          </Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteIconContainer}>
            <MaterialIcons name="delete" size={22} color="#D32F2F" />
          </TouchableOpacity>
        </View>

        <View style={[styles.statusBadge, isAvailable ? styles.available : styles.rented]}>
          <Text style={[styles.statusText, isAvailable ? styles.availableText : styles.rentedText]}>
            {isAvailable ? "Available" : "Rented"}
          </Text>
        </View>

        <Text style={[styles.location, isDesktop && styles.desktopLocation]} numberOfLines={1}>
          📍 {property.location}
        </Text>
        <Text style={[styles.price, isDesktop && styles.desktopPrice]}>${property.price}/month</Text>

        <View style={styles.details}>
          <Text style={[styles.detailItem, isDesktop && styles.desktopDetailItem]}>
            🛏️ {property.bedrooms} {property.bedrooms === 1 ? "bed" : "beds"}
          </Text>
          <Text style={[styles.detailItem, isDesktop && styles.desktopDetailItem]}>
            🚿 {property.bathrooms} {property.bathrooms === 1 ? "bath" : "baths"}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.type, isDesktop && styles.desktopType]}>{property.type}</Text>
          {property.rating > 0 && (
            <Text style={[styles.rating, isDesktop && styles.desktopRating]}>⭐ {property.rating}</Text>
          )}
        </View>

        {isAvailable && (
          <TouchableOpacity onPress={handleBookNow} style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    marginBottom: 16,
  },
  desktopCard: {
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
  },
  desktopImage: {
    height: 240,
  },
  content: {
    padding: 16,
  },
  desktopContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  desktopTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  deleteIconContainer: {
    marginLeft: 8,
    padding: 4,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  available: {
    backgroundColor: "#E8F5E8",
  },
  rented: {
    backgroundColor: "#FFE8E8",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  availableText: {
    color: "#2E7D32",
  },
  rentedText: {
    color: "#D32F2F",
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  desktopLocation: {
    fontSize: 15,
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 12,
  },
  desktopPrice: {
    fontSize: 20,
    marginBottom: 16,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    fontSize: 13,
    color: "#666",
  },
  desktopDetailItem: {
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  type: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  desktopType: {
    fontSize: 15,
  },
  rating: {
    fontSize: 14,
    color: "#FF9500",
  },
  desktopRating: {
    fontSize: 15,
  },
  bookButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 16,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
})
