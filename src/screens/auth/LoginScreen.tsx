import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { InlineMessage } from "../../components/common/InlineMessage";
import { Screen } from "../../components/common/Screen";
import { SectionHeader } from "../../components/common/SectionHeader";
import { theme } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { AuthStackParamList } from "../../types/navigation";
import { validateEmail } from "../../utils/validators";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export const LoginScreen = ({ navigation }: Props) => {
  const { signIn, authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      setError(null);
      await signIn({ email, password });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to log in.");
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.layout}
      >
        <View style={styles.hero}>
          <Text style={styles.kicker}>Travel Better</Text>
          <SectionHeader
            title="Plan every trip with an AI co-pilot."
            subtitle="Sign in to manage trips, generate itineraries, chat with the assistant, and explore places on the map."
          />
        </View>
        <Card>
          <Input
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            label="Email"
            onChangeText={(value) => {
              setEmail(value);
              if (error) {
                setError(null);
              }
            }}
            placeholder="you@example.com"
            value={email}
          />
          <Input
            label="Password"
            onChangeText={(value) => {
              setPassword(value);
              if (error) {
                setError(null);
              }
            }}
            onSubmitEditing={handleSubmit}
            placeholder="Enter your password"
            returnKeyType="done"
            secureTextEntry
            value={password}
          />
          {error ? <InlineMessage message={error} tone="error" /> : null}
          <Button loading={authLoading} onPress={handleSubmit} title="Log In" />
          <Pressable onPress={() => navigation.navigate("Register")} style={styles.linkWrap}>
            <Text style={styles.link}>Need an account? Create one</Text>
          </Pressable>
        </Card>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: "center",
  },
  hero: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  kicker: {
    color: theme.colors.secondary,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: theme.spacing(1),
    textTransform: "uppercase",
  },
  linkWrap: {
    marginTop: theme.spacing(2),
  },
  link: {
    color: theme.colors.secondary,
    fontWeight: "700",
    textAlign: "center",
  },
});
