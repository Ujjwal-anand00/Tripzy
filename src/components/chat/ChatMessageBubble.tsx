import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "../../constants/theme";
import { ChatMessage } from "../../types/models";

export const ChatMessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";

  return (
    <View
      style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.assistantBubble,
      ]}
    >
      <Text style={[styles.text, isUser && styles.userText]}>{message.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 22,
    marginBottom: theme.spacing(1.5),
    maxWidth: "86%",
    padding: theme.spacing(2),
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.primary,
  },
  assistantBubble: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  text: {
    color: theme.colors.text,
    lineHeight: 21,
  },
  userText: {
    color: theme.colors.white,
  },
});
