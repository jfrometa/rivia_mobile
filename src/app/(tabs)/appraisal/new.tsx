import React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Screen } from "../../../components/ui/Screen";
import { AppText } from "../../../components/ui/AppText";
import { AppButton } from "../../../components/ui/AppButton";
import { AppInput } from "../../../components/ui/AppInput";
import { Card } from "../../../components/ui/Card";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { UpsertAppraisalSchema } from "../../../features/appraisal/schema";
import type { UpsertAppraisalSchemaType } from "../../../features/appraisal/schema";
import {
  useCreateAppraisalMutation,
  useGetClientsQuery,
} from "../../../services/api/apiSlice";
import { useAuth } from "../../../services/auth/AuthProvider";
import { tokens } from "../../../theme";

export default function NewAppraisalScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [createAppraisal, { isLoading: isCreating }] = useCreateAppraisalMutation();
  const { data: clients, isLoading: clientsLoading, error: clientsError } = useGetClientsQuery();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpsertAppraisalSchemaType & FieldValues>({
    resolver: zodResolver(UpsertAppraisalSchema),
    defaultValues: {
      applicantId: clients?.[0]?.id || 1,
      contactId: clients?.[0]?.id || 1,
      propertyType: "apartment",
      company: "CSA",
      visitDate: new Date(),
      assignTo: session?.user.id,
      comparisonExchangeRateDOPUSD: 58.5,
    },
  });

  const onSubmit = async (data: UpsertAppraisalSchemaType) => {
    try {
      const appraisal = await createAppraisal(data).unwrap();
      Alert.alert("Éxito", "Tasación creada correctamente");
      router.push(`/(tabs)/appraisal/${appraisal.id}`);
    } catch (error) {
      console.error("Error creating appraisal:", error);
      Alert.alert("Error", "Error al crear la tasación");
    }
  };

  if (clientsLoading) return <LoadingState />;
  if (clientsError)
    return <ErrorState message={(clientsError as Error)?.message} onRetry={() => {}} />;

  return (
    <Screen>
      <ScrollView style={styles.container}>
        <AppText variant="2xl" weight="bold" style={styles.header}>
          Nueva Tasación
        </AppText>

        <Card style={styles.card}>
          <AppText variant="lg" weight="600" style={styles.sectionHeader}>
            Información Básica
          </AppText>

          <Controller
            control={control}
            name="visitDate"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Fecha de Visita"
                placeholder="Selecciona una fecha"
                value={value.toLocaleDateString()}
                editable={false}
                style={styles.input}
              />
            )}
          />

          <Controller
            control={control}
            name="company"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Compañía"
                placeholder="CSA"
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />

          <Controller
            control={control}
            name="propertyType"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Tipo de Propiedad"
                placeholder="apartment"
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />
        </Card>

        <Card style={styles.card}>
          <AppText variant="lg" weight="600" style={styles.sectionHeader}>
            Cliente y Contacto
          </AppText>

          <Controller
            control={control}
            name="applicantId"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="ID Solicitante"
                placeholder="ID del cliente"
                value={value.toString()}
                onChangeText={(text) => onChange(parseInt(text) || 1)}
                style={styles.input}
              />
            )}
          />

          <Controller
            control={control}
            name="contactId"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="ID Contacto"
                placeholder="ID del contacto"
                value={value.toString()}
                onChangeText={(text) => onChange(parseInt(text) || 1)}
                style={styles.input}
              />
            )}
          />
        </Card>

        <AppButton
          title={isSubmitting || isCreating ? "Guardando..." : "Crear Tasación"}
          onPress={handleSubmit(onSubmit as any)}
          disabled={isSubmitting || isCreating}
          style={styles.button}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: tokens.spacing.lg,
  },
  card: {
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
  },
  sectionHeader: {
    marginBottom: tokens.spacing.md,
  },
  input: {
    marginBottom: tokens.spacing.md,
  },
  button: {
    marginTop: tokens.spacing.lg,
  },
});
