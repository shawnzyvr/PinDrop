import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from '../config/firebase';
import { useAuth } from './AuthContext';
import { PinEntry, NewPinInput } from '../types/pin';
import { getCachedPins, setCachedPins } from '../utils/storage';

interface PinsContextType {
  pins: PinEntry[];
  loading: boolean;
  addPin: (input: NewPinInput) => Promise<void>;
  deletePin: (pinId: string) => Promise<void>;
  refreshPins: () => Promise<void>;
}

const PinsContext = createContext<PinsContextType | undefined>(undefined);

export const PinsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [pins, setPins] = useState<PinEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      setPins([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1. Load cached pins for offline-first display (Session 7)
    getCachedPins(user.uid).then((cached) => {
      setPins(cached);
      setLoading(false);
    });

    // 2. Real-time Firestore subscription if Firebase is configured
    if (isFirebaseConfigured) {
      try {
        const pinsQuery = query(
          collection(db, 'pins'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(
          pinsQuery,
          (snapshot) => {
            const fetchedPins: PinEntry[] = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                userId: data.userId,
                latitude: data.latitude,
                longitude: data.longitude,
                address: data.address || '',
                note: data.note || '',
                photoUrl: data.photoUrl || '',
                createdAt: data.createdAt || Date.now(),
              };
            });

            setPins(fetchedPins);
            setCachedPins(user.uid, fetchedPins);
            setLoading(false);
          },
          (error) => {
            console.warn('Firestore subscription using local storage mode:', error.message);
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (err) {
        console.warn('Firestore initialization fallback to local storage:', err);
        setLoading(false);
      }
    }
  }, [user]);

  const addPin = async (input: NewPinInput) => {
    if (!user) throw new Error('User not logged in');

    let photoUrl = input.photoUri || '';

    // If real Firebase is configured, upload image to Cloud Storage
    if (isFirebaseConfigured && input.photoUri && !input.photoUri.startsWith('http')) {
      try {
        const response = await fetch(input.photoUri);
        const blob = await response.blob();
        const photoId = `pin_${Date.now()}.jpg`;
        const storageRef = ref(storage, `memories/${user.uid}/${photoId}`);
        await uploadBytes(storageRef, blob);
        photoUrl = await getDownloadURL(storageRef);
      } catch (err) {
        console.warn('Failed to upload image to Firebase Storage, using local photo URI fallback');
      }
    }

    const newPin: PinEntry = {
      id: `pin_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: user.uid,
      latitude: input.latitude,
      longitude: input.longitude,
      address: input.address || 'Unknown spot',
      note: input.note,
      photoUrl,
      createdAt: Date.now(),
    };

    const updatedPins = [newPin, ...pins];
    setPins(updatedPins);
    await setCachedPins(user.uid, updatedPins);

    // Save to Firestore if configured
    if (isFirebaseConfigured) {
      try {
        const docRef = await addDoc(collection(db, 'pins'), {
          userId: newPin.userId,
          latitude: newPin.latitude,
          longitude: newPin.longitude,
          address: newPin.address,
          note: newPin.note,
          photoUrl: newPin.photoUrl,
          createdAt: newPin.createdAt,
        });

        // Replace ID with Firestore document ID
        setPins((prev) =>
          prev.map((p) => (p.id === newPin.id ? { ...p, id: docRef.id } : p))
        );
      } catch (err) {
        console.warn('Firestore save fallback to local AsyncStorage:', err);
      }
    }
  };

  const deletePin = async (pinId: string) => {
    if (!user) return;

    const updated = pins.filter((p) => p.id !== pinId);
    setPins(updated);
    await setCachedPins(user.uid, updated);

    if (isFirebaseConfigured) {
      try {
        if (!pinId.startsWith('pin_')) {
          await deleteDoc(doc(db, 'pins', pinId));
        }
      } catch (err) {
        console.warn('Failed to delete pin from Firestore:', err);
      }
    }
  };

  const refreshPins = async () => {
    if (user) {
      const cached = await getCachedPins(user.uid);
      setPins(cached);
    }
  };

  return (
    <PinsContext.Provider
      value={{ pins, loading, addPin, deletePin, refreshPins }}
    >
      {children}
    </PinsContext.Provider>
  );
};

export const usePins = (): PinsContextType => {
  const context = useContext(PinsContext);
  if (!context) {
    throw new Error('usePins must be used within a PinsProvider');
  }
  return context;
};
