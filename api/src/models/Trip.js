import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    travelers: {
      type: Number,
      default: 1,
    },
    preferences: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "planned", "booked"],
      default: "planned",
    },
    location: {
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
    },
    itinerary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Itinerary",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Trip = mongoose.model("Trip", tripSchema);
