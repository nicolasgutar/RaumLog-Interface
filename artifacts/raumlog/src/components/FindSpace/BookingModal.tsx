import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Calendar, CheckCircle, MapPin } from "lucide-react";
import { createReservation } from "@/lib/api";
import { CommissionEngine, type BookingBreakdown } from "@/lib/payment-service";
import { useStore } from "@/store/useStore";
import type { SpaceDTO } from "@/hooks/useSpaces";

type ModalStep = "info" | "booking" | "processing" | "submitted";

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}

function daysBetween(a: string, b: string) {
  if (!a || !b) return 0;
  return Math.max(0, Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

export function BookingModal({ space, onClose }: { space: SpaceDTO; onClose: () => void }) {
  const [currentImg, setCurrentImg] = useState(0);
  const [step, setStep] = useState<ModalStep>("info");
  const { guestInfo, setGuestInfo } = useStore();

  const today = new Date().toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [, setTermsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const days = daysBetween(checkIn, checkOut);
  const months = Math.floor(days / 30);
  const breakdown: BookingBreakdown = CommissionEngine.getBookingBreakdown(
    months, days, Number(space.priceMonthlyNum), Number(space.priceDailyNum)
  );
  const publicPrice = breakdown.userTotal;
  const platformCut = breakdown.commission;

  async function handleBook() {
    if (!acceptedTerms) { setTermsError(true); return; }
    if (!checkIn || !checkOut || days === 0 || !guestInfo.name || !guestInfo.email) return;
    setLoading(true);
    try {
      await createReservation({
        spaceId: space.id, spaceTitle: space.spaceType, spaceOwnerEmail: space.ownerEmail,
        guestName: guestInfo.name, guestEmail: guestInfo.email, guestPhone: guestInfo.phone,
        itemsDescription: "", declaredValue: "0",
        checkIn, checkOut, days, months,
        totalPrice: String(publicPrice),
        hostNetPrice: String(Math.round(breakdown.hostNetTotal)),
        platformCommission: String(Math.round(platformCut)),
        acceptedTerms: true,
      });
      setStep("processing");
      await new Promise((r) => setTimeout(r, 1500));
      setStep("submitted");
    } catch {
      alert("Error al procesar la reserva.");
    } finally {
      setLoading(false);
    }
  }

  const prev = () => setCurrentImg((i) => (i === 0 ? space.images.length - 1 : i - 1));
  const next = () => setCurrentImg((i) => (i === space.images.length - 1 ? 0 : i + 1));

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {step === "submitted" && (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#2C5E8D] mb-2 uppercase tracking-wide">¡Solicitud Enviada!</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
              Tu solicitud fue recibida. El anfitrión se comunicará contigo para coordinar los detalles.
            </p>
            <button onClick={onClose} className="w-full max-w-xs py-4 bg-[#2C5E8D] text-white font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all">
              Volver al Marketplace
            </button>
          </div>
        )}

        {step === "info" && (
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 relative h-[300px] lg:h-auto bg-gray-100">
              <img src={space.images[currentImg]} className="w-full h-full object-cover" />
              <button onClick={onClose} className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"><X className="w-5 h-5 text-gray-500" /></button>
              {space.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 p-2 rounded-full px-4">
                  <button onClick={prev} className="text-white"><ChevronLeft className="w-5 h-5" /></button>
                  <span className="text-xs text-white font-medium">{currentImg + 1} / {space.images.length}</span>
                  <button onClick={next} className="text-white"><ChevronRight className="w-5 h-5" /></button>
                </div>
              )}
            </div>
            <div className="w-full lg:w-1/2 p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="bg-[#AECBE9]/30 text-[#2C5E8D] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{space.category}</span>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{space.accessType}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-[#2C5E8D] mb-4 uppercase tracking-wide">{space.spaceType} en {space.city}</h2>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-6">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="uppercase tracking-tight">{space.address}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">{space.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-center w-full">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Precio Mensual</p>
                    <p className="text-2xl font-bold text-[#2C5E8D]">{formatCOP(Number(space.priceMonthlyNum))}</p>
                  </div>
                </div>
                <button onClick={() => setStep("booking")} className="w-full py-4 bg-[#2C5E8D] text-white font-bold rounded-xl hover:bg-[#1a3d5c] transition-all uppercase tracking-widest">Solicitar Reserva</button>
              </div>
            </div>
          </div>
        )}

        {step !== "info" && step !== "submitted" && (
          <div className="p-8">
            <button
              onClick={() => setStep("info")}
              className="mb-8 flex items-center gap-2 text-[#2C5E8D] font-bold text-xs uppercase tracking-widest"
            >
              <ChevronLeft className="w-4 h-4" /> Volver al Detalle
            </button>

            {step === "booking" && (
              <div className="max-w-xl mx-auto space-y-8">
                <h2 className="text-2xl font-bold text-[#2C5E8D] uppercase tracking-wide text-center">Datos de la Reserva</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2">Fecha Ingreso *</label>
                    <input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full border border-[#AECBE9] rounded-xl p-3 text-sm text-[#2C5E8D] outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2">Fecha Salida *</label>
                    <input type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full border border-[#AECBE9] rounded-xl p-3 text-sm text-[#2C5E8D] outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2">Nombre Completo *</label>
                  <input type="text" placeholder="Tu nombre" value={guestInfo.name} onChange={(e) => setGuestInfo({ name: e.target.value })} className="w-full border border-[#AECBE9] rounded-xl p-3 text-sm text-[#2C5E8D] outline-none mb-4" />
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2">Email *</label>
                  <input type="email" placeholder="tu@email.com" value={guestInfo.email} onChange={(e) => setGuestInfo({ email: e.target.value })} className="w-full border border-[#AECBE9] rounded-xl p-3 text-sm text-[#2C5E8D] outline-none" />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="w-4 h-4 accent-[#2C5E8D]" />
                  <span className="text-xs font-medium text-[#2C5E8D]/70 uppercase tracking-tighter">Acepto los términos y condiciones de RaumLog</span>
                </label>
                <button onClick={handleBook} disabled={loading} className="w-full py-4 bg-[#2C5E8D] text-white font-bold rounded-xl shadow-md uppercase tracking-widest">{loading ? "Procesando..." : "Enviar Solicitud"}</button>
              </div>
            )}

            {step === "processing" && (
              <div className="py-20 text-center">
                <div className="w-12 h-12 border-4 border-[#AECBE9] border-t-[#2C5E8D] rounded-full animate-spin mx-auto mb-6" />
                <p className="font-bold text-[#2C5E8D] uppercase tracking-widest">Registrando solicitud...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
