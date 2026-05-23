import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { theme } from "../../constants/theme";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  style?: ViewStyle;
};

export const Button = ({
  title,
  onPress,
  loading,
  disabled,
  icon,
  variant = "primary",
  style,
}: Props) => {
  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.white,
    },
    ghost: {
      backgroundColor: theme.colors.card,
      color: theme.colors.text,
    },
    danger: {
      backgroundColor: theme.colors.danger,
      color: theme.colors.white,
    },
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: variantStyles.backgroundColor },
        (loading || disabled) && styles.buttonDisabled,
        pressed && !loading && !disabled && styles.buttonPressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.color} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={[styles.title, { color: variantStyles.color }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing(2),
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing(1),
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
});
