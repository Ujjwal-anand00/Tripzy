import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, RefreshControl, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { fetchTrips } from "../../api/trips";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { EmptyState } from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import { Screen } from "../../components/common/Screen";
import { StatCard } from "../../components/common/StatCard";
import { TripCard } from "../../components/trips/TripCard";
import { theme } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { Trip } from "../../types/models";
import { AppTabParamList } from "../../types/navigation";

export const HomeScreen = () => {
  const navigation = useNavigation<BottomTabNavigationProp<AppTabParamList>>();
  const { token, user } = useAuth();
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
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, [token]);

  const bookedTrips = trips.filter((trip) => trip.status === "booked").length;
  const totalBudget = trips.reduce((sum, trip) => sum + trip.budget, 0);

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
      <View style={styles.hero}>
        <Text style={styles.kicker}>Welcome back</Text>
        <Text style={styles.heroTitle}>{user?.name?.split(" ")[0]}, where next?</Text>
        <Text style={styles.heroSubtitle}>
          Build trips, ask the AI assistant for route help, and turn rough ideas
          into realistic day-wise plans.
        </Text>
        <View style={styles.heroActions}>
          <Button
            icon={<Ionicons color={theme.colors.white} name="add-outline" size={18} />}
            onPress={() =>
              navigation.navigate("Trips", {
                screen: "TripForm",
                params: { mode: "create" },
              })
            }
            title="Create Trip"
          />
          <Button
            icon={
              <Ionicons
                color={theme.colors.text}
                name="chatbubble-ellipses-outline"
                size={18}
              />
            }
            onPress={() => navigation.navigate("Chat")}
            title="Open AI Chat"
            variant="ghost"
          />
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard label="Saved trips" value={String(trips.length)} />
        <StatCard label="Booked trips" value={String(bookedTrips)} />
      </View>

      <Card style={styles.highlight}>
        <Text style={styles.highlightTitle}>Your travel dashboard</Text>
        <Text style={styles.highlightMeta}>
          {trips.length} saved trip{trips.length === 1 ? "" : "s"} | AI chat, maps,
          and itinerary generation connected end-to-end.
        </Text>
        <View style={styles.highlightActions}>
          <Button
            icon={<Ionicons color={theme.colors.white} name="map-outline" size={18} />}
            onPress={() => navigation.navigate("Map")}
            title="Explore Map"
            variant="secondary"
          />
          <Button
            icon={<Ionicons color={theme.colors.text} name="briefcase-outline" size={18} />}
            onPress={() => navigation.navigate("Trips", { screen: "TripsList" })}
            title={`Budgeted ${new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(totalBudget || 0)}`}
            variant="ghost"
          />
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Trips</Text>
      </View>

      {loading ? (
        <LoadingState label="Loading your trips..." />
      ) : error ? (
        <EmptyState title="Unable to load trips" subtitle={error} />
      ) : trips.length === 0 ? (
        <EmptyState
          title="No trips yet"
          subtitle="Start with a destination and budget, then let the itinerary generator fill in the details."
        />
      ) : (
        <View>
          {trips.slice(0, 3).map((trip) => (
            <TripCard
              key={trip._id}
              onPress={() =>
                navigation.navigate("Trips", {
                  screen: "TripDetails",
                  params: { tripId: trip._id },
                })
              }
              trip={trip}
            />
          ))}
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  hero: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
  },
  kicker: {
    color: "#d6f1f3",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: theme.spacing(1),
    textTransform: "uppercase",
  },
  heroTitle: {
    color: theme.colors.white,
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
  },
  heroSubtitle: {
    color: "#daf6f8",
    fontSize: 15,
    lineHeight: 22,
    marginTop: theme.spacing(1),
  },
  heroActions: {
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(3),
  },
  highlight: {
    backgroundColor: theme.colors.cardAlt,
    marginBottom: theme.spacing(3),
  },
  statsRow: {
    flexDirection: "row",
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(3),
  },
  highlightTitle: {
    color: theme.colors.primaryDark,
    fontSize: 18,
    fontWeight: "800",
  },
  highlightMeta: {
    color: theme.colors.text,
    lineHeight: 22,
    marginTop: theme.spacing(1),
  },
  highlightActions: {
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(2),
  },
  sectionHeader: {
    marginBottom: theme.spacing(1),
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
});
