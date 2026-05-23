import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "../../constants/theme";

type Props = {
  label: string;
  value: string;
};

export const StatCard = ({ label, value }: Props) => {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flex: 1,
    minHeight: 94,
    padding: theme.spacing(2),
  },
  value: {
    color: theme.colors.primaryDark,
    fontSize: 24,
    fontWeight: "800",
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: theme.spacing(0.75),
  },
});
