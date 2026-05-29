import { Redirect } from "expo-router";
import { useAuth } from "../services/auth/AuthProvider";
import { LoadingState } from "../components/ui/LoadingState";

export default function Index() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingState />;
  }

  if (user) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return <Redirect href="/(auth)/login" />;
}
