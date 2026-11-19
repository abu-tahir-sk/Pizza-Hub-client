import type { User } from "@/types";
import { apiRequest } from "./http";

export async function updateProfile(data: {
  name: string;
  image?: string | null;
  businessName?: string;
}): Promise<User> {
  const res = await apiRequest<User>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function fetchMyProfile(): Promise<User> {
  const res = await apiRequest<User>("/api/users/me");
  return res.data!;
}
