import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

const WA_NUMBER = "573001234567";
const WA_MESSAGE = encodeURIComponent("Hola RaumLog, necesito ayuda con un espacio de almacenamiento");

interface Channel {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  sub: string;
  action: () => void;
}

export default function SoporteScreen() {
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;

  const channels: Channel[] = [
    {
      icon: "logo-whatsapp",
      color: "#25D366",
      label: "WhatsApp",
      sub: "Respuesta rápida · Lunes a Sábado",
      action: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Linking.openURL(`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`);
      },
    },
    {
      icon: "mail-outline",
      color: Colors.primary,
      label: "Correo electrónico",
      sub: "info@coalge.com.co · COALGE S.A.S.",
      action: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Linking.openURL("mailto:info@coalge.com.co?subject=Ayuda%20RaumLog");
      },
    },
    {
      icon: "logo-instagram",
      color: "#E1306C",
      label: "Instagram",
      sub: "@raumlog",
      action: () => Linking.openURL("https://instagram.com/raumlog"),
    },
    {
      icon: "logo-facebook",
      color: "#1877F2",
      label: "Facebook",
      sub: "facebook.com/raumlog",
      action: () => Linking.openURL("https://facebook.com/raumlog"),
    },
    {
      icon: "logo-linkedin",
      color: "#0A66C2",
      label: "LinkedIn",
      sub: "linkedin.com/company/raumlog",
      action: () => Linking.openURL("https://linkedin.com/company/raumlog"),
    },
  ];

  return (
    <View style={[s.root, { paddingTop: insets.top + webTop }]}>
      <View style={s.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={s.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.primary} />
        </Pressable>
        <Text style={s.title}>Centro de Ayuda</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          s.content,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 100) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.subtitle}>
          Estamos aquí para ayudarte. Elige el canal que prefieras.
        </Text>

        {channels.map((ch) => (
          <Pressable
            key={ch.label}
            onPress={ch.action}
            style={({ pressed }) => [s.row, pressed && s.rowPressed]}
          >
            <View style={[s.iconBox, { backgroundColor: ch.color + "18" }]}>
              <Ionicons name={ch.icon} size={24} color={ch.color} />
            </View>
            <View style={s.rowText}>
              <Text style={s.rowLabel}>{ch.label}</Text>
              <Text style={s.rowSub}>{ch.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.primary + "60"} />
          </Pressable>
        ))}

        <View style={s.infoCard}>
          <Text style={s.infoText}>
            <Text style={{ fontWeight: "700", color: Colors.primary }}>COALGE S.A.S.</Text>
            {" · "}NIT 901.234.567-8 · Medellín, Antioquia, Colombia.{"\n"}
            Lunes–Viernes 8am–6pm · Sábados 9am–1pm
          </Text>
        </View>

        <View style={s.legalRow}>
          <Pressable onPress={() => Linking.openURL("https://raumlog.co/terminos-y-condiciones")}>
            <Text style={s.legalLink}>Términos y Condiciones</Text>
          </Pressable>
          <Text style={s.legalDot}> · </Text>
          <Pressable onPress={() => Linking.openURL("https://raumlog.co/politica-de-privacidad")}>
            <Text style={s.legalLink}>Política de Privacidad</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryLight + "40",
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: Colors.primaryLight + "30",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  content: { padding: 20, gap: 12 },
  subtitle: {
    fontSize: 14,
    color: Colors.primary + "80",
    marginBottom: 8,
    lineHeight: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rowPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: "600", color: Colors.primary },
  rowSub: { fontSize: 12, color: Colors.primary + "70", marginTop: 2 },
  infoCard: {
    backgroundColor: Colors.primaryLight + "20",
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
  },
  infoText: { fontSize: 13, color: Colors.primary + "80", lineHeight: 20 },
  legalRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  legalLink: { fontSize: 11, color: Colors.primary + "70", textDecorationLine: "underline" },
  legalDot: { fontSize: 11, color: Colors.primary + "40" },
});
