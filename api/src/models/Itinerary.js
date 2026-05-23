import mongoose from "mongoose";

const itineraryActivitySchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, default: "" },
    estimatedCost: { type: Number, default: 0 },
  },
  { _id: false }
);

const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    activities: {
      type: [itineraryActivitySchema],
      default: [],
    },
  },
  { _id: false }
);

const itinerarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
    },
    destination: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    preferences: {
      type: [String],
      default: [],
    },
    overview: {
      type: String,
      required: true,
    },
    days: {
      type: [itineraryDaySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Itinerary = mongoose.model("Itinerary", itinerarySchema);
