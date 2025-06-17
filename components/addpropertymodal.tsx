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
  SafeAreaView,
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
      Alert.alert("Permission needed", "Please allow access to your photos.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    })

    if (!result.canceled) {
      handleChange("image_url", result.assets[0].uri)
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Property</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Image */}
            <TouchableOpacity onPress={pickImage} style={styles.imageSection}>
              {formData.image_url ? (
                <Image source={{ uri: formData.image_url }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imageText}>📷 Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Basic Info */}
            <View style={styles.section}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => handleChange("title", text)}
                placeholder="Property title"
              />

              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(text) => handleChange("location", text)}
                placeholder="City, Area"
              />

              <Text style={styles.label}>Monthly Rent (Nu) *</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => handleChange("price", text)}
                keyboardType="numeric"
                placeholder="eg. 15000"
              />
            </View>

            {/* Rooms & Bathrooms */}
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.label}>Bedrooms</Text>
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
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => handleChange("description", text)}
                multiline
                numberOfLines={4}
                placeholder="Describe your property..."
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Submit Button */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[
                styles.submitBtn, 
                (!formData.title || !formData.location || !formData.price) && styles.disabledBtn
              ]} 
              onPress={handleSubmit}
              disabled={!formData.title || !formData.location || !formData.price}
            >
              <Text style={styles.submitText}>Add Property</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeText: {
    fontSize: 16,
    color: "#007AFF",
  },
  form: {
    flex: 1,
    padding: 16,
  },
  imageSection: {
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  imageText: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  textArea: {
    height: 80,
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
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  counterBtn: {
    padding: 12,
    minWidth: 44,
    alignItems: "center",
  },
  counterText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
  },
  counterValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    minWidth: 30,
    textAlign: "center",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  submitBtn: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledBtn: {
    backgroundColor: "#ccc",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})