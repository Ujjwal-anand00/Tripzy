import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "../../constants/theme";

type Props = {
  title: string;
  subtitle?: string;
};

export const SectionHeader = ({ title, subtitle }: Props) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing(2),
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 15,
    marginTop: 6,
  },
});
