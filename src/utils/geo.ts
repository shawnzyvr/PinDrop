import * as Location from 'expo-location';

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export function formatAddressFromGeocode(
  geocodeResult: Location.LocationGeocodedAddress
): string {
  const parts: string[] = [];
  if (geocodeResult.name && geocodeResult.name !== geocodeResult.street) {
    parts.push(geocodeResult.name);
  }
  if (geocodeResult.streetNumber || geocodeResult.street) {
    parts.push(
      [geocodeResult.streetNumber, geocodeResult.street]
        .filter(Boolean)
        .join(' ')
    );
  }
  if (geocodeResult.city || geocodeResult.subregion) {
    parts.push(geocodeResult.city || geocodeResult.subregion || '');
  }
  if (geocodeResult.country) {
    parts.push(geocodeResult.country);
  }

  return parts.filter(Boolean).join(', ') || 'Unknown location';
}
