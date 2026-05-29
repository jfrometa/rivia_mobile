import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_API_BASE_URL: z.string().url(),
});

const envVars = {
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
};

export const env = envSchema.parse(envVars);
