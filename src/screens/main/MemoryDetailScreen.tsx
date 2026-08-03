import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { usePins } from '../../context/PinsContext';
import { useTheme } from '../../theme/ThemeContext';
import { formatDate, formatTime } from '../../utils/date';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

type Props = NativeStackScreenProps<RootStackParamList, 'MemoryDetail'>;

export const MemoryDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { pinId } = route.params;
  const { pins, deletePin } = usePins();
  const { colors, spacing, typography } = useTheme();

  const pin = pins.find((p) => p.id === pinId);

  if (!pin) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <Text style={[typography.title, { color: colors.textPrimary }]}>Memory Not Found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: spacing.md }} />
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Memory Pin',
      'Are you sure you want to delete this memory? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePin(pin.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Full Photo Banner */}
      {pin.photoUrl ? (
        <Image source={{ uri: pin.photoUrl }} style={styles.fullPhoto} resizeMode="cover" />
      ) : (
        <View style={[styles.photoPlaceholder, { backgroundColor: colors.surfaceBorder }]}>
          <Text style={{ fontSize: 60 }}>📍</Text>
        </View>
      )}

      <View style={{ padding: spacing.lg }}>
        {/* Note Title */}
        <Text style={[typography.title, { color: colors.textPrimary, marginBottom: spacing.xs }]}>
          {pin.note}
        </Text>

        <Text style={[typography.caption, { color: colors.textMuted, marginBottom: spacing.md }]}>
          Added on {formatDate(pin.createdAt)} at {formatTime(pin.createdAt)}
        </Text>

        {/* Location Info Card */}
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={[typography.subtitle, { color: colors.textPrimary, marginBottom: spacing.xs }]}>
            📍 Spot Address
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            {pin.address || 'Unknown address'}
          </Text>
          <Text style={[typography.caption, { color: colors.textMuted, marginTop: 4 }]}>
            Coordinates: {pin.latitude.toFixed(5)}, {pin.longitude.toFixed(5)}
          </Text>
        </Card>

        {/* Mini Map View */}
        <Card style={{ padding: 0, overflow: 'hidden', marginBottom: spacing.lg }}>
          <MapView
            style={styles.miniMap}
            initialRegion={{
              latitude: pin.latitude,
              longitude: pin.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <UrlTile
              urlTemplate="https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
              tileSize={256}
              shouldReplaceMapContent={true}
            />
            <Marker coordinate={{ latitude: pin.latitude, longitude: pin.longitude }} />
          </MapView>
        </Card>

        <Button title="Delete Memory" variant="danger" onPress={handleDelete} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  fullPhoto: {
    width: '100%',
    height: 280,
  },
  photoPlaceholder: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniMap: {
    width: '100%',
    height: 160,
  },
});
