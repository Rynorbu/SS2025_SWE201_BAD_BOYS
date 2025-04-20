import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const sendOtp = async () => {
    if (phone.trim() === '') {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setOtpSent(true);
      Alert.alert('OTP Sent', 'An OTP has been sent to your phone.');
    }
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });

    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
      Alert.alert('Success', 'You are logged in!');
      // You can navigate to another screen here
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/home.png')} // Update the path with your house-related image
        style={styles.logo}
      />
      {/* <Image
  source={{ uri: 'https://www.flaticon.com/free-icons/home ' }}
  style={styles.logo}
/> */}
      <Text style={styles.title}>House Rental Management</Text>
      <Text style={styles.subtitle}>Login to find your dream home</Text>

      <TextInput
        style={styles.input}
        placeholder="Phone number"
        keyboardType="phone-pad"
        onChangeText={setPhone}
        value={phone}
      />

      {otpSent && (
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          keyboardType="phone-pad"
          onChangeText={setOtp}
          value={otp}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={!otpSent ? sendOtp : handleLogin}
      >
        <Text style={styles.buttonText}>{otpSent ? 'Login' : 'Send OTP'}</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Uncomment to add a sign-up option */}
      {/* 
      <TouchableOpacity>
        <Text style={styles.link}>Create an Account!</Text>
      </TouchableOpacity> 
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 100,
    backgroundColor: '#f0f8ff',
    marginHorizontal: 20,
    borderRadius: 40,
  },
  logo: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
    color: '#34495e',
  },
  input: {
    backgroundColor: '#ecf0f1',
    padding: 12,
    borderRadius: 25,
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#1abc9c',
    padding: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  link: {
    color: '#1abc9c',
    textAlign: 'center',
    marginTop: 10,
  },
});
