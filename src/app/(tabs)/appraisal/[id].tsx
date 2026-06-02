import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { AppText } from "../../../components/ui/AppText";
import { Card } from "../../../components/ui/Card";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { useGetAppraisalByIdQuery } from "../../../services/api/apiSlice";
import { tokens } from "../../../theme";

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

function renderValue(value: any): React.ReactNode {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (Array.isArray(value)) {
    return (
      <View style={styles.arrayContainer}>
        {value.map((item, index) => (
          <AppText key={index} variant="sm" color={tokens.colors.gray[700]}>
            • {typeof item === "object" ? JSON.stringify(item) : String(item)}
          </AppText>
        ))}
      </View>
    );
  }
  if (typeof value === "object") {
    return (
      <View style={styles.objectContainer}>
        {Object.entries(value).map(([k, v]) => (
          <View key={k} style={styles.fieldRow}>
            <AppText variant="sm" weight="600" style={styles.fieldLabel}>
              {formatKey(k)}:
            </AppText>
            <AppText variant="sm" color={tokens.colors.gray[700]}>
              {renderValue(v)}
            </AppText>
          </View>
        ))}
      </View>
    );
  }
  return String(value);
}

export default function AppraisalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useGetAppraisalByIdQuery(id!);

  if (isLoading) return <LoadingState />;
  if (error)
    return <ErrorState message={(error as Error)?.message} onRetry={refetch} />;

  return (
    <Screen>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.detailCard}>
          <AppText variant="2xl" weight="bold" style={styles.title}>
            Tasación {data?.id}
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

        {data?.fields && Object.keys(data.fields).length > 0 && (
          <Card style={styles.fieldsCard}>
            <AppText variant="lg" weight="bold" style={styles.fieldsTitle}>
              Detalles
            </AppText>
            <View style={styles.fieldsContainer}>
              {Object.entries(data.fields).map(([key, value]) => (
                <View key={key} style={styles.fieldRow}>
                  <AppText variant="sm" weight="600" style={styles.fieldLabel}>
                    {formatKey(key)}:
                  </AppText>
                  <AppText variant="sm" color={tokens.colors.gray[700]}>
                    {renderValue(value)}
                  </AppText>
                </View>
              ))}
            </View>
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  detailCard: {
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
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
  fieldsCard: {
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  fieldsTitle: {
    marginBottom: tokens.spacing.md,
  },
  fieldsContainer: {
    gap: tokens.spacing.sm,
  },
  fieldRow: {
    flexDirection: "column",
    gap: tokens.spacing.xs,
  },
  fieldLabel: {
    color: tokens.colors.gray[800],
  },
  arrayContainer: {
    gap: tokens.spacing.xs,
  },
  objectContainer: {
    gap: tokens.spacing.xs,
    paddingLeft: tokens.spacing.sm,
  },
});
