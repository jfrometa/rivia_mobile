import React from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { AppText } from "../../../components/ui/AppText";
import { AppButton } from "../../../components/ui/AppButton";
import { Card } from "../../../components/ui/Card";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { useGetAppraisalsQuery } from "../../../services/api/apiSlice";
import { tokens } from "../../../theme";

export default function AppraisalsScreen() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetAppraisalsQuery();

  // Log error to debug
  if (error) {
    console.error("Appraisals error:", error);
  }

  if (isLoading) return <LoadingState />;
  if (error) {
    // Try to extract a meaningful error message
    const errorMessage = 
      (error as any)?.data?.message || 
      (error as any)?.error || 
      (error as Error)?.message || 
      "Ocurrió un error al cargar las tasaciones";
      console.log(errorMessage)
    return <ErrorState message={errorMessage} onRetry={refetch} />;
  }

  return (
    <Screen>
      <View style={styles.headerContainer}>
        <AppText variant="2xl" weight="bold" style={styles.header}>
        Tasaciones
      </AppText>
      <AppButton
        title="Nueva"
        onPress={() => router.push("/(tabs)/appraisal/new")}
        style={styles.newButton}
      />
    </View>

      <FlatList
        data={data || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/(tabs)/appraisal/${item.id}`)}
          >
            <Card style={styles.appraisalCard}>
              <AppText variant="lg" weight="600">
                {item.id}
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
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center" }}>
            <AppText variant="md" color={tokens.colors.gray[500]}>
              No hay tasaciones aún
            </AppText>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: tokens.spacing.md }} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: tokens.spacing.lg,
  },
  header: {
    marginBottom: 0,
  },
  newButton: {
    minWidth: 100,
  },
  appraisalCard: {
    padding: tokens.spacing.md,
  },
});
