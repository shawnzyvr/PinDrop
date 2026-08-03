import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { AddPinModal } from '../screens/main/AddPinModal';
import { MemoryDetailScreen } from '../screens/main/MemoryDetailScreen';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { LoadingOverlay } from '../components/common/LoadingOverlay';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { user, loading } = useAuth();
  const { isDark, colors } = useTheme();

  if (loading) {
    return <LoadingOverlay message="Initializing PinDrop Journal..." />;
  }

  const customNavigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.surfaceBorder,
    },
  };

  return (
    <NavigationContainer theme={customNavigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Authenticated User Flow (Session 4 Slide 21)
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen
              name="AddPinModal"
              component={AddPinModal}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="MemoryDetail"
              component={MemoryDetailScreen}
              options={{
                headerShown: true,
                headerTitle: 'Memory Details',
                headerBackTitle: 'Back',
              }}
            />
          </>
        ) : (
          // Unauthenticated Flow
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
