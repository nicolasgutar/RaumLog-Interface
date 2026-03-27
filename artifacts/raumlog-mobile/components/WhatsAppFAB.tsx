import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import React from "react";
import { Platform, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WA_NUMBER = "573001234567";
const WA_MESSAGE = encodeURIComponent("Hola RaumLog, necesito ayuda con un espacio de almacenamiento");

export default function WhatsAppFAB() {
  const insets = useSafeAreaInsets();
  const bottomOffset = insets.bottom + (Platform.OS === "web" ? 100 : 100);

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Linking.openURL(`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`);
      }}
      style={({ pressed }) => [
        s.fab,
        { bottom: bottomOffset },
        pressed && { opacity: 0.85, transform: [{ scale: 0.93 }] },
      ]}
      hitSlop={8}
    >
      <Ionicons name="logo-whatsapp" size={28} color="#fff" />
    </Pressable>
  );
}

const s = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
});
