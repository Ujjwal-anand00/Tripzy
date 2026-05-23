import { apiClient } from "./client";
import { Trip } from "../types/models";

export type TripPayload = {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  preferences: string[];
  notes: string;
  status: "draft" | "planned" | "booked";
  location?: {
    latitude: number;
    longitude: number;
  };
};

export const fetchTrips = (token: string) =>
  apiClient<{ success: boolean; trips: Trip[] }>("/trips", {
    method: "GET",
    token,
  });

export const fetchTripById = (token: string, tripId: string) =>
  apiClient<{ success: boolean; trip: Trip }>(`/trips/${tripId}`, {
    method: "GET",
    token,
  });

export const createTripRequest = (token: string, payload: TripPayload) =>
  apiClient<{ success: boolean; trip: Trip }>("/trips", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

export const updateTripRequest = (
  token: string,
  tripId: string,
  payload: TripPayload
) =>
  apiClient<{ success: boolean; trip: Trip }>(`/trips/${tripId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });

export const deleteTripRequest = (token: string, tripId: string) =>
  apiClient<{ success: boolean; message: string }>(`/trips/${tripId}`, {
    method: "DELETE",
    token,
  });
