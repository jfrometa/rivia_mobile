import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Screen } from "../../../components/ui/Screen";
import { AppText } from "../../../components/ui/AppText";
import { Card } from "../../../components/ui/Card";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { useRolesQuery } from "../../../features/role/queries";
import { tokens } from "../../../theme";
import type { Role } from "../../../features/role/types";

export default function RolesScreen() {
  const { data, isLoading, error, refetch } = useRolesQuery();

  if (isLoading) return <LoadingState />;
  if (error)
    return <ErrorState message={(error as Error)?.message} onRetry={refetch} />;

  return (
    <Screen>
      <AppText variant="2xl" weight="bold" style={styles.header}>
        Roles
      </AppText>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Role }) => (
          <Card style={styles.roleCard}>
            <AppText variant="lg" weight="600">
              {item.name}
            </AppText>
            <View style={styles.permissionsContainer}>
              <AppText variant="sm" color={tokens.colors.gray[500]}>
                Permisos:
              </AppText>
              {item.permissions.map((perm: string, idx: number) => (
                <AppText key={idx} variant="xs" color={tokens.colors.gray[600]}>
                  • {perm}
                </AppText>
              ))}
            </View>
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
  roleCard: {
    padding: tokens.spacing.md,
  },
  permissionsContainer: {
    marginTop: tokens.spacing.sm,
    gap: tokens.spacing.xs,
  },
});
