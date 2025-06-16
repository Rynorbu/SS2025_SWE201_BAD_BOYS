"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import * as ImagePicker from "expo-image-picker"

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
    description: "",
    image_url: "",
  })

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
    }

    onAdd(newProperty)
    setFormData({
      title: "",
      location: "",
      price: "",
      room: "",
      bathroom: "",
      description: "",
      image_url: "",
    })
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission denied", "We need permission to access your media library.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setFormData({ ...formData, image_url: result.assets[0].uri })
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.titleTop}>Add New Property</Text>

          <ScrollView
            style={styles.form}
            contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Basic Info */}
            <View style={[styles.section, styles.spacedSection]}>
              <Text style={styles.sectionTitle}>Basic Information</Text>

              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />

              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
              />

              <Text style={styles.label}>Monthly Rent (Nu)</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                keyboardType="numeric"
              />
            </View>

            {/* Property Details */}
            <View style={[styles.section, styles.spacedSection]}>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Room</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.room}
                    onChangeText={(text) => setFormData({ ...formData, room: text })}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Bathroom</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.bathroom}
                    onChangeText={(text) => setFormData({ ...formData, bathroom: text })}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={[styles.section, styles.spacedSection]}>
              <Text style={styles.sectionTitle}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Image Upload */}
            <View style={[styles.section, styles.spacedSection]}>
              <Text style={styles.sectionTitle}>Image</Text>
              {formData.image_url ? (
                <Image source={{ uri: formData.image_url }} style={styles.imagePreview} />
              ) : (
                <View style={styles.placeholderBox}>
                  <Text style={{ color: "#888" }}>No image selected</Text>
                </View>
              )}
              <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
                <Text style={styles.uploadText}>Select Image</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Bottom Buttons */}
          <View style={[styles.buttonContainer, styles.spacedButtonContainer]}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadBtn} onPress={handleSubmit}>
              <Text style={styles.uploadText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  titleTop: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  form: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    // Removed marginBottom here to use spacedSection for controlled spacing
  },
  spacedSection: {
    marginBottom: 32, // Added space between each main section
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  spacedButtonContainer: {
    marginTop: 16, // extra space above buttons for breathing room
  },
  cancelBtn: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  uploadBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  cancelText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  uploadText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  imageBtn: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  placeholderBox: {
    height: 200,
    borderRadius: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
  },
})
