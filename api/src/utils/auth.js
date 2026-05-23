import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export const hashPassword = async (password) => bcrypt.hash(password, 12);

export const comparePassword = async (password, hash) =>
  bcrypt.compare(password, hash);

export const createToken = (userId) =>
  jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
