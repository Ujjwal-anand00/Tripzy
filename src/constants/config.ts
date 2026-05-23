import { Region } from "react-native-maps";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.77:5000/api";

export const defaultMapRegion: Region = {
  latitude: 12.9716,
  longitude: 77.5946,
  latitudeDelta: 4.8,
  longitudeDelta: 4.8,
};
