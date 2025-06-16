"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, StyleSheet, Alert } from "react-native"

interface AddPropertyModalProps {
  visible: boolean
  onClose: () => void
  onAdd: (property: any) => void
}

export function AddPropertyModal({ visible, onClose, onAdd }: AddPropertyModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    room: "",
    bathroom: "",
    // area: "",
    // type: "Apartment",
    description: "",
    // amenities: "",
    image_url: "/placeholder.svg?height=200&width=300",
  })

  // const propertyTypes = ["Apartment", "House", "Studio", "Condo", "Townhouse"]

  const handleSubmit = () => {
    if (!formData.title || !formData.location || !formData.price) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    const newProperty = {
      ...formData,
      price: Number.parseInt(formData.price),
      room: Number.parseInt(formData.room) || 1,
      bathroom: Number.parseInt(formData.bathroom) || 1,
      // area: Number.parseInt(formData.area) || 0,
    }

    onAdd(newProperty)
    setFormData({
      title: "",
      location: "",
      price: "",
      room: "",
      bathroom: "",
      // area: "",
      // type: "Apartment",
      description: "",
      // amenities: "",
      image_url: "/placeholder.svg?height=200&width=300",
    })
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add New Property</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.saveButton}>Upload</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder=""
            />

            <Text style={styles.label}>Location </Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              placeholder=""
            />

            <Text style={styles.label}>Monthly Rent (Nu) </Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              placeholder=""
              keyboardType="numeric"
            />
          </View>

          {/* Property Details */}
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>room</Text>
                <TextInput
                  style={styles.input}
                  value={formData.room}
                  onChangeText={(text) => setFormData({ ...formData, room: text })}
                  placeholder=""
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>bathroom</Text>
                <TextInput
                  style={styles.input}
                  value={formData.bathroom}
                  onChangeText={(text) => setFormData({ ...formData, bathroom: text })}
                  placeholder=""
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Description Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder=""
              multiline
              numberOfLines={4}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingTop: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  cancelButton: {
    fontSize: 16,
    color: "#666",
  },
  saveButton: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  form: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 0.48,
  },
  typeSelector: {
    marginBottom: 16,
  },
  typeButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedType: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  typeText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  selectedTypeText: {
    color: "#fff",
  },
})
