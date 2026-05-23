import { apiClient } from "./client";
import { AuthResponse, User } from "../types/models";

export const registerRequest = (body: {
  name: string;
  email: string;
  password: string;
}) =>
  apiClient<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const loginRequest = (body: { email: string; password: string }) =>
  apiClient<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const meRequest = (token: string) =>
  apiClient<{ success: boolean; user: User }>("/auth/me", {
    method: "GET",
    token,
  });
