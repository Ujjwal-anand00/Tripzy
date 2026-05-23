import { destinationCatalog } from "../constants/destinationCatalog.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDestinations = asyncHandler(async (request, response) => {
  const query = typeof request.query.query === "string" ? request.query.query.trim().toLowerCase() : "";

  const destinations = destinationCatalog.filter((destination) => {
    if (!query) {
      return true;
    }

    return (
      destination.name.toLowerCase().includes(query) ||
      destination.country.toLowerCase().includes(query) ||
      destination.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  response.status(200).json({
    success: true,
    destinations,
  });
});
