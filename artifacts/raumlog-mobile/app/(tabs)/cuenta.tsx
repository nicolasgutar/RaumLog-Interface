import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";

interface MenuRow {
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
  badge?: string;
}

export default function CuentaScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const webTop = Platform.OS === "web" ? 67 : 0;

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          logout();
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View
        style={[
          styles.root,
          styles.guestRoot,
          { paddingTop: insets.top + webTop, paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 90) },
        ]}
      >
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.guestLogo}
          resizeMode="contain"
        />
        <Text style={styles.guestTitle}>RaumLog</Text>
        <Text style={styles.guestSubtitle}>
          Tu espacio, tu confianza.{"\n"}Almacenamiento colaborativo en Medellín y Bogotá.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.loginBtn, pressed && { opacity: 0.85 }]}
          onPress={() => router.push("/auth")}
        >
          <Ionicons name="log-in-outline" size={20} color="#fff" />
          <Text style={styles.loginBtnText}>Iniciar sesión</Text>
        </Pressable>
        <Pressable onPress={() => router.push({ pathname: "/auth" })}>
          <Text style={styles.registerText}>¿No tienes cuenta? Regístrate gratis</Text>
        </Pressable>

        <View style={styles.featureRow}>
          {[
            { icon: "shield-checkmark-outline", text: "Contrato digital" },
            { icon: "card-outline", text: "Pago seguro" },
            { icon: "location-outline", text: "Medellín y Bogotá" },
          ].map((f) => (
            <View key={f.text} style={styles.featureItem}>
              <Ionicons name={f.icon as any} size={22} color={Colors.primaryLight} />
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  const initial = user.name.charAt(0).toUpperCase();
  const roleLabel = user.role === "host" ? "Anfitrión" : "Cliente";

  const menuItems: MenuRow[] = [
    ...(user.role === "host"
      ? [{ icon: "home-outline", label: "Panel de anfitrión", onPress: () => router.push("/(tabs)/dashboard") }]
      : [{ icon: "calendar-outline", label: "Mis reservas", onPress: () => router.push("/(tabs)/reservas") }]),
    { icon: "search-outline", label: "Buscar espacios", onPress: () => router.push("/(tabs)/") },
    { icon: "help-circle-outline", label: "Centro de Ayuda", onPress: () => router.push("/soporte"), color: Colors.primaryDark },
    { icon: "information-circle-outline", label: "Acerca de RaumLog", onPress: () => {}, color: Colors.textSecondary },
    { icon: "log-out-outline", label: "Cerrar sesión", onPress: handleLogout, color: Colors.error },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top + webTop }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 90) }}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.rolePill}>
              <Ionicons
                name={user.role === "host" ? "home" : "cube"}
                size={12}
                color={Colors.primary}
              />
              <Text style={styles.rolePillText}>{roleLabel}</Text>
            </View>
          </View>
        </View>

        {user.role === "host" && (
          <View style={styles.hostBanner}>
            <Ionicons name="star" size={18} color={Colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.hostBannerTitle}>Cuenta de anfitrión activa</Text>
              <Text style={styles.hostBannerSub}>Puedes gestionar espacios y solicitudes</Text>
            </View>
          </View>
        )}

        <View style={styles.menuSection}>
          {menuItems.map((item, i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [styles.menuRow, pressed && { backgroundColor: Colors.border }]}
              onPress={() => { Haptics.selectionAsync(); item.onPress(); }}
            >
              <View style={[styles.menuIcon, { backgroundColor: (item.color ?? Colors.primary) + "15" }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color ?? Colors.primary} />
              </View>
              <Text style={[styles.menuLabel, item.color ? { color: item.color } : {}]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </Pressable>
          ))}
        </View>

        <Text style={styles.version}>RaumLog v1.0 · Medellín & Bogotá</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  guestRoot: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  guestLogo: {
    width: 140,
    height: 140,
    borderRadius: 28,
    marginBottom: 8,
  },
  guestTitle: { fontFamily: "Inter_700Bold", fontSize: 28, color: Colors.text },
  guestSubtitle: {
    fontFamily: "Inter_400Regular", fontSize: 15, color: Colors.textSecondary,
    textAlign: "center", lineHeight: 22,
  },
  loginBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: Colors.primary, borderRadius: 16,
    paddingHorizontal: 32, paddingVertical: 14, marginTop: 8,
    shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  loginBtnText: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
  registerText: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.primary },
  featureRow: { flexDirection: "row", gap: 20, marginTop: 16 },
  featureItem: { alignItems: "center", gap: 4 },
  featureText: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textMuted, textAlign: "center" },
  profileCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    margin: 20, backgroundColor: Colors.card, borderRadius: 18,
    padding: 16, shadowColor: "#000", shadowOpacity: 0.05,
    shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
    borderWidth: 1, borderColor: Colors.border,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontFamily: "Inter_700Bold", fontSize: 22, color: "#fff" },
  userName: { fontFamily: "Inter_700Bold", fontSize: 17, color: Colors.text, marginBottom: 2 },
  userEmail: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary, marginBottom: 6 },
  rolePill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: Colors.primaryLight + "30", borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3, alignSelf: "flex-start",
  },
  rolePillText: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: Colors.primary },
  hostBanner: {
    flexDirection: "row", alignItems: "center", gap: 12,
    marginHorizontal: 20, marginBottom: 16,
    backgroundColor: Colors.accent + "20", borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: Colors.accent + "40",
  },
  hostBannerTitle: { fontFamily: "Inter_700Bold", fontSize: 14, color: Colors.text },
  hostBannerSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary },
  menuSection: {
    marginHorizontal: 20, backgroundColor: Colors.card, borderRadius: 18,
    overflow: "hidden", borderWidth: 1, borderColor: Colors.border,
  },
  menuRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 15, color: Colors.text },
  version: {
    fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textMuted,
    textAlign: "center", marginTop: 24, marginBottom: 8,
  },
});
