import AsyncStorage from '@react-native-async-storage/async-storage';
import { PinEntry } from '../types/pin';

const PINS_CACHE_KEY = '@pindrop_cached_pins_';

export async function getCachedPins(userId: string): Promise<PinEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(`${PINS_CACHE_KEY}${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (error) {
    console.error('Failed to load cached pins:', error);
  }
  return [];
}

export async function setCachedPins(
  userId: string,
  pins: PinEntry[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(`${PINS_CACHE_KEY}${userId}`, JSON.stringify(pins));
  } catch (error) {
    console.error('Failed to save cached pins:', error);
  }
}
