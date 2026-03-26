import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Colors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";

const API_BASE = `https://${process.env["EXPO_PUBLIC_DOMAIN"]}/api`;

interface Space {
  id: number;
  ownerName: string;
  ownerEmail: string;
  spaceType: string;
  city: string;
  address: string;
  description: string;
  priceMonthly: string;
  priceDaily: string;
}

const SPACE_TYPE_LABELS: Record<string, string> = {
  garage: "Garaje",
  bodega: "Bodega",
  deposito: "Depósito",
  cuarto: "Cuarto útil",
  warehouse: "Almacén",
};

async function fetchSpace(id: string): Promise<Space> {
  const resp = await fetch(`${API_BASE}/spaces/public/${id}`);
  if (!resp.ok) throw new Error("Espacio no encontrado");
  return (await resp.json()).space;
}

function calcPrice(baseMonthly: number, months: number) {
  const base = baseMonthly * months;
  const commission = Math.round(base * 0.2);
  const iva = Math.round(base * 0.19);
  const total = base + iva;
  return { base, commission, iva, total, hostNet: base - commission };
}

export default function SpaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [months, setMonths] = useState("1");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0]!;
  });
  const [showBooking, setShowBooking] = useState(false);

  const { data: space, isLoading, isError } = useQuery({
    queryKey: ["space", id],
    queryFn: () => fetchSpace(id!),
    enabled: !!id,
  });

  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!user || !space) throw new Error("Datos faltantes");
      const monthsNum = parseInt(months, 10);
      const base = parseInt(space.priceMonthly, 10) * monthsNum;
      const { total, commission, hostNet } = calcPrice(parseInt(space.priceMonthly, 10), monthsNum);
      const resp = await fetch(`${API_BASE}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceId: space.id,
          spaceTitle: `${SPACE_TYPE_LABELS[space.spaceType] ?? space.spaceType} en ${space.city}`,
          spaceOwnerEmail: space.ownerEmail,
          guestName: user.name,
          guestEmail: user.email,
          months: monthsNum,
          startDate,
          totalPrice: String(total),
          platformCommission: String(commission),
          hostNetPrice: String(hostNet),
        }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Error al reservar");
      }
      return resp.json();
    },
    onSuccess: (data) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ["guest-reservations"] });
      Alert.alert(
        "Reserva enviada",
        "El anfitrión revisará tu solicitud. Te notificaremos cuando haya una respuesta.",
        [
          {
            text: "Ver mis reservas",
            onPress: () => {
              router.back();
              router.push("/(tabs)/reservas");
            },
          },
          { text: "Volver", onPress: () => router.back() },
        ]
      );
    },
    onError: (e: any) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", e.message || "No se pudo enviar la reserva");
    },
  });

  const handleBook = () => {
    if (!user) {
      Alert.alert("Inicia sesión", "Necesitas una cuenta de cliente para reservar", [
        { text: "Cancelar", style: "cancel" },
        { text: "Entrar", onPress: () => router.push("/auth") },
      ]);
      return;
    }
    if (user.role === "host") {
      Alert.alert("Solo clientes", "Los anfitriones no pueden hacer reservas");
      return;
    }
    const monthsNum = parseInt(months, 10);
    if (!monthsNum || monthsNum < 1) {
      Alert.alert("Duración requerida", "Ingresa cuántos meses necesitas");
      return;
    }
    setShowBooking(true);
  };

  const confirmBook = () => {
    Alert.alert(
      "Confirmar reserva",
      `¿Enviar solicitud por ${months} ${parseInt(months, 10) === 1 ? "mes" : "meses"}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: () => bookMutation.mutate() },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isError || !space) {
    return (
      <View style={[styles.root, styles.center]}>
        <Ionicons name="warning-outline" size={48} color={Colors.textMuted} />
        <Text style={styles.errorText}>No se encontró el espacio</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const monthsNum = parseInt(months, 10) || 1;
  const priceMonthly = parseInt(space.priceMonthly || "0", 10);
  const { base, iva, total } = calcPrice(priceMonthly, monthsNum);
  const typeLabel = SPACE_TYPE_LABELS[space.spaceType] ?? space.spaceType;

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Pressable style={[styles.backFab, { top: insets.top + 12 }]} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color={Colors.text} />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <Ionicons name="business-outline" size={56} color={Colors.primaryLight} />
        </View>

        <View style={styles.body}>
          <View style={styles.topRow}>
            <View style={styles.typePill}>
              <Text style={styles.typePillText}>{typeLabel}</Text>
            </View>
            <View style={styles.cityRow}>
              <Ionicons name="location" size={14} color={Colors.primary} />
              <Text style={styles.cityText}>{space.city}</Text>
            </View>
          </View>

          <Text style={styles.address}>{space.address || "Dirección exacta al confirmar"}</Text>

          {!!space.description && (
            <>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.description}>{space.description}</Text>
            </>
          )}

          <Text style={styles.sectionTitle}>Precio</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Mensual</Text>
              <Text style={styles.priceValue}>
                ${priceMonthly.toLocaleString("es-CO")} COP
              </Text>
            </View>
            {!!space.priceDaily && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Diario</Text>
                <Text style={styles.priceValue}>
                  ${parseInt(space.priceDaily, 10).toLocaleString("es-CO")} COP
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Anfitrión</Text>
          <View style={styles.hostCard}>
            <View style={styles.hostAvatar}>
              <Text style={styles.hostAvatarText}>{space.ownerName.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.hostName}>{space.ownerName}</Text>
          </View>

          <Text style={styles.sectionTitle}>Solicitar reserva</Text>
          <View style={styles.bookingForm}>
            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Meses</Text>
                <TextInput
                  style={styles.formInput}
                  value={months}
                  onChangeText={setMonths}
                  keyboardType="number-pad"
                  placeholder="1"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Inicio (AAAA-MM-DD)</Text>
                <TextInput
                  style={styles.formInput}
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="2026-04-01"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>

            {priceMonthly > 0 && monthsNum > 0 && (
              <View style={styles.breakdown}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Base ({monthsNum} mes{monthsNum !== 1 ? "es" : ""})</Text>
                  <Text style={styles.breakdownValue}>${base.toLocaleString("es-CO")}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>IVA (19%)</Text>
                  <Text style={styles.breakdownValue}>${iva.toLocaleString("es-CO")}</Text>
                </View>
                <View style={[styles.breakdownRow, styles.breakdownTotal]}>
                  <Text style={styles.breakdownTotalLabel}>Total a pagar</Text>
                  <Text style={styles.breakdownTotalValue}>${total.toLocaleString("es-CO")} COP</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceValue}>${priceMonthly.toLocaleString("es-CO")}</Text>
          <Text style={styles.footerPriceSub}>/mes · sin IVA</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.reserveBtn, pressed && { opacity: 0.85 }]}
          onPress={handleBook}
          disabled={bookMutation.isPending}
        >
          {bookMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="calendar-outline" size={18} color="#fff" />
              <Text style={styles.reserveBtnText}>Solicitar</Text>
            </>
          )}
        </Pressable>
        {showBooking && (
          <Pressable
            style={({ pressed }) => [styles.confirmBtn, pressed && { opacity: 0.85 }]}
            onPress={confirmBook}
            disabled={bookMutation.isPending}
          >
            <Text style={styles.confirmBtnText}>Confirmar reserva</Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  center: { alignItems: "center", justifyContent: "center", gap: 12 },
  backFab: {
    position: "absolute",
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  hero: {
    height: 200,
    backgroundColor: Colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: 20 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  typePill: {
    backgroundColor: Colors.primaryLight + "30",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  typePillText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.primaryDark,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cityRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  cityText: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.primary },
  address: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text, marginBottom: 16 },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 16,
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  priceCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  priceRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  priceLabel: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textSecondary },
  priceValue: { fontFamily: "Inter_700Bold", fontSize: 14, color: Colors.primary },
  hostCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hostAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  hostAvatarText: { fontFamily: "Inter_700Bold", fontSize: 18, color: "#fff" },
  hostName: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  bookingForm: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formRow: { flexDirection: "row", gap: 12 },
  formField: { flex: 1 },
  formLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  breakdown: { marginTop: 14, gap: 6 },
  breakdownRow: { flexDirection: "row", justifyContent: "space-between" },
  breakdownLabel: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary },
  breakdownValue: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.text },
  breakdownTotal: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    marginTop: 4,
  },
  breakdownTotalLabel: { fontFamily: "Inter_700Bold", fontSize: 14, color: Colors.text },
  breakdownTotalValue: { fontFamily: "Inter_700Bold", fontSize: 14, color: Colors.primary },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
    flexWrap: "wrap",
  },
  footerPrice: { flex: 1 },
  footerPriceValue: { fontFamily: "Inter_700Bold", fontSize: 18, color: Colors.primary },
  footerPriceSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textMuted },
  reserveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  reserveBtnText: { fontFamily: "Inter_700Bold", fontSize: 15, color: "#fff" },
  confirmBtn: {
    width: "100%",
    backgroundColor: Colors.success,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmBtnText: { fontFamily: "Inter_700Bold", fontSize: 15, color: "#fff" },
  errorText: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  backBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  backBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#fff" },
});
