import mongoose from "mongoose";
import { act } from "react";
const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  website: {
    type: String,
  },
  openingHours: {
    type: [String],
  },
  photos: {
    type: [String],
  },
  reviews: [
    {
      authorName: String,
      rating: String,
      text: String,
    },
  ],
  types: {
    type: [String],
  },
  formatted_address: {
    type: String,
    required: true,
  },
  briefDescription: {
    type: String,
  },
  geometry: {
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    viewPoint: {
      northeast: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
      southwest: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
    },
  },
});

const itinerarySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  activities: [activitySchema],
});

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  website: {
    type: String,
  },
  openingHours: {
    type: [String],
  },
  photos: {
    type: [String],
  },
  reviews: [
    {
      authorName: String,
      rating: String,
      text: String,
    },
  ],
  types: {
    type: [String],
  },
  formatted_address: {
    type: String,
    required: true,
  },
  briefDescription: {
    type: String,
  },
  geometry: {
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    viewPoint: {
      northeast: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
      southwest: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
    },
  },
});
const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  splitBy: {
    type: String,
    required: true,
  },
  paidBy: {
    type: String,
    required: true,
  }
});

const tripSchema = new mongoose.Schema({
  tripName: {
    type: String,
    required: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  travelers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  background: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  startDay: {
    type: String,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  endDay: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    default: 0,
  },
  expenses: { expenseSchema },
  placesToVisit: { placeSchema },
  itinerary: { itinerarySchema },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export const Trip = mongoose.model("Trip", tripSchema);
