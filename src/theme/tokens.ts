export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 9999,
};

export const typography = {
  title: { fontSize: 24, fontWeight: '700' as const, lineHeight: 30 },
  subtitle: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  button: { fontSize: 16, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
};

export const lightColors = {
  primary: '#2A65F0',
  primaryDark: '#1E4CB8',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceBorder: '#E5E7EB',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  danger: '#EF4444',
  success: '#10B981',
  accent: '#F59E0B',
  mapPin: '#EF4444',
  cardShadow: 'rgba(0,0,0,0.06)',
};

export const darkColors = {
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  background: '#111827',
  surface: '#1F2937',
  surfaceBorder: '#374151',
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textMuted: '#9CA3AF',
  danger: '#F87171',
  success: '#34D399',
  accent: '#FBBF24',
  mapPin: '#F87171',
  cardShadow: 'rgba(0,0,0,0.3)',
};

export type ThemeColors = typeof lightColors;
