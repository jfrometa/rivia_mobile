import { View, StyleSheet, ActivityIndicator } from "react-native";
import { AppText } from "../components/ui/AppText";
import { tokens } from "../theme/tokens";
import { Redirect } from "expo-router";
import { useAuth } from "../services/auth/AuthProvider";


export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Use the name of the file inside (auth), for example: "login"
  if (!user) {
    return <Redirect href="/login" />;
  }

  // Use the name of the file inside (tabs), for example: "dashboard"
  return <Redirect href="/dashboard" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: tokens.colors.gray[50],
  },
});
