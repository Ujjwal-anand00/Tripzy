import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (request, _response, next) => {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401);
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    throw new AppError("Invalid or expired token", 401, error.message);
  }

  const user = await User.findById(payload.userId).select("-passwordHash");

  if (!user) {
    throw new AppError("User not found", 401);
  }

  request.user = user;
  next();
});
