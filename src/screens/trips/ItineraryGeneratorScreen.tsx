import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";

import { generateItineraryRequest } from "../../api/itineraries";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { InlineMessage } from "../../components/common/InlineMessage";
import { Screen } from "../../components/common/Screen";
import { SectionHeader } from "../../components/common/SectionHeader";
import { ItineraryPreviewCard } from "../../components/trips/ItineraryPreviewCard";
import { theme } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { Itinerary } from "../../types/models";
import { TripsStackParamList } from "../../types/navigation";
import { splitCommaList } from "../../utils/format";

type Props = NativeStackScreenProps<TripsStackParamList, "ItineraryGenerator">;

export const ItineraryGeneratorScreen = ({ navigation, route }: Props) => {
  const { token } = useAuth();
  const [duration, setDuration] = useState("4");
  const [budget, setBudget] = useState(String(route.params.budget));
  const [preferences, setPreferences] = useState("food, culture, easy pacing");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

 const handleGenerate = async () => {
  if (!token) {
    setError("User not authenticated");
    return;
  }

  if (Number(duration) <= 0) {
    setError("Duration must be at least 1 day.");
    return;
  }

  if (Number(budget) <= 0) {
    setError("Budget must be greater than zero.");
    return;
  }

  setSaving(true);
  setError(null);
  setSuccessMessage(null);

  try {
    const response = await generateItineraryRequest(token, {
      tripId: route.params.tripId,
      destination: route.params.destination,
      budget: Number(budget),
      duration: Number(duration),
      preferences: splitCommaList(preferences),
    });

    // ✅ Validate response
    if (!response || !response.itinerary) {
      throw new Error("Invalid response from server");
    }

    setGeneratedItinerary(response.itinerary);
    setSuccessMessage("AI itinerary generated and saved successfully.");
  } catch (err: any) {
    console.log("❌ ERROR:", err);

    let message = "Failed to generate itinerary";

    // ✅ Better error handling
    if (err?.message === "Network request failed") {
      message = "Cannot connect to server. Check your network or API URL.";
    } else if (err?.response?.data?.message) {
      message = err.response.data.message;
    } else if (err?.message) {
      message = err.message;
    }

    setError(message);
    Alert.alert("Generation failed", message);
  } finally {
    setSaving(false);
  }
};
  return (
    <Screen>
      <SectionHeader
        title="AI Itinerary Generator"
        subtitle={`Generate a structured plan for ${route.params.destination} and store it in MongoDB.`}
      />
      <Card>
        <Input label="Destination" editable={false} value={route.params.destination} />
        <Input
          keyboardType="numeric"
          label="Duration (days)"
          onChangeText={setDuration}
          value={duration}
        />
        <Input
          keyboardType="numeric"
          label="Budget"
          onChangeText={setBudget}
          value={budget}
        />
        <Input
          label="Preferences"
          multiline
          onChangeText={setPreferences}
          placeholder="history, local food, photography"
          value={preferences}
        />
        {error ? <InlineMessage message={error} tone="error" /> : null}
        {successMessage ? <InlineMessage message={successMessage} tone="success" /> : null}
        <Button loading={saving} onPress={handleGenerate} title="Generate with AI" />
        {generatedItinerary ? (
          <Button
            onPress={() => navigation.replace("TripDetails", { tripId: route.params.tripId })}
            style={styles.viewTripButton}
            title="View Saved Trip"
            variant="ghost"
          />
        ) : null}
      </Card>
      {generatedItinerary ? <ItineraryPreviewCard itinerary={generatedItinerary} /> : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  viewTripButton: {
    marginTop: theme.spacing(1.5),
  },
});
