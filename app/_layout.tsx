import { Stack } from "expo-router";
import { AuthProvider, ThemeProvider } from "@/src/contexts";
import { NavigationBarController } from "@/src/components";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationBarController>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="event/[id]" />
          </Stack>
        </NavigationBarController>
      </AuthProvider>
    </ThemeProvider>
  );
}
