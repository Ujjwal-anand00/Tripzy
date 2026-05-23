import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { loginRequest, meRequest, registerRequest } from "../api/auth";
import { tokenStorage } from "../storage/tokenStorage";
import { User } from "../types/models";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  initializing: boolean;
  authLoading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signUp: (payload: { name: string; email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedToken = await tokenStorage.getToken();

        if (!storedToken) {
          return;
        }

        const response = await meRequest(storedToken);
        setToken(storedToken);
        setUser(response.user);
      } catch {
        await tokenStorage.clearToken();
      } finally {
        setInitializing(false);
      }
    };

    bootstrap();
  }, []);

  const persistSession = async (nextToken: string, nextUser: User) => {
    await tokenStorage.saveToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const signIn = async (credentials: { email: string; password: string }) => {
    setAuthLoading(true);
    try {
      const response = await loginRequest(credentials);
      await persistSession(response.token, response.user);
    } finally {
      setAuthLoading(false);
    }
  };

  const signUp = async (payload: {
    name: string;
    email: string;
    password: string;
  }) => {
    setAuthLoading(true);
    try {
      const response = await registerRequest(payload);
      await persistSession(response.token, response.user);
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    await tokenStorage.clearToken();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      authLoading,
      signIn,
      signUp,
      signOut,
    }),
    [authLoading, initializing, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
