import React from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { AppText } from "../../../components/ui/AppText";
import { Card } from "../../../components/ui/Card";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { useAppraisalByIdQuery } from "../../../features/appraisal/queries";
import { tokens } from "../../../theme";

export default function AppraisalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useAppraisalByIdQuery(id);

  if (isLoading) return <LoadingState />;
  if (error)
    return <ErrorState message={(error as Error)?.message} onRetry={refetch} />;

  return (
    <Screen>
      <Card style={styles.detailCard}>
        <AppText variant="2xl" weight="bold" style={styles.title}>
          {data?.title}
        </AppText>
        <AppText variant="md" style={styles.status}>
          Estado: {data?.status}
        </AppText>
        <View style={styles.dates}>
          <AppText variant="sm" color={tokens.colors.gray[500]}>
            Creada: {new Date(data?.createdAt || "").toLocaleDateString()}
          </AppText>
          <AppText variant="sm" color={tokens.colors.gray[500]}>
            Actualizada: {new Date(data?.updatedAt || "").toLocaleDateString()}
          </AppText>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  detailCard: {
    padding: tokens.spacing.lg,
  },
  title: {
    marginBottom: tokens.spacing.md,
  },
  status: {
    marginBottom: tokens.spacing.md,
  },
  dates: {
    gap: tokens.spacing.sm,
  },
});
