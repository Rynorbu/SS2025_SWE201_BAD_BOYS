"use client"

import React from "react"
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

interface PropertyDetailsProps {
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
    description: string // Added description field
  }
  onClose: () => void
}

export function PropertyDetails({ property, onClose }: PropertyDetailsProps) {
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: property.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.location}>📍 {property.location}</Text>
        <Text style={styles.price}>${property.price}/month</Text>

        <View style={styles.detailsRow}>
          <Text style={styles.detailItem}>🛏️ {property.bedrooms} Bedrooms</Text>
          <Text style={styles.detailItem}>🚿 {property.bathrooms} Bathrooms</Text>
        </View>

        <Text style={styles.detailItem}>📐 {property.area} sq ft</Text>
        <Text style={styles.detailItem}>🏠 Type: {property.type}</Text>
        <Text style={styles.detailItem}>⭐ Rating: {property.rating}</Text>

        <View style={[styles.statusBadge, property.isAvailable ? styles.available : styles.rented]}>
          <Text style={styles.statusText}>{property.isAvailable ? "Available" : "Rented"}</Text>
        </View>

        {/* Added property description */}
        <Text style={styles.description}>{property.description}</Text>

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "#f0f0f0",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    fontSize: 16,
    color: "#444",
    marginBottom: 8,
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 16,
  },
  available: {
    backgroundColor: "#d4edda",
  },
  rented: {
    backgroundColor: "#f8d7da",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#155724",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 8,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginTop: 16,
    lineHeight: 24,
  },
})
