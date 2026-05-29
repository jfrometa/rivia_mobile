import { onlineManager } from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";

export function setupReactQueryNetworkManager() {
  onlineManager.setEventListener((setOnline) => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    });
    return unsubscribe;
  });
}
