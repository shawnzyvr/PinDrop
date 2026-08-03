import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import { MapHomeScreen } from '../screens/main/MapHomeScreen';
import { ListViewScreen } from '../screens/main/ListViewScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { useTheme } from '../theme/ThemeContext';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.surfaceBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarIcon: ({ focused }) => {
          let icon = '🗺️';
          if (route.name === 'ListView') icon = '📖';
          if (route.name === 'Profile') icon = '👤';
          return <Text style={{ fontSize: focused ? 22 : 18 }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen name="MapHome" component={MapHomeScreen} options={{ tabBarLabel: 'Map' }} />
      <Tab.Screen name="ListView" component={ListViewScreen} options={{ tabBarLabel: 'Journal' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};
