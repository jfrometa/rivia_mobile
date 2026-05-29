import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Screen } from "../../../components/ui/Screen";
import { AppText } from "../../../components/ui/AppText";
import { Card } from "../../../components/ui/Card";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { useUsersQuery } from "../../../features/user/queries";
import { tokens } from "../../../theme";

export default function UsersScreen() {
  const { data, isLoading, error, refetch } = useUsersQuery();

  if (isLoading) return <LoadingState />;
  if (error)
    return <ErrorState message={(error as Error)?.message} onRetry={refetch} />;

  return (
    <Screen>
      <AppText variant="2xl" weight="bold" style={styles.header}>
        Usuarios
      </AppText>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.userCard}>
            <AppText variant="lg" weight="600">
              {item.name || item.email}
            </AppText>
            <AppText variant="sm" color={tokens.colors.gray[500]}>
              {item.email}
            </AppText>
            {item.role && (
              <AppText variant="sm" color={tokens.colors.primary[600]}>
                Rol: {item.role}
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
  userCard: {
    padding: tokens.spacing.md,
  },
});
