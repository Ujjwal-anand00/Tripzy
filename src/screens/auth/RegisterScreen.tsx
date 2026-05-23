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
import { validateEmail, validatePassword } from "../../utils/validators";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export const RegisterScreen = ({ navigation }: Props) => {
  const { signUp, authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be 8+ chars with uppercase, lowercase, and a number.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    try {
      setError(null);
      await signUp({ name, email, password });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Unable to create account."
      );
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.layout}
      >
        <View style={styles.hero}>
          <Text style={styles.kicker}>Start Strong</Text>
          <SectionHeader
            title="Create your Tripzy account."
            subtitle="Your account unlocks saved trips, AI chat history, destination discovery, and reusable itineraries."
          />
        </View>
        <Card>
          <Input
            label="Full Name"
            onChangeText={(value) => {
              setName(value);
              if (error) {
                setError(null);
              }
            }}
            placeholder="Aarav Mehta"
            value={name}
          />
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
            placeholder="Choose a strong password"
            secureTextEntry
            value={password}
          />
          <Input
            label="Confirm Password"
            onChangeText={(value) => {
              setConfirmPassword(value);
              if (error) {
                setError(null);
              }
            }}
            onSubmitEditing={handleSubmit}
            placeholder="Repeat your password"
            returnKeyType="done"
            secureTextEntry
            value={confirmPassword}
          />
          {error ? <InlineMessage message={error} tone="error" /> : null}
          <Button loading={authLoading} onPress={handleSubmit} title="Create Account" />
          <Pressable onPress={() => navigation.navigate("Login")} style={styles.linkWrap}>
            <Text style={styles.link}>Already have an account? Log in</Text>
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
