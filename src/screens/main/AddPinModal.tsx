import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { usePins } from '../../context/PinsContext';
import { useLocation } from '../../hooks/useLocation';
import { useCamera } from '../../hooks/useCamera';
import { useTheme } from '../../theme/ThemeContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

const AddPinSchema = z.object({
  note: z.string().min(1, 'Please enter a note for this spot').max(500, 'Note is too long'),
});

type AddPinFormData = z.infer<typeof AddPinSchema>;
type Props = NativeStackScreenProps<RootStackParamList, 'AddPinModal'>;

export const AddPinModal: React.FC<Props> = ({ route, navigation }) => {
  const { addPin } = usePins();
  const location = useLocation();
  const camera = useCamera();
  const { colors, spacing, radii, typography } = useTheme();
  const [submitting, setSubmitting] = useState(false);

  const activeLat = route.params?.latitude || location.latitude;
  const activeLng = route.params?.longitude || location.longitude;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddPinFormData>({
    resolver: zodResolver(AddPinSchema),
    defaultValues: {
      note: '',
    },
  });

  const onSubmit = async (data: AddPinFormData) => {
    setSubmitting(true);
    try {
      await addPin({
        latitude: activeLat,
        longitude: activeLng,
        address: location.address,
        note: data.note,
        photoUri: camera.photoUri || undefined,
      });

      // Session 9 Slide 19: Haptic feedback for completed action
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (err) {
      console.error('Failed to add pin:', err);
      alert('Failed to drop pin. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[typography.title, { color: colors.textPrimary }]}>
            📍 Drop Memory Pin
          </Text>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Text style={[typography.button, { color: colors.textSecondary }]}>Cancel</Text>
          </Pressable>
        </View>

        {/* Location Box */}
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={[typography.subtitle, { color: colors.textPrimary, marginBottom: spacing.xs }]}>
            Current GPS Spot
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            {location.loading ? 'Fetching location...' : location.address}
          </Text>
          <Text style={[typography.caption, { color: colors.textMuted, marginTop: 4 }]}>
            {activeLat.toFixed(5)}, {activeLng.toFixed(5)}
          </Text>
        </Card>

        {/* Photo Attachment Section */}
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={[typography.subtitle, { color: colors.textPrimary, marginBottom: spacing.sm }]}>
            Photo Attachment
          </Text>

          {camera.photoUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: camera.photoUri }} style={[styles.photoPreview, { borderRadius: radii.md }]} />
              <Pressable
                onPress={camera.clearPhoto}
                style={[styles.removePhotoBtn, { backgroundColor: colors.danger, borderRadius: radii.full }]}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>✕</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.photoButtonsRow}>
              <Button
                title="📷 Snap Photo"
                variant="outline"
                onPress={camera.takePhoto}
                style={{ flex: 1, marginRight: spacing.xs }}
              />
              <Button
                title="🖼️ Pick Image"
                variant="outline"
                onPress={camera.pickImage}
                style={{ flex: 1, marginLeft: spacing.xs }}
              />
            </View>
          )}
        </Card>

        {/* Note Input */}
        <Controller
          control={control}
          name="note"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Memory Note"
              placeholder="What makes this spot special? (e.g. Best sunset view in town)"
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: 'top' }}
              error={errors.note?.message}
            />
          )}
        />

        <Button
          title="Save Memory Pin"
          onPress={handleSubmit(onSubmit)}
          loading={submitting}
          style={{ marginTop: spacing.md }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoButtonsRow: {
    flexDirection: 'row',
  },
  previewContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  photoPreview: {
    width: '100%',
    height: 180,
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
