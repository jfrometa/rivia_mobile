import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "./session";
import {
  saveAccessToken,
  getAccessToken,
  saveRefreshToken,
  getRefreshToken,
  clearAllSessionData,
} from "./auth-storage";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (session: Session) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Simple function to decode JWT payload (without verifying signature for now)
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signIn = async (newSession: Session) => {
    await saveAccessToken(newSession.accessToken);
    if (newSession.refreshToken) {
      await saveRefreshToken(newSession.refreshToken);
    }
    setSession(newSession);
  };

  const signOut = async () => {
    await clearAllSessionData();
    setSession(null);
  };

  const restoreSession = async () => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();

      if (accessToken) {
        // Decode JWT to get user info
        const payload = decodeJWT(accessToken);
        
        if (payload) {
          setSession({
            user: {
              id: payload.sub || payload.id,
              email: payload.email,
              name: payload.name,
              tenantId: payload.tenantId,
              roles: payload.roles || [],
              image: null,
            },
            accessToken,
            refreshToken: refreshToken ?? undefined,
          });
        }
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isLoading,
        signIn,
        signOut,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
