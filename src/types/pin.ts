export interface PinEntry {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  address?: string;
  note: string;
  photoUrl?: string;
  createdAt: number;
}

export interface NewPinInput {
  latitude: number;
  longitude: number;
  address?: string;
  note: string;
  photoUri?: string;
}
