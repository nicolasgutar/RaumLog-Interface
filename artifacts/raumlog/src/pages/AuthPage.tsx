import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, Chrome, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

type Mode = "login" | "register";

export default function AuthPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, error: storeError } = useAuthStore();
  const { signInWithGoogle, registerWithEmail, loginWithEmail, initializing } = useAuth();

  const [mode, setMode] = useState<Mode>((params.get("modo") as Mode) || "login");
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = params.get("redirigir") || (user?.role === "Anfitrión" ? "/dashboard/host" : "/encuentra-tu-espacio");

  useEffect(() => {
    if (user && !initializing) {
      if (!user.isOnboardingComplete) {
         navigate("/onboarding", { replace: true });
      } else {
         navigate(redirectTo, { replace: true });
      }
    }
  }, [user, initializing, navigate, redirectTo]);

  function field(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    if (mode === "register") {
        if (form.password !== form.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        if (!acceptedTerms) {
            setError("Debes aceptar los Términos y la Política de Privacidad para registrarte");
            return;
        }
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await loginWithEmail(form.email, form.password);
      } else {
        await registerWithEmail(form.email, form.password, "", undefined);
      }
    } catch (err: any) {
      setError(err.message || "Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
        await signInWithGoogle();
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  }

  if (initializing) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[#D8CFC3]/20">
              <div className="w-8 h-8 border-4 border-t-transparent border-[#2C5E8D] rounded-full animate-spin"></div>
          </div>
      );
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

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#AECBE9]/30">
        
          {/* Simplified Google Login - PRIMARY ACTION */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-3 border-2 border-[#AECBE9] hover:border-[#2C5E8D] rounded-xl flex items-center justify-center gap-3 transition-all font-medium text-[#2C5E8D] hover:bg-[#2C5E8D]/5 disabled:opacity-50 mb-6"
          >
            <Chrome className="w-5 h-5" />
            <span>Continuar con Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#AECBE9]/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-[#AECBE9]">O con correo electrónico</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Register specific fields removed - asking only for email/pass */}

            <div>
              <label className="block text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider mb-1 px-1">Correo electrónico *</label>
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

            <div>
              <label className="block text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider mb-1 px-1">Contraseña *</label>
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
              <>
              <div>
                <label className="block text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider mb-1 px-1">Confirmar contraseña *</label>
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

               <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="accept-terms"
                  checked={acceptedTerms}
                  onChange={(e) => { setAcceptedTerms(e.target.checked); setError(""); }}
                  className="mt-0.5 w-4 h-4 rounded border-[#AECBE9] text-[#2C5E8D] accent-[#2C5E8D] cursor-pointer flex-shrink-0"
                />
                <label htmlFor="accept-terms" className="text-[10px] text-[#2C5E8D]/70 leading-relaxed cursor-pointer">
                  Acepto los <Link to="/terminos-y-condiciones" target="_blank" className="text-[#2C5E8D] font-bold underline">Términos</Link> y la <Link to="/politica-de-privacidad" target="_blank" className="text-[#2C5E8D] font-bold underline">Privacidad</Link> de RaumLog conforme a la Ley de datos de Colombia.
                </label>
              </div>
              </>
            )}

            {(error || storeError) && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 font-medium leading-relaxed">
                   {error || storeError}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] disabled:opacity-60 text-white font-bold rounded-lg transition-all shadow-md mt-2 tracking-wide"
            >
              {loading
                ? (mode === "login" ? "Accediendo..." : "Creando cuenta...")
                : (mode === "login" ? "INICIAR SESIÓN" : "CREAR MI CUENTA")}
            </button>
          </form>

          <p className="text-center text-xs text-[#2C5E8D]/50 mt-6">
            {mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="text-[#2C5E8D] font-semibold hover:underline"
            >
              {mode === "login" ? "Regístrate aquí" : "Inicia sesión aquí"}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
