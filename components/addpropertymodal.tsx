"use client"

import { useState, useEffect } from "react"
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
import AsyncStorage from "@react-native-async-storage/async-storage"

interface AddPropertyModalProps {
  visible: boolean
  onClose: () => void
  onAdd: (property: any) => void
}

const STORAGE_KEY = "@property_form_data"

export function AddPropertyModal({ visible, onClose, onAdd }: AddPropertyModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    room: "1",
    bathroom: "1",
    description: "",
    image_url: "",
  })

  useEffect(() => {
    if (visible) {
      loadFormData()
    }
  }, [visible])

  const loadFormData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY)
      if (savedData) {
        setFormData(JSON.parse(savedData))
      }
    } catch (e) {
      console.error("Failed to load form data", e)
    }
  }

  const saveFormData = async (newFormData: typeof formData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFormData))
    } catch (e) {
      console.error("Failed to save form data", e)
    }
  }

  const handleChange = (key: keyof typeof formData, value: string) => {
    const updatedForm = { ...formData, [key]: value }
    setFormData(updatedForm)
    saveFormData(updatedForm)
  }

  const increment = (key: "room" | "bathroom") => {
    const newValue = String(Math.max(1, Number(formData[key]) + 1))
    handleChange(key, newValue)
  }

  const decrement = (key: "room" | "bathroom") => {
    const newValue = String(Math.max(1, Number(formData[key]) - 1))
    handleChange(key, newValue)
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.location || !formData.price) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    const newProperty = {
      ...formData,
      price: Number.parseInt(formData.price),
      room: Number.parseInt(formData.room),
      bathroom: Number.parseInt(formData.bathroom),
    }

    onAdd(newProperty)

    setFormData({
      title: "",
      location: "",
      price: "",
      room: "1",
      bathroom: "1",
      description: "",
      image_url: "",
    })
    AsyncStorage.removeItem(STORAGE_KEY)
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
      handleChange("image_url", result.assets[0].uri)
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
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>

              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => handleChange("title", text)}
              />

              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(text) => handleChange("location", text)}
              />

              <Text style={styles.label}>Monthly Rent (Nu)</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => handleChange("price", text)}
                keyboardType="numeric"
              />
            </View>

            {/* Room & Bathroom */}
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.label}>Rooms</Text>
                <View style={styles.counter}>
                  <TouchableOpacity onPress={() => decrement("room")} style={styles.counterBtn}>
                    <Text style={styles.counterText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{formData.room}</Text>
                  <TouchableOpacity onPress={() => increment("room")} style={styles.counterBtn}>
                    <Text style={styles.counterText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Bathrooms</Text>
                <View style={styles.counter}>
                  <TouchableOpacity onPress={() => decrement("bathroom")} style={styles.counterBtn}>
                    <Text style={styles.counterText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{formData.bathroom}</Text>
                  <TouchableOpacity onPress={() => increment("bathroom")} style={styles.counterBtn}>
                    <Text style={styles.counterText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => handleChange("description", text)}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Image Upload */}
            <View style={styles.section}>
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

          {/* Buttons */}
          <View style={styles.buttonContainer}>
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
    backgroundColor: "#f9f9f9",
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
    marginBottom: 28,
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
    padding: 14,
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
    alignItems: "center",
    marginBottom: 16,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  counterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  counterText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  counterValue: {
    marginHorizontal: 8,
    fontSize: 18,
    minWidth: 24,
    textAlign: "center",
    fontWeight: "600",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
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
