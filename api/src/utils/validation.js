import mongoose from "mongoose";

import { AppError } from "./AppError.js";

export const ensureString = (value, fieldName, min = 1) => {
  if (typeof value !== "string" || value.trim().length < min) {
    throw new AppError(`${fieldName} is required`, 400);
  }

  return value.trim();
};

export const ensureOptionalString = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new AppError("Invalid string value", 400);
  }

  return value.trim();
};

export const ensureOptionalNumber = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return ensureNumber(value, fieldName);
};

export const ensureEmail = (value) => {
  const email = ensureString(value, "Email");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError("Invalid email address", 400);
  }

  return email.toLowerCase();
};

export const ensurePassword = (value) => {
  const password = ensureString(value, "Password", 8);

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    throw new AppError(
      "Password must contain uppercase, lowercase, and numeric characters",
      400
    );
  }

  return password;
};

export const ensureNumber = (value, fieldName) => {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    throw new AppError(`${fieldName} must be a number`, 400);
  }

  return parsedValue;
};

export const ensureArray = (value, fieldName) => {
  if (!Array.isArray(value)) {
    throw new AppError(`${fieldName} must be an array`, 400);
  }

  return value;
};

export const ensureStringArray = (value, fieldName) => {
  return ensureArray(value, fieldName).map((item, index) => {
    if (typeof item !== "string" || !item.trim()) {
      throw new AppError(`${fieldName} item ${index + 1} must be a non-empty string`, 400);
    }

    return item.trim();
  });
};

export const ensurePositiveNumber = (value, fieldName, minimum = 1) => {
  const parsedValue = ensureNumber(value, fieldName);

  if (parsedValue < minimum) {
    throw new AppError(`${fieldName} must be at least ${minimum}`, 400);
  }

  return parsedValue;
};

export const ensureObjectId = (value, fieldName = "Resource id") => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new AppError(`${fieldName} is invalid`, 400);
  }

  return value;
};
