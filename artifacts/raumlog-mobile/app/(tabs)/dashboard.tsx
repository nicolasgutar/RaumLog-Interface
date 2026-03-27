import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
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

interface Space {
  id: number;
  spaceType: string;
  city: string;
  address: string;
  priceMonthly: string;
  published: boolean;
  status: string;
}

interface Reservation {
  id: number;
  guestName: string;
  guestEmail: string;
  spaceTitle: string;
  months: number;
  totalPrice: string;
  status: string;
  startDate: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending_approval: { label: "Pendiente", color: Colors.statusPending },
  approved_by_host: { label: "Aprobada", color: Colors.statusApproved },
  rejected: { label: "Rechazada", color: Colors.statusRejected },
  paid: { label: "Pagada", color: Colors.statusPaid },
  in_storage: { label: "En uso", color: Colors.statusStorage },
  completed: { label: "Completada", color: Colors.statusCompleted },
};

const SPACE_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  approved: { label: "Aprobado", color: Colors.statusApproved },
  pending: { label: "Pendiente", color: Colors.statusPending },
  rejected: { label: "Rechazado", color: Colors.statusRejected },
};

async function fetchHostSpaces(email: string): Promise<Space[]> {
  const resp = await fetch(`${API_BASE}/host/spaces?email=${encodeURIComponent(email)}`);
  if (!resp.ok) throw new Error("Error");
  return (await resp.json()).spaces ?? [];
}

async function fetchHostReservations(email: string): Promise<Reservation[]> {
  const resp = await fetch(`${API_BASE}/host/reservations?email=${encodeURIComponent(email)}`);
  if (!resp.ok) throw new Error("Error");
  return (await resp.json()).reservations ?? [];
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"spaces" | "reservations">("reservations");
  const spacesQ = useQuery({
    queryKey: ["host-spaces", user?.email],
    queryFn: () => fetchHostSpaces(user!.email),
    enabled: !!user && user.role === "host",
  });

  const reservsQ = useQuery({
    queryKey: ["host-reservations", user?.email],
    queryFn: () => fetchHostReservations(user!.email),
    enabled: !!user && user.role === "host",
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const resp = await fetch(`${API_BASE}/host/reservations/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ownerEmail: user!.email }),
      });
      if (!resp.ok) throw new Error("Error al actualizar");
      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["host-reservations"] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
  });

  const handleAction = (id: number, status: "approved_by_host" | "rejected" | "completed") => {
    const labels = { approved_by_host: "aprobar", rejected: "rechazar", completed: "marcar como completada" };
    Alert.alert(
      "Confirmar acción",
      `¿Deseas ${labels[status]} esta reserva?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: () => statusMutation.mutate({ id, status }) },
      ]
    );
  };

  if (!user) {
    return (
      <View style={[styles.root, styles.center, { paddingTop: insets.top }]}>
        <View style={styles.emptyIcon}>
          <Ionicons name="home-outline" size={36} color={Colors.primaryLight} />
        </View>
        <Text style={styles.emptyTitle}>Panel de Anfitrión</Text>
        <Text style={styles.emptyText}>Inicia sesión para gestionar tus espacios</Text>
        <Pressable style={styles.actionBtn} onPress={() => router.push("/auth")}>
          <Text style={styles.actionBtnText}>Entrar</Text>
        </Pressable>
      </View>
    );
  }

  if (user.role !== "host") {
    return (
      <View style={[styles.root, styles.center, { paddingTop: insets.top }]}>
        <View style={styles.emptyIcon}>
          <Ionicons name="home-outline" size={36} color={Colors.primaryLight} />
        </View>
        <Text style={styles.emptyTitle}>Solo para anfitriones</Text>
        <Text style={styles.emptyText}>Esta sección es para cuentas de tipo anfitrión</Text>
      </View>
    );
  }

  const reservations = reservsQ.data ?? [];
  const spaces = spacesQ.data ?? [];
  const pending = reservations.filter(r => r.status === "pending_approval").length;
  const active = reservations.filter(r => r.status === "in_storage").length;
  const totalEarned = reservations
    .filter(r => ["paid", "in_storage", "completed"].includes(r.status))
    .reduce((sum, r) => sum + parseInt(r.totalPrice ?? "0", 10), 0);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Panel</Text>
          <Text style={styles.headerTitle}>Mis espacios</Text>
        </View>
        <Pressable
          style={styles.addBtn}
          onPress={() => router.push("/agregar-espacio")}
          accessibilityLabel="Agregar espacio"
        >
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 90) }}
      >
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: Colors.primary }]}>
            <Text style={styles.statValue}>{pending}</Text>
            <Text style={styles.statLabel}>Por revisar</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.statusStorage }]}>
            <Text style={styles.statValue}>{active}</Text>
            <Text style={styles.statLabel}>En uso</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.success }]}>
            <Text style={styles.statValue}>${Math.floor(totalEarned / 1000)}K</Text>
            <Text style={styles.statLabel}>Ingresos</Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          {(["reservations", "spaces"] as const).map((t) => (
            <Pressable
              key={t}
              style={[styles.tabBtn, activeTab === t && styles.tabBtnActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
                {t === "reservations" ? "Solicitudes" : "Mis espacios"}
              </Text>
              {t === "reservations" && pending > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{pending}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          {activeTab === "reservations" ? (
            reservsQ.isLoading ? (
              <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} />
            ) : reservations.length === 0 ? (
              <View style={styles.emptyBlock}>
                <Ionicons name="calendar-outline" size={40} color={Colors.textMuted} />
                <Text style={styles.emptyBlockText}>Sin solicitudes todavía</Text>
              </View>
            ) : (
              reservations.map((r) => {
                const st = STATUS_CONFIG[r.status] ?? { label: r.status, color: Colors.textMuted };
                const total = parseInt(r.totalPrice ?? "0", 10);
                return (
                  <View key={r.id} style={styles.resCard}>
                    <View style={styles.resHeader}>
                      <View style={[styles.statusPill, { backgroundColor: st.color + "20" }]}>
                        <View style={[styles.statusDot, { backgroundColor: st.color }]} />
                        <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
                      </View>
                      <Text style={styles.resId}>#{r.id}</Text>
                    </View>
                    <Text style={styles.resGuest}>{r.guestName}</Text>
                    <Text style={styles.resMeta} numberOfLines={1}>{r.spaceTitle || "Espacio"}</Text>
                    <View style={styles.resRow}>
                      <Text style={styles.resDuration}>{r.months} {r.months === 1 ? "mes" : "meses"}</Text>
                      <Text style={styles.resPrice}>${total.toLocaleString("es-CO")} COP</Text>
                    </View>
                    {r.status === "pending_approval" && (
                      <View style={styles.actionsRow}>
                        <Pressable
                          style={[styles.actionChip, { backgroundColor: Colors.statusApproved + "20" }]}
                          onPress={() => handleAction(r.id, "approved_by_host")}
                        >
                          <Ionicons name="checkmark" size={14} color={Colors.statusApproved} />
                          <Text style={[styles.actionChipText, { color: Colors.statusApproved }]}>Aprobar</Text>
                        </Pressable>
                        <Pressable
                          style={[styles.actionChip, { backgroundColor: Colors.statusRejected + "15" }]}
                          onPress={() => handleAction(r.id, "rejected")}
                        >
                          <Ionicons name="close" size={14} color={Colors.statusRejected} />
                          <Text style={[styles.actionChipText, { color: Colors.statusRejected }]}>Rechazar</Text>
                        </Pressable>
                      </View>
                    )}
                    {r.status === "in_storage" && (
                      <Pressable
                        style={[styles.actionChip, { backgroundColor: Colors.statusCompleted + "20", alignSelf: "flex-start" }]}
                        onPress={() => handleAction(r.id, "completed")}
                      >
                        <Ionicons name="checkmark-done" size={14} color={Colors.statusCompleted} />
                        <Text style={[styles.actionChipText, { color: Colors.statusCompleted }]}>Finalizar</Text>
                      </Pressable>
                    )}
                  </View>
                );
              })
            )
          ) : (
            spacesQ.isLoading ? (
              <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} />
            ) : spaces.length === 0 ? (
              <View style={styles.emptyBlock}>
                <Ionicons name="home-outline" size={40} color={Colors.textMuted} />
                <Text style={styles.emptyBlockText}>Aún no tienes espacios</Text>
                <Text style={styles.emptyBlockSub}>Ofrece tu espacio desde la web</Text>
              </View>
            ) : (
              spaces.map((sp) => {
                const st = SPACE_STATUS_CONFIG[sp.status] ?? { label: sp.status, color: Colors.textMuted };
                return (
                  <View key={sp.id} style={styles.spaceCard}>
                    <View style={styles.spaceLeft}>
                      <Ionicons name="business-outline" size={24} color={Colors.primaryLight} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.resHeader}>
                        <View style={[styles.statusPill, { backgroundColor: st.color + "20" }]}>
                          <View style={[styles.statusDot, { backgroundColor: st.color }]} />
                          <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
                        </View>
                        <Text style={styles.spacePublished}>{sp.published ? "Publicado" : "No publicado"}</Text>
                      </View>
                      <Text style={styles.spaceCity}>{sp.city} · {sp.spaceType}</Text>
                      <Text style={styles.spaceAddress} numberOfLines={1}>{sp.address || "Sin dirección"}</Text>
                      {!!sp.priceMonthly && (
                        <Text style={styles.spacePrice}>
                          ${parseInt(sp.priceMonthly, 10).toLocaleString("es-CO")} COP/mes
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  center: { alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 32 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 16,
  },
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center",
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  headerSub: {
    fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.primary,
    letterSpacing: 0.5, textTransform: "uppercase",
  },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 24, color: Colors.text, marginTop: 2 },
  statsRow: { flexDirection: "row", paddingHorizontal: 20, gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1, borderRadius: 16, padding: 14, alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 22, color: "#fff" },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  tabRow: { flexDirection: "row", paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  tabBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 18, paddingVertical: 9, borderRadius: 24,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
  },
  tabBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.textSecondary },
  tabTextActive: { color: "#fff" },
  badge: {
    backgroundColor: Colors.accent, borderRadius: 10, minWidth: 18, height: 18,
    alignItems: "center", justifyContent: "center", paddingHorizontal: 4,
  },
  badgeText: { fontFamily: "Inter_700Bold", fontSize: 10, color: "#fff" },
  section: { paddingHorizontal: 20 },
  emptyBlock: { alignItems: "center", gap: 8, paddingVertical: 40 },
  emptyBlockText: { fontFamily: "Inter_500Medium", fontSize: 15, color: Colors.textMuted },
  emptyBlockSub: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textMuted },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primaryDark,
    alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  emptyTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  emptyText: {
    fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textSecondary, textAlign: "center",
  },
  actionBtn: {
    marginTop: 8, backgroundColor: Colors.primary, borderRadius: 24,
    paddingHorizontal: 28, paddingVertical: 12,
  },
  actionBtnText: { fontFamily: "Inter_700Bold", fontSize: 15, color: "#fff" },
  resCard: {
    backgroundColor: Colors.card, borderRadius: 16, padding: 14, marginBottom: 12,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 5, shadowOffset: { width: 0, height: 2 },
    elevation: 1, borderWidth: 1, borderColor: Colors.border,
  },
  resHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  resId: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textMuted },
  resGuest: { fontFamily: "Inter_700Bold", fontSize: 15, color: Colors.text, marginBottom: 2 },
  resMeta: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary, marginBottom: 8 },
  resRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  resDuration: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  resPrice: { fontFamily: "Inter_700Bold", fontSize: 14, color: Colors.primary },
  actionsRow: { flexDirection: "row", gap: 8 },
  actionChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7,
  },
  actionChipText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  spaceCard: {
    backgroundColor: Colors.card, borderRadius: 16, padding: 14, marginBottom: 12,
    flexDirection: "row", gap: 12, alignItems: "flex-start",
    borderWidth: 1, borderColor: Colors.border,
  },
  spaceLeft: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.primaryDark,
    alignItems: "center", justifyContent: "center",
  },
  spaceCity: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text, marginBottom: 2 },
  spaceAddress: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  spacePrice: { fontFamily: "Inter_700Bold", fontSize: 13, color: Colors.primary },
  spacePublished: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textMuted },
});
