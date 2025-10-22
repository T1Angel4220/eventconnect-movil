import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks";
import { IOS_COLORS, getIOSColor } from "@/src/constants/iosStyles";

/**
 * Layout para las pantallas con tabs (dashboard del participante) - Estilo iOS
 */
export default function TabsLayout() {
  const { isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: getIOSColor(IOS_COLORS.systemBlue, isDark),
        tabBarInactiveTintColor: getIOSColor(IOS_COLORS.label.secondary, isDark),
        tabBarStyle: {
          backgroundColor: getIOSColor(IOS_COLORS.background.secondary, isDark),
          borderTopWidth: 0.5,
          borderTopColor: getIOSColor(
            isDark ? 'rgba(84, 84, 88, 0.65)' : 'rgba(60, 60, 67, 0.29)',
            isDark
          ),
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 2,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: -0.08,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Eventos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-events"
        options={{
          title: "Mis Eventos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ticket" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

