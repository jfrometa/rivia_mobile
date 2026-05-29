import { QueryClient, focusManager } from "@tanstack/react-query";
import { setupReactQueryNetworkManager } from "../services/network/react-query-online-manager";
import { useAppState } from "../hooks/useAppState";
import { AppStateStatus } from "react-native";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function setupReactQuery() {
  setupReactQueryNetworkManager();
}

// Hook to set up focus manager in the root component
export function useReactQueryFocusManager() {
  useAppState((status: AppStateStatus) => {
    if (status === "active") {
      focusManager.setFocused(true);
    }
  });
}
