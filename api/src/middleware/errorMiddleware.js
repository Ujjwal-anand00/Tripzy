import { AppError } from "../utils/AppError.js";

export const notFoundHandler = (request, _response, next) => {
  next(new AppError(`Route not found: ${request.method} ${request.originalUrl}`, 404));
};

export const errorHandler = (error, _request, response, _next) => {
  const statusCode = error.statusCode || 500;

  response.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    details: error.details || null,
  });
};
