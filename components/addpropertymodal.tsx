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
import { Ionicons } from "@expo/vector-icons"

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
      Alert.alert("Missing Information", "Please fill in all required fields")
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
      aspect: [16, 9],
      quality: 0.8,
    })

    if (!result.canceled) {
      handleChange("image_url", result.assets[0].uri)
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.titleTop}>Add New Property</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.form}
              contentContainerStyle={{ paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Image Upload - Moved to top for better UX */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Property Image</Text>
                <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                  {formData.image_url ? (
                    <Image source={{ uri: formData.image_url }} style={styles.imagePreview} />
                  ) : (
                    <View style={styles.placeholderBox}>
                      <Ionicons name="camera" size={40} color="#999" />
                      <Text style={styles.placeholderText}>Tap to select an image</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Basic Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Basic Information</Text>

                <Text style={styles.label}>
                  Title <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.title}
                  onChangeText={(text) => handleChange("title", text)}
                  placeholder="e.g. Modern Apartment in City Center"
                  placeholderTextColor="#999"
                />

                <Text style={styles.label}>
                  Location <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.location}
                  onChangeText={(text) => handleChange("location", text)}
                  placeholder="e.g. Thimphu, Bhutan"
                  placeholderTextColor="#999"
                />

                <Text style={styles.label}>
                  Monthly Rent (Nu) <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.price}
                  onChangeText={(text) => handleChange("price", text)}
                  keyboardType="numeric"
                  placeholder="e.g. 15000"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Room & Bathroom */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Property Details</Text>
                <View style={styles.detailsCard}>
                  <View style={styles.row}>
                    <View style={styles.labelContainer}>
                      <Ionicons name="bed-outline" size={20} color="#555" />
                      <Text style={styles.detailLabel}>Bedrooms</Text>
                    </View>
                    <View style={styles.counter}>
                      <TouchableOpacity onPress={() => decrement("room")} style={styles.counterBtn}>
                        <Ionicons name="remove" size={20} color="#007AFF" />
                      </TouchableOpacity>
                      <Text style={styles.counterValue}>{formData.room}</Text>
                      <TouchableOpacity onPress={() => increment("room")} style={styles.counterBtn}>
                        <Ionicons name="add" size={20} color="#007AFF" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.row}>
                    <View style={styles.labelContainer}>
                      <Ionicons name="water-outline" size={20} color="#555" />
                      <Text style={styles.detailLabel}>Bathrooms</Text>
                    </View>
                    <View style={styles.counter}>
                      <TouchableOpacity onPress={() => decrement("bathroom")} style={styles.counterBtn}>
                        <Ionicons name="remove" size={20} color="#007AFF" />
                      </TouchableOpacity>
                      <Text style={styles.counterValue}>{formData.bathroom}</Text>
                      <TouchableOpacity onPress={() => increment("bathroom")} style={styles.counterBtn}>
                        <Ionicons name="add" size={20} color="#007AFF" />
                      </TouchableOpacity>
                    </View>
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
                  numberOfLines={6}
                  placeholder="Describe your property, including amenities, nearby facilities, etc."
                  placeholderTextColor="#999"
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.uploadBtn, 
                  (!formData.title || !formData.location || !formData.price) && styles.disabledBtn
                ]} 
                onPress={handleSubmit}
                disabled={!formData.title || !formData.location || !formData.price}
              >
                <Text style={styles.uploadText}>Upload Property</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 50 : 10,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  closeButton: {
    padding: 8,
  },
  titleTop: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  form: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#FF3B30",
  },
  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 16,
    color: "#333",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  counterBtn: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  counterValue: {
    width: 40,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  cancelBtn: {
    backgroundColor: "#F2F2F2",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  uploadBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 2,
    alignItems: "center",
  },
  disabledBtn: {
    backgroundColor: "#A0C8FF",
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
    backgroundColor: "#f0f0f0",
  },
  placeholderBox: {
    height: 200,
    borderRadius: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  placeholderText: {
    marginTop: 8,
    color: "#999",
    fontSize: 14,
  },
})