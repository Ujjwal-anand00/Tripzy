import { apiClient } from "./client";
import { ChatSession } from "../types/models";

export const fetchChatSessions = (token: string) =>
  apiClient<{ success: boolean; sessions: ChatSession[] }>("/chat/sessions", {
    method: "GET",
    token,
  });

export const sendChatMessage = (
  token: string,
  payload: { sessionId?: string; message: string }
) =>
  apiClient<{ success: boolean; session: ChatSession; reply: string }>(
    "/chat/messages",
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }
  );
