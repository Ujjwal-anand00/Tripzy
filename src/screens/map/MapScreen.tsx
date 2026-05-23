import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

import { fetchDestinations } from "../../api/destinations";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Screen } from "../../components/common/Screen";
import { defaultMapRegion } from "../../constants/config";
import { theme } from "../../constants/theme";
import { Destination } from "../../types/models";

export const MapScreen = () => {
  const mapRef = useRef<MapView | null>(null);
  const [query, setQuery] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [region, setRegion] = useState<Region>(defaultMapRegion);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDestinations = async (nextQuery = "") => {
    setLoading(true);
    try {
      const response = await fetchDestinations(nextQuery);
      setDestinations(response.destinations);
      setSelectedDestination(response.destinations[0] || null);
      setError(null);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Unable to load destinations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const handleSearch = async () => {
    await loadDestinations(query);
  };

  const focusDestination = (destination: Destination) => {
    setSelectedDestination(destination);
    const nextRegion = {
      latitude: destination.latitude,
      longitude: destination.longitude,
      latitudeDelta: 1.2,
      longitudeDelta: 1.2,
    };
    setRegion(nextRegion);
    mapRef.current?.animateToRegion(nextRegion, 600);
  };

  const locateMe = async () => {
    setLocationLoading(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        Alert.alert("Location access denied", "Enable location permission to center the map.");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const nextRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 1.8,
        longitudeDelta: 1.8,
      };

      setRegion(nextRegion);
      mapRef.current?.animateToRegion(nextRegion, 600);
      setError(null);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Unable to fetch your location.";
      setError(message);
      Alert.alert("Location unavailable", message);
    } finally {
      setLocationLoading(false);
    }
  };

  const chips = useMemo(
    () =>
      destinations.slice(0, 5).map((destination) => (
        <Pressable
          key={destination.id}
          onPress={() => focusDestination(destination)}
          style={styles.chip}
        >
          <Text style={styles.chipText}>{destination.name}</Text>
        </Pressable>
      )),
    [destinations]
  );

  return (
    <Screen scrollable={false} padded={false}>
      <View style={styles.container}>
        <View style={styles.searchPanel}>
          <Input
            label="Explore destinations"
            onChangeText={setQuery}
            placeholder="Search cities, countries, or themes"
            returnKeyType="search"
            value={query}
            onSubmitEditing={handleSearch}
          />
          <View style={styles.searchActions}>
            <Pressable onPress={handleSearch} style={styles.iconButton}>
              <Ionicons color={theme.colors.white} name="search" size={20} />
            </Pressable>
            <Pressable onPress={locateMe} style={styles.iconButtonSecondary}>
              {locationLoading ? (
                <ActivityIndicator color={theme.colors.secondary} />
              ) : (
                <Ionicons color={theme.colors.secondary} name="locate" size={20} />
              )}
            </Pressable>
          </View>
          <View style={styles.chipsRow}>{chips}</View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <MapView
          initialRegion={region}
          onRegionChangeComplete={setRegion}
          ref={mapRef}
          style={styles.map}
        >
          {destinations.map((destination) => (
            <Marker
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              key={destination.id}
              onPress={() => setSelectedDestination(destination)}
              title={destination.name}
              description={destination.description}
            />
          ))}
        </MapView>

        {selectedDestination ? (
          <Card style={styles.overlayCard}>
            <Text style={styles.overlayTitle}>{selectedDestination.name}</Text>
            <Text style={styles.overlayCountry}>{selectedDestination.country}</Text>
            <Text style={styles.overlayDescription}>
              {selectedDestination.description}
            </Text>
            <Text style={styles.overlayTags}>
              {selectedDestination.tags.join(" | ")}
            </Text>
          </Card>
        ) : null}

        {loading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </View>
        ) : null}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchPanel: {
    paddingHorizontal: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  searchActions: {
    flexDirection: "row",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  iconButtonSecondary: {
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: 16,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  chip: {
    backgroundColor: "#f1dcc0",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    color: theme.colors.primaryDark,
    fontWeight: "700",
  },
  map: {
    flex: 1,
  },
  overlayCard: {
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    position: "absolute",
    right: theme.spacing(2),
  },
  overlayTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  overlayCountry: {
    color: theme.colors.secondary,
    fontWeight: "700",
    marginTop: 4,
  },
  overlayDescription: {
    color: theme.colors.text,
    lineHeight: 22,
    marginTop: theme.spacing(1),
  },
  overlayTags: {
    color: theme.colors.textMuted,
    marginTop: theme.spacing(1),
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: "rgba(245,240,230,0.6)",
    justifyContent: "center",
  },
  error: {
    color: theme.colors.danger,
    marginBottom: theme.spacing(1),
  },
});
