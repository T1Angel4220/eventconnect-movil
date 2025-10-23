import { Stack } from "expo-router";

/**
 * Layout para las pantallas de gestión de perfil (fuera de tabs)
 */
export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right", // Animación iOS nativa
      }}
    >
      <Stack.Screen 
        name="edit-profile" 
        options={{
          presentation: "card",
        }}
      />
      <Stack.Screen 
        name="change-password"
        options={{
          presentation: "card",
        }}
      />
    </Stack>
  );
}

