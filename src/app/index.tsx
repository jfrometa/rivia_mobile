import { View, StyleSheet } from "react-native";
import { AppText } from "../components/ui/AppText";
import { tokens } from "../theme/tokens";

export default function Index() {
  return (
    <View style={styles.container}>
      <AppText variant="3xl" weight="bold" color={tokens.colors.primary[600]}>
        Hello from src/app/index.tsx!
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: tokens.colors.gray[50],
  },
});
