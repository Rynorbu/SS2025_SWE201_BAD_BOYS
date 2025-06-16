"use client"

import { View, TextInput, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Ionicons name="search-outline" size={23} color="#007AFF" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search properties by title or location..."
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#999"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
})
