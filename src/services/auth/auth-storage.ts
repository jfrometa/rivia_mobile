import { STORAGE_KEYS } from "../../lib/constants";
import {
  saveToSecureStorage,
  getFromSecureStorage,
  deleteFromSecureStorage,
} from "../storage/secure-storage";

export async function saveAccessToken(token: string): Promise<void> {
  await saveToSecureStorage(STORAGE_KEYS.ACCESS_TOKEN, token);
}

export async function getAccessToken(): Promise<string | null> {
  return await getFromSecureStorage(STORAGE_KEYS.ACCESS_TOKEN);
}

export async function deleteAccessToken(): Promise<void> {
  await deleteFromSecureStorage(STORAGE_KEYS.ACCESS_TOKEN);
}

export async function saveRefreshToken(token: string): Promise<void> {
  await saveToSecureStorage(STORAGE_KEYS.REFRESH_TOKEN, token);
}

export async function getRefreshToken(): Promise<string | null> {
  return await getFromSecureStorage(STORAGE_KEYS.REFRESH_TOKEN);
}

export async function deleteRefreshToken(): Promise<void> {
  await deleteFromSecureStorage(STORAGE_KEYS.REFRESH_TOKEN);
}

export async function clearAllSessionData(): Promise<void> {
  await deleteAccessToken();
  await deleteRefreshToken();
}
