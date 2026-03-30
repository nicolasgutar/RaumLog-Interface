import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Upload, Phone, User as UserIcon, LogOut, Warehouse, Package, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { useSignedUpload, UploadedFile } from "@/hooks/useSignedUpload";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,application/pdf";

function FileUploadZone({
  label,
  docType,
  file,
  onFile,
  uploading,
  progress,
}: {
  label: string;
  docType: string;
  file: UploadedFile | null;
  onFile: (f: File) => void;
  uploading: boolean;
  progress: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div
      onClick={() => !uploading && ref.current?.click()}
      className={`relative flex flex-col items-center gap-3 p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all
        ${file ? "border-green-400 bg-green-50" : "border-[#AECBE9]/60 hover:border-[#2C5E8D] bg-gray-50/50"}`}
    >
      <input
        ref={ref}
        type="file"
        accept={ACCEPTED_TYPES}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />

      {uploading ? (
        <>
          <Loader2 className="w-8 h-8 text-[#2C5E8D] animate-spin" />
          <p className="text-sm text-[#2C5E8D] font-medium">Subiendo… {progress}%</p>
          <div className="w-full bg-[#AECBE9]/30 rounded-full h-1.5">
            <div className="bg-[#2C5E8D] h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </>
      ) : file ? (
        <>
          <CheckCircle className="w-8 h-8 text-green-500" />
          <p className="text-sm font-semibold text-green-700 text-center truncate max-w-full">{file.fileName}</p>
          <p className="text-[10px] text-green-600">Toca para cambiar</p>
        </>
      ) : (
        <>
          {docType === "CEDULA" ? <FileText className="w-8 h-8 text-[#AECBE9]" /> : <ImageIcon className="w-8 h-8 text-[#AECBE9]" />}
          <p className="font-bold text-[#2C5E8D] text-sm text-center">{label}</p>
          <p className="text-[10px] text-gray-400 text-center">JPG, PNG, WEBP o PDF · máx 10 MB</p>
        </>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user, idToken } = useAuthStore();
  const { uploadFile } = useSignedUpload();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    role: (user?.role as "Cliente" | "Anfitrión") || "Cliente",
    acceptTerms: false,
  });

  // Step 2 state
  const [cedula, setCedula] = useState<UploadedFile | null>(null);
  const [soporte, setSoporte] = useState<UploadedFile | null>(null);
  const [uploadingCedula, setUploadingCedula] = useState(false);
  const [uploadingSoporte, setUploadingSoporte] = useState(false);
  const [progressCedula, setProgressCedula] = useState(0);
  const [progressSoporte, setProgressSoporte] = useState(0);
  const [savingStep2, setSavingStep2] = useState(false);
  const [existingDocs, setExistingDocs] = useState<{cedula?: string, soporte?: string} | null>(null);

  // Fetch existing docs on mount for step 2
  useState(() => {
    if (idToken && step === 2) {
        fetch(`${API}/api/admin/users/${user?.uid}`, {
            headers: { Authorization: `Bearer ${idToken}` }
        })
        .then(r => r.json())
        .then(data => {
            if (data.user?.kyc) {
                setExistingDocs({
                    cedula: data.user.kyc.cedulaData,
                    soporte: data.user.kyc.rutData
                });
            }
        })
        .catch(console.error);
    }
  });

  // ─── Step 1 ───────────────────────────────────────────────────────────────
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.acceptTerms) { setError("Debes aceptar los términos y condiciones"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/user/onboarding/step1`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ 
          fullName: form.fullName, 
          phone: form.phone, 
          role: form.role,
          acceptTerms: form.acceptTerms 
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Error al guardar"); }
      const { user: updated } = await res.json();
      useAuthStore.getState().setAuth(updated, idToken!);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── File handling ─────────────────────────────────────────────────────────
  async function handleDocUpload(file: File, type: "CEDULA" | "SOPORTE") {
    const setUploading = type === "CEDULA" ? setUploadingCedula : setUploadingSoporte;
    const setProgress = type === "CEDULA" ? setProgressCedula : setProgressSoporte;
    const setResult = type === "CEDULA" ? setCedula : setSoporte;

    setUploading(true);
    setProgress(0);
    setError("");
    try {
      const result = await uploadFile(file, "kyc", (pct) => setProgress(pct));
      setResult(result);
    } catch (err: any) {
      setError(`Error subiendo ${type === "CEDULA" ? "cédula" : "soporte"}: ${err.message}`);
    } finally {
      setUploading(false);
    }
  }

  // ─── Step 2 ───────────────────────────────────────────────────────────────
  const handleStep2 = async (skip = false) => {
    if (!skip && (cedula || soporte)) {
      setSavingStep2(true);
      setError("");
      try {
        const res = await fetch(`${API}/api/kyc/save-paths`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({
            cedula: cedula?.filePath ?? existingDocs?.cedula ?? null,
            soporte: soporte?.filePath ?? existingDocs?.soporte ?? null,
          }),
        });
        if (!res.ok) {
            const d = await res.json();
            throw new Error(d.error || "Error al guardar documentos");
        }
      } catch (err: any) { 
        setError(err.message);
        setSavingStep2(false);
        return; 
      } finally {
        setSavingStep2(false);
      }
    }
    navigate(user?.role === "Anfitrión" ? "/perfil" : "/encuentra-tu-espacio");
  };

  // ─── Progress bar ──────────────────────────────────────────────────────────
  const StepDot = ({ n }: { n: number }) => (
    <div className={`flex items-center gap-2 ${n <= step ? "text-[#2C5E8D]" : "text-gray-300"}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all
        ${n < step ? "bg-[#2C5E8D] border-[#2C5E8D] text-white" : n === step ? "border-[#2C5E8D] text-[#2C5E8D]" : "border-gray-200 text-gray-300"}`}>
        {n < step ? <CheckCircle className="w-4 h-4" /> : n}
      </div>
      <span className="hidden sm:inline text-xs font-semibold">{n === 1 ? "Mi información" : "Verificación"}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <img src="/raumlog-logo-main.png" alt="RaumLog" className="h-10 w-auto" />
          <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-2 text-sm text-[#2C5E8D]/60 hover:text-[#2C5E8D] transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-8">
          <StepDot n={1} />
          <div className={`flex-1 h-0.5 rounded ${step >= 2 ? "bg-[#2C5E8D]" : "bg-gray-200"} transition-all`} />
          <StepDot n={2} />
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#AECBE9]/20 p-8 sm:p-10">
          {step === 1 ? (
            <form onSubmit={handleStep1}>
              <h2 className="text-3xl font-heading text-[#2C5E8D] mb-2">¡Ya casi estamos!</h2>
              <p className="text-gray-500 mb-8 text-sm">Completa tu información de contacto para empezar a usar RaumLog.</p>

              <div className="space-y-5">
                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-[#2C5E8D] mb-3">Selecciona tu tipo de cuenta</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["Cliente", "Anfitrión"] as const).map((r) => (
                      <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all
                          ${form.role === r ? "border-[#2C5E8D] bg-[#2C5E8D]/5 text-[#2C5E8D]" : "border-gray-100 text-gray-400 hover:border-[#2C5E8D]/30"}`}>
                        {r === "Cliente" ? <Package className="w-7 h-7" /> : <Warehouse className="w-7 h-7" />}
                        <div className="text-center">
                          <p className="font-bold text-sm">{r}</p>
                          <p className="text-[10px] opacity-60">{r === "Cliente" ? "Quiero almacenar" : "Soy dueño de espacio"}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#2C5E8D] mb-2">Nombre Completo</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AECBE9]" />
                    <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required placeholder="Ej: Juan Pérez"
                      className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2C5E8D] transition-all text-sm" />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-[#2C5E8D] mb-2">Teléfono de contacto</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AECBE9]" />
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="Ej: 300 123 4567"
                      className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2C5E8D] transition-all text-sm" />
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 p-4 bg-[#2C5E8D]/5 rounded-2xl border border-[#2C5E8D]/10">
                  <input type="checkbox" id="terms" checked={form.acceptTerms} onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })}
                    className="mt-0.5 w-4 h-4 accent-[#2C5E8D]" />
                  <label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                    Acepto los términos y condiciones y la política de privacidad de RaumLog.
                  </label>
                </div>

                {error && <p className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-[#2C5E8D] text-white font-bold rounded-2xl hover:bg-[#1e4468] transition-all shadow-lg shadow-[#2C5E8D]/20 disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Procesando...</> : "Continuar →"}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h2 className="text-3xl font-heading text-[#2C5E8D] mb-2">Verificación de identidad</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Sube tus documentos para verificar tu cuenta. Esto es <strong>opcional</strong> pero acelera la activación de tus espacios.
              </p>

              {existingDocs && (
                <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                        <p className="text-sm font-bold text-green-800">Ya has subido documentos anteriormente</p>
                        <p className="text-xs text-green-600">Puedes continuar o subir nuevas versiones si lo deseas.</p>
                    </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <FileUploadZone
                  label={existingDocs?.cedula ? "Subir Cédula de nuevo" : "Documento de Identidad (Cédula)"}
                  docType="CEDULA"
                  file={cedula}
                  onFile={(f) => handleDocUpload(f, "CEDULA")}
                  uploading={uploadingCedula}
                  progress={progressCedula}
                />
                <FileUploadZone
                  label={existingDocs?.soporte ? "Subir RUT de nuevo" : "Soporte de Residencia o RUT"}
                  docType="SOPORTE"
                  file={soporte}
                  onFile={(f) => handleDocUpload(f, "SOPORTE")}
                  uploading={uploadingSoporte}
                  progress={progressSoporte}
                />
              </div>

              <div className="flex items-start gap-3 bg-blue-50 text-blue-700 p-4 rounded-xl text-xs mb-6">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>Tus documentos están protegidos y solo son accesibles por el equipo de RaumLog para fines de verificación.</p>
              </div>

              {error && <p className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 mb-4">{error}</p>}

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => handleStep2(true)}
                  className="flex-1 py-3 border border-[#AECBE9] text-[#2C5E8D] font-semibold rounded-2xl hover:bg-[#AECBE9]/10 transition-all text-sm">
                  Omitir por ahora
                </button>
                <button onClick={() => handleStep2(false)} disabled={savingStep2 || (!cedula && !soporte && !existingDocs)}
                  className="flex-1 py-3 bg-[#2C5E8D] text-white font-bold rounded-2xl hover:bg-[#1e4468] transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                  {savingStep2 ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</> : (existingDocs ? "Actualizar y Finalizar" : "Finalizar Registro")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
