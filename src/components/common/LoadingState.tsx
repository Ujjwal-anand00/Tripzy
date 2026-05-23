import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { theme } from "../../constants/theme";

export const LoadingState = ({ label = "Loading..." }: { label?: string }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.colors.primary} size="large" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing(5),
  },
  label: {
    color: theme.colors.textMuted,
    marginTop: theme.spacing(1),
  },
});
