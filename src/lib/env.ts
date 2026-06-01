import { z } from "zod";

console.log("🔍 [DEBUG] Raw process.env.EXPO_PUBLIC_API_BASE_URL:", process.env.EXPO_PUBLIC_API_BASE_URL);
console.log("🔍 [DEBUG] All process.env keys:", Object.keys(process.env).filter(k => k.includes('EXPO')));

const envSchema = z.object({
  EXPO_PUBLIC_API_BASE_URL: z.string().url(),
});

const envVars = {
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
};

console.log("🔍 [DEBUG] Using envVars.EXPO_PUBLIC_API_BASE_URL:", envVars.EXPO_PUBLIC_API_BASE_URL);

export const env = envSchema.parse(envVars);
