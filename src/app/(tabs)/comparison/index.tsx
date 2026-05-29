import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Screen } from "../../../components/ui/Screen";
import { AppText } from "../../../components/ui/AppText";
import { Card } from "../../../components/ui/Card";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { tokens } from "../../../theme";

// Mock data for now
const mockComparables = [
  { id: "1", address: "Calle Principal 123", price: 250000 },
  { id: "2", address: "Av. Secundaria 456", price: 320000 },
];

export default function ComparisonScreen() {
  // TODO: Replace with useComparablesQuery when API is ready
  const data = mockComparables;
  const isLoading = false;
  const error = null;

  if (isLoading) return <LoadingState />;
  if (error)
    return <ErrorState message={(error as Error)?.message} />;

  return (
    <Screen>
      <AppText variant="2xl" weight="bold" style={styles.header}>
        Comparables
      </AppText>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.comparisonCard}>
            <AppText variant="lg" weight="600">
              {item.address}
            </AppText>
            <AppText variant="md" color={tokens.colors.secondary[600]}>
              ${item.price.toLocaleString()}
            </AppText>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: tokens.spacing.md }} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: tokens.spacing.lg,
  },
  comparisonCard: {
    padding: tokens.spacing.md,
  },
});
