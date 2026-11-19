import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

/** Named exports used throughout the app. */
export const { signIn, signUp, signOut, useSession, getSession } = authClient;
