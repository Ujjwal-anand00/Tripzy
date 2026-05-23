import { User } from "../models/User.js";
import { comparePassword, createToken, hashPassword } from "../utils/auth.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ensureEmail, ensurePassword, ensureString } from "../utils/validation.js";

const buildAuthResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

export const register = asyncHandler(async (request, response) => {
  const name = ensureString(request.body.name, "Name");
  const email = ensureEmail(request.body.email);
  const password = ensurePassword(request.body.password);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const user = await User.create({
    name,
    email,
    passwordHash: await hashPassword(password),
  });

  response.status(201).json({
    success: true,
    token: createToken(user._id.toString()),
    user: buildAuthResponse(user),
  });
});

export const login = asyncHandler(async (request, response) => {
  const email = ensureEmail(request.body.email);
  const password = ensureString(request.body.password, "Password");

  const user = await User.findOne({ email });

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new AppError("Invalid email or password", 401);
  }

  response.status(200).json({
    success: true,
    token: createToken(user._id.toString()),
    user: buildAuthResponse(user),
  });
});

export const getCurrentUser = asyncHandler(async (request, response) => {
  response.status(200).json({
    success: true,
    user: buildAuthResponse(request.user),
  });
});
