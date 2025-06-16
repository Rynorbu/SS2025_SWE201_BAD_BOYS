// // app/login.tsx
// import 'react-native-url-polyfill/auto';
// import { useState } from 'react';
// import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
// import { createClient } from '@supabase/supabase-js';
// import { useRouter } from 'expo-router';

// // Supabase credentials from your app.json or .env file
// const supabase = createClient(
//   'https://jkycwmkcpnimncfxovkl.supabase.co',
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreWN3bWtjcG5pbW5jZnhvdmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNjM4NTEsImV4cCI6MjA1OTczOTg1MX0.Hxf-7jpMNqHXI2Lz3Aw6k42B5SRxfM0HPzW__lcIyh0'
// );

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const router = useRouter();

//   const handleMagicLinkLogin = async () => {
//     const { error } = await supabase.auth.signInWithOtp({
//       email,
//     });

//     if (error) {
//       Alert.alert('Error', error.message);
//     } else {
//       Alert.alert('Check your email', 'Magic link sent!');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Magic Link Login</Text>
//       <TextInput
//         placeholder="Enter your email"
//         value={email}
//         onChangeText={setEmail}
//         style={styles.input}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <Button title="Send Magic Link" onPress={handleMagicLinkLogin} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 24,
//     backgroundColor: '#fff',
//   },
//   input: {
//     borderColor: '#ccc',
//     borderWidth: 1,
//     padding: 12,
//     marginBottom: 12,
//     borderRadius: 8,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
// });

"use client"

import "react-native-url-polyfill/auto"
import { useState } from "react"
import { View, TextInput, Button, Alert, StyleSheet, Text } from "react-native"
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
      // Use the current origin as redirect (back to index)
      const redirectUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:8081"

      console.log("🔗 Sending magic link with redirect:", redirectUrl)

      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl, // Redirect back to index.tsx
        },
      })

      if (error) {
        console.error("❌ Magic link error:", error)
        Alert.alert("Error", error.message)
      } else {
        console.log("✅ Magic link sent")
        Alert.alert("Check your email", `We sent a magic link to ${email}. Click the link in your email to sign in.`)
      }
    } catch (err) {
      console.error("💥 Unexpected error:", err)
      Alert.alert("Error", "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Magic Link Login</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <Button title={loading ? "Sending..." : "Send Magic Link"} onPress={handleMagicLinkLogin} disabled={loading} />

      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>Debug Info:</Text>
        <Text style={styles.debugText}>
          Redirect URL: {typeof window !== "undefined" ? window.location.origin : "http://localhost:8081"}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  debugContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  debugText: {
    fontSize: 12,
    color: "#666",
  },
})
