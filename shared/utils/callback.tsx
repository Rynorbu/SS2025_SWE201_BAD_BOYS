import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = async () => {
      const url = await Linking.getInitialURL();

      if (url) {
        const { error } = await supabase.auth.exchangeCodeForSession(url);

        if (error) {
          console.error('Session exchange error:', error.message);
        } else {
          router.replace('/home');
        }
      }
    };

    handleDeepLink();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Finishing login...</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 16,
  },
});
