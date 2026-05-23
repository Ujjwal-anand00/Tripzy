import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "../../constants/theme";
import { Trip } from "../../types/models";
import { formatCurrency, formatDateRange } from "../../utils/format";

export const TripCard = ({
  trip,
  onPress,
}: {
  trip: Trip;
  onPress: () => void;
}) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{trip.title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{trip.status}</Text>
        </View>
      </View>
      <Text style={styles.destination}>{trip.destination}</Text>
      <Text style={styles.meta}>
        {formatDateRange(trip.startDate, trip.endDate)} | {trip.travelers} traveler
        {trip.travelers > 1 ? "s" : ""}
      </Text>
      <Text style={styles.budget}>{formatCurrency(trip.budget)}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2.5),
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    marginRight: theme.spacing(1),
  },
  destination: {
    color: theme.colors.secondary,
    fontSize: 15,
    fontWeight: "700",
  },
  meta: {
    color: theme.colors.textMuted,
    marginTop: 10,
  },
  budget: {
    color: theme.colors.primaryDark,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 14,
  },
  badge: {
    backgroundColor: theme.colors.cardAlt,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: theme.colors.primaryDark,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});
