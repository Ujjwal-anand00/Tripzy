import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { theme } from "../src/constants/theme";
import { HomeScreen } from "../src/screens/home/HomeScreen";

type HomeStackParamList = {
  HomeMain: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: {
        backgroundColor: theme.colors.background,
      },
    }}
  >
    <Stack.Screen name="HomeMain" component={HomeScreen} />
  </Stack.Navigator>
);

export default HomeStack;
