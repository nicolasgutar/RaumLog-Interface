/**
 * TabLayout — Navegación principal de la app RaumLog.
 *
 * Define la barra de pestañas inferior con 4 secciones:
 * Buscar, Reservas, Anfitrión y Cuenta.
 *
 * El header superior muestra el logo oficial de RaumLog centrado
 * sobre fondo blanco con borde sutil. Respeta el Safe Area del
 * dispositivo automáticamente gracias a Expo Router.
 */
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";

import Colors from "@/constants/colors";
import WhatsAppFAB from "@/components/WhatsAppFAB";

/** Logo centrado que se muestra en el header de cada pestaña. */
function LogoTitle() {
  return (
    <Image
      source={require("../../assets/images/icon.png")}
      style={{ width: 120, height: 40 }}
      resizeMode="contain"
      accessibilityLabel="RaumLog"
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          /* ── Header superior con logo ── */
          headerShown: true,
          headerTitle: () => <LogoTitle />,
          headerTitleAlign: "left",
          headerStyle: {
            backgroundColor: "#ffffff",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: Colors.border,
          } as any,
          headerShadowVisible: false,

          /* ── Tab bar inferior ── */
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: isIOS ? "transparent" : isDark ? "#0D1B2A" : "#fff",
            borderTopWidth: 1,
            borderTopColor: Colors.border,
            elevation: 0,
            ...(isWeb ? { height: 84 } : {}),
          },
          tabBarBackground: () =>
            isIOS ? (
              <BlurView
                intensity={90}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
            ) : (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: isDark ? "#0D1B2A" : "#fff" },
                ]}
              />
            ),
          tabBarLabelStyle: {
            fontFamily: "Inter_500Medium",
            fontSize: 11,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Buscar",
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="magnifyingglass" tintColor={color} size={22} />
              ) : (
                <Ionicons name="search-outline" size={22} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="reservas"
          options={{
            title: "Reservas",
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="calendar" tintColor={color} size={22} />
              ) : (
                <Ionicons name="calendar-outline" size={22} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Anfitrión",
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="house" tintColor={color} size={22} />
              ) : (
                <Ionicons name="home-outline" size={22} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="cuenta"
          options={{
            title: "Cuenta",
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="person.circle" tintColor={color} size={22} />
              ) : (
                <Ionicons name="person-circle-outline" size={22} color={color} />
              ),
          }}
        />
      </Tabs>
      <WhatsAppFAB />
    </View>
  );
}
