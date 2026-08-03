import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Platform } from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { usePins } from '../../context/PinsContext';
import { useLocation } from '../../hooks/useLocation';
import { useTheme } from '../../theme/ThemeContext';
import { CustomMarker } from '../../components/map/CustomMarker';
import { PinEntry } from '../../types/pin';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

export const MapHomeScreen: React.FC<Props> = ({ navigation }) => {
  const mapRef = useRef<MapView | null>(null);
  const { pins } = usePins();
  const { latitude, longitude, permissionGranted } = useLocation();
  const { colors, spacing, radii, typography } = useTheme();

  useEffect(() => {
    if (mapRef.current && latitude && longitude) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        },
        1000
      );
    }
  }, [latitude, longitude]);

  const handleCenterOnUser = () => {
    if (mapRef.current && latitude && longitude) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        },
        1000
      );
    }
  };

  const handleCalloutPress = (pin: PinEntry) => {
    navigation.navigate('MemoryDetail', { pinId: pin.id });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: latitude || 37.78825,
          longitude: longitude || -122.4324,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={permissionGranted}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
      >
        {/* Raster Tile Layer with shouldReplaceMapContent so tiles render on Android without Google API key restriction */}
        <UrlTile
          urlTemplate="https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          tileSize={256}
          shouldReplaceMapContent={true}
        />

        {pins.map((pin) => (
          <CustomMarker key={pin.id} pin={pin} onPressCallout={handleCalloutPress} />
        ))}
      </MapView>

      {/* Floating Header Badge */}
      <View style={[styles.headerBadge, { backgroundColor: colors.surface, borderRadius: radii.md }]}>
        <Text style={[typography.subtitle, { color: colors.textPrimary }]}>📍 PinDrop Journal</Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          {pins.length} {pins.length === 1 ? 'memory' : 'memories'} saved
        </Text>
      </View>

      {/* Locate Me FAB */}
      <Pressable
        onPress={handleCenterOnUser}
        style={[styles.locateBtn, { backgroundColor: colors.surface, borderRadius: radii.full }]}
        accessibilityRole="button"
        accessibilityLabel="Center map on my location"
      >
        <Text style={{ fontSize: 20 }}>🎯</Text>
      </Pressable>

      {/* Drop Pin Action FAB */}
      <Pressable
        onPress={() => navigation.navigate('AddPinModal', { latitude, longitude })}
        style={[
          styles.fab,
          { backgroundColor: colors.primary, borderRadius: radii.full, paddingHorizontal: spacing.lg },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Drop new memory pin"
      >
        <Text style={[typography.button, { color: '#FFFFFF' }]}>+ Drop Pin</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  headerBadge: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  locateBtn: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
