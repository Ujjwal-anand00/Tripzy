import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { fetchChatSessions, sendChatMessage } from "../../api/chat";
import { ChatMessageBubble } from "../../components/chat/ChatMessageBubble";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { InlineMessage } from "../../components/common/InlineMessage";
import { LoadingState } from "../../components/common/LoadingState";
import { Screen } from "../../components/common/Screen";
import { SectionHeader } from "../../components/common/SectionHeader";
import { theme } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { ChatSession } from "../../types/models";

export const ChatScreen = () => {
  const { token } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);

  const loadSessions = async () => {
    if (!token) {
      setSessions([]);
      setActiveSession(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetchChatSessions(token);
      setSessions(response.sessions);
      setActiveSession((currentSession) => currentSession || response.sessions[0] || null);
      setError(null);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Unable to load chat sessions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 80);

    return () => clearTimeout(timer);
  }, [activeSession?.messages.length, sending]);

  const handleSend = async () => {
    if (!token || !message.trim()) {
      return;
    }

    setSending(true);
    try {
      const response = await sendChatMessage(token, {
        sessionId: activeSession?._id,
        message: message.trim(),
      });

      setMessage("");
      setActiveSession(response.session);
      setSessions((currentSessions) => {
        const filtered = currentSessions.filter(
          (session) => session._id !== response.session._id
        );

        return [response.session, ...filtered];
      });
      setError(null);
    } catch (caughtError) {
      const nextError =
        caughtError instanceof Error ? caughtError.message : "Unable to send message.";
      setError(nextError);
      Alert.alert("Message failed", nextError);
    } finally {
      setSending(false);
    }
  };

  const startNewChat = () => {
    setActiveSession(null);
    setMessage("");
    setError(null);
  };

  return (
    <Screen scrollable={false}>
      <SectionHeader
        title="AI Trip Assistant"
        subtitle="Ask for routing help, budget tradeoffs, destination ideas, or a polished trip outline."
      />

      <View style={styles.sessionRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Pressable onPress={startNewChat} style={styles.newChatButton}>
            <Ionicons color={theme.colors.primaryDark} name="add-circle-outline" size={18} />
            <Text style={styles.newChatText}>New chat</Text>
          </Pressable>
          {sessions.map((session) => (
            <Pressable
              key={session._id}
              onPress={() => setActiveSession(session)}
              style={[
                styles.sessionChip,
                activeSession?._id === session._id && styles.sessionChipActive,
              ]}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.sessionChipText,
                  activeSession?._id === session._id && styles.sessionChipTextActive,
                ]}
              >
                {session.title}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <LoadingState label="Loading your AI chats..." />
      ) : error && !activeSession?.messages?.length ? (
        <EmptyState title="Unable to load chats" subtitle={error} />
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.chatLayout}
        >
          <ScrollView
            contentContainerStyle={styles.messagesWrap}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            ref={scrollRef}
          >
            {activeSession?.messages?.length ? (
              activeSession.messages.map((chatMessage, index) => (
                <ChatMessageBubble
                  key={`${chatMessage.role}-${index}`}
                  message={chatMessage}
                />
              ))
            ) : (
              <EmptyState
                title="No messages yet"
                subtitle="Start with a prompt like: plan a 4-day Mysore and Coorg trip under INR 30,000."
              />
            )}
          </ScrollView>

          <View style={styles.composer}>
            {error ? <InlineMessage message={error} tone="error" /> : null}
            <TextInput
              multiline
              onChangeText={setMessage}
              placeholder="Ask Tripzy AI anything about your trip..."
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
              value={message}
            />
            <Button
              disabled={!message.trim()}
              loading={sending}
              onPress={handleSend}
              title="Send"
              style={styles.sendButton}
            />
          </View>
        </KeyboardAvoidingView>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  chatLayout: {
    flex: 1,
  },
  sessionRow: {
    marginBottom: theme.spacing(2),
  },
  newChatButton: {
    alignItems: "center",
    backgroundColor: "#f6dfc3",
    borderRadius: 999,
    flexDirection: "row",
    marginRight: theme.spacing(1),
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  newChatText: {
    color: theme.colors.primaryDark,
    fontWeight: "700",
    marginLeft: 6,
  },
  sessionChip: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: theme.spacing(1),
    maxWidth: 180,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sessionChipActive: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  sessionChipText: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  sessionChipTextActive: {
    color: theme.colors.white,
  },
  messagesWrap: {
    flexGrow: 1,
    paddingBottom: theme.spacing(2),
  },
  composer: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    gap: theme.spacing(1.5),
    paddingTop: theme.spacing(2),
  },
  input: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    color: theme.colors.text,
    maxHeight: 120,
    minHeight: 56,
    paddingHorizontal: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  sendButton: {
    marginBottom: theme.spacing(1),
  },
});
