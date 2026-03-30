import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search, MapPin, X, ChevronLeft, ChevronRight,
  Calendar, CheckCircle, AlertCircle,
  Package, Clock, ThumbsUp, Banknote, FileText, Shield,
  Box, Filter,
} from "lucide-react";
import { createReservation, approveReservationByHost, payReservation, checkinReservation } from "@/lib/api";
import { PaymentService, CommissionEngine, type BookingBreakdown } from "@/lib/payment-service";
import { useStore } from "@/store/useStore";
import { useSpaces, type SpaceDTO, type SpacesQuery, type SpacesResponse } from "@/hooks/useSpaces";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

// Modular Components
import { SpaceCard } from "@/components/Listing/SpaceCard";
import { Pagination } from "@/components/Listing/Pagination";
import { FilterSidebar } from "@/components/Listing/FilterSidebar";

type Space = SpaceDTO;
type ModalStep = "info" | "booking" | "processing" | "payment" | "contract" | "checkin" | "success";

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}

function daysBetween(a: string, b: string) {
  if (!a || !b) return 0;
  return Math.max(0, Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((r, j) => {
    const reader = new FileReader();
    reader.onload = () => r(reader.result as string);
    reader.onerror = j;
    reader.readAsDataURL(file);
  });
}

const STATUS_FLOW = [
  { key: "pending_approval", label: "Pendiente", icon: Clock },
  { key: "approved_by_host", label: "Aprobada", icon: ThumbsUp },
  { key: "paid", label: "Pagada", icon: Banknote },
  { key: "in_storage", label: "Almacenando", icon: Package },
];

function ContractView({ space, guestName, guestEmail, guestPhone, checkIn, checkOut, days, months, publicPrice, reservationId }: {
  space: Space; guestName: string; guestEmail: string; guestPhone: string;
  checkIn: string; checkOut: string; days: number; months: number;
  publicPrice: number; platformCut: number; breakdown: BookingBreakdown;
  reservationId: number | null; wompiRef: string;
}) {
  const now = new Date();
  const contractNo = `RL-CONT-${reservationId || "000"}-${now.getFullYear()}`;
  const dateStr = now.toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="border border-[#2C5E8D]/20 rounded-xl p-5 text-sm text-[#2C5E8D] space-y-4 bg-white">
      <div className="flex items-center justify-between border-b border-[#AECBE9]/40 pb-3">
        <div>
          <p className="font-bold text-lg text-[#1a3d5c]">CONTRATO DE ALMACENAMIENTO COLABORATIVO</p>
          <p className="text-xs text-[#2C5E8D]/50">N.° {contractNo} · Emitido: {dateStr}</p>
        </div>
        <Shield className="w-8 h-8 text-[#2C5E8D]/30" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#AECBE9]/10 rounded-lg p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#2C5E8D]/60 mb-2">DEPOSITANTE (Cliente)</p>
          <p className="font-semibold">{guestName}</p>
          <p className="text-xs text-[#2C5E8D]/70">{guestEmail}</p>
          {guestPhone && <p className="text-xs text-[#2C5E8D]/70">{guestPhone}</p>}
        </div>
        <div className="bg-[#AECBE9]/10 rounded-lg p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#2C5E8D]/60 mb-2">DEPOSITARIO (Anfitrión)</p>
          <p className="font-semibold">{space.ownerEmail}</p>
          <p className="text-xs text-[#2C5E8D]/70">Plataforma operada por COALGE S.A.S.</p>
        </div>
      </div>

      <div className="bg-[#AECBE9]/10 rounded-lg p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#2C5E8D]/60 mb-2">ESPACIO DE ALMACENAMIENTO</p>
        <p className="font-semibold">{space.spaceType}</p>
        <p className="text-xs text-[#2C5E8D]/70">{space.city} · {space.size} · {space.spaceType}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-xs">
          <p className="font-semibold text-green-800 mb-1">Fecha de ingreso</p>
          <p className="text-green-700">{checkIn}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs">
          <p className="font-semibold text-red-800 mb-1">Fecha de salida</p>
          <p className="text-red-700">{checkOut}</p>
        </div>
      </div>

      <div className="border border-[#AECBE9]/40 rounded-lg p-3 space-y-1.5 text-xs">
        <p className="font-semibold text-[#2C5E8D] mb-2">CONDICIONES ECONÓMICAS</p>
        <div className="flex justify-between">
          <span className="text-[#2C5E8D]/70">Duración pactada</span>
          <span className="font-medium">{months > 0 ? `${months} meses (${days} días)` : `${days} días`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#2C5E8D]/70">Precio mensual del espacio</span>
          <span className="font-medium">{formatCOP(Number(space.priceMonthlyNum))}</span>
        </div>
        <div className="flex justify-between font-bold text-[#2C5E8D] pt-1 border-t border-[#AECBE9]/30">
          <span>VALOR TOTAL PAGADO (con IVA)</span>
          <span>{formatCOP(publicPrice)}</span>
        </div>
      </div>

      <div className="text-xs text-[#2C5E8D]/60 space-y-1.5 border-t border-[#AECBE9]/30 pt-3 opacity-60">
        <p><strong className="text-[#2C5E8D]">Términos:</strong> El Depositante asume el riesgo al entregar los bienes. RaumLog actúa como intermediario tecnológico. Los pagos deben ser a través de la plataforma.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="border-t-2 border-[#2C5E8D]/20 pt-2 text-center text-[10px] text-[#2C5E8D]/50">
          <p className="font-semibold text-[#2C5E8D]">{guestName}</p>
          <p>Firma electrónica</p>
        </div>
        <div className="border-t-2 border-[#2C5E8D]/20 pt-2 text-center text-[10px] text-[#2C5E8D]/50">
          <p className="font-semibold text-[#2C5E8D]">{space.ownerEmail}</p>
          <p>Firma electrónica</p>
        </div>
      </div>
    </div>
  );
}

function FichaDeposito({ space, declaredValue, checkinNotes, photoCount, reservationId, checkIn, checkOut }: {
  space: Space; guestName: string; guestEmail: string; checkIn: string; checkOut: string;
  declaredValue: string; checkinNotes: string; photoCount: number; reservationId: number | null;
}) {
  const now = new Date();
  const fichaNo = `RL-FICHA-${reservationId || "000"}-${now.getFullYear()}`;
  return (
    <div className="border-2 border-gray-100 rounded-xl p-5 text-sm text-[#2C5E8D] space-y-4 bg-gray-50/50">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="font-bold text-lg text-[#1a3d5c]">FICHA DE DEPÓSITO N.° {fichaNo}</h3>
        <FileText className="w-5 h-5 text-gray-300" />
      </div>
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div><p className="font-bold text-gray-400 mb-1">FECHAS</p><p>{checkIn} → {checkOut}</p></div>
        <div><p className="font-bold text-gray-400 mb-1">VALOR DECLARADO</p><p>{formatCOP(Number(declaredValue) || 0)}</p></div>
      </div>
      <div className="bg-white p-3 rounded-lg border border-gray-100">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Resumen de Inventario</p>
        <p className="text-gray-600 text-[13px] leading-relaxed">{checkinNotes || "Sin notas adicionales."}</p>
        <p className="text-[11px] text-[#AECBE9] font-bold mt-2 uppercase">{photoCount} Fotos adjuntas</p>
      </div>
    </div>
  );
}

function SpaceModal({ space, onClose }: { space: Space; onClose: () => void }) {
  const [currentImg, setCurrentImg] = useState(0);
  const [step, setStep] = useState<ModalStep>("info");
  const [, setReservationStatus] = useState("pending_approval");
  const { guestInfo, setGuestInfo } = useStore();

  const today = new Date().toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [itemsDesc] = useState("");
  const [declaredValue, setDeclaredValue] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [, setTermsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [wompiResult, setWompiResult] = useState<any>(null);
  const [checkinNotes, setCheckinNotes] = useState("");
  const [checkinPhotos, setCheckinPhotos] = useState<File[]>([]);

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
      const reservation = await createReservation({
        spaceId: space.id, spaceTitle: space.spaceType, spaceOwnerEmail: space.ownerEmail,
        guestName: guestInfo.name, guestEmail: guestInfo.email, guestPhone: guestInfo.phone,
        itemsDescription: itemsDesc, declaredValue: declaredValue || "0",
        checkIn, checkOut, days, months,
        totalPrice: String(publicPrice),
        hostNetPrice: String(Math.round(breakdown.hostNetTotal)),
        platformCommission: String(Math.round(platformCut)),
        acceptedTerms: true,
      });
      setReservationId(reservation.id);
      setStep("processing");
      setReservationStatus("pending_approval");
      await new Promise((r) => setTimeout(r, 2000));
      await approveReservationByHost(reservation.id);
      setReservationStatus("approved_by_host");
      await new Promise((r) => setTimeout(r, 1000));
      setStep("payment");
    } catch {
      alert("Error al procesar la reserva.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePay() {
    if (!reservationId) return;
    setLoading(true);
    try {
      await PaymentService.prepare(reservationId, publicPrice, guestInfo.email, guestInfo.name, guestInfo.phone);
      const result = await payReservation(reservationId);
      setWompiResult(result.wompiResponse);
      setReservationStatus("paid");
      setStep("contract");
    } catch {
      alert("Error en el pago.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckin() {
    if (!reservationId) return;
    setLoading(true);
    try {
      const photoBase64s = await Promise.all(checkinPhotos.map(fileToBase64));
      await checkinReservation(reservationId, { checkinNotes, checkinPhotos: photoBase64s, declaredValue });
      setReservationStatus("in_storage");
      setStep("success");
    } catch {
      alert("Error en el check-in.");
    } finally {
      setLoading(false);
    }
  }

  const prev = () => setCurrentImg((i) => (i === 0 ? space.images.length - 1 : i - 1));
  const next = () => setCurrentImg((i) => (i === space.images.length - 1 ? 0 : i + 1));

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {step === "success" && (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#2C5E8D] mb-2 uppercase tracking-wide">¡Reserva Completada!</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto small text-sm leading-relaxed">Tu almacenamiento ha comenzado formalmente. Hemos generado el acta de depósito.</p>
            <FichaDeposito
              space={space} guestName={guestInfo.name} guestEmail={guestInfo.email}
              checkIn={checkIn} checkOut={checkOut} declaredValue={declaredValue}
              checkinNotes={checkinNotes} photoCount={checkinPhotos.length}
              reservationId={reservationId}
            />
            <button onClick={onClose} className="w-full max-w-xs mt-10 py-4 bg-[#2C5E8D] text-white font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all">Regresar al Marketplace</button>
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

        {step !== "info" && step !== "success" && (
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
                <button onClick={handleBook} disabled={loading} className="w-full py-4 bg-[#2C5E8D] text-white font-bold rounded-xl shadow-md uppercase tracking-widest">{loading ? "Procesando..." : "Continuar con la Reserva"}</button>
              </div>
            )}

            {step === "processing" && (
              <div className="py-20 text-center">
                <div className="w-12 h-12 border-4 border-[#AECBE9] border-t-[#2C5E8D] rounded-full animate-spin mx-auto mb-6" />
                <p className="font-bold text-[#2C5E8D] uppercase tracking-widest">Validando disponibilidad...</p>
              </div>
            )}

            {step === "payment" && (
              <div className="max-w-xl mx-auto space-y-8">
                <h2 className="text-2xl font-bold text-[#2C5E8D] uppercase tracking-wide text-center">Finalizar Pago</h2>
                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Valor total a pagar</p>
                  <p className="text-4xl font-bold text-[#2C5E8D] mb-2">{formatCOP(publicPrice)}</p>
                  <p className="text-[10px] text-gray-400">Incluye seguros y tarifa de plataforma</p>
                </div>
                <button onClick={handlePay} disabled={loading} className="w-full py-4 bg-[#2C5E8D] text-white font-bold rounded-xl shadow-md uppercase tracking-widest">{loading ? "Abriendo Pasarela..." : `Pagar Ahora`}</button>
              </div>
            )}

            {step === "contract" && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-[#2C5E8D] uppercase tracking-wide text-center">Contrato de Almacenamiento</h2>
                <ContractView
                  space={space} guestName={guestInfo.name} guestEmail={guestInfo.email} guestPhone={guestInfo.phone}
                  checkIn={checkIn} checkOut={checkOut} days={days} months={months}
                  publicPrice={publicPrice} platformCut={platformCut} breakdown={breakdown}
                  reservationId={reservationId} wompiRef={wompiResult?.reference || ""}
                />
                <button onClick={() => setStep("checkin")} className="w-full py-4 bg-[#2C5E8D] text-white font-bold rounded-xl shadow-md uppercase tracking-widest">Firmar y Continuar al Check-in</button>
              </div>
            )}

            {step === "checkin" && (
              <div className="max-w-xl mx-auto space-y-8">
                <h2 className="text-2xl font-bold text-[#2C5E8D] uppercase tracking-wide text-center">Acta de Entrega</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2">Valor Declarado de Bienes (COP) *</label>
                    <input type="number" placeholder="Ej: 1000000" value={declaredValue} onChange={(e) => setDeclaredValue(e.target.value)} className="w-full border border-[#AECBE9] rounded-xl p-3 text-sm text-[#2C5E8D] outline-none" />
                  </div>
                  <textarea placeholder="Notas adicionales sobre el estado de los bienes..." value={checkinNotes} onChange={(e) => setCheckinNotes(e.target.value)} className="w-full border border-[#AECBE9] rounded-xl p-3 text-sm text-[#2C5E8D] outline-none h-32 resize-none" />
                  <button onClick={handleCheckin} disabled={loading || !declaredValue} className="w-full py-4 bg-[#2C5E8D] text-white font-bold rounded-xl shadow-md uppercase tracking-widest">Finalizar Entrega</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FindSpace() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { setBooking, clearBooking, updateBooking } = useStore();

  const [query, setQuery] = useState<SpacesQuery>({
    limit: 6,
    offset: 0,
    // category: "General", // Removed to show everything by default
  });

  // Guest restriction: Redirect if searching, filtering or paginating beyond page 1
  useEffect(() => {
    const isGuestAction = query.offset! > 0 || query.search || (query.category && query.category !== "General") || !!query.minPrice || !!query.maxPrice;
    if (!user && isGuestAction) {
      navigate("/auth?redirigir=/encuentra-tu-espacio", { replace: true });
    }
  }, [user, query.offset, query.search, query.category, query.minPrice, query.maxPrice, navigate]);
  const { data, loading, error } = useSpaces(query);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

  const updateQuery = (updates: Partial<SpacesQuery>) => {
    setQuery((prev: SpacesQuery) => ({
      ...prev,
      ...updates,
      offset: updates.offset !== undefined ? updates.offset : 0
    }));
  };

  useEffect(() => {
    if (data?.meta?.totalCount !== undefined && query.offset !== undefined && query.limit !== undefined) {
      const totalPages = Math.ceil(data.meta.totalCount / query.limit);
      const currentPage = Math.floor(query.offset / query.limit);
      if (currentPage >= totalPages && totalPages > 0) {
        const prevOffset = Math.max(0, (totalPages - 1) * query.limit);
        setQuery((prev: SpacesQuery) => ({ ...prev, offset: prevOffset }));
      }
    }
  }, [data, query.limit, query.offset]);

  const onSelectSpace = (space: SpaceDTO) => {
    if (!user) {
      navigate("/auth?redirigir=/encuentra-tu-espacio", { replace: true });
      return;
    }
    setSelectedSpace(space);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ search: searchTerm });
  };

  const currentPage = Math.floor((query.offset || 0) / (query.limit || 12));

  return (
    <div className="min-h-screen flex flex-col bg-white font-body">
      <Header />
      {selectedSpace && <SpaceModal space={selectedSpace} onClose={() => setSelectedSpace(null)} />}

      <main className="flex-1">
        {/* Simple Hero Section inspired by original */}
        <section className="bg-[#2C5E8D] py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl text-white font-bold mb-8 uppercase tracking-wide leading-tight">
              Encuentra tu espacio ideal
            </h1>

            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full bg-white border-none rounded-lg py-4 pl-12 pr-4 text-[#2C5E8D] placeholder-gray-400 font-medium outline-none shadow-lg"
                  placeholder="Ciudad, barrio o tipo de espacio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-[#E8A838] px-8 py-4 rounded-lg font-bold text-[#1a3d5c] shadow-lg hover:bg-orange-400 transition-all uppercase tracking-wide">BUSCAR</button>
            </form>
          </div>
        </section>

        <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-[#2C5E8D] uppercase tracking-wide">Espacios Disponibles</h2>
              <div className="h-1 w-16 bg-[#E8A838] mt-2 rounded-full" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg border font-bold text-xs uppercase tracking-widest transition-all ${showFilters ? "bg-[#2C5E8D] text-white border-[#2C5E8D]" : "bg-white text-[#2C5E8D] border-[#AECBE9]/50 hover:bg-gray-50"}`}
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </button>
          </div>

          {showFilters && (
            <div className="mb-12">
              <FilterSidebar
                query={query as any}
                updateQuery={updateQuery}
                totalResults={data?.meta?.totalCount || 0}
              />
            </div>
          )}

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-[#AECBE9]/30 border-t-[#2C5E8D] rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cargando resultados...</p>
            </div>
          ) : error ? (
            <div className="py-16 bg-red-50 rounded-2xl border border-red-100 p-10 text-center max-w-xl mx-auto">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-800 mb-1 uppercase tracking-tight">Error de Conexión</h3>
              <p className="text-red-600/70 text-sm leading-relaxed">{error.message}</p>
            </div>
          ) : data?.data.length === 0 ? (
            <div className="py-24 text-center border-2 border-dashed border-gray-200 rounded-2xl">
              <Box className="w-12 h-12 text-gray-300 mx-auto mb-4 opacity-40" />
              <h3 className="text-xl font-bold text-gray-400 mb-2 uppercase">No hay resultados</h3>
              <p className="text-gray-400 text-sm">Prueba ajustando los filtros o realizando otra búsqueda.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {data?.data.map((space: SpaceDTO) => (
                  <SpaceCard key={space.id} space={space} onClick={onSelectSpace} />
                ))}
              </div>

              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={data?.meta?.totalPages || 0}
                  onPageChange={(p) => updateQuery({ offset: p * (query.limit || 6) })}
                />
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
