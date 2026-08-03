import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { formatAddressFromGeocode } from '../utils/geo';

export interface LocationState {
  latitude: number;
  longitude: number;
  address: string;
  loading: boolean;
  errorMsg: string | null;
  permissionGranted: boolean;
}

export function useLocation() {
  const [locationState, setLocationState] = useState<LocationState>({
    latitude: 37.78825, // Default fallback coordinates (San Francisco)
    longitude: -122.4324,
    address: 'Determining location...',
    loading: true,
    errorMsg: null,
    permissionGranted: false,
  });

  const fetchLocation = async () => {
    setLocationState((prev) => ({ ...prev, loading: true, errorMsg: null }));
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationState((prev) => ({
          ...prev,
          loading: false,
          permissionGranted: false,
          errorMsg: 'Permission to access location was denied.',
        }));
        return;
      }

      // Session 9 Slide 14: One-shot read with balanced accuracy
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = loc.coords;
      let address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

      try {
        // Session 9 Slide 15: Reverse geocoding
        const geocoded = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocoded && geocoded.length > 0) {
          address = formatAddressFromGeocode(geocoded[0]);
        }
      } catch (e) {
        console.warn('Geocoding failed, using raw coordinates:', e);
      }

      setLocationState({
        latitude,
        longitude,
        address,
        loading: false,
        errorMsg: null,
        permissionGranted: true,
      });
    } catch (err: any) {
      setLocationState((prev) => ({
        ...prev,
        loading: false,
        errorMsg: err.message || 'Could not fetch current location.',
      }));
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return {
    ...locationState,
    refreshLocation: fetchLocation,
  };
}
