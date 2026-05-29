import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

export function useAppState(onChange: (status: AppStateStatus) => void) {
  const savedCallback = useRef(onChange);

  useEffect(() => {
    savedCallback.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      savedCallback.current(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);
}
