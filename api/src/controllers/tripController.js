import { Itinerary } from "../models/Itinerary.js";
import { Trip } from "../models/Trip.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  ensureOptionalNumber,
  ensureObjectId,
  ensureOptionalString,
  ensurePositiveNumber,
  ensureString,
  ensureStringArray,
} from "../utils/validation.js";

const buildTripPayload = (body) => {
  const title = ensureString(body.title, "Trip title");
  const destination = ensureString(body.destination, "Destination");
  const budget = ensurePositiveNumber(body.budget, "Budget");
  const travelers =
    body.travelers !== undefined ? ensurePositiveNumber(body.travelers, "Travelers") : 1;
  const preferences = body.preferences
    ? ensureStringArray(body.preferences, "Preferences")
    : [];
  const status = body.status || "planned";

  if (!["draft", "planned", "booked"].includes(status)) {
    throw new AppError("Status must be draft, planned, or booked", 400);
  }

  const startDate = new Date(body.startDate);
  const endDate = new Date(body.endDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new AppError("Start date and end date must be valid dates", 400);
  }

  if (endDate < startDate) {
    throw new AppError("End date must be after start date", 400);
  }

  return {
    title,
    destination,
    budget,
    travelers,
    preferences,
    status,
    notes: ensureOptionalString(body.notes) || "",
    startDate,
    endDate,
    location: {
      latitude: ensureOptionalNumber(body.location?.latitude, "Latitude") || 0,
      longitude: ensureOptionalNumber(body.location?.longitude, "Longitude") || 0,
    },
  };
};

export const getTrips = asyncHandler(async (request, response) => {
  const trips = await Trip.find({ user: request.user._id })
    .sort({ startDate: 1 })
    .populate("itinerary");

  response.status(200).json({
    success: true,
    trips,
  });
});

export const getTripById = asyncHandler(async (request, response) => {
  const tripId = ensureObjectId(request.params.tripId, "Trip id");

  const trip = await Trip.findOne({
    _id: tripId,
    user: request.user._id,
  }).populate("itinerary");

  if (!trip) {
    throw new AppError("Trip not found", 404);
  }

  response.status(200).json({
    success: true,
    trip,
  });
});

export const createTrip = asyncHandler(async (request, response) => {
  const payload = buildTripPayload(request.body);

  const trip = await Trip.create({
    user: request.user._id,
    ...payload,
  });

  response.status(201).json({
    success: true,
    trip,
  });
});

export const updateTrip = asyncHandler(async (request, response) => {
  const tripId = ensureObjectId(request.params.tripId, "Trip id");
  const payload = buildTripPayload(request.body);

  const trip = await Trip.findOneAndUpdate(
    { _id: tripId, user: request.user._id },
    payload,
    { new: true, runValidators: true }
  ).populate("itinerary");

  if (!trip) {
    throw new AppError("Trip not found", 404);
  }

  response.status(200).json({
    success: true,
    trip,
  });
});

export const deleteTrip = asyncHandler(async (request, response) => {
  const tripId = ensureObjectId(request.params.tripId, "Trip id");

  const trip = await Trip.findOneAndDelete({
    _id: tripId,
    user: request.user._id,
  });

  if (!trip) {
    throw new AppError("Trip not found", 404);
  }

  if (trip.itinerary) {
    await Itinerary.deleteOne({ _id: trip.itinerary, user: request.user._id });
  }

  response.status(200).json({
    success: true,
    message: "Trip deleted successfully",
  });
});
