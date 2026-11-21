import { createAuthClient } from "better-auth/react";
import { API_BASE_URL } from "@/config/env";

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
});

/** Named exports used throughout the app. */
export const { signIn, signUp, signOut, useSession, getSession, updateUser } = authClient;
