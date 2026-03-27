/**
 * AgregarEspacio — Formulario para que anfitriones registren un nuevo espacio.
 *
 * Los datos del propietario se pre-rellenan desde la sesión activa.
 * Llama a POST /api/spaces al enviar.
 */
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";

const API_BASE = `https://${process.env["EXPO_PUBLIC_DOMAIN"]}/api`;

const SPACE_TYPES = ["Garaje", "Cuarto útil", "Bodega", "Habitación vacía", "Otro"];
const CITIES = ["Medellín", "Bogotá"];

interface FormState {
  spaceType: string;
  city: string;
  address: string;
  description: string;
  priceMonthly: string;
  priceDaily: string;
  priceAnnual: string;
}

const INITIAL: FormState = {
  spaceType: "",
  city: "",
  address: "",
  description: "",
  priceMonthly: "",
  priceDaily: "",
  priceAnnual: "",
};

export default function AgregarEspacio() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);

  function set(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.spaceType) {
      Alert.alert("Faltan datos", "Selecciona el tipo de espacio.");
      return;
    }
    if (!form.city) {
      Alert.alert("Faltan datos", "Selecciona la ciudad.");
      return;
    }
    if (!form.priceMonthly) {
      Alert.alert("Faltan datos", "Indica al menos el precio mensual.");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/spaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerName: user!.name,
          ownerEmail: user!.email,
          ownerPhone: user!.phone ?? "",
          spaceType: form.spaceType,
          city: form.city,
          address: form.address,
          description: form.description,
          priceMonthly: form.priceMonthly,
          priceDaily: form.priceDaily,
          priceAnnual: form.priceAnnual,
        }),
      });

      if (!resp.ok) throw new Error("Error al registrar");

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "¡Espacio registrado!",
        "Tu espacio fue enviado para revisión. El equipo de RaumLog lo aprobará pronto.",
        [{ text: "Entendido", onPress: () => router.back() }]
      );
    } catch (e) {
      Alert.alert("Error", "No se pudo registrar el espacio. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </Pressable>
        <View>
          <Text style={styles.headerSub}>Panel de anfitrión</Text>
          <Text style={styles.headerTitle}>Agregar espacio</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        {/* Tipo de espacio */}
        <Text style={styles.label}>Tipo de espacio *</Text>
        <View style={styles.pillRow}>
          {SPACE_TYPES.map((t) => (
            <Pressable
              key={t}
              style={[styles.pill, form.spaceType === t && styles.pillActive]}
              onPress={() => set("spaceType", t)}
            >
              <Text style={[styles.pillText, form.spaceType === t && styles.pillTextActive]}>
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Ciudad */}
        <Text style={styles.label}>Ciudad *</Text>
        <View style={styles.pillRow}>
          {CITIES.map((c) => (
            <Pressable
              key={c}
              style={[styles.pill, form.city === c && styles.pillActive]}
              onPress={() => set("city", c)}
            >
              <Text style={[styles.pillText, form.city === c && styles.pillTextActive]}>
                {c}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Dirección */}
        <Text style={styles.label}>Dirección o sector</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Laureles, calle 76 #…"
          placeholderTextColor={Colors.textMuted}
          value={form.address}
          onChangeText={(v) => set("address", v)}
          returnKeyType="next"
        />

        {/* Descripción */}
        <Text style={styles.label}>Descripción del espacio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Tamaño aproximado, acceso, características…"
          placeholderTextColor={Colors.textMuted}
          value={form.description}
          onChangeText={(v) => set("description", v)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Precios */}
        <Text style={styles.sectionTitle}>Precios (en COP)</Text>

        <Text style={styles.label}>Precio mensual *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 300000"
          placeholderTextColor={Colors.textMuted}
          value={form.priceMonthly}
          onChangeText={(v) => set("priceMonthly", v.replace(/[^0-9]/g, ""))}
          keyboardType="numeric"
          returnKeyType="next"
        />

        <Text style={styles.label}>Precio diario (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 15000"
          placeholderTextColor={Colors.textMuted}
          value={form.priceDaily}
          onChangeText={(v) => set("priceDaily", v.replace(/[^0-9]/g, ""))}
          keyboardType="numeric"
          returnKeyType="next"
        />

        <Text style={styles.label}>Precio anual (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 3000000"
          placeholderTextColor={Colors.textMuted}
          value={form.priceAnnual}
          onChangeText={(v) => set("priceAnnual", v.replace(/[^0-9]/g, ""))}
          keyboardType="numeric"
          returnKeyType="done"
        />

        {/* Nota informativa */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.primary} />
          <Text style={styles.infoText}>
            Tu espacio será revisado por el equipo de RaumLog antes de publicarse. Te
            notificaremos cuando esté listo.
          </Text>
        </View>

        {/* Botón enviar */}
        <Pressable
          style={[styles.submitBtn, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? "Enviando…" : "Registrar espacio"}
          </Text>
          {!loading && <Ionicons name="arrow-forward" size={18} color="#fff" />}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSub: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: Colors.primary,
    textAlign: "center",
  },
  content: {
    padding: 20,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: Colors.primaryDark,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
    marginTop: 14,
    marginBottom: 6,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: "#fff",
  },
  pillActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  pillText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.textMuted,
  },
  pillTextActive: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.text,
  },
  textArea: {
    height: 96,
    paddingTop: 12,
  },
  infoBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    backgroundColor: Colors.primaryLight + "22",
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.primary,
    lineHeight: 18,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.4,
  },
});
