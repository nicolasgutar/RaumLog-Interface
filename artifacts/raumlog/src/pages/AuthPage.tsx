import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { User, Lock, Mail, Phone, Eye, EyeOff, Warehouse, Package } from "lucide-react";
import { login, register } from "@/lib/auth-api";
import { useStore } from "@/store/useStore";

type Mode = "login" | "register";
type Role = "host" | "guest";

export default function AuthPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setAuth, authUser } = useStore();

  const [mode, setMode] = useState<Mode>((params.get("modo") as Mode) || "login");
  const [role, setRole] = useState<Role>("guest");
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = params.get("redirigir") || (role === "host" ? "/dashboard/host" : "/encuentra-tu-espacio");

  useEffect(() => {
    if (authUser) navigate(redirectTo, { replace: true });
  }, [authUser, navigate, redirectTo]);

  function field(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (mode === "register" && form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (mode === "register" && !acceptedTerms) {
      setError("Debes aceptar los Términos y la Política de Privacidad para registrarte");
      return;
    }
    setLoading(true);
    try {
      const result = mode === "login"
        ? await login(form.email, form.password)
        : await register({ email: form.email, password: form.password, name: form.name, phone: form.phone, role });
      setAuth(result.token, result.user);
      navigate(result.user.role === "host" ? "/dashboard/host" : "/encuentra-tu-espacio", { replace: true });
    } catch (err: any) {
      setError(err.message || "Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C5E8D]/10 to-[#AECBE9]/20 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/raumlog-logo-main.png" alt="RaumLog" className="h-16 w-auto mx-auto mb-4" />
          </Link>
          <h1 className="font-heading text-2xl text-[#2C5E8D] uppercase tracking-wide">
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h1>
          <p className="text-[#2C5E8D]/60 text-sm mt-1">
            {mode === "login" ? "Bienvenido de nuevo a RaumLog" : "Únete a la comunidad de almacenamiento colaborativo"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Mode toggle */}
          <div className="flex rounded-xl border border-[#AECBE9] p-1 mb-6 gap-1">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === m
                    ? "bg-[#2C5E8D] text-white shadow"
                    : "text-[#2C5E8D]/60 hover:text-[#2C5E8D]"
                }`}
              >
                {m === "login" ? "Iniciar sesión" : "Registrarse"}
              </button>
            ))}
          </div>

          {/* Role selector (only on register) */}
          {mode === "register" && (
            <div className="mb-5">
              <p className="text-sm font-medium text-[#2C5E8D] mb-2">Tipo de cuenta</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("guest")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    role === "guest"
                      ? "border-[#2C5E8D] bg-[#2C5E8D]/5"
                      : "border-[#AECBE9] hover:border-[#2C5E8D]/40"
                  }`}
                >
                  <Package className={`w-6 h-6 ${role === "guest" ? "text-[#2C5E8D]" : "text-[#AECBE9]"}`} />
                  <div className="text-center">
                    <p className={`text-sm font-semibold ${role === "guest" ? "text-[#2C5E8D]" : "text-gray-500"}`}>
                      Cliente
                    </p>
                    <p className="text-[10px] text-gray-400">Quiero almacenar</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("host")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    role === "host"
                      ? "border-[#2C5E8D] bg-[#2C5E8D]/5"
                      : "border-[#AECBE9] hover:border-[#2C5E8D]/40"
                  }`}
                >
                  <Warehouse className={`w-6 h-6 ${role === "host" ? "text-[#2C5E8D]" : "text-[#AECBE9]"}`} />
                  <div className="text-center">
                    <p className={`text-sm font-semibold ${role === "host" ? "text-[#2C5E8D]" : "text-gray-500"}`}>
                      Anfitrión
                    </p>
                    <p className="text-[10px] text-gray-400">Quiero arrendar mi espacio</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Nombre completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AECBE9]" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => field("name", e.target.value)}
                    required
                    placeholder="Tu nombre completo"
                    className="w-full pl-9 pr-4 py-2.5 border border-[#AECBE9] rounded-lg text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Correo electrónico *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AECBE9]" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => field("email", e.target.value)}
                  required
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  className="w-full pl-9 pr-4 py-2.5 border border-[#AECBE9] rounded-lg text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm"
                />
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AECBE9]" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => field("phone", e.target.value)}
                    placeholder="+57 300 000 0000"
                    className="w-full pl-9 pr-4 py-2.5 border border-[#AECBE9] rounded-lg text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Contraseña *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AECBE9]" />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => field("password", e.target.value)}
                  required
                  minLength={8}
                  placeholder={mode === "register" ? "Mínimo 8 caracteres" : "••••••••"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="w-full pl-9 pr-10 py-2.5 border border-[#AECBE9] rounded-lg text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AECBE9] hover:text-[#2C5E8D]"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Confirmar contraseña *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AECBE9]" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => field("confirmPassword", e.target.value)}
                    required
                    placeholder="Repite tu contraseña"
                    autoComplete="new-password"
                    className="w-full pl-9 pr-4 py-2.5 border border-[#AECBE9] rounded-lg text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm"
                  />
                </div>
              </div>
            )}

            {mode === "register" && (
              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="accept-terms"
                  checked={acceptedTerms}
                  onChange={(e) => { setAcceptedTerms(e.target.checked); setError(""); }}
                  className="mt-0.5 w-4 h-4 rounded border-[#AECBE9] text-[#2C5E8D] accent-[#2C5E8D] cursor-pointer flex-shrink-0"
                />
                <label htmlFor="accept-terms" className="text-xs text-[#2C5E8D]/70 leading-relaxed cursor-pointer">
                  Acepto los{" "}
                  <Link to="/terminos-y-condiciones" target="_blank" className="text-[#2C5E8D] font-semibold hover:underline">
                    Términos y Condiciones
                  </Link>
                  {" "}y la{" "}
                  <Link to="/politica-de-privacidad" target="_blank" className="text-[#2C5E8D] font-semibold hover:underline">
                    Política de Privacidad
                  </Link>
                  {" "}de RaumLog, incluyendo la cláusula de comisión híbrida y el tratamiento de mis datos personales conforme a la Ley 1581 de Colombia.
                </label>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] disabled:opacity-60 text-white font-bold rounded-lg transition-colors mt-2"
            >
              {loading
                ? (mode === "login" ? "Entrando..." : "Creando cuenta...")
                : (mode === "login" ? "Iniciar sesión" : "Crear cuenta")}
            </button>
          </form>

          <p className="text-center text-xs text-[#2C5E8D]/50 mt-5">
            {mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="text-[#2C5E8D] font-semibold hover:underline"
            >
              {mode === "login" ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
