import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Alert, RefreshControl, StyleSheet, View } from "react-native";

import { fetchTrips } from "../../api/trips";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import { Screen } from "../../components/common/Screen";
import { SectionHeader } from "../../components/common/SectionHeader";
import { TripCard } from "../../components/trips/TripCard";
import { theme } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { Trip } from "../../types/models";
import { TripsStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<TripsStackParamList, "TripsList">;

export const TripsListScreen = ({ navigation }: Props) => {
  const { token } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTrips = async (isRefresh = false) => {
    if (!token) {
      setTrips([]);
      setLoading(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetchTrips(token);
      setTrips(response.trips);
      setError(null);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Unable to load trips.";
      setError(message);

      if (isRefresh) {
        Alert.alert("Refresh failed", message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [token])
  );

  return (
    <Screen
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadTrips(true)}
          tintColor={theme.colors.primary}
        />
      }
    >
      <SectionHeader
        title="Your Trips"
        subtitle="Every saved trip is connected to itinerary generation, backend storage, and future editing."
      />
      <Button
        onPress={() => navigation.navigate("TripForm", { mode: "create" })}
        style={styles.createButton}
        title="Create a New Trip"
      />

      {loading ? (
        <LoadingState label="Loading trips..." />
      ) : error ? (
        <EmptyState title="Unable to load trips" subtitle={error} />
      ) : trips.length === 0 ? (
        <EmptyState
          title="No trips saved"
          subtitle="Create your first trip to start planning dates, budget, travelers, and itinerary ideas."
        />
      ) : (
        <View>
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              onPress={() => navigation.navigate("TripDetails", { tripId: trip._id })}
              trip={trip}
            />
          ))}
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  createButton: {
    marginBottom: theme.spacing(3),
  },
});
