import { Itinerary } from "../models/Itinerary.js";
import { Trip } from "../models/Trip.js";
import { generateStructuredItinerary } from "../services/aiService.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  ensureObjectId,
  ensurePositiveNumber,
  ensureString,
  ensureStringArray,
} from "../utils/validation.js";

export const generateItinerary = asyncHandler(async (request, response) => {
  const destination = ensureString(request.body.destination, "Destination");
  const budget = ensurePositiveNumber(request.body.budget, "Budget");
  const duration = ensurePositiveNumber(request.body.duration, "Duration");
  const preferences = request.body.preferences
    ? ensureStringArray(request.body.preferences, "Preferences")
    : [];
  const tripId = request.body.tripId
    ? ensureObjectId(request.body.tripId, "Trip id")
    : null;

  let existingTrip = null;

  if (tripId) {
    existingTrip = await Trip.findOne({
      _id: tripId,
      user: request.user._id,
    });

    if (!existingTrip) {
      throw new AppError("Trip not found", 404);
    }
  }

  const aiResult = await generateStructuredItinerary({
    destination,
    budget,
    duration,
    preferences,
  });

  if (tripId) {
    await Itinerary.deleteMany({
      user: request.user._id,
      trip: tripId,
    });
  }

  const itinerary = await Itinerary.create({
    user: request.user._id,
    trip: tripId,
    destination,
    budget,
    duration,
    preferences,
    overview: aiResult.overview,
    days: aiResult.days,
  });

  if (existingTrip) {
    existingTrip.itinerary = itinerary._id;
    await existingTrip.save();
  }

  response.status(201).json({
    success: true,
    itinerary,
  });
});

export const getItineraries = asyncHandler(async (request, response) => {
  const itineraries = await Itinerary.find({ user: request.user._id }).sort({
    createdAt: -1,
  });

  response.status(200).json({
    success: true,
    itineraries,
  });
});

export const getItineraryById = asyncHandler(async (request, response) => {
  const itineraryId = ensureObjectId(request.params.itineraryId, "Itinerary id");

  const itinerary = await Itinerary.findOne({
    _id: itineraryId,
    user: request.user._id,
  });

  if (!itinerary) {
    throw new AppError("Itinerary not found", 404);
  }

  response.status(200).json({
    success: true,
    itinerary,
  });
});
