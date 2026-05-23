import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

import { theme } from "../../constants/theme";

export const Card = ({ style, ...props }: ViewProps) => {
  return <View {...props} style={[styles.card, style]} />;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(2.5),
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
