import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '';

export const isFirebaseConfigured = Boolean(
  apiKey &&
  apiKey.length > 20 &&
  !apiKey.includes('Placeholder') &&
  !apiKey.includes('your_actual') &&
  !apiKey.includes('AIzaSyDemo')
);

const firebaseConfig = {
  apiKey: apiKey || 'AIzaSyPlaceholderKeyForPinDropJournal',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'pindrop-journal.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'pindrop-journal',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'pindrop-journal.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789012:web:1234567890abcdef',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Fix Firebase warning by initializing Auth with AsyncStorage persistence
let authInstance;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
