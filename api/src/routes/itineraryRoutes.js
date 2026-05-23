import express from "express";

import {
  generateItinerary,
  getItineraries,
  getItineraryById,
} from "../controllers/itineraryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getItineraries);
router.post("/generate", generateItinerary);
router.get("/:itineraryId", getItineraryById);

export default router;
