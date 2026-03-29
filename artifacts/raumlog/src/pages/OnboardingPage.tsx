import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Upload, Phone, User as UserIcon, LogOut, Warehouse, Package } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore, AccountType } from "@/store/authStore";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    role: user?.role || "Cliente",
    acceptTerms: false
  });

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.acceptTerms) {
        setError("Debes aceptar los términos y condiciones");
        return;
    }
    setLoading(true);
    try {
      const idToken = await useAuthStore.getState().idToken;
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/onboarding/step1`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ 
          fullName: form.fullName, 
          phone: form.phone,
          role: form.role,
          acceptTerms: form.acceptTerms
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al guardar información");
      }

      const { user: updatedUser } = await res.json();
      useAuthStore.getState().setAuth(updatedUser, idToken!);
      
      // Since first step is enough, we can finish here
      navigate(updatedUser.role === 'Anfitrión' ? '/dashboard/host' : '/encuentra-tu-espacio');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = () => {
     navigate(user?.role === 'Anfitrión' ? '/dashboard/host' : '/encuentra-tu-espacio');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
           <img src="/raumlog-logo-main.png" alt="RaumLog" className="h-10 w-auto" />
           <button onClick={logout} className="flex items-center gap-2 text-sm text-[#2C5E8D]/60 hover:text-[#2C5E8D]">
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
           </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#AECBE9]/20 p-8 sm:p-12">
          {step === 1 ? (
              <form onSubmit={handleStep1}>
                <h2 className="text-3xl font-heading text-[#2C5E8D] mb-4">¡Ya casi estamos!</h2>
                <p className="text-gray-500 mb-8">Completa tu información de contacto para empezar a usar RaumLog.</p>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-[#2C5E8D] mb-4">Selecciona tu tipo de cuenta</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setForm({...form, role: "Cliente"})}
                                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                                    form.role === "Cliente"
                                    ? "border-[#2C5E8D] bg-[#2C5E8D]/5 text-[#2C5E8D]"
                                    : "border-gray-100 text-gray-400 hover:border-[#2C5E8D]/30"
                                }`}
                            >
                                <Package className="w-8 h-8" />
                                <div className="text-center">
                                    <p className="font-bold">Cliente</p>
                                    <p className="text-[10px] opacity-60">Quiero almacenar</p>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm({...form, role: "Anfitrión"})}
                                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                                    form.role === "Anfitrión"
                                    ? "border-[#2C5E8D] bg-[#2C5E8D]/5 text-[#2C5E8D]"
                                    : "border-gray-100 text-gray-400 hover:border-[#2C5E8D]/30"
                                }`}
                            >
                                <Warehouse className="w-8 h-8" />
                                <div className="text-center">
                                    <p className="font-bold">Anfitrión</p>
                                    <p className="text-[10px] opacity-60">Soy dueño de espacio</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#2C5E8D] mb-2">Nombre Completo</label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AECBE9]" />
                            <input 
                                type="text"
                                value={form.fullName}
                                onChange={(e) => setForm({...form, fullName: e.target.value})}
                                required
                                placeholder="Ej: Juan Pérez"
                                className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2C5E8D] transition-all"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-[#2C5E8D] mb-2">Teléfono de contacto</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AECBE9]" />
                            <input 
                                type="tel"
                                value={form.phone}
                                onChange={(e) => setForm({...form, phone: e.target.value})}
                                required
                                placeholder="Ej: 300 123 4567"
                                className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2C5E8D] transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-[#2C5E8D]/5 rounded-2xl border border-[#2C5E8D]/10">
                         <input 
                            type="checkbox" 
                            id="terms"
                            checked={form.acceptTerms}
                            onChange={(e) => setForm({...form, acceptTerms: e.target.checked})}
                            className="mt-1 w-5 h-5 accent-[#2C5E8D]"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                            Acepto los términos y condiciones y la política de privacidad.
                        </label>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
                             {error}
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#2C5E8D] text-white font-bold rounded-2xl hover:bg-[#1e4468] transition-all shadow-lg shadow-[#2C5E8D]/20 transform active:scale-[0.98]"
                    >
                        {loading ? "Procesando..." : "Finalizar y Continuar"}
                    </button>
                </div>
              </form>
          ) : (
              <div className="text-center">
                   <h2 className="text-3xl font-heading text-[#2C5E8D] mb-4">Verificación (Opcional)</h2>
                   <p className="text-gray-500 mb-10">Puedes verificar tu identidad ahora o hacerlo más tarde desde tu perfil.</p>
                   
                   <div className="grid sm:grid-cols-2 gap-6 mb-10 opacity-50 pointer-events-none">
                        <div className="p-8 border-2 border-dashed border-[#AECBE9]/50 rounded-3xl hover:border-[#2C5E8D] transition-all cursor-pointer group">
                             <Upload className="w-10 h-10 text-[#AECBE9] mx-auto mb-4" />
                             <p className="font-bold text-[#2C5E8D]">Documento de Identidad</p>
                        </div>
                        <div className="p-8 border-2 border-dashed border-[#AECBE9]/50 rounded-3xl hover:border-[#2C5E8D] transition-all cursor-pointer group">
                             <Upload className="w-10 h-10 text-[#AECBE9] mx-auto mb-4" />
                             <p className="font-bold text-[#2C5E8D]">Soporte de Residencia</p>
                        </div>
                   </div>

                   <div className="flex items-center gap-3 bg-blue-50 text-blue-700 p-4 rounded-xl text-sm mb-10">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-left font-medium">Pronto te llegará un correo de verificación para que puedas seguir usando la aplicación.</p>
                   </div>

                   <button 
                        onClick={handleStep2}
                        className="w-full py-4 bg-[#2C5E8D] text-white font-bold rounded-2xl hover:bg-[#1e4468] transition-all shadow-lg"
                    >
                        Finalizar Registro
                    </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
