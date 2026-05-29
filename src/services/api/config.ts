import { env } from "../../lib/env";

export const apiConfig = {
  baseUrl: env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
};
