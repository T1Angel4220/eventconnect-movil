import { Stack } from "expo-router";
import { AuthProvider, ThemeProvider } from "@/src/contexts";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="event/[id]" />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
