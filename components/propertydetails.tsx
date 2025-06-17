"use client"

import React from "react"
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

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
    description: string
  }
  onClose: () => void
}

export function PropertyDetails({ property, onClose }: PropertyDetailsProps) {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image with overlay */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: property.image }} style={styles.image} />
          <View style={styles.imageOverlay}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={[styles.statusChip, property.isAvailable ? styles.availableChip : styles.rentedChip]}>
              <Text style={styles.statusChipText}>
                {property.isAvailable ? "Available" : "Rented"}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Main Info */}
          <View style={styles.mainInfo}>
            <Text style={styles.title}>{property.title}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.location}>{property.location}</Text>
            </View>
            <Text style={styles.price}>Nu {property.price.toLocaleString()}</Text>
            <Text style={styles.priceLabel}>per month</Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureBox}>
              <Ionicons name="bed" size={24} color="#007AFF" />
              <Text style={styles.featureNumber}>{property.bedrooms}</Text>
              <Text style={styles.featureLabel}>Bedrooms</Text>
            </View>
            <View style={styles.featureBox}>
              <Ionicons name="water" size={24} color="#007AFF" />
              <Text style={styles.featureNumber}>{property.bathrooms}</Text>
              <Text style={styles.featureLabel}>Bathrooms</Text>
            </View>
            <View style={styles.featureBox}>
              <Ionicons name="resize" size={24} color="#007AFF" />
              <Text style={styles.featureNumber}>{property.area}</Text>
              <Text style={styles.featureLabel}>sq ft</Text>
            </View>
          </View>

          {/* Description */}
          {property.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>About this property</Text>
              <Text style={styles.description}>{property.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "#f0f0f0",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  availableChip: {
    backgroundColor: "#34C759",
  },
  rentedChip: {
    backgroundColor: "#FF3B30",
  },
  statusChipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  mainInfo: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginLeft: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: "800",
    color: "#007AFF",
    marginBottom: 2,
  },
  priceLabel: {
    fontSize: 14,
    color: "#999",
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  featureBox: {
    alignItems: "center",
  },
  featureNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 8,
    marginBottom: 4,
  },
  featureLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  descriptionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
})