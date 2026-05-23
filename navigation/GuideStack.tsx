import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { theme } from "../src/constants/theme";
import { ChatScreen } from "../src/screens/chat/ChatScreen";
import { MapScreen } from "../src/screens/map/MapScreen";

type GuideStackParamList = {
  GuideChat: undefined;
  GuideMap: undefined;
};

const Stack = createNativeStackNavigator<GuideStackParamList>();

export const GuideStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: theme.colors.text,
      headerStyle: {
        backgroundColor: theme.colors.background,
      },
      headerShadowVisible: false,
      contentStyle: {
        backgroundColor: theme.colors.background,
      },
    }}
  >
    <Stack.Screen
      name="GuideChat"
      component={ChatScreen}
      options={{ title: "AI Guide" }}
    />
    <Stack.Screen
      name="GuideMap"
      component={MapScreen}
      options={{ title: "Destination Map" }}
    />
  </Stack.Navigator>
);

export default GuideStack;
