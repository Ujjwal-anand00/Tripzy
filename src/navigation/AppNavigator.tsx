import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { LoadingState } from "../components/common/LoadingState";
import { Screen } from "../components/common/Screen";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../types/navigation";
import { AuthNavigator } from "./AuthNavigator";
import { MainTabsNavigator } from "./MainTabsNavigator";

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { initializing, user } = useAuth();

  if (initializing) {
    return (
      <Screen scrollable={false}>
        <LoadingState label="Preparing Tripzy..." />
      </Screen>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="App" component={MainTabsNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
