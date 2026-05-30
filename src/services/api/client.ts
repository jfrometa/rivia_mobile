import { apiConfig } from "./config";
import { ApiError } from "./errors";
import { getAccessToken } from "../auth/auth-storage";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions
): Promise<T> {
  const url = `${apiConfig.baseUrl}${endpoint}`;
  const accessToken = await getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  console.log("URL: ", url)
  console.log("Headers: ", headers)
  console.log("Body: ", options.body)
  const response = await fetch(url, {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(
      (data as { message?: string })?.message || "Request failed",
      response.status,
      data
    );
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: "GET", headers }),
  post: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: "POST", body, headers }),
  put: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: "PUT", body, headers }),
  patch: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: "PATCH", body, headers }),
  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: "DELETE", headers }),
};
