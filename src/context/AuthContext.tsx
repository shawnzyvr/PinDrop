import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, isFirebaseConfigured } from '../config/firebase';
import { UserProfile } from '../types/user';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const LOCAL_USER_KEY = '@pindrop_local_user_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isFirebaseConfigured) {
      try {
        const unsubscribe = onAuthStateChanged(
          auth,
          (firebaseUser: User | null) => {
            if (firebaseUser) {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Explorer',
              });
            } else {
              setUser(null);
            }
            setLoading(false);
          },
          (error) => {
            console.warn('Firebase Auth state error, falling back to local mode:', error.message);
            loadLocalUserSession();
          }
        );
        return () => unsubscribe();
      } catch (err) {
        console.warn('Firebase Auth init error, falling back to local mode:', err);
        loadLocalUserSession();
      }
    } else {
      loadLocalUserSession();
    }
  }, []);

  const loadLocalUserSession = async () => {
    try {
      const stored = await AsyncStorage.getItem(LOCAL_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch (e) {
      console.warn('Failed to load local user session:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    if (isFirebaseConfigured) {
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        return;
      } catch (err: any) {
        console.warn('Firebase login attempt:', err.code, err.message);
        if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          throw new Error('Invalid email or password.');
        }
        // For API key errors or unconfigured projects, proceed to local session
      }
    }

    // Local authentication fallback (always succeeds)
    const localUser: UserProfile = {
      uid: 'local_' + Math.abs(email.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)),
      email,
      displayName: email.split('@')[0] || 'Explorer',
    };
    await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    setUser(localUser);
  };

  const register = async (email: string, pass: string) => {
    if (isFirebaseConfigured) {
      try {
        await createUserWithEmailAndPassword(auth, email, pass);
        return;
      } catch (err: any) {
        console.warn('Firebase register attempt:', err.code, err.message);
        if (err.code === 'auth/email-already-in-use') {
          throw new Error('That email address is already in use.');
        }
        // For API key errors or unconfigured projects, proceed to local session
      }
    }

    // Local registration fallback (always succeeds)
    const localUser: UserProfile = {
      uid: 'local_' + Math.abs(email.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)),
      email,
      displayName: email.split('@')[0] || 'Explorer',
    };
    await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    setUser(localUser);
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        // ignore
      }
    }
    await AsyncStorage.removeItem(LOCAL_USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
