import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

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
  status: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending_approval: { label: "Esperando aprobación", color: Colors.statusPending, icon: "time-outline" },
  approved_by_host: { label: "Aprobada", color: Colors.statusApproved, icon: "checkmark-circle-outline" },
  rejected: { label: "Rechazada", color: Colors.statusRejected, icon: "close-circle-outline" },
  paid: { label: "Pagada", color: Colors.statusPaid, icon: "card-outline" },
  in_storage: { label: "En almacenamiento", color: Colors.statusStorage, icon: "cube-outline" },
  completed: { label: "Completada", color: Colors.statusCompleted, icon: "checkmark-done-outline" },
};

async function fetchGuestReservations(email: string): Promise<Reservation[]> {
  const resp = await fetch(`${API_BASE}/reservations/guest?email=${encodeURIComponent(email)}`);
  if (!resp.ok) throw new Error("Error al cargar reservas");
  const data = await resp.json();
  return data.reservations ?? [];
}

function ReservationCard({ item }: { item: Reservation }) {
  const status = STATUS_CONFIG[item.status] ?? { label: item.status, color: Colors.textMuted, icon: "ellipse-outline" };
  const total = parseInt(item.totalPrice ?? "0", 10);
  const date = new Date(item.startDate).toLocaleDateString("es-CO", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
      onPress={() => { Haptics.selectionAsync(); router.push({ pathname: "/booking/[id]", params: { id: String(item.id) } }); }}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.statusDot, { backgroundColor: status.color }]} />
        <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.cardDate}>{date}</Text>
      </View>
      <Text style={styles.cardTitle} numberOfLines={1}>{item.spaceTitle || "Espacio de almacenamiento"}</Text>
      <View style={styles.cardRow}>
        <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
        <Text style={styles.cardMeta}>{item.months} {item.months === 1 ? "mes" : "meses"}</Text>
        <View style={styles.dot} />
        <Text style={styles.cardPrice}>
          ${total.toLocaleString("es-CO")} COP
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} style={styles.chevron} />
    </Pressable>
  );
}

export default function ReservasScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const webTop = Platform.OS === "web" ? 67 : 0;

  const { data: reservations = [], isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["guest-reservations", user?.email],
    queryFn: () => fetchGuestReservations(user!.email),
    enabled: !!user,
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top + webTop }]}>
      <View style={styles.header}>
        <Text style={styles.headerSub}>Tu historial</Text>
        <Text style={styles.headerTitle}>Mis reservas</Text>
      </View>

      {!user ? (
        <View style={styles.center}>
          <View style={styles.emptyIcon}>
            <Ionicons name="lock-closed-outline" size={36} color={Colors.primaryLight} />
          </View>
          <Text style={styles.emptyTitle}>Inicia sesión</Text>
          <Text style={styles.emptyText}>Para ver tus reservas necesitas una cuenta</Text>
          <Pressable style={styles.actionBtn} onPress={() => router.push("/auth")}>
            <Text style={styles.actionBtnText}>Entrar</Text>
          </Pressable>
        </View>
      ) : isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No se pudo cargar</Text>
          <Pressable style={styles.actionBtn} onPress={() => refetch()}>
            <Text style={styles.actionBtnText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : reservations.length === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIcon}>
            <Ionicons name="calendar-outline" size={36} color={Colors.primaryLight} />
          </View>
          <Text style={styles.emptyTitle}>Sin reservas aún</Text>
          <Text style={styles.emptyText}>Busca un espacio y haz tu primera reserva</Text>
          <Pressable style={styles.actionBtn} onPress={() => router.push("/(tabs)/")}>
            <Text style={styles.actionBtnText}>Explorar espacios</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ReservationCard item={item} />}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 90) },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.primary} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerSub: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.primary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    color: Colors.text,
    marginTop: 2,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 32 },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: Colors.text,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  actionBtn: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 12,
    shadowColor: Colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  actionBtnText: { fontFamily: "Inter_700Bold", fontSize: 15, color: "#fff" },
  list: { paddingHorizontal: 20, paddingTop: 4 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  cardDate: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textMuted },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: Colors.text,
    marginBottom: 6,
  },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardMeta: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.textMuted },
  cardPrice: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.primary },
  chevron: { position: "absolute", right: 16, top: "50%" },
});
