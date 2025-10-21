import { Stack } from "expo-router";

/**
 * Layout para las pantallas de autenticación
 * Sin tabs, solo navegación de stack
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "#ffffff" },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="verify-code" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}

