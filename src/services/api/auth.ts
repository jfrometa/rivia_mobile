import { api } from "./client";
import { z } from "zod";

export const LoginCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().optional(),
  }),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // TODO: Replace with actual login endpoint (may require backend adaptation for token-based auth)
  return api.post<AuthResponse>("/auth/login", credentials);
}
