import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Screen } from "../../../components/ui/Screen";
import { AppText } from "../../../components/ui/AppText";
import { Card } from "../../../components/ui/Card";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { useClientsQuery } from "../../../features/client/queries";
import { tokens } from "../../../theme";

export default function ClientsScreen() {
  const { data, isLoading, error, refetch } = useClientsQuery();

  if (isLoading) return <LoadingState />;
  if (error)
    return <ErrorState message={(error as Error)?.message} onRetry={refetch} />;

  return (
    <Screen>
      <AppText variant="2xl" weight="bold" style={styles.header}>
        Clientes
      </AppText>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.clientCard}>
            <AppText variant="lg" weight="600">
              {item.name}
            </AppText>
            <AppText variant="sm" color={tokens.colors.gray[500]}>
              {item.email}
            </AppText>
            {item.phone && (
              <AppText variant="sm" color={tokens.colors.gray[500]}>
                {item.phone}
              </AppText>
            )}
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
  clientCard: {
    padding: tokens.spacing.md,
  },
});
