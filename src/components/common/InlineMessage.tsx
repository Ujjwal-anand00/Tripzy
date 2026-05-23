import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "../../constants/theme";

type Props = {
  message: string;
  tone?: "error" | "success" | "info";
};

export const InlineMessage = ({ message, tone = "info" }: Props) => {
  const palette = {
    error: {
      backgroundColor: "#fde8e8",
      borderColor: "#f3b6b6",
      textColor: theme.colors.danger,
    },
    success: {
      backgroundColor: "#e6f6ec",
      borderColor: "#b9e3c8",
      textColor: theme.colors.success,
    },
    info: {
      backgroundColor: "#eef7f7",
      borderColor: "#c5dedd",
      textColor: theme.colors.secondary,
    },
  }[tone];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
        },
      ]}
    >
      <Text style={[styles.text, { color: palette.textColor }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    marginBottom: theme.spacing(2),
    paddingHorizontal: theme.spacing(1.5),
    paddingVertical: theme.spacing(1.25),
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
});
