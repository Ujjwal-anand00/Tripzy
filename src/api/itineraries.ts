import { apiClient } from "./client";
import { Itinerary } from "../types/models";

export const generateItineraryRequest = (
  token: string,
  payload: {
    tripId?: string;
    destination: string;
    budget: number;
    duration: number;
    preferences: string[];
  }
) =>
  apiClient<{ success: boolean; itinerary: Itinerary }>("/itineraries/generate", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
