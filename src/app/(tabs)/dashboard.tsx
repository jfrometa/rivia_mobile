import React from "react";
import { View, StyleSheet } from "react-native";
import { Screen } from "../../components/ui/Screen";
import { AppText } from "../../components/ui/AppText";
import { Card } from "../../components/ui/Card";
import { LoadingState } from "../../components/ui/LoadingState";
import { ErrorState } from "../../components/ui/ErrorState";
import { useDashboardSummaryQuery } from "../../features/dashboard/queries";
import { useAuth } from "../../services/auth/AuthProvider";
import { tokens } from "../../theme";

export default function DashboardScreen() {
  const { user } = useAuth();
  const { data, isLoading, error, refetch } = useDashboardSummaryQuery();

  if (isLoading) return <LoadingState />;
  if (error)
    return <ErrorState message={(error as Error)?.message} onRetry={refetch} />;

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="2xl" weight="bold">
          Hola {user?.name || "Usuario"}
        </AppText>
        <AppText variant="sm" color={tokens.colors.gray[500]}>
          Resumen de tu día
        </AppText>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <AppText variant="3xl" weight="bold" color={tokens.colors.primary[600]}>
            {data?.totalAppraisals || 0}
          </AppText>
          <AppText variant="sm" color={tokens.colors.gray[600]}>
            Tasaciones totales
          </AppText>
        </Card>

        <Card style={styles.statCard}>
          <AppText variant="3xl" weight="bold" color={tokens.colors.secondary[600]}>
            {data?.pendingReviews || 0}
          </AppText>
          <AppText variant="sm" color={tokens.colors.gray[600]}>
            Pendientes de revisión
          </AppText>
        </Card>

        <Card style={styles.statCard}>
          <AppText variant="3xl" weight="bold" color={tokens.colors.success[600]}>
            {data?.activeClients || 0}
          </AppText>
          <AppText variant="sm" color={tokens.colors.gray[600]}>
            Clientes activos
          </AppText>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: tokens.spacing.lg,
  },
  statsContainer: {
    gap: tokens.spacing.md,
  },
  statCard: {
    padding: tokens.spacing.lg,
    alignItems: "center",
  },
});
