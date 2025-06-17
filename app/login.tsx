"use client"

import "react-native-url-polyfill/auto"
import { useState } from "react"
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
} from "react-native"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import { supabase } from "../lib/session"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleMagicLinkLogin = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address")
      return
    }

    setLoading(true)

    try {
      const redirectUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:8081"
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      })

      if (error) {
        Alert.alert("Error", error.message)
      } else {
        Alert.alert("Check your email", `We sent a magic link to ${email}. Click the link in your email to sign in.`)
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/login-hotel.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.card}>
            <View style={styles.logoContainer}>
              <FontAwesome5 name="home" size={40} color="#4A90E2" />
            </View>

            <Text style={styles.title}>Login with Magic Link</Text>

            <TextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <TouchableOpacity style={styles.button} onPress={handleMagicLinkLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send Magic Link</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

const { width, height } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 400,
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    width: "100%",
    backgroundColor: "#FAFAFA",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})
