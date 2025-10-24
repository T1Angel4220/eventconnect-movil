import { Stack } from "expo-router";
import { LogBox } from "react-native";
import { AuthProvider, ThemeProvider, ToastProvider } from "@/src/contexts";
import { NavigationBarController, ErrorBoundary } from "@/src/components";

// ⚠️ DESACTIVAR LOGBOX - No más errores feos en pantalla
LogBox.ignoreAllLogs(true);

// También desactivar warnings específicos si es necesario
if (__DEV__) {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Filtrar errores específicos que no queremos mostrar
    const message = args[0]?.toString() || '';
    if (
      message.includes('Warning:') ||
      message.includes('ReactNativeFiberHostComponent')
    ) {
      return;
    }
    originalConsoleError(...args);
  };
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
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
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
