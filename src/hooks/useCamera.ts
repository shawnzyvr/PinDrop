import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export function useCamera() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const takePhoto = async () => {
    setLoading(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission is required to capture photos.');
        setLoading(false);
        return null;
      }

      // Session 9 Slide 11: Image capture with quality 0.7 compression
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setPhotoUri(uri);
        setLoading(false);
        return uri;
      }
    } catch (err) {
      console.error('Error taking photo:', err);
    }
    setLoading(false);
    return null;
  };

  const pickImage = async () => {
    setLoading(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Photo library permission is required to select photos.');
        setLoading(false);
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setPhotoUri(uri);
        setLoading(false);
        return uri;
      }
    } catch (err) {
      console.error('Error picking image:', err);
    }
    setLoading(false);
    return null;
  };

  const clearPhoto = () => setPhotoUri(null);

  return {
    photoUri,
    loading,
    takePhoto,
    pickImage,
    clearPhoto,
    setPhotoUri,
  };
}
