import { ChatSession } from "../models/ChatSession.js";
import { generateAssistantReply } from "../services/aiService.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ensureObjectId, ensureOptionalString, ensureString } from "../utils/validation.js";

const buildSessionTitle = (message) => message.slice(0, 32).trim() || "New Trip Chat";

export const getChatSessions = asyncHandler(async (request, response) => {
  const sessions = await ChatSession.find({ user: request.user._id })
    .sort({ updatedAt: -1 })
    .select("title updatedAt messages");

  response.status(200).json({
    success: true,
    sessions,
  });
});

export const getChatSessionById = asyncHandler(async (request, response) => {
  const sessionId = ensureObjectId(request.params.sessionId, "Chat session id");

  const session = await ChatSession.findOne({
    _id: sessionId,
    user: request.user._id,
  });

  if (!session) {
    throw new AppError("Chat session not found", 404);
  }

  response.status(200).json({
    success: true,
    session,
  });
});

export const sendMessage = asyncHandler(async (request, response) => {
  const message = ensureString(request.body.message, "Message");
  const requestedSessionId = ensureOptionalString(request.body.sessionId);

  let session;

  if (requestedSessionId) {
    session = await ChatSession.findOne({
      _id: ensureObjectId(requestedSessionId, "Chat session id"),
      user: request.user._id,
    });

    if (!session) {
      throw new AppError("Chat session not found", 404);
    }
  } else {
    session = await ChatSession.create({
      user: request.user._id,
      title: buildSessionTitle(message),
      messages: [],
    });
  }

  session.messages.push({
    role: "user",
    content: message,
  });

  const assistantReply = await generateAssistantReply(
    session.messages.map((item) => ({
      role: item.role,
      content: item.content,
    }))
  );

  session.messages.push({
    role: "assistant",
    content: assistantReply,
  });

  await session.save();

  response.status(200).json({
    success: true,
    session,
    reply: assistantReply,
  });
});
