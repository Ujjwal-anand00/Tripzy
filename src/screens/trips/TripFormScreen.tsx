import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import {
  createTripRequest,
  fetchTripById,
  TripPayload,
  updateTripRequest,
} from "../../api/trips";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { LoadingState } from "../../components/common/LoadingState";
import { Screen } from "../../components/common/Screen";
import { SectionHeader } from "../../components/common/SectionHeader";
import { theme } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { TripsStackParamList } from "../../types/navigation";
import { splitCommaList } from "../../utils/format";

type Props = NativeStackScreenProps<TripsStackParamList, "TripForm">;

const initialState = {
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  budget: "",
  travelers: "1",
  preferences: "",
  notes: "",
  status: "planned" as TripPayload["status"],
  latitude: "",
  longitude: "",
};

const tripStatuses: TripPayload["status"][] = ["draft", "planned", "booked"];

export const TripFormScreen = ({ navigation, route }: Props) => {
  const { token } = useAuth();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(route.params.mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrip = async () => {
      if (route.params.mode !== "edit" || !token) {
        return;
      }

      setLoading(true);
      try {
        const response = await fetchTripById(token, route.params.tripId);
        const { trip } = response;

        setForm({
          title: trip.title,
          destination: trip.destination,
          startDate: trip.startDate.slice(0, 10),
          endDate: trip.endDate.slice(0, 10),
          budget: String(trip.budget),
          travelers: String(trip.travelers),
          preferences: trip.preferences.join(", "),
          notes: trip.notes,
          status: trip.status,
          latitude: trip.location.latitude ? String(trip.location.latitude) : "",
          longitude: trip.location.longitude ? String(trip.location.longitude) : "",
        });
        setError(null);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error ? caughtError.message : "Unable to load trip."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [route.params, token]);

  const updateField = (key: keyof typeof initialState, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!token) {
      return;
    }

    if (!form.title || !form.destination || !form.startDate || !form.endDate) {
      setError("Title, destination, and travel dates are required.");
      return;
    }

    if (Number(form.budget) <= 0) {
      setError("Budget must be greater than zero.");
      return;
    }

    if (Number(form.travelers) <= 0) {
      setError("Travelers must be at least 1.");
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError("End date must be after the start date.");
      return;
    }

    setSaving(true);
    try {
      setError(null);

      const payload: TripPayload = {
        title: form.title,
        destination: form.destination,
        startDate: form.startDate,
        endDate: form.endDate,
        budget: Number(form.budget),
        travelers: Number(form.travelers),
        preferences: splitCommaList(form.preferences),
        notes: form.notes,
        status: form.status,
        location: {
          latitude: form.latitude ? Number(form.latitude) : 0,
          longitude: form.longitude ? Number(form.longitude) : 0,
        },
      };

      const response =
        route.params.mode === "edit"
          ? await updateTripRequest(token, route.params.tripId, payload)
          : await createTripRequest(token, payload);

      navigation.replace("TripDetails", { tripId: response.trip._id });
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Unable to save trip.";
      setError(message);
      Alert.alert("Save failed", message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Screen scrollable={false}>
        <LoadingState label="Loading trip details..." />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title={route.params.mode === "edit" ? "Edit Trip" : "Create Trip"}
        subtitle="Set the destination, budget, dates, and preferences the backend will store in MongoDB."
      />

      <Card>
        <Input
          label="Trip Title"
          onChangeText={(value) => updateField("title", value)}
          value={form.title}
        />
        <Input
          label="Destination"
          onChangeText={(value) => updateField("destination", value)}
          value={form.destination}
        />
        <Input
          label="Start Date (YYYY-MM-DD)"
          onChangeText={(value) => updateField("startDate", value)}
          value={form.startDate}
        />
        <Input
          label="End Date (YYYY-MM-DD)"
          onChangeText={(value) => updateField("endDate", value)}
          value={form.endDate}
        />
        <Input
          label="Budget"
          keyboardType="numeric"
          onChangeText={(value) => updateField("budget", value)}
          value={form.budget}
        />
        <Input
          label="Travelers"
          keyboardType="numeric"
          onChangeText={(value) => updateField("travelers", value)}
          value={form.travelers}
        />
        <Input
          label="Preferences"
          onChangeText={(value) => updateField("preferences", value)}
          placeholder="food, culture, nature"
          value={form.preferences}
        />
        <Input
          label="Notes"
          multiline
          onChangeText={(value) => updateField("notes", value)}
          placeholder="Special reminders, accommodation goals, transport notes"
          value={form.notes}
        />
        <Text style={styles.statusLabel}>Status</Text>
        <View style={styles.statusRow}>
          {tripStatuses.map((status) => (
            <Pressable
              key={status}
              onPress={() => updateField("status", status)}
              style={[
                styles.statusChip,
                form.status === status && styles.statusChipActive,
              ]}
            >
              <Text
                style={[
                  styles.statusChipText,
                  form.status === status && styles.statusChipTextActive,
                ]}
              >
                {status}
              </Text>
            </Pressable>
          ))}
        </View>
        <Input
          keyboardType="numeric"
          label="Latitude (optional)"
          onChangeText={(value) => updateField("latitude", value)}
          value={form.latitude}
        />
        <Input
          keyboardType="numeric"
          label="Longitude (optional)"
          onChangeText={(value) => updateField("longitude", value)}
          value={form.longitude}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button loading={saving} onPress={handleSubmit} title="Save Trip" />
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  error: {
    color: theme.colors.danger,
    marginBottom: theme.spacing(2),
  },
  statusLabel: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: theme.spacing(1),
  },
  statusRow: {
    flexDirection: "row",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  statusChip: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  statusChipActive: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  statusChipText: {
    color: theme.colors.text,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  statusChipTextActive: {
    color: theme.colors.white,
  },
});
