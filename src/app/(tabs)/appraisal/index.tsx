import React from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { AppText } from "../../../components/ui/AppText";
import { Card } from "../../../components/ui/Card";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { useAppraisalsQuery } from "../../../features/appraisal/queries";
import { tokens } from "../../../theme";

export default function AppraisalsScreen() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useAppraisalsQuery();

  if (isLoading) return <LoadingState />;
  if (error)
    return <ErrorState message={(error as Error)?.message} onRetry={refetch} />;

  return (
    <Screen>
      <AppText variant="2xl" weight="bold" style={styles.header}>
        Tasaciones
      </AppText>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/(tabs)/appraisal/${item.id}`)}
          >
            <Card style={styles.appraisalCard}>
              <AppText variant="lg" weight="600">
                {item.title}
              </AppText>
              <AppText variant="sm" color={tokens.colors.gray[500]}>
                Estado: {item.status}
              </AppText>
              <AppText variant="xs" color={tokens.colors.gray[400]}>
                Creada: {new Date(item.createdAt).toLocaleDateString()}
              </AppText>
            </Card>
          </TouchableOpacity>
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
  appraisalCard: {
    padding: tokens.spacing.md,
  },
});
