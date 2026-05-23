import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { Screen } from "../../components/common/Screen";
import { SectionHeader } from "../../components/common/SectionHeader";
import { theme } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

export const ProfileScreen = () => {
  const { user, signOut } = useAuth();

  return (
    <Screen>
      <SectionHeader
        title="Profile"
        subtitle="Your account stays connected to saved trips, itineraries, and assistant history."
      />
      <Card style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </Card>
      <Card>
        <Text style={styles.noteTitle}>Security note</Text>
        <Text style={styles.note}>
          JWT tokens are stored using SecureStore on native devices, with AsyncStorage
          only as a web fallback for development environments.
        </Text>
      </Card>
      <Button onPress={signOut} style={styles.logout} title="Log Out" variant="danger" />
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing(2),
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: theme.spacing(1.5),
    textTransform: "uppercase",
  },
  value: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  noteTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  note: {
    color: theme.colors.textMuted,
    lineHeight: 22,
    marginTop: theme.spacing(1),
  },
  logout: {
    marginTop: theme.spacing(3),
  },
});
