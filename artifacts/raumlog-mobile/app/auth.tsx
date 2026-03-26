import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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

type Mode = "login" | "register";
type Role = "guest" | "host";

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("guest");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Completa el correo y la contraseña");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError("Ingresa tu nombre completo");
      return;
    }
    if (mode === "register" && password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password, phone.trim(), role);
      }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (e: any) {
      setError(e.message || "Ocurrió un error");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={22} color={Colors.textSecondary} />
        </Pressable>

        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>RL</Text>
          </View>
          <Text style={styles.logoName}>RaumLog</Text>
        </View>

        <Text style={styles.headline}>
          {mode === "login" ? "Bienvenido de nuevo" : "Únete a la comunidad"}
        </Text>

        <View style={styles.toggleRow}>
          {(["login", "register"] as Mode[]).map((m) => (
            <Pressable
              key={m}
              style={[styles.toggleBtn, mode === m && styles.toggleActive]}
              onPress={() => switchMode(m)}
            >
              <Text style={[styles.toggleText, mode === m && styles.toggleTextActive]}>
                {m === "login" ? "Iniciar sesión" : "Registrarse"}
              </Text>
            </Pressable>
          ))}
        </View>

        {mode === "register" && (
          <>
            <Text style={styles.label}>Tipo de cuenta</Text>
            <View style={styles.roleRow}>
              {(["guest", "host"] as Role[]).map((r) => (
                <Pressable
                  key={r}
                  style={[styles.roleBtn, role === r && styles.roleActive]}
                  onPress={() => setRole(r)}
                >
                  <Ionicons
                    name={r === "guest" ? "cube-outline" : "home-outline"}
                    size={22}
                    color={role === r ? Colors.primary : Colors.textSecondary}
                  />
                  <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                    {r === "guest" ? "Cliente" : "Anfitrión"}
                  </Text>
                  <Text style={styles.roleSubtext}>
                    {r === "guest" ? "Quiero almacenar" : "Ofrezco espacio"}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre completo"
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Teléfono (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="+57 300 000 0000"
              placeholderTextColor={Colors.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </>
        )}

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="tu@correo.com"
          placeholderTextColor={Colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder={mode === "register" ? "Mín. 8 caracteres" : "Tu contraseña"}
            placeholderTextColor={Colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            autoCapitalize="none"
          />
          <Pressable style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
            <Ionicons
              name={showPass ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.textSecondary}
            />
          </Pressable>
        </View>

        {!!error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.85 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>
              {mode === "login" ? "Entrar" : "Crear cuenta"}
            </Text>
          )}
        </Pressable>

        <Pressable onPress={() => switchMode(mode === "login" ? "register" : "login")}>
          <Text style={styles.switchText}>
            {mode === "login"
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.card,
  },
  scroll: {
    padding: 24,
  },
  closeBtn: {
    alignSelf: "flex-end",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  logoName: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  headline: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    color: Colors.text,
    marginBottom: 24,
  },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: Colors.border,
    borderRadius: 12,
    padding: 3,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: Colors.card,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  toggleText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: Colors.text,
    fontFamily: "Inter_600SemiBold",
  },
  roleRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  roleBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    gap: 6,
  },
  roleActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + "22",
  },
  roleText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  roleTextActive: {
    color: Colors.primary,
  },
  roleSubtext: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "center",
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.background,
    marginBottom: 12,
  },
  passRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  eyeBtn: {
    width: 44,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.error + "15",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.error,
    flex: 1,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  submitText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#fff",
  },
  switchText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.primary,
    textAlign: "center",
  },
});
