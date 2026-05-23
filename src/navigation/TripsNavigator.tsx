import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { theme } from "../constants/theme";
import { ItineraryGeneratorScreen } from "../screens/trips/ItineraryGeneratorScreen";
import { TripDetailsScreen } from "../screens/trips/TripDetailsScreen";
import { TripFormScreen } from "../screens/trips/TripFormScreen";
import { TripsListScreen } from "../screens/trips/TripsListScreen";
import { TripsStackParamList } from "../types/navigation";

const TripsStack = createNativeStackNavigator<TripsStackParamList>();

export const TripsNavigator = () => (
  <TripsStack.Navigator
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
    <TripsStack.Screen
      name="TripsList"
      component={TripsListScreen}
      options={{ title: "Trips" }}
    />
    <TripsStack.Screen
      name="TripForm"
      component={TripFormScreen}
      options={{ title: "Trip Editor" }}
    />
    <TripsStack.Screen
      name="TripDetails"
      component={TripDetailsScreen}
      options={{ title: "Trip Details" }}
    />
    <TripsStack.Screen
      name="ItineraryGenerator"
      component={ItineraryGeneratorScreen}
      options={{ title: "AI Itinerary" }}
    />
  </TripsStack.Navigator>
);
