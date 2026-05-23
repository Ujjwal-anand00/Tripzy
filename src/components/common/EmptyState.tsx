import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "../../constants/theme";

export const EmptyState = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderColor: theme.colors.border,
    borderWidth: 1,
    padding: theme.spacing(3),
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    color: theme.colors.textMuted,
    marginTop: theme.spacing(1),
    lineHeight: 20,
  },
});
