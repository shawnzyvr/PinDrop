import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { PinEntry } from '../../types/pin';
import { useTheme } from '../../theme/ThemeContext';
import { formatRelativeTime } from '../../utils/date';
import { Card } from '../common/Card';

interface PinCardProps {
  pin: PinEntry;
  onPress: (pin: PinEntry) => void;
  onDelete?: (pinId: string) => void;
}

// Session 10 Slide 12: Wrap list item in React.memo to prevent unnecessary re-renders
export const PinCard = React.memo<PinCardProps>(({ pin, onPress, onDelete }) => {
  const { colors, spacing, radii, typography } = useTheme();

  return (
    <Pressable onPress={() => onPress(pin)} style={{ marginBottom: spacing.md }}>
      <Card style={styles.cardContainer}>
        {pin.photoUrl ? (
          <Image source={{ uri: pin.photoUrl }} style={[styles.image, { borderRadius: radii.md }]} />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: colors.surfaceBorder, borderRadius: radii.md }]}>
            <Text style={{ fontSize: 24 }}>📍</Text>
          </View>
        )}

        <View style={[styles.content, { marginLeft: spacing.md }]}>
          <Text
            style={[typography.subtitle, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {pin.note || 'Untitled Memory'}
          </Text>

          <Text
            style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}
            numberOfLines={1}
          >
            📍 {pin.address || `${pin.latitude.toFixed(3)}, ${pin.longitude.toFixed(3)}`}
          </Text>

          <View style={[styles.footer, { marginTop: spacing.xs }]}>
            <Text style={[typography.caption, { color: colors.textMuted }]}>
              {formatRelativeTime(pin.createdAt)}
            </Text>

            {onDelete && (
              <Pressable onPress={() => onDelete(pin.id)} hitSlop={8}>
                <Text style={[typography.caption, { color: colors.danger }]}>Delete</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  );
});

PinCard.displayName = 'PinCard';

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
  },
  placeholder: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
