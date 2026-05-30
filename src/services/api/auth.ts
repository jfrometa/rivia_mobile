import { api } from "./client";
import { z } from "zod";

export const LoginCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

// export const AuthResponseSchema = z.object({
//   accessToken: z.string(),
//   refreshToken: z.string().optional(),
//   user: z.object({
//     id: z.string(),
//     email: z.string().email(),
//     name: z.string().optional(),
//   }),
// });

// export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
//   // TODO: Replace with actual login endpoint (may require backend adaptation for token-based auth)
//   return api.post<AuthResponse>("/auth/signin", credentials);
// }

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    tenantId: z.string(),
    roles: z.array(z.string()),
  }),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>("/mobile/auth", credentials);
    console.log("LOGIN DATA:", response);
    return AuthResponseSchema.parse(response);
  } catch (error: any) {
    console.log("LOGIN ERROR:", error);
    console.log("LOGIN ERROR MESSAGE:", error?.message);
    console.log("LOGIN ERROR RESPONSE:", error?.response?.data);
    console.log("LOGIN ERROR STATUS:", error?.response?.status);
    throw error;
  }
}