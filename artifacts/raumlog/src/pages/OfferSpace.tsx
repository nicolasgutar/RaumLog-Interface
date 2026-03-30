import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Camera, DollarSign, Shield, Star, CheckCircle, Upload, FileText, X, Calculator, ArrowRight } from "lucide-react";
import { submitSpace, submitKyc } from "@/lib/api";
import { CommissionEngine } from "@/lib/payment-service";
import { useAuthStore } from "@/store/authStore";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";

const benefits = [
  {
    icon: DollarSign,
    title: "Genera ingresos extra",
    description: "Tú fijas el precio. Recibe pagos mensuales directamente en tu cuenta.",
  },
  {
    icon: Shield,
    title: "Contrato digital",
    description: "Toda operación está respaldada por un contrato que protege tus intereses.",
  },
  {
    icon: Star,
    title: "Tú decides",
    description: "Elige a quién aceptar, cuándo y en qué condiciones. Tienes el control total.",
  },
  {
    icon: Camera,
    title: "Anuncio gratuito",
    description: "Crea tu anuncio con fotos y descripción sin costo alguno. Nosotros lo validamos.",
  },
];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

type Step = "space" | "kyc" | "success";

export default function OfferSpace() {
  const navigate = useNavigate();
  const { user, idToken, setAuth } = useAuthStore();
  const [step, setStep] = useState<Step>("space");

  const [spaceForm, setSpaceForm] = useState({
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    spaceType: "Garaje",
    city: "",
    address: "",
    description: "",
    priceMonthly: "",
    priceDaily: "",
    priceAnnual: "",
  });

  const [kycForm, setKycForm] = useState({
    cedulaFile: null as File | null,
    rutFile: null as File | null,
  });

  const [spaceLoading, setSpaceLoading] = useState(false);
  const [kycLoading, setKycLoading] = useState(false);
  const [error, setError] = useState("");
  const [desiredNet, setDesiredNet] = useState("");

  const desiredNetNum = Number(desiredNet.replace(/\D/g, "")) || 0;
  const scenarios = desiredNetNum > 0 ? CommissionEngine.getScenarios(desiredNetNum) : null;

  function formatCOP(n: number) {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
  }

  function handleSpaceChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setSpaceForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSpaceSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      navigate("/auth");
      return;
    }

    if (user.role === "Cliente") {
      setSpaceLoading(true);
      setError("");
      try {
        const res = await fetch(`${API}/api/user/become-host`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });
        if (!res.ok) throw new Error("Error al cambiar de rol");
        const { user: updatedUser } = await res.json();
        setAuth(updatedUser, idToken!);
        navigate("/perfil");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setSpaceLoading(false);
      }
      return;
    }

    if (user.role === "Anfitrión") {
      navigate("/perfil");
      return;
    }
  }

  // Determine button text and action
  let buttonText = "Continuar → Creación de cuenta";
  if (user) {
    if (user.role === "Cliente") {
      buttonText = "Continuar → Convertirme en anfitrión";
    } else {
      buttonText = "Continuar → Ir al perfil";
    }
  }

  async function handleKycSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setKycLoading(true);
    try {
      let cedulaData = "";
      let cedulaFilename = "";
      let rutData = "";
      let rutFilename = "";

      if (kycForm.cedulaFile) {
        cedulaData = await fileToBase64(kycForm.cedulaFile);
        cedulaFilename = kycForm.cedulaFile.name;
      }
      if (kycForm.rutFile) {
        rutData = await fileToBase64(kycForm.rutFile);
        rutFilename = kycForm.rutFile.name;
      }

      await submitKyc({
        hostEmail: spaceForm.ownerEmail,
        hostName: spaceForm.ownerName,
        hostPhone: spaceForm.ownerPhone,
        cedulaFilename,
        cedulaData,
        rutFilename,
        rutData,
      });
      setStep("success");
    } catch {
      setError("Error al enviar los documentos. Intenta de nuevo.");
    } finally {
      setKycLoading(false);
    }
  }

  function skipKyc() {
    setStep("success");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#2C5E8D] py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl lg:text-5xl text-white mb-4 uppercase tracking-wide">
              Ofrece tu espacio
            </h1>
            <p className="text-[#AECBE9] text-lg max-w-2xl mx-auto">
              Convierte el espacio que no usas en ingresos mensuales. Sin burocracia,
              sin riesgos, sin complicaciones.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-3xl text-[#2C5E8D] text-center mb-12 uppercase tracking-wide">
              ¿Por qué ser anfitrión en RaumLog?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl border border-[#AECBE9]/40 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-[#AECBE9]/30 flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-[#2C5E8D]" />
                    </div>
                    <h3 className="font-semibold text-[#2C5E8D] text-lg mb-2">{b.title}</h3>
                    <p className="text-[#2C5E8D]/70 text-sm leading-relaxed">{b.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Form section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#D8CFC3]/30">
          <div className="max-w-2xl mx-auto">

            {step === "success" ? (
              <div className="bg-white rounded-2xl p-10 shadow text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="font-heading text-2xl text-[#2C5E8D] mb-2">¡Registro completo!</h3>
                <p className="text-[#2C5E8D]/70 mb-2">
                  Recibimos tu espacio y documentos. Nuestro equipo los revisará y te contactará pronto.
                </p>
                <p className="text-sm text-[#2C5E8D]/50">
                  Puedes ver el estado de tu espacio en el{" "}
                  <a href="/perfil" className="text-[#2C5E8D] underline font-medium">Panel del Anfitrión</a>.
                </p>
                <button
                  onClick={() => { setStep("space"); setSpaceForm({ ownerName: "", ownerEmail: "", ownerPhone: "", spaceType: "Garaje", city: "", address: "", description: "", priceMonthly: "", priceDaily: "", priceAnnual: "" }); }}
                  className="mt-6 px-6 py-2.5 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-lg transition-colors"
                >
                  Registrar otro espacio
                </button>
              </div>

            ) : step === "kyc" ? (
              <div className="bg-white rounded-2xl p-8 shadow">
                {/* Progress */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-[#2C5E8D]/60">Datos del espacio</span>
                  </div>
                  <div className="flex-1 h-px bg-[#AECBE9]/40" />
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#2C5E8D] flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-[#2C5E8D]">Verificación KYC</span>
                  </div>
                </div>

                <h2 className="font-heading text-2xl text-[#2C5E8D] mb-2 uppercase tracking-wide">Verificación de identidad</h2>
                <p className="text-[#2C5E8D]/60 text-sm mb-6">
                  Para publicar tu espacio necesitamos verificar tu identidad. Sube los documentos requeridos (PDF o imagen).
                  Quedarán en estado <strong>Pendiente de revisión</strong>.
                </p>

                <form onSubmit={handleKycSubmit} className="space-y-5">
                  {/* Cédula */}
                  <div>
                    <label className="block text-sm font-medium text-[#2C5E8D] mb-2">
                      Cédula de Ciudadanía *
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors ${kycForm.cedulaFile ? "border-green-400 bg-green-50" : "border-[#AECBE9] hover:border-[#2C5E8D]"}`}>
                      {kycForm.cedulaFile ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileText className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">{kycForm.cedulaFile.name}</span>
                          <button type="button" onClick={() => setKycForm((p) => ({ ...p, cedulaFile: null }))}
                            className="text-red-400 hover:text-red-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-[#AECBE9]" />
                          <span className="text-sm text-[#2C5E8D]/60">Haz clic para subir tu cédula</span>
                          <span className="text-xs text-[#2C5E8D]/40">PDF, JPG, PNG — máx. 5 MB</span>
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only"
                            onChange={(e) => setKycForm((p) => ({ ...p, cedulaFile: e.target.files?.[0] || null }))} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* RUT */}
                  <div>
                    <label className="block text-sm font-medium text-[#2C5E8D] mb-2">
                      RUT o Recibo de Servicio Público *
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors ${kycForm.rutFile ? "border-green-400 bg-green-50" : "border-[#AECBE9] hover:border-[#2C5E8D]"}`}>
                      {kycForm.rutFile ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileText className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">{kycForm.rutFile.name}</span>
                          <button type="button" onClick={() => setKycForm((p) => ({ ...p, rutFile: null }))}
                            className="text-red-400 hover:text-red-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-[#AECBE9]" />
                          <span className="text-sm text-[#2C5E8D]/60">Haz clic para subir el documento</span>
                          <span className="text-xs text-[#2C5E8D]/40">PDF, JPG, PNG — máx. 5 MB</span>
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only"
                            onChange={(e) => setKycForm((p) => ({ ...p, rutFile: e.target.files?.[0] || null }))} />
                        </label>
                      )}
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                  <button type="submit" disabled={kycLoading || !kycForm.cedulaFile || !kycForm.rutFile}
                    className="w-full py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors">
                    {kycLoading ? "Enviando documentos..." : "Enviar documentos para revisión"}
                  </button>
                  <button type="button" onClick={skipKyc}
                    className="w-full py-2 text-[#2C5E8D]/50 hover:text-[#2C5E8D] text-sm transition-colors">
                    Omitir por ahora (enviaré documentos más tarde)
                  </button>
                </form>
              </div>

            ) : (
              <>
                <h2 className="font-heading text-3xl text-[#2C5E8D] text-center mb-2 uppercase tracking-wide">
                  Registra tu espacio hoy
                </h2>
                <p className="text-center text-[#2C5E8D]/60 text-sm mb-8">Paso 1 de 2 · Información del espacio</p>

                <form onSubmit={handleSpaceSubmit} className="bg-white rounded-2xl p-8 shadow space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Nombre completo *</label>
                      <input type="text" name="ownerName" value={spaceForm.ownerName} onChange={handleSpaceChange} required
                        className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30"
                        placeholder="Tu nombre" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Teléfono / WhatsApp *</label>
                      <input type="tel" name="ownerPhone" value={spaceForm.ownerPhone} onChange={handleSpaceChange} required
                        className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30"
                        placeholder="+57 300 000 0000" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Correo electrónico *</label>
                    <input type="email" name="ownerEmail" value={spaceForm.ownerEmail} onChange={handleSpaceChange} required
                      className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30"
                      placeholder="tu@email.com" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Tipo de espacio *</label>
                      <select name="spaceType" value={spaceForm.spaceType} onChange={handleSpaceChange} required
                        className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 bg-white">
                        <option>Garaje</option>
                        <option>Cuarto útil</option>
                        <option>Bodega</option>
                        <option>Habitación vacía</option>
                        <option>Otro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Ciudad *</label>
                      <input type="text" name="city" value={spaceForm.city} onChange={handleSpaceChange} required
                        className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30"
                        placeholder="Medellín, Bogotá..." />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Dirección o sector</label>
                    <input type="text" name="address" value={spaceForm.address} onChange={handleSpaceChange}
                      className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30"
                      placeholder="Barrio, calle, referencia..." />
                  </div>

                  {/* Commission Calculator */}
                  <div className="border border-[#2C5E8D]/20 rounded-xl overflow-hidden">
                    <div className="bg-[#2C5E8D] px-4 py-2.5 flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-white" />
                      <span className="text-sm font-semibold text-white">Calculadora de precios</span>
                      <span className="text-xs text-[#AECBE9] ml-1">· Comisión dinámica por duración</span>
                    </div>
                    <div className="p-4 bg-[#AECBE9]/10 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#2C5E8D] mb-1">
                          ¿Cuánto quieres recibir tú al mes? (Precio Neto Deseado)
                        </label>
                        <input type="text" value={desiredNet} onChange={(e) => setDesiredNet(e.target.value)}
                          className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 bg-white"
                          placeholder="ej. 400000" />
                      </div>

                      {scenarios && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Scenario A */}
                          <div className="bg-white rounded-xl border border-[#AECBE9] p-4 space-y-2">
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className="text-xs font-bold text-[#2C5E8D] uppercase tracking-wide">Escenario A</span>
                              <span className="text-xs bg-[#AECBE9]/40 text-[#2C5E8D] px-2 py-0.5 rounded-full">1 – 5 meses</span>
                            </div>
                            <div className="text-xs space-y-1.5">
                              <div className="flex justify-between">
                                <span className="text-[#2C5E8D]/60">Precio que paga el cliente</span>
                                <span className="font-semibold text-[#2C5E8D]">{formatCOP(scenarios.shortStay.publicMonthly)}/mes</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-orange-600">Comisión RaumLog (20%)</span>
                                <span className="font-semibold text-orange-600">{formatCOP(scenarios.shortStay.commission)}/mes</span>
                              </div>
                              <div className="flex justify-between border-t border-[#AECBE9]/40 pt-1.5">
                                <span className="text-green-700 font-medium">🙋 Tú recibes</span>
                                <span className="font-bold text-green-700">{formatCOP(scenarios.shortStay.hostNet)}/mes</span>
                              </div>
                            </div>
                          </div>

                          {/* Scenario B */}
                          <div className="bg-green-50 rounded-xl border border-green-200 p-4 space-y-2">
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Escenario B</span>
                              <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">6+ meses 🎉</span>
                            </div>
                            <p className="text-xs text-green-700 font-medium">Ejemplo a {scenarios.longStay.exampleMonths} meses:</p>
                            <div className="text-xs space-y-1.5">
                              <div className="flex justify-between">
                                <span className="text-[#2C5E8D]/60">Total que paga el cliente</span>
                                <span className="font-semibold text-[#2C5E8D]">{formatCOP(scenarios.longStay.publicTotal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-orange-600">Comisión RaumLog (1 mes fijo)</span>
                                <span className="font-semibold text-orange-600">{formatCOP(scenarios.longStay.commission)}</span>
                              </div>
                              <div className="flex justify-between border-t border-green-200 pt-1.5">
                                <span className="text-green-700 font-medium">🙋 Tú recibes</span>
                                <span className="font-bold text-green-700">{formatCOP(scenarios.longStay.hostNetTotal)}</span>
                              </div>
                              <p className="text-green-600 text-center font-medium pt-1">
                                Tasa efectiva: {(scenarios.longStay.effectiveRate * 100).toFixed(1)}% vs. 20%
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {scenarios && (
                        <p className="text-xs text-[#2C5E8D]/50 text-center">
                          El cliente paga {formatCOP(scenarios.shortStay.publicMonthly)}/mes.
                          En reservas de 6+ meses, RaumLog cobra solo 1 mes en vez del 20% mensual.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Precio diario (COP)</label>
                      <input type="text" name="priceDaily" value={spaceForm.priceDaily} onChange={handleSpaceChange}
                        className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30"
                        placeholder="ej. 30000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Precio mensual (COP)</label>
                      <input type="text" name="priceMonthly" value={spaceForm.priceMonthly} onChange={handleSpaceChange}
                        className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30"
                        placeholder="ej. 500000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Precio anual (COP)</label>
                      <input type="text" name="priceAnnual" value={spaceForm.priceAnnual} onChange={handleSpaceChange}
                        className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30"
                        placeholder="ej. 5000000" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Descripción del espacio</label>
                    <textarea name="description" value={spaceForm.description} onChange={handleSpaceChange} rows={3}
                      className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 resize-none"
                      placeholder="Cuéntanos más sobre el espacio: tamaño, acceso, condiciones..." />
                  </div>

                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                  <button type="submit" disabled={spaceLoading}
                    className="w-full py-4 bg-[#2C5E8D] hover:bg-[#1a3d5c] disabled:opacity-60 text-white font-bold rounded-xl shadow-lg hover:shadow-[#2C5E8D]/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    {spaceLoading ? "Cargando..." : buttonText}
                    {!spaceLoading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

