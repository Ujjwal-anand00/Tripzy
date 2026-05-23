import express from "express";

import {
  getChatSessionById,
  getChatSessions,
  sendMessage,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/sessions", getChatSessions);
router.get("/sessions/:sessionId", getChatSessionById);
router.post("/messages", sendMessage);

export default router;
