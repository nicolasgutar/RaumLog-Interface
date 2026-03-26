import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search, MapPin, Filter, X, ChevronLeft, ChevronRight,
  Calendar, CreditCard, CheckCircle, AlertCircle, Upload, FileText,
  Package, Clock, ThumbsUp, Banknote,
} from "lucide-react";
import { createReservation, approveReservationByHost, payReservation, checkinReservation } from "@/lib/api";
import { PaymentService, CommissionEngine } from "@/lib/payment-service";
import { NotificationService } from "@/lib/notifications";
import { useStore } from "@/store/useStore";

interface Space {
  id: number; title: string; type: string; size: string; location: string;
  description: string; priceDaily: string; priceMonthly: string; priceAnnual: string;
  rawPriceDaily: number; rawPriceMonthly: number; ownerEmail: string; images: string[];
}

const spaces: Space[] = [
  { id: 1, title: "Garaje en El Poblado", type: "Garaje", size: "20 m²", location: "Medellín, El Poblado",
    description: "Garaje amplio con portón eléctrico, buena iluminación y acceso seguro las 24 horas. Ideal para almacenar vehículos, muebles o mercancía.",
    priceDaily: "$35.000 COP", priceMonthly: "$650.000 COP", priceAnnual: "$6.500.000 COP",
    rawPriceDaily: 35000, rawPriceMonthly: 650000, ownerEmail: "demo@raumlog.com",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80","https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80","https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80"] },
  { id: 2, title: "Cuarto Útil en Laureles", type: "Cuarto Útil", size: "8 m²", location: "Medellín, Laureles",
    description: "Cuarto útil limpio y seco, con buena ventilación. Perfecto para guardar cajas, electrodomésticos o artículos del hogar.",
    priceDaily: "$18.000 COP", priceMonthly: "$320.000 COP", priceAnnual: "$3.200.000 COP",
    rawPriceDaily: 18000, rawPriceMonthly: 320000, ownerEmail: "demo@raumlog.com",
    images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80","https://images.unsplash.com/photo-1558618047-3d9b42c24b5d?w=800&q=80"] },
  { id: 3, title: "Bodega Industrial en Itagüí", type: "Bodega", size: "50 m²", location: "Itagüí, Medellín",
    description: "Bodega en zona industrial con fácil acceso vehicular, piso en concreto y techado completo. Ideal para negocios y archivo.",
    priceDaily: "$75.000 COP", priceMonthly: "$1.400.000 COP", priceAnnual: "$14.000.000 COP",
    rawPriceDaily: 75000, rawPriceMonthly: 1400000, ownerEmail: "demo@raumlog.com",
    images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80","https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80","https://images.unsplash.com/photo-1620801113793-1e8de77a1a2f?w=800&q=80"] },
  { id: 4, title: "Depósito en Envigado", type: "Depósito", size: "15 m²", location: "Envigado, Medellín",
    description: "Depósito en conjunto residencial cerrado, con vigilancia y cámaras de seguridad. Acceso con código personal.",
    priceDaily: "$25.000 COP", priceMonthly: "$480.000 COP", priceAnnual: "$4.800.000 COP",
    rawPriceDaily: 25000, rawPriceMonthly: 480000, ownerEmail: "demo@raumlog.com",
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80","https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80"] },
  { id: 5, title: "Garaje Doble en Bello", type: "Garaje", size: "35 m²", location: "Bello, Medellín",
    description: "Garaje doble con espacio para dos vehículos o gran capacidad de almacenamiento. Rejas de seguridad, iluminación LED.",
    priceDaily: "$55.000 COP", priceMonthly: "$1.000.000 COP", priceAnnual: "$10.000.000 COP",
    rawPriceDaily: 55000, rawPriceMonthly: 1000000, ownerEmail: "demo@raumlog.com",
    images: ["https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80","https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80","https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"] },
  { id: 6, title: "Mini Bodega en Sabaneta", type: "Bodega", size: "12 m²", location: "Sabaneta, Medellín",
    description: "Mini bodega en zona comercial, seca y segura. Contrato flexible por días, meses o año.",
    priceDaily: "$22.000 COP", priceMonthly: "$400.000 COP", priceAnnual: "$4.000.000 COP",
    rawPriceDaily: 22000, rawPriceMonthly: 400000, ownerEmail: "demo@raumlog.com",
    images: ["https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80","https://images.unsplash.com/photo-1620801113793-1e8de77a1a2f?w=800&q=80"] },
];

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

type ModalStep = "info" | "booking" | "processing" | "payment" | "checkin" | "success";

const STEP_LABELS: Record<ModalStep, string> = {
  info: "Detalle",
  booking: "Reservar",
  processing: "Aprobación",
  payment: "Pago",
  checkin: "Check-in",
  success: "Listo",
};

const STATUS_FLOW = [
  { key: "pending_approval", label: "Pendiente de aprobación", icon: Clock },
  { key: "approved_by_host", label: "Aprobada por anfitrión", icon: ThumbsUp },
  { key: "paid", label: "Pagada", icon: Banknote },
  { key: "in_storage", label: "En almacenamiento", icon: Package },
];

function StatusTracker({ current }: { current: string }) {
  const idx = STATUS_FLOW.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center gap-1 mb-5">
      {STATUS_FLOW.map((s, i) => {
        const Icon = s.icon;
        const done = i <= idx;
        return (
          <div key={s.key} className="flex items-center flex-1">
            <div className={`flex flex-col items-center gap-1 flex-shrink-0 ${i === 0 ? "" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${done ? "bg-[#2C5E8D]" : "bg-gray-200"}`}>
                <Icon className={`w-3.5 h-3.5 ${done ? "text-white" : "text-gray-400"}`} />
              </div>
              <span className={`text-[10px] text-center leading-tight w-14 ${done ? "text-[#2C5E8D] font-medium" : "text-gray-400"}`}>{s.label}</span>
            </div>
            {i < STATUS_FLOW.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < idx ? "bg-[#2C5E8D]" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SpaceModal({ space, onClose }: { space: Space; onClose: () => void }) {
  const [currentImg, setCurrentImg] = useState(0);
  const [step, setStep] = useState<ModalStep>("info");
  const [reservationStatus, setReservationStatus] = useState("pending_approval");
  const { guestInfo, setGuestInfo } = useStore();

  const today = new Date().toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [itemsDesc, setItemsDesc] = useState("");
  const [declaredValue, setDeclaredValue] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [wompiResult, setWompiResult] = useState<any>(null);
  const [checkinNotes, setCheckinNotes] = useState("");
  const [checkinPhotos, setCheckinPhotos] = useState<File[]>([]);

  const days = daysBetween(checkIn, checkOut);
  const months = Math.floor(days / 30);
  const useLongStay = days >= 30;
  const publicPrice = useLongStay
    ? months * space.rawPriceMonthly
    : days * space.rawPriceDaily;
  const hostNet = CommissionEngine.getHostNet(publicPrice);
  const platformCut = CommissionEngine.getPlatformCut(publicPrice);

  const prev = () => setCurrentImg((i) => (i === 0 ? space.images.length - 1 : i - 1));
  const next = () => setCurrentImg((i) => (i === space.images.length - 1 ? 0 : i + 1));

  async function handleBook() {
    if (!acceptedTerms) { setTermsError(true); return; }
    if (!checkIn || !checkOut || days === 0 || !guestInfo.name || !guestInfo.email) return;
    setLoading(true);
    try {
      const reservation = await createReservation({
        spaceId: space.id,
        spaceTitle: space.title,
        spaceOwnerEmail: space.ownerEmail,
        guestName: guestInfo.name,
        guestEmail: guestInfo.email,
        guestPhone: guestInfo.phone,
        itemsDescription: itemsDesc,
        declaredValue: declaredValue || "0",
        checkIn, checkOut, days, months,
        totalPrice: String(publicPrice),
        hostNetPrice: String(Math.round(hostNet)),
        platformCommission: String(Math.round(platformCut)),
        acceptedTerms: true,
      });
      setReservationId(reservation.id);
      NotificationService.onStatusChange(reservation.id, "pending_approval", {
        guestName: guestInfo.name, guestEmail: guestInfo.email, spaceTitle: space.title,
      });
      setStep("processing");
      setReservationStatus("pending_approval");

      // Auto-approve for demo spaces
      await new Promise((r) => setTimeout(r, 2000));
      await approveReservationByHost(reservation.id);
      setReservationStatus("approved_by_host");
      NotificationService.onStatusChange(reservation.id, "approved_by_host", {
        guestName: guestInfo.name, guestEmail: guestInfo.email, spaceTitle: space.title,
      });
      await new Promise((r) => setTimeout(r, 1000));
      setStep("payment");
    } catch (e) {
      alert("Error al crear la reserva. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePay() {
    if (!reservationId) return;
    setLoading(true);
    try {
      const payload = await PaymentService.prepare(
        reservationId, publicPrice,
        guestInfo.email, guestInfo.name, guestInfo.phone
      );
      console.log("[RaumLog PaymentService] Payload Wompi:", JSON.stringify(payload, null, 2));
      const result = await payReservation(reservationId);
      setWompiResult(result.wompiResponse);
      setReservationStatus("paid");
      NotificationService.onPaymentReceived(reservationId, publicPrice, result.wompiResponse.reference);
      NotificationService.onStatusChange(reservationId, "paid", {
        guestName: guestInfo.name, guestEmail: guestInfo.email, spaceTitle: space.title,
      });
      setStep("checkin");
    } catch {
      alert("Error al procesar el pago. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckin() {
    if (!reservationId) return;
    setLoading(true);
    try {
      const photoBase64s = await Promise.all(checkinPhotos.map(fileToBase64));
      await checkinReservation(reservationId, {
        checkinNotes,
        checkinPhotos: photoBase64s,
        declaredValue,
      });
      setReservationStatus("in_storage");
      NotificationService.onCheckin(reservationId, photoBase64s.length, space.title);
      NotificationService.onStatusChange(reservationId, "in_storage", {
        guestName: guestInfo.name, guestEmail: guestInfo.email, spaceTitle: space.title,
      });
      setStep("success");
    } catch {
      alert("Error al registrar el check-in.");
    } finally {
      setLoading(false);
    }
  }

  function addPhoto(files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 5 - checkinPhotos.length);
    setCheckinPhotos((p) => [...p, ...newFiles].slice(0, 5));
  }

  const canBook = checkIn && checkOut && days > 0 && guestInfo.name && guestInfo.email;

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

        {/* ── SUCCESS ── */}
        {step === "success" && (
          <div className="p-10 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="font-heading text-2xl text-[#2C5E8D] mb-2">¡Check-in completado!</h2>
            <StatusTracker current="in_storage" />
            <p className="text-[#2C5E8D]/70 mb-2">
              Tu espacio en <strong>{space.title}</strong> está activo. Tus bienes están en almacenamiento.
            </p>
            <p className="text-xs text-[#2C5E8D]/40 mt-2">Confirmación enviada a {guestInfo.email}</p>
            <button onClick={onClose} className="mt-6 px-8 py-3 bg-[#2C5E8D] text-white font-semibold rounded-lg hover:bg-[#1a3d5c] transition-colors">
              Cerrar
            </button>
          </div>
        )}

        {/* ── CHECK-IN ── */}
        {step === "checkin" && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl text-[#2C5E8D]">Acta de Entrega</h2>
              <button onClick={onClose} className="text-[#2C5E8D]/40 hover:text-[#2C5E8D]"><X className="w-5 h-5" /></button>
            </div>
            <StatusTracker current="paid" />

            {wompiResult && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 text-sm">
                <p className="font-semibold text-green-700">✅ Pago confirmado</p>
                <p className="text-green-600 text-xs">Ref: {wompiResult.reference} · {formatCOP(publicPrice)}</p>
              </div>
            )}

            <p className="text-[#2C5E8D]/70 text-sm mb-5">
              Documenta el estado de tus bienes al ingresar al espacio. Este Acta tiene validez contractual.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Valor declarado de los bienes (COP) *</label>
                <input type="text" value={declaredValue} onChange={(e) => setDeclaredValue(e.target.value)}
                  className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm"
                  placeholder="ej. 2000000" />
                <p className="text-xs text-[#2C5E8D]/50 mt-1">La responsabilidad se limita al valor declarado en esta Acta.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-2">
                  Fotos del estado de los bienes ({checkinPhotos.length}/5)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
                  {checkinPhotos.map((f, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-[#AECBE9]">
                      <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => setCheckinPhotos((p) => p.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs leading-none">×</button>
                    </div>
                  ))}
                  {checkinPhotos.length < 5 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-[#AECBE9] flex flex-col items-center justify-center cursor-pointer hover:border-[#2C5E8D] transition-colors">
                      <Upload className="w-5 h-5 text-[#AECBE9] mb-1" />
                      <span className="text-[10px] text-[#2C5E8D]/50">Agregar</span>
                      <input type="file" accept="image/*" multiple className="sr-only"
                        onChange={(e) => addPhoto(e.target.files)} />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Inventario y notas del estado</label>
                <textarea value={checkinNotes} onChange={(e) => setCheckinNotes(e.target.value)} rows={3}
                  className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm resize-none"
                  placeholder="Ej: 3 cajas de libros (buen estado), sofá 2 puestos (rayado en el brazo derecho), 2 maletas..." />
              </div>

              <button onClick={handleCheckin} disabled={loading || !declaredValue}
                className="w-full py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors">
                {loading ? "Registrando..." : "Firmar Acta de Entrega →"}
              </button>
              <button onClick={() => setStep("success")} className="w-full py-2 text-[#2C5E8D]/50 hover:text-[#2C5E8D] text-sm transition-colors">
                Omitir por ahora
              </button>
            </div>
          </div>
        )}

        {/* ── PAYMENT ── */}
        {step === "payment" && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl text-[#2C5E8D]">Confirmar y Pagar</h2>
              <button onClick={onClose} className="text-[#2C5E8D]/40 hover:text-[#2C5E8D]"><X className="w-5 h-5" /></button>
            </div>
            <StatusTracker current="approved_by_host" />

            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-5 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-green-700">El anfitrión aprobó tu solicitud. Puedes continuar con el pago.</span>
            </div>

            <div className="bg-[#AECBE9]/20 rounded-xl p-4 mb-5 text-sm space-y-1">
              <p className="font-semibold text-[#2C5E8D] text-base">{space.title}</p>
              <p className="text-[#2C5E8D]/70">{checkIn} → {checkOut} · {days} días</p>
              {useLongStay
                ? <p className="text-[#2C5E8D]/70">{months} meses × {space.priceMonthly}</p>
                : <p className="text-[#2C5E8D]/70">{days} días × {space.priceDaily}</p>}
            </div>

            <div className="border border-[#2C5E8D]/20 rounded-xl p-5 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-[#2C5E8D]" />
                <span className="font-semibold text-[#2C5E8D]">Pago con Wompi</span>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium">Sandbox</span>
              </div>
              <p className="text-sm text-[#2C5E8D]/60 mb-4">
                Modo de prueba activo. En producción se procesaría con el widget oficial de Wompi.
              </p>
              <div className="space-y-2 text-sm border-t border-[#AECBE9]/40 pt-3">
                <div className="flex justify-between text-[#2C5E8D]/70">
                  <span>Precio del espacio</span>
                  <span>{formatCOP(publicPrice)}</span>
                </div>
                <div className="flex justify-between text-[#2C5E8D]/50 text-xs">
                  <span>Comisión plataforma (20%)</span>
                  <span>{formatCOP(platformCut)}</span>
                </div>
                <div className="flex justify-between font-bold text-[#2C5E8D] text-base pt-1 border-t border-[#AECBE9]/30">
                  <span>Total a pagar</span>
                  <span>{formatCOP(publicPrice)}</span>
                </div>
              </div>
            </div>

            <button onClick={handlePay} disabled={loading}
              className="w-full py-3.5 bg-[#2C5E8D] hover:bg-[#1a3d5c] disabled:opacity-60 text-white font-bold rounded-lg transition-colors">
              {loading ? "Procesando pago..." : `Pagar ${formatCOP(publicPrice)}`}
            </button>
          </div>
        )}

        {/* ── PROCESSING ── */}
        {step === "processing" && (
          <div className="p-10 text-center">
            <div className="w-16 h-16 border-4 border-[#AECBE9] border-t-[#2C5E8D] rounded-full animate-spin mx-auto mb-6" />
            <h2 className="font-heading text-xl text-[#2C5E8D] mb-2">Procesando tu solicitud</h2>
            <StatusTracker current={reservationStatus} />
            <p className="text-[#2C5E8D]/60 text-sm">
              {reservationStatus === "pending_approval"
                ? "Solicitud enviada al anfitrión. Esperando aprobación..."
                : "¡El anfitrión aprobó tu solicitud! Preparando el pago..."}
            </p>
          </div>
        )}

        {/* ── BOOKING ── */}
        {step === "booking" && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl text-[#2C5E8D]">Reservar: {space.title}</h2>
              <button onClick={onClose} className="text-[#2C5E8D]/40 hover:text-[#2C5E8D]"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-5">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Fecha de ingreso *</label>
                  <input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full border border-[#AECBE9] rounded-lg px-3 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Fecha de salida *</label>
                  <input type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full border border-[#AECBE9] rounded-lg px-3 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm" />
                </div>
              </div>

              {/* Price summary */}
              {days > 0 && (
                <div className="bg-[#AECBE9]/20 rounded-xl p-4 text-sm space-y-1.5">
                  <div className="flex justify-between text-[#2C5E8D]/70">
                    <span>{useLongStay ? `${months} meses × ${space.priceMonthly}` : `${days} días × ${space.priceDaily}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#2C5E8D] text-base pt-2 border-t border-[#2C5E8D]/10 mt-1">
                    <span>Total</span>
                    <span>{formatCOP(publicPrice)}</span>
                  </div>
                </div>
              )}

              {/* Guest info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Tu nombre *</label>
                  <input type="text" value={guestInfo.name} onChange={(e) => setGuestInfo({ name: e.target.value })}
                    className="w-full border border-[#AECBE9] rounded-lg px-3 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm" placeholder="Nombre completo" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Teléfono *</label>
                  <input type="tel" value={guestInfo.phone} onChange={(e) => setGuestInfo({ phone: e.target.value })}
                    className="w-full border border-[#AECBE9] rounded-lg px-3 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm" placeholder="+57 300 000 0000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Correo electrónico *</label>
                <input type="email" value={guestInfo.email} onChange={(e) => setGuestInfo({ email: e.target.value })}
                  className="w-full border border-[#AECBE9] rounded-lg px-3 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm" placeholder="tu@correo.com" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C5E8D] mb-1">¿Qué vas a guardar?</label>
                  <textarea value={itemsDesc} onChange={(e) => setItemsDesc(e.target.value)} rows={2}
                    className="w-full border border-[#AECBE9] rounded-lg px-3 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm resize-none"
                    placeholder="Muebles, cajas, electrodomésticos..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Valor declarado de los bienes (COP)</label>
                  <input type="text" value={declaredValue} onChange={(e) => setDeclaredValue(e.target.value)}
                    className="w-full border border-[#AECBE9] rounded-lg px-3 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm"
                    placeholder="ej. 2000000" />
                </div>
              </div>

              {/* Enhanced T&C */}
              <div className={`border rounded-xl p-4 ${termsError ? "border-red-300 bg-red-50" : "border-[#AECBE9]/60 bg-[#AECBE9]/10"}`}>
                <p className="text-xs font-semibold text-[#2C5E8D] mb-2 uppercase tracking-wide">Términos y Condiciones de Almacenamiento</p>
                <ul className="text-xs text-[#2C5E8D]/70 space-y-1.5 mb-3 list-none">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C5E8D]/40 mt-1.5 flex-shrink-0" />
                    <span><strong className="text-[#2C5E8D]">Intermediario:</strong> RaumLog actúa como plataforma intermediaria. La custodia física de los bienes es responsabilidad del anfitrión.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C5E8D]/40 mt-1.5 flex-shrink-0" />
                    <span><strong className="text-[#2C5E8D]">Prohibido almacenar:</strong> Alimentos perecederos, materiales inflamables o explosivos, sustancias ilegales, animales vivos o artículos con mal olor.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C5E8D]/40 mt-1.5 flex-shrink-0" />
                    <span><strong className="text-[#2C5E8D]">Responsabilidad:</strong> La responsabilidad de RaumLog y del anfitrión se limita al valor declarado en el Acta de Entrega firmada al momento del check-in.</span>
                  </li>
                </ul>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={acceptedTerms}
                    onChange={(e) => { setAcceptedTerms(e.target.checked); setTermsError(false); }}
                    className="w-4 h-4 accent-[#2C5E8D] flex-shrink-0" />
                  <span className="text-sm text-[#2C5E8D] font-medium">
                    Acepto los términos y condiciones de almacenamiento de RaumLog
                  </span>
                </label>
                {termsError && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Debes aceptar los términos para continuar.
                  </p>
                )}
              </div>

              <button onClick={handleBook} disabled={loading || !canBook}
                className="w-full py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors">
                {loading ? "Enviando solicitud..." : "Enviar solicitud de reserva →"}
              </button>
              <button onClick={() => setStep("info")} className="w-full py-2 text-[#2C5E8D]/60 hover:text-[#2C5E8D] text-sm transition-colors">
                ← Volver al detalle
              </button>
            </div>
          </div>
        )}

        {/* ── INFO ── */}
        {step === "info" && (
          <>
            <div className="relative aspect-video bg-gray-100 rounded-t-2xl overflow-hidden">
              <img src={space.images[currentImg]} alt={`${space.title} - foto ${currentImg + 1}`} className="w-full h-full object-cover" />
              {space.images.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#2C5E8D] w-9 h-9 rounded-full flex items-center justify-center shadow transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#2C5E8D] w-9 h-9 rounded-full flex items-center justify-center shadow transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {space.images.map((_, i) => (
                      <button key={i} onClick={() => setCurrentImg(i)} className={`w-2 h-2 rounded-full transition-colors ${i === currentImg ? "bg-white" : "bg-white/50"}`} />
                    ))}
                  </div>
                </>
              )}
              <button onClick={onClose} className="absolute top-3 right-3 bg-white/80 hover:bg-white text-[#2C5E8D] w-9 h-9 rounded-full flex items-center justify-center shadow transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2 px-5 pt-4">
              {space.images.map((img, i) => (
                <button key={i} onClick={() => setCurrentImg(i)}
                  className={`w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${i === currentImg ? "border-[#2C5E8D]" : "border-transparent"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-xs bg-[#AECBE9]/40 text-[#2C5E8D] px-2 py-1 rounded font-medium">{space.type}</span>
                  <h2 className="font-heading text-2xl text-[#1a3d5c] mt-2">{space.title}</h2>
                  <p className="text-[#2C5E8D]/60 text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" /> {space.location} · {space.size}
                  </p>
                </div>
              </div>
              <p className="text-[#2C5E8D]/80 text-sm mb-6 leading-relaxed">{space.description}</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-[#AECBE9]/20 rounded-xl p-4 text-center">
                  <Calendar className="w-5 h-5 text-[#2C5E8D] mx-auto mb-1" />
                  <p className="text-xs text-[#2C5E8D]/60 mb-1 font-medium uppercase tracking-wide">Precio Diario</p>
                  <p className="font-bold text-[#2C5E8D] text-sm">{space.priceDaily}</p>
                </div>
                <div className="bg-[#2C5E8D]/10 rounded-xl p-4 text-center border-2 border-[#2C5E8D]/20">
                  <Calendar className="w-5 h-5 text-[#2C5E8D] mx-auto mb-1" />
                  <p className="text-xs text-[#2C5E8D]/60 mb-1 font-medium uppercase tracking-wide">Precio Mensual</p>
                  <p className="font-bold text-[#2C5E8D] text-sm">{space.priceMonthly}</p>
                </div>
                <div className="bg-[#AECBE9]/20 rounded-xl p-4 text-center">
                  <Calendar className="w-5 h-5 text-[#2C5E8D] mx-auto mb-1" />
                  <p className="text-xs text-[#2C5E8D]/60 mb-1 font-medium uppercase tracking-wide">Precio Anual</p>
                  <p className="font-bold text-[#2C5E8D] text-sm">{space.priceAnnual}</p>
                </div>
              </div>

              <button onClick={() => setStep("booking")}
                className="block w-full py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-lg transition-colors text-center text-sm tracking-wide">
                Reservar este espacio
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function FindSpace() {
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? spaces.filter((s) =>
        s.location.toLowerCase().includes(search.toLowerCase()) ||
        s.type.toLowerCase().includes(search.toLowerCase()) ||
        s.title.toLowerCase().includes(search.toLowerCase()))
    : spaces;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {selectedSpace && <SpaceModal space={selectedSpace} onClose={() => setSelectedSpace(null)} />}
      <main className="flex-1 bg-gray-50">
        <section className="bg-[#2C5E8D] py-14 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl lg:text-5xl text-white mb-4 uppercase tracking-wide">Encuentra tu espacio</h1>
            <p className="text-[#AECBE9] text-lg mb-8">Disponible en Medellín, Bogotá y sus alrededores</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="flex-1 flex items-center bg-white rounded-lg px-4 gap-2">
                <MapPin className="w-5 h-5 text-[#2C5E8D] flex-shrink-0" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ciudad, barrio o tipo..."
                  className="flex-1 py-3 outline-none text-[#2C5E8D] placeholder-[#AECBE9]" />
              </div>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#AECBE9] hover:bg-[#8ab5d9] text-[#2C5E8D] font-semibold rounded-lg transition-colors">
                <Search className="w-5 h-5" /> Buscar
              </button>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-2xl text-[#2C5E8D] uppercase">
                Espacios disponibles
                {search && <span className="text-base font-normal ml-2 normal-case">· "{search}"</span>}
              </h2>
              <button className="flex items-center gap-2 text-[#2C5E8D] border border-[#AECBE9] px-4 py-2 rounded-lg hover:bg-[#AECBE9]/20 transition-colors text-sm">
                <Filter className="w-4 h-4" /> Filtros
              </button>
            </div>
            {filtered.length === 0
              ? <div className="text-center py-20 text-[#2C5E8D]/50">No se encontraron espacios para "{search}".</div>
              : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((space) => (
                    <article key={space.id} className="bg-white rounded-2xl shadow hover:shadow-md transition-shadow overflow-hidden">
                      <div className="relative">
                        <img src={space.images[0]} alt={space.title} className="w-full h-48 object-cover" />
                        <span className="absolute top-3 left-3 text-xs bg-white/90 text-[#2C5E8D] px-2 py-1 rounded font-medium shadow-sm">
                          {space.images.length} fotos
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs bg-[#AECBE9]/40 text-[#2C5E8D] px-2 py-1 rounded font-medium">{space.type}</span>
                          <span className="font-bold text-[#2C5E8D] text-sm">{space.priceMonthly}<span className="font-normal text-xs text-[#2C5E8D]/60">/mes</span></span>
                        </div>
                        <h3 className="font-semibold text-[#1a3d5c] text-lg mb-1">{space.title}</h3>
                        <p className="text-[#2C5E8D]/60 text-sm mb-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{space.location}</p>
                        <p className="text-[#2C5E8D]/60 text-sm mb-4">{space.size}</p>
                        <button onClick={() => setSelectedSpace(space)}
                          className="w-full py-2 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-lg transition-colors text-sm">
                          Ver detalles
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
