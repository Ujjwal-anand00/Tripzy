import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import { theme } from "../../constants/theme";

type Props = TextInputProps & {
  label: string;
  error?: string | null;
};

export const Input = ({ label, error, style, ...props }: Props) => {
  const multiline = Boolean(props.multiline);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={theme.colors.textMuted}
        style={[styles.input, multiline && styles.multilineInput, style]}
        textAlignVertical={multiline ? "top" : "center"}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing(2),
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    color: theme.colors.text,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1.5),
  },
  multilineInput: {
    minHeight: 110,
    paddingTop: theme.spacing(1.75),
  },
  error: {
    color: theme.colors.danger,
    fontSize: 12,
    marginTop: 6,
  },
});
