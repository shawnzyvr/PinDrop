import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../theme/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { colors, spacing, radii, typography } = useTheme();

  const handlePress = () => {
    if (disabled || loading) return;
    // Session 9 Slide 19: Haptic feedback on tap
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress();
  };

  let bg = colors.primary;
  let textCol = '#FFFFFF';
  let borderCol = 'transparent';

  if (variant === 'secondary') {
    bg = colors.surfaceBorder;
    textCol = colors.textPrimary;
  } else if (variant === 'danger') {
    bg = colors.danger;
    textCol = '#FFFFFF';
  } else if (variant === 'outline') {
    bg = 'transparent';
    textCol = colors.primary;
    borderCol = colors.primary;
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bg,
          borderColor: borderCol,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          borderRadius: radii.md,
          opacity: disabled || loading ? 0.6 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textCol} />
      ) : (
        <Text style={[typography.button, { color: textCol, textAlign: 'center' }, textStyle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
