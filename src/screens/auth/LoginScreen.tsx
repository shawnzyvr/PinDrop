import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

// Session 5 Slide 10: Zod schema definition
const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof LoginSchema>;
type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const { colors, spacing, typography } = useTheme();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Session 5 Slide 11: React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    try {
      await login(data.email, data.password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    // Session 5 Slide 14-15: KeyboardAvoidingView pattern
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Text style={{ fontSize: 48, marginBottom: spacing.sm }}>📍</Text>
          <Text style={[typography.title, { color: colors.textPrimary, textAlign: 'center' }]}>
            PinDrop Journal
          </Text>
          <Text
            style={[
              typography.body,
              { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
            ]}
          >
            Log in to access your personal memory map
          </Text>
        </View>

        {errorMsg && (
          <View style={[styles.errorBanner, { backgroundColor: colors.danger + '15', borderColor: colors.danger }]}>
            <Text style={[typography.caption, { color: colors.danger, textAlign: 'center' }]}>
              {errorMsg}
            </Text>
          </View>
        )}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Email Address"
              placeholder="you@example.com"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Password"
              placeholder="••••••••"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="done"
              error={errors.password?.message}
            />
          )}
        />

        <Button
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          style={{ marginTop: spacing.md }}
        />

        <View style={[styles.footerRow, { marginTop: spacing.xl }]}>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={[typography.body, { color: colors.primary, fontWeight: '600' }]}>
              Sign Up
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  errorBanner: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
