import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Colors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";

const API_BASE = `https://${process.env["EXPO_PUBLIC_DOMAIN"]}/api`;

interface Reservation {
  id: number;
  spaceTitle: string;
  spaceOwnerEmail: string;
  guestName: string;
  guestEmail: string;
  months: number;
  startDate: string;
  totalPrice: string;
  platformCommission: string;
  hostNetPrice: string;
  status: string;
  wompiReference: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string; description: string }> = {
  pending_approval: {
    label: "Esperando aprobación",
    color: Colors.statusPending,
    icon: "time-outline",
    description: "El anfitrión está revisando tu solicitud.",
  },
  approved_by_host: {
    label: "Aprobada",
    color: Colors.statusApproved,
    icon: "checkmark-circle-outline",
    description: "El anfitrión aprobó tu solicitud. Procede con el pago.",
  },
  rejected: {
    label: "Rechazada",
    color: Colors.statusRejected,
    icon: "close-circle-outline",
    description: "El anfitrión no pudo aceptar esta solicitud.",
  },
  paid: {
    label: "Pagada",
    color: Colors.statusPaid,
    icon: "card-outline",
    description: "Pago confirmado. Coordina el check-in con el anfitrión.",
  },
  in_storage: {
    label: "En almacenamiento",
    color: Colors.statusStorage,
    icon: "cube-outline",
    description: "Tu almacenaje está activo.",
  },
  completed: {
    label: "Completada",
    color: Colors.statusCompleted,
    icon: "checkmark-done-outline",
    description: "Esta reserva fue completada exitosamente.",
  },
};

async function fetchReservation(id: string): Promise<Reservation> {
  const resp = await fetch(`${API_BASE}/reservations/${id}`);
  if (!resp.ok) throw new Error("Reserva no encontrada");
  return (await resp.json()).reservation;
}

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reservation, isLoading, isError, refetch } = useQuery({
    queryKey: ["reservation", id],
    queryFn: () => fetchReservation(id!),
    enabled: !!id,
  });

  const payMutation = useMutation({
    mutationFn: async () => {
      const resp = await fetch(`${API_BASE}/reservations/${id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!resp.ok) throw new Error("Error al procesar el pago");
      return resp.json();
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ["reservation", id] });
      queryClient.invalidateQueries({ queryKey: ["guest-reservations"] });
      Alert.alert("Pago aprobado", "Tu pago fue procesado exitosamente (modo sandbox Wompi).");
    },
    onError: (e: any) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", e.message);
    },
  });

  const handlePay = () => {
    Alert.alert(
      "Confirmar pago",
      `Pago total: $${parseInt(reservation?.totalPrice ?? "0", 10).toLocaleString("es-CO")} COP\n\nSe procesará en modo sandbox Wompi.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Pagar", onPress: () => payMutation.mutate() },
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

  if (isError || !reservation) {
    return (
      <View style={[styles.root, styles.center]}>
        <Ionicons name="warning-outline" size={48} color={Colors.textMuted} />
        <Text style={styles.errorText}>No se encontró la reserva</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const status = STATUS_CONFIG[reservation.status] ?? {
    label: reservation.status,
    color: Colors.textMuted,
    icon: "ellipse-outline",
    description: "",
  };
  const total = parseInt(reservation.totalPrice ?? "0", 10);
  const commission = parseInt(reservation.platformCommission ?? "0", 10);
  const hostNet = parseInt(reservation.hostNetPrice ?? "0", 10);
  const iva = total - (total / 1.19);

  const createdDate = new Date(reservation.createdAt).toLocaleDateString("es-CO", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 12) }]}>
        <Pressable style={styles.backFab} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </Pressable>
        <Text style={styles.topBarTitle}>Reserva #{reservation.id}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 100),
          paddingTop: 12,
        }}
      >
        <View style={[styles.statusCard, { borderColor: status.color + "40" }]}>
          <View style={[styles.statusIcon, { backgroundColor: status.color + "15" }]}>
            <Ionicons name={status.icon as any} size={28} color={status.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
            <Text style={styles.statusDesc}>{status.description}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Espacio</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={16} color={Colors.primary} />
            <Text style={styles.infoValue}>{reservation.spaceTitle || "Espacio de almacenaje"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.infoLabel}>
              {reservation.months} {reservation.months === 1 ? "mes" : "meses"} · desde {new Date(reservation.startDate).toLocaleDateString("es-CO")}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.infoLabel}>Solicitud: {createdDate}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Desglose de pago</Text>
        <View style={styles.infoCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Base</Text>
            <Text style={styles.priceValue}>${Math.round(total / 1.19).toLocaleString("es-CO")} COP</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>IVA (19%)</Text>
            <Text style={styles.priceValue}>${Math.round(total - total / 1.19).toLocaleString("es-CO")} COP</Text>
          </View>
          <View style={[styles.priceRow, styles.priceTotal]}>
            <Text style={styles.priceTotalLabel}>Total</Text>
            <Text style={styles.priceTotalValue}>${total.toLocaleString("es-CO")} COP</Text>
          </View>
        </View>

        {!!reservation.wompiReference && (
          <>
            <Text style={styles.sectionTitle}>Referencia de pago</Text>
            <View style={styles.refCard}>
              <Ionicons name="card-outline" size={16} color={Colors.statusPaid} />
              <Text style={styles.refText}>{reservation.wompiReference}</Text>
            </View>
          </>
        )}
      </ScrollView>

      {reservation.status === "approved_by_host" && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
          <Pressable
            style={({ pressed }) => [styles.payBtn, pressed && { opacity: 0.85 }]}
            onPress={handlePay}
            disabled={payMutation.isPending}
          >
            {payMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="card-outline" size={20} color="#fff" />
                <Text style={styles.payBtnText}>Proceder al pago</Text>
              </>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  center: { alignItems: "center", justifyContent: "center", gap: 12 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.background,
  },
  backFab: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.card, alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  topBarTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: Colors.text },
  statusCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
    marginBottom: 20,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  statusIcon: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: "center", justifyContent: "center",
  },
  statusLabel: { fontFamily: "Inter_700Bold", fontSize: 16, marginBottom: 4 },
  statusDesc: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    gap: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoValue: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text, flex: 1 },
  infoLabel: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary, flex: 1 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  priceLabel: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textSecondary },
  priceValue: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.text },
  priceTotal: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10, marginTop: 6 },
  priceTotalLabel: { fontFamily: "Inter_700Bold", fontSize: 15, color: Colors.text },
  priceTotalValue: { fontFamily: "Inter_700Bold", fontSize: 15, color: Colors.primary },
  refCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.statusPaid + "15",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  refText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.statusPaid, flex: 1 },
  footer: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  payBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  payBtnText: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
  errorText: { fontFamily: "Inter_500Medium", fontSize: 15, color: Colors.textSecondary },
  backBtn: { backgroundColor: Colors.primary, borderRadius: 20, paddingHorizontal: 24, paddingVertical: 10 },
  backBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#fff" },
});
