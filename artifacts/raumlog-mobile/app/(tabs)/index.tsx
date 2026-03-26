import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import Colors from "@/constants/colors";

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

const CITY_FILTERS = ["Todas", "Medellín", "Bogotá"];

async function fetchSpaces(city?: string): Promise<Space[]> {
  const params = city && city !== "Todas" ? `?city=${encodeURIComponent(city)}` : "";
  const resp = await fetch(`${API_BASE}/spaces/public${params}`);
  if (!resp.ok) throw new Error("Error al cargar espacios");
  const data = await resp.json();
  return data.spaces ?? [];
}

function SpaceCard({ space, onPress }: { space: Space; onPress: () => void }) {
  const typeLabel = SPACE_TYPE_LABELS[space.spaceType] ?? space.spaceType;
  const priceNum = parseInt(space.priceMonthly ?? "0", 10);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] }]}
      onPress={() => { Haptics.selectionAsync(); onPress(); }}
    >
      <View style={styles.cardImagePlaceholder}>
        <Ionicons name="business-outline" size={36} color={Colors.primaryLight} />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardRow}>
          <View style={styles.typePill}>
            <Text style={styles.typePillText}>{typeLabel}</Text>
          </View>
          <View style={styles.cityPill}>
            <Ionicons name="location-outline" size={11} color={Colors.textSecondary} />
            <Text style={styles.cityPillText}>{space.city}</Text>
          </View>
        </View>
        <Text style={styles.cardAddress} numberOfLines={1}>{space.address || "Dirección exacta al confirmar"}</Text>
        {!!space.description && (
          <Text style={styles.cardDesc} numberOfLines={2}>{space.description}</Text>
        )}
        <View style={styles.cardFooter}>
          <Text style={styles.priceText}>
            {priceNum > 0
              ? `$${priceNum.toLocaleString("es-CO")} COP`
              : "Precio a convenir"}
          </Text>
          <Text style={styles.priceSub}>/mes</Text>
          <View style={{ flex: 1 }} />
          <View style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>Ver</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function BuscarScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("Todas");

  const { data: spaces = [], isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["spaces", selectedCity],
    queryFn: () => fetchSpaces(selectedCity),
  });

  const filtered = search.trim()
    ? spaces.filter(s =>
        s.city.toLowerCase().includes(search.toLowerCase()) ||
        s.address?.toLowerCase().includes(search.toLowerCase()) ||
        s.spaceType.toLowerCase().includes(search.toLowerCase()) ||
        s.description?.toLowerCase().includes(search.toLowerCase())
      )
    : spaces;

  const webTop = Platform.OS === "web" ? 67 : 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top + webTop }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Disponible ahora</Text>
          <Text style={styles.headerTitle}>Espacios de almacenaje</Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por ciudad, tipo..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {!!search && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.filterRow}>
        {CITY_FILTERS.map((c) => (
          <Pressable
            key={c}
            style={[styles.filterChip, selectedCity === c && styles.filterChipActive]}
            onPress={() => { setSelectedCity(c); Haptics.selectionAsync(); }}
          >
            <Text style={[styles.filterText, selectedCity === c && styles.filterTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No se pudo conectar</Text>
          <Pressable style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyText}>
            {spaces.length === 0
              ? "Aún no hay espacios disponibles"
              : "Sin resultados para tu búsqueda"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <SpaceCard
              space={item}
              onPress={() => router.push({ pathname: "/space/[id]", params: { id: String(item.id) } })}
            />
          )}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 90) },
          ]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={filtered.length > 0}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
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
  searchRow: { paddingHorizontal: 20, marginBottom: 12 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  filterTextActive: { color: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyText: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    marginTop: 4,
  },
  retryText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#fff" },
  list: { paddingHorizontal: 20, paddingTop: 4 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardImagePlaceholder: {
    height: 110,
    backgroundColor: Colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: { padding: 14 },
  cardRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  typePill: {
    backgroundColor: Colors.primaryLight + "30",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  typePillText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.primaryDark,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  cityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  cityPillText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.textSecondary,
  },
  cardAddress: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: { flexDirection: "row", alignItems: "center" },
  priceText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: Colors.primary,
  },
  priceSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 2,
  },
  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  viewBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.primary,
  },
});
