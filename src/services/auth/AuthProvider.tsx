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

      // TODO: Validate token with backend or decode JWT to get user
      if (accessToken) {
        // For now, set a mock session if token exists
        // Replace this with actual token validation
        setSession({
          user: {
            id: "mock-id",
            email: "mock@example.com",
            name: "Mock User",
          },
          accessToken,
          refreshToken: refreshToken ?? undefined,
        });
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
