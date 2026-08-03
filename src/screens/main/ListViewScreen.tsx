import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../types/navigation';
import { usePins } from '../../context/PinsContext';
import { useIsOnline } from '../../hooks/useIsOnline';
import { useTheme } from '../../theme/ThemeContext';
import { PinCard } from '../../components/journal/PinCard';
import { Input } from '../../components/common/Input';
import { PinEntry } from '../../types/pin';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'ListView'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const ListViewScreen: React.FC<Props> = ({ navigation }) => {
  const { pins, refreshPins, deletePin } = usePins();
  const isOnline = useIsOnline();
  const { colors, spacing, typography } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshPins();
    setRefreshing(false);
  };

  const filteredPins = useMemo(() => {
    if (!searchQuery.trim()) return pins;
    const q = searchQuery.toLowerCase();
    return pins.filter(
      (p) =>
        p.note.toLowerCase().includes(q) ||
        (p.address && p.address.toLowerCase().includes(q))
    );
  }, [pins, searchQuery]);

  const handlePinPress = useCallback(
    (pin: PinEntry) => {
      navigation.navigate('MemoryDetail', { pinId: pin.id });
    },
    [navigation]
  );

  const handleDeletePin = useCallback(
    (pinId: string) => {
      deletePin(pinId);
    },
    [deletePin]
  );

  const renderItem = useCallback(
    ({ item }: { item: PinEntry }) => (
      <PinCard pin={item} onPress={handlePinPress} onDelete={handleDeletePin} />
    ),
    [handlePinPress, handleDeletePin]
  );

  const keyExtractor = useCallback((item: PinEntry) => item.id, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Offline Banner */}
      {!isOnline && (
        <View style={[styles.offlineBanner, { backgroundColor: colors.accent }]}>
          <Text style={[typography.caption, { color: '#000000', fontWeight: '600' }]}>
            ⚡ Offline mode: showing cached memories
          </Text>
        </View>
      )}

      {/* Header & Search */}
      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md }}>
        <Text style={[typography.title, { color: colors.textPrimary, marginBottom: spacing.sm }]}>
          Journal Entries
        </Text>
        <Input
          placeholder="Search by note or address..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Session 5 Slide 18: Virtualized FlatList */}
      <FlatList
        data={filteredPins}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ padding: spacing.md, flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 40, marginBottom: spacing.sm }}>📖</Text>
            <Text style={[typography.subtitle, { color: colors.textPrimary, textAlign: 'center' }]}>
              {searchQuery ? 'No matching memories found' : 'No pins dropped yet'}
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs }]}>
              {searchQuery
                ? 'Try searching for another keyword'
                : 'Switch to the Map tab or tap "+ Drop Pin" to log your first spot!'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  offlineBanner: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
});
