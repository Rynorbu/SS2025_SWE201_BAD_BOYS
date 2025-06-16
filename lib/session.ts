// // // lib/session.ts
// // import * as SecureStore from 'expo-secure-store';
// // import { createClient } from '@supabase/supabase-js';

// // export const supabase = createClient(
// //   'https://jkycwmkcpnimncfxovkl.supabase.co',
// //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreWN3bWtjcG5pbW5jZnhvdmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNjM4NTEsImV4cCI6MjA1OTczOTg1MX0.Hxf-7jpMNqHXI2Lz3Aw6k42B5SRxfM0HPzW__lcIyh0'
// // );

// // const SESSION_KEY = 'supabase.session';

// // export const saveSession = async (session: any) => {
// //   await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
// // };

// // export const getSavedSession = async () => {
// //   const sessionStr = await SecureStore.getItemAsync(SESSION_KEY);
// //   return sessionStr ? JSON.parse(sessionStr) : null;
// // };

// // export const clearSession = async () => {
// //   await SecureStore.deleteItemAsync(SESSION_KEY);
// // };

// // lib/session.ts

// import * as SecureStore from 'expo-secure-store'; 

// import { createClient } from '@supabase/supabase-js';

// export const supabase = createClient(
//   'https://jkycwmkcpnimncfxovkl.supabase.co',
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreWN3bWtjcG5pbW5jZnhvdmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNjM4NTEsImV4cCI6MjA1OTczOTg1MX0.Hxf-7jpMNqHXI2Lz3Aw6k42B5SRxfM0HPzW__lcIyh0'
// );

// const SESSION_KEY = 'supabase.session';

// export const saveSession = async (session: any) => {
//   try {
//     await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
//   } catch (err) {
//     console.error('Error saving session:', err);
//   }
// };

// export const getSavedSession = async () => {
//   try {
//     const sessionStr = await SecureStore.getItemAsync(SESSION_KEY);
//     return sessionStr ? JSON.parse(sessionStr) : null;
//   } catch (err) {
//     console.error('Error getting session:', err);
//     return null;
//   }
// };

// export const clearSession = async () => {
//   try {
//     await SecureStore.deleteItemAsync(SESSION_KEY);
//   } catch (err) {
//     console.error('Error clearing session:', err);
//   }
// };

import * as SecureStore from "expo-secure-store"
import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  "https://jkycwmkcpnimncfxovkl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreWN3bWtjcG5pbW5jZnhvdmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNjM4NTEsImV4cCI6MjA1OTczOTg1MX0.Hxf-7jpMNqHXI2Lz3Aw6k42B5SRxfM0HPzW__lcIyh0",
  {
    auth: {
      // Set the redirect URL for magic links
      redirectTo: "http://localhost:8081/store/callback", 
      autoRefreshToken: true,
      persistSession: true,
    },
  },
)

const SESSION_KEY = "supabase.session"

export const saveSession = async (session: any) => {
  try {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session))
  } catch (err) {
    console.error("Error saving session:", err)
  }
}

export const getSavedSession = async () => {
  try {
    const sessionStr = await SecureStore.getItemAsync(SESSION_KEY)
    return sessionStr ? JSON.parse(sessionStr) : null
  } catch (err) {
    console.error("Error getting session:", err)
    return null
  }
}

export const clearSession = async () => {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY)
  } catch (err) {
    console.error("Error clearing session:", err)
  }
}

// Listen for auth state changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === "SIGNED_IN" && session) {
    await saveSession(session)
  } else if (event === "SIGNED_OUT") {
    await clearSession()
  }
})
