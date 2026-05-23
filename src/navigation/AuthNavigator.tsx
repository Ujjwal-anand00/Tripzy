import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { theme } from "../constants/theme";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { AuthStackParamList } from "../types/navigation";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: {
        backgroundColor: theme.colors.background,
      },
    }}
  >
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);
