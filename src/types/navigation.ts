import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type TripsStackParamList = {
  TripsList: undefined;
  TripForm: { mode: "create" } | { mode: "edit"; tripId: string };
  TripDetails: { tripId: string };
  ItineraryGenerator: { tripId: string; destination: string; budget: number };
};

export type AppTabParamList = {
  Home: undefined;
  Trips: NavigatorScreenParams<TripsStackParamList>;
  Map: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppTabParamList>;
};
