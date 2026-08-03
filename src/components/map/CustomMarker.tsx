import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { PinEntry } from '../../types/pin';
import { useTheme } from '../../theme/ThemeContext';

interface CustomMarkerProps {
  pin: PinEntry;
  onPressCallout: (pin: PinEntry) => void;
}

export const CustomMarker: React.FC<CustomMarkerProps> = ({ pin, onPressCallout }) => {
  const { colors, radii } = useTheme();

  return (
    <Marker
      coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
      title={pin.note ? pin.note.slice(0, 30) : 'Memory Pin'}
      description={pin.address}
    >
      <View
        style={[
          styles.markerContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.mapPin,
            borderRadius: radii.full,
          },
        ]}
      >
        {pin.photoUrl ? (
          <Image source={{ uri: pin.photoUrl }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.dot, { backgroundColor: colors.mapPin }]} />
        )}
      </View>
      <Callout onPress={() => onPressCallout(pin)} />
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    padding: 3,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  thumbnail: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});
