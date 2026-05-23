import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "../../constants/theme";
import { Itinerary } from "../../types/models";
import { formatCurrency } from "../../utils/format";
import { Card } from "../common/Card";

export const ItineraryPreviewCard = ({ itinerary }: { itinerary: Itinerary }) => {
  return (
    <Card>
      <Text style={styles.title}>Generated Itinerary</Text>
      <Text style={styles.overview}>{itinerary.overview}</Text>
      {itinerary.days.map((day) => (
        <View key={day.day} style={styles.dayBlock}>
          <Text style={styles.dayTitle}>
            Day {day.day}: {day.title}
          </Text>
          <Text style={styles.summary}>{day.summary}</Text>
          {day.activities.map((activity, index) => (
            <View key={`${activity.time}-${activity.title}-${index}`} style={styles.activity}>
              <Text style={styles.activityTitle}>
                {activity.time} | {activity.title}
              </Text>
              <Text style={styles.summary}>{activity.description}</Text>
              <Text style={styles.meta}>
                {activity.location} | {formatCurrency(activity.estimatedCost)}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  overview: {
    color: theme.colors.text,
    lineHeight: 22,
    marginTop: theme.spacing(1),
  },
  dayBlock: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  dayTitle: {
    color: theme.colors.secondary,
    fontSize: 16,
    fontWeight: "800",
  },
  summary: {
    color: theme.colors.text,
    lineHeight: 22,
    marginTop: theme.spacing(1),
  },
  activity: {
    marginTop: theme.spacing(1.5),
  },
  activityTitle: {
    color: theme.colors.primaryDark,
    fontWeight: "700",
  },
  meta: {
    color: theme.colors.textMuted,
    marginTop: 6,
  },
});
