import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import { theme } from "../constants/theme";
import { ChatScreen } from "../screens/chat/ChatScreen";
import { HomeScreen } from "../screens/home/HomeScreen";
import { MapScreen } from "../screens/map/MapScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { AppTabParamList } from "../types/navigation";
import { TripsNavigator } from "./TripsNavigator";

const Tab = createBottomTabNavigator<AppTabParamList>();

export const MainTabsNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.textMuted,
      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.border,
        height: 68,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarIcon: ({ color, size }) => {
        const icons: Record<keyof AppTabParamList, keyof typeof Ionicons.glyphMap> = {
          Home: "compass-outline",
          Trips: "briefcase-outline",
          Map: "map-outline",
          Chat: "chatbubble-ellipses-outline",
          Profile: "person-circle-outline",
        };

        return <Ionicons color={color} name={icons[route.name]} size={size} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Trips" component={TripsNavigator} />
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Chat" component={ChatScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);
