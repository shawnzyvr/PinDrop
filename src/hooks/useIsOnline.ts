import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useIsOnline(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // Session 7 Slide 20: Listen for network connectivity status
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(!!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return isOnline;
}
