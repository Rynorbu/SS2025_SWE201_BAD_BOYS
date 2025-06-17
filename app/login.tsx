"use client"

import "react-native-url-polyfill/auto"
import React, { useState } from "react"
import {
  View,
  Alert,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native"
import { LoginForm } from "../components/LoginForm"
import { AuthBusinessLogic } from "../shared/services/authBusinessLogic"

export default function LoginScreen() {
  const [loading, setLoading] = useState(false)

  const handleMagicLinkLogin = async (email: string) => {
    setLoading(true)

    try {
      const { success, message } = await AuthBusinessLogic.handleMagicLinkLogin(email)
      
      if (success) {
        Alert.alert("Check your email", message)
      } else {
        Alert.alert("Error", message)
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
          <LoginForm onSubmit={handleMagicLinkLogin} loading={loading} />
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
})