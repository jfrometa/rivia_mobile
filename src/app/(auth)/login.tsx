import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Screen } from "../../components/ui/Screen";
import { AppText } from "../../components/ui/AppText";
import { AppButton } from "../../components/ui/AppButton";
import { AppInput } from "../../components/ui/AppInput";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../../services/auth/AuthProvider";
import { useLoginMutation } from "../../services/api/apiSlice";
import { tokens } from "../../theme";

const loginSchema = z.object({
  email: z.string().email("Ingrese un email válido"),
  password: z.string().min(1, "Ingrese su contraseña"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loginMutation, { isLoading }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const authResponse = await loginMutation(data).unwrap();
      console.log('Auth response: ', authResponse);
      await signIn({
        user: {
          id: authResponse.user.id,
          email: authResponse.user.email,
          name: authResponse.user.name ?? undefined,
          tenantId: authResponse.user.tenantId,
          roles: authResponse.user.roles,
          image: authResponse.user.image,
        },
        accessToken: authResponse.token,
        refreshToken: undefined,
      });
      router.replace("/(tabs)/appraisal");
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert(
        "Error de inicio de sesión",
        error?.data?.message || error?.message || "Credenciales inválidas"
      );
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText variant="3xl" weight="bold">
            Rivia Tasaciones
          </AppText>
          <AppText variant="md" color={tokens.colors.gray[500]}>
            Inicia sesión en tu cuenta
          </AppText>
        </View>

        <Card style={styles.card}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Email"
                placeholder="tu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Contraseña"
                placeholder="••••••••"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
              />
            )}
          />

          <AppButton
            title="Iniciar Sesión"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={styles.button}
          />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: tokens.spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: tokens.spacing.xl,
  },
  card: {
    padding: tokens.spacing.lg,
  },
  button: {
    marginTop: tokens.spacing.md,
  },
});
