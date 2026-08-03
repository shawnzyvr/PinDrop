# PinDrop Journal 📍

**PinDrop Journal** is a location-based memory mapper app for travelers, foodies, and everyday explorers. Instead of a standard list of diary entries, PinDrop Journal provides an interactive map where users can drop pins at their exact GPS location, attach photos, and write notes.

Built for **BIT4.6A – Advanced Mobile Development (SS 26)** by Shayan Naghibi.

---

## 📱 Features

- 🗺️ **Interactive Map & Markers**: Interactive map rendering custom pin markers with thumbnails.
- 🎯 **GPS Location & Geocoding**: Real-time GPS location via `expo-location` and reverse geocoding into readable street addresses.
- 📷 **Camera & Photo Capture**: Photo capture using `expo-camera` / `expo-image-picker` with compression (`quality: 0.7`).
- 📳 **Haptic Feedback**: Tactile responses via `expo-haptics` when dropping pins or completing actions.
- 🔐 **Firebase Authentication**: User registration, login, and session persistence.
- ☁️ **Cloud Storage & Firestore**: Real-time sync of coordinates, addresses, notes, and uploaded photos.
- 💾 **Offline-First Persistence**: Local pin caching with `@react-native-async-storage/async-storage` and network detection via `@react-native-community/netinfo`.
- 🎨 **Design System & Dark Mode**: Design tokens (`src/theme/tokens.ts`) with Light & Dark mode support.
- 📑 **Virtualized Journal List**: Performance-optimized `FlatList` with search filter and pull-to-refresh.

---

## 🛠️ Tech Stack

- **Framework**: React Native with Expo (TypeScript Strict Mode)
- **Navigation**: React Navigation v7 (`@react-navigation/native-stack`, `@react-navigation/bottom-tabs`)
- **Map API**: `react-native-maps`
- **Backend & Database**: Firebase (Auth, Firestore, Storage)
- **Local Persistence**: `@react-native-async-storage/async-storage`
- **Hardware Integration**: `expo-location`, `expo-camera`, `expo-image-picker`, `expo-haptics`
- **Forms & Validation**: `react-hook-form`, `zod`, `@hookform/resolvers`
- **Testing**: Jest, `@testing-library/react-native`

---

## 📋 Course Requirements Checklist

| Requirement | Demonstrated? | Where to find in code |
| :--- | :---: | :--- |
| **Navigation across multiple screens** | ✅ | [RootNavigator.tsx](file:///C:/Users/shawnzy/.gemini/antigravity/scratch/PinDropJournal/src/navigation/RootNavigator.tsx), [MainNavigator.tsx](file:///C:/Users/shawnzy/.gemini/antigravity/scratch/PinDropJournal/src/navigation/MainNavigator.tsx) |
| **State management** | ✅ | [AuthContext.tsx](file:///C:/Users/shawnzy/.gemini/antigravity/scratch/PinDropJournal/src/context/AuthContext.tsx), [PinsContext.tsx](file:///C:/Users/shawnzy/.gemini/antigravity/scratch/PinDropJournal/src/context/PinsContext.tsx), [ThemeContext.tsx](file:///C:/Users/shawnzy/.gemini/antigravity/scratch/PinDropJournal/src/theme/ThemeContext.tsx) |
| **TypeScript used properly** | ✅ | Typed props, models, navigation params in [src/types/](file:///C:/Users/shawnzy/.gemini/antigravity/scratch/PinDropJournal/src/types) |
| **Backend & External API** | ✅ | Firebase Auth, Firestore, and Storage in [firebase.ts](file:///C:/Users/shawnzy/.gemini/antigravity/scratch/PinDropJournal/src/config/firebase.ts) |
| **Local Data Persistence** | ✅ | Offline pin caching in [storage.ts](file:///C:/Users/shawnzy/.gemini/antigravity/scratch/PinDropJournal/src/utils/storage.ts) |
| **Device Hardware Features** | ✅ | GPS & Geocoding in [useLocation.ts](file:///C:/Users/shawnzy/.gemini/antigravity/scratch/PinDropJournal/src/hooks/useLocation.ts), Camera in [useCamera.ts](file:///C:/Users/shawnzy/.gemini/antigravity/scratch/PinDropJournal/src/hooks/useCamera.ts), Haptics in [Button.tsx](file:///C:/Users/shawnzy/.gemini/antigravity/scratch/PinDropJournal/src/components/common/Button.tsx) |
| **Clean & Responsive UI** | ✅ | Design tokens in [tokens.ts](file:///C:/Users/shawnzy/.gemini/antigravity/scratch/PinDropJournal/src/theme/tokens.ts), Flexbox layouts across screens |
| **Error handling & loading states** | ✅ | Form validation with Zod in [LoginScreen.tsx](file:///C:/Users/shawnzy/.gemini/antigravity/scratch/PinDropJournal/src/screens/auth/LoginScreen.tsx), Loading overlays, network status hook [useIsOnline.ts](file:///C:/Users/shawnzy/.gemini/antigravity/scratch/PinDropJournal/src/hooks/useIsOnline.ts) |

---

## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js (LTS version)
- Expo Go app on your physical device or an Android/iOS emulator

### Installation

1. Clone or open the repository in IntelliJ / WebStorm / VS Code:
```bash
cd PinDropJournal
```

2. Install dependencies:
```bash
npm install
```

3. Start the Expo development server:
```bash
npx expo start
```

4. Scan the QR code using **Expo Go** on your physical phone (or press `a` for Android Emulator / `i` for iOS Simulator).

### Running Automated Tests
```bash
npm test
```
