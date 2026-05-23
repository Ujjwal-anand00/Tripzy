import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "tripzy.auth.token";

const secureStoreAvailable = Platform.OS !== "web";

export const tokenStorage = {
  async getToken() {
    if (secureStoreAvailable) {
      return SecureStore.getItemAsync(TOKEN_KEY);
    }

    return AsyncStorage.getItem(TOKEN_KEY);
  },
  async saveToken(token: string) {
    if (secureStoreAvailable) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      return;
    }

    await AsyncStorage.setItem(TOKEN_KEY, token);
  },
  async clearToken() {
    if (secureStoreAvailable) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      return;
    }

    await AsyncStorage.removeItem(TOKEN_KEY);
  },
};
