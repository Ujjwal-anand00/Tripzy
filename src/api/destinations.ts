import { apiClient } from "./client";
import { Destination } from "../types/models";

export const fetchDestinations = (query = "") =>
  apiClient<{ success: boolean; destinations: Destination[] }>(
    `/destinations${query ? `?query=${encodeURIComponent(query)}` : ""}`,
    {
      method: "GET",
    }
  );
