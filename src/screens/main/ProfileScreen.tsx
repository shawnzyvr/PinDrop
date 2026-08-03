import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { usePins } from '../../context/PinsContext';
import { useTheme } from '../../theme/ThemeContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { pins } = usePins();
  const { isDark, toggleTheme, colors, spacing, radii, typography } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ padding: spacing.lg }}>
        <Text style={[typography.title, { color: colors.textPrimary, marginBottom: spacing.lg }]}>
          User Profile
        </Text>

        {/* User Card */}
        <Card style={[styles.userCard, { marginBottom: spacing.md }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary, borderRadius: radii.full }]}>
            <Text style={{ fontSize: 32, color: '#FFFFFF' }}>👤</Text>
          </View>
          <View style={{ marginLeft: spacing.md, flex: 1 }}>
            <Text style={[typography.subtitle, { color: colors.textPrimary }]}>
              {user?.displayName || 'Explorer'}
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary }]}>
              {user?.email || 'Logged in user'}
            </Text>
          </View>
        </Card>

        {/* Stats Card */}
        <Card style={[styles.statsCard, { marginBottom: spacing.md }]}>
          <View style={styles.statItem}>
            <Text style={[typography.title, { color: colors.primary, fontSize: 32 }]}>
              {pins.length}
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Total Pins Dropped
            </Text>
          </View>
        </Card>

        {/* Theme Toggle Settings Card */}
        <Card style={[styles.settingsRow, { marginBottom: spacing.xl }]}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.subtitle, { color: colors.textPrimary }]}>
              Dark Mode
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Switch between Light and Dark interface
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.surfaceBorder, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </Card>

        <Button title="Sign Out" variant="outline" onPress={logout} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
