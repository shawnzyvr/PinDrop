import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...rest }) => {
  const { colors, spacing, radii, typography } = useTheme();

  return (
    <View style={{ marginBottom: spacing.md, width: '100%' }}>
      {label && (
        <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.xs }]}>
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.textPrimary,
            borderColor: error ? colors.danger : colors.surfaceBorder,
            borderRadius: radii.md,
            padding: spacing.md,
          },
          style,
        ]}
        {...rest}
      />
      {error && (
        <Text style={[typography.caption, { color: colors.danger, marginTop: spacing.xs }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    fontSize: 15,
  },
});
