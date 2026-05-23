import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { deleteTripRequest, fetchTripById } from "../../api/trips";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { LoadingState } from "../../components/common/LoadingState";
import { Screen } from "../../components/common/Screen";
import { SectionHeader } from "../../components/common/SectionHeader";
import { ItineraryPreviewCard } from "../../components/trips/ItineraryPreviewCard";
import { theme } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { Trip } from "../../types/models";
import { TripsStackParamList } from "../../types/navigation";
import { formatCurrency, formatDateRange } from "../../utils/format";

type Props = NativeStackScreenProps<TripsStackParamList, "TripDetails">;

export const TripDetailsScreen = ({ navigation, route }: Props) => {
  const { token } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTrip = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetchTripById(token, route.params.tripId);
      setTrip(response.trip);
      setError(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to load trip.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [route.params.tripId, token]);

  const confirmDelete = async () => {
    if (!token || !trip) {
      return;
    }

    setDeleting(true);
    try {
      await deleteTripRequest(token, trip._id);
      navigation.navigate("TripsList");
    } catch (caughtError) {
      Alert.alert(
        "Delete failed",
        caughtError instanceof Error ? caughtError.message : "Unable to delete trip."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Delete trip?", "This will permanently remove the trip and its itinerary.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: confirmDelete },
    ]);
  };

  if (loading) {
    return (
      <Screen scrollable={false}>
        <LoadingState label="Loading trip..." />
      </Screen>
    );
  }

  if (!trip) {
    return (
      <Screen>
        <SectionHeader
          title="Trip unavailable"
          subtitle={error || "This trip could not be loaded."}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title={trip.title}
        subtitle={`${trip.destination} | ${formatDateRange(trip.startDate, trip.endDate)}`}
      />

      <Card style={styles.card}>
        <Text style={styles.metricLabel}>Status</Text>
        <Text style={styles.metricValue}>{trip.status}</Text>
        <Text style={styles.metricLabel}>Budget</Text>
        <Text style={styles.metricValue}>{formatCurrency(trip.budget)}</Text>
        <Text style={styles.metricLabel}>Travelers</Text>
        <Text style={styles.metricValue}>{trip.travelers}</Text>
        {(trip.location.latitude || trip.location.longitude) ? (
          <>
            <Text style={styles.metricLabel}>Saved Coordinates</Text>
            <Text style={styles.paragraph}>
              {trip.location.latitude}, {trip.location.longitude}
            </Text>
          </>
        ) : null}
        <Text style={styles.metricLabel}>Preferences</Text>
        <Text style={styles.paragraph}>
          {trip.preferences.length ? trip.preferences.join(", ") : "No preferences added"}
        </Text>
        <Text style={styles.metricLabel}>Notes</Text>
        <Text style={styles.paragraph}>{trip.notes || "No notes yet."}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>AI Itinerary</Text>
        {trip.itinerary ? (
          <View style={styles.previewWrap}>
            <ItineraryPreviewCard itinerary={trip.itinerary} />
          </View>
        ) : (
          <Text style={styles.paragraph}>
            No itinerary yet. Generate one from your trip details.
          </Text>
        )}
        <Button
          onPress={() =>
            navigation.navigate("ItineraryGenerator", {
              tripId: trip._id,
              destination: trip.destination,
              budget: trip.budget,
            })
          }
          style={styles.actionSpacing}
          title={trip.itinerary ? "Regenerate Itinerary" : "Generate Itinerary"}
          variant="secondary"
        />
      </Card>

      <Button
        onPress={() => navigation.navigate("TripForm", { mode: "edit", tripId: trip._id })}
        style={styles.actionSpacing}
        title="Edit Trip"
        variant="ghost"
      />
      <Button
        loading={deleting}
        onPress={handleDelete}
        title="Delete Trip"
        variant="danger"
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing(2),
  },
  metricLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: theme.spacing(1.5),
    textTransform: "uppercase",
  },
  metricValue: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 4,
    textTransform: "capitalize",
  },
  paragraph: {
    color: theme.colors.text,
    lineHeight: 22,
    marginTop: theme.spacing(1),
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  previewWrap: {
    marginTop: theme.spacing(1.5),
  },
  actionSpacing: {
    marginBottom: theme.spacing(2),
  },
});
