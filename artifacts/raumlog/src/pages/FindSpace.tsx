import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, MapPin, Filter, X, ChevronLeft, ChevronRight, Calendar, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { createReservation, payReservation, generateWompiSignature } from "@/lib/api";
import { useStore } from "@/store/useStore";

interface Space {
  id: number;
  title: string;
  type: string;
  size: string;
  location: string;
  description: string;
  priceDaily: string;
  priceMonthly: string;
  priceAnnual: string;
  rawPriceDaily: number;
  rawPriceMonthly: number;
  ownerEmail: string;
  images: string[];
}

const spaces: Space[] = [
  {
    id: 1,
    title: "Garaje en El Poblado",
    type: "Garaje",
    size: "20 m²",
    location: "Medellín, El Poblado",
    description: "Garaje amplio con portón eléctrico, buena iluminación y acceso seguro las 24 horas. Ideal para almacenar vehículos, muebles o mercancía.",
    priceDaily: "$35.000 COP",
    priceMonthly: "$650.000 COP",
    priceAnnual: "$6.500.000 COP",
    rawPriceDaily: 35000,
    rawPriceMonthly: 650000,
    ownerEmail: "demo@raumlog.com",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
      "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80",
    ],
  },
  {
    id: 2,
    title: "Cuarto Útil en Laureles",
    type: "Cuarto Útil",
    size: "8 m²",
    location: "Medellín, Laureles",
    description: "Cuarto útil limpio y seco, con buena ventilación. Perfecto para guardar cajas, electrodomésticos o artículos del hogar de forma ordenada.",
    priceDaily: "$18.000 COP",
    priceMonthly: "$320.000 COP",
    priceAnnual: "$3.200.000 COP",
    rawPriceDaily: 18000,
    rawPriceMonthly: 320000,
    ownerEmail: "demo@raumlog.com",
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1558618047-3d9b42c24b5d?w=800&q=80",
    ],
  },
  {
    id: 3,
    title: "Bodega Industrial en Itagüí",
    type: "Bodega",
    size: "50 m²",
    location: "Itagüí, Medellín",
    description: "Bodega en zona industrial con fácil acceso vehicular, piso en concreto y techado completo. Ideal para negocios, almacenamiento de mercancía o archivo.",
    priceDaily: "$75.000 COP",
    priceMonthly: "$1.400.000 COP",
    priceAnnual: "$14.000.000 COP",
    rawPriceDaily: 75000,
    rawPriceMonthly: 1400000,
    ownerEmail: "demo@raumlog.com",
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
      "https://images.unsplash.com/photo-1620801113793-1e8de77a1a2f?w=800&q=80",
    ],
  },
  {
    id: 4,
    title: "Depósito en Envigado",
    type: "Depósito",
    size: "15 m²",
    location: "Envigado, Medellín",
    description: "Depósito en conjunto residencial cerrado, con vigilancia y cámaras de seguridad. Acceso con código personal, disponible todos los días.",
    priceDaily: "$25.000 COP",
    priceMonthly: "$480.000 COP",
    priceAnnual: "$4.800.000 COP",
    rawPriceDaily: 25000,
    rawPriceMonthly: 480000,
    ownerEmail: "demo@raumlog.com",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
    ],
  },
  {
    id: 5,
    title: "Garaje Doble en Bello",
    type: "Garaje",
    size: "35 m²",
    location: "Bello, Medellín",
    description: "Garaje doble con espacio para dos vehículos o gran capacidad de almacenamiento. Rejas de seguridad, iluminación LED y piso en baldosa.",
    priceDaily: "$55.000 COP",
    priceMonthly: "$1.000.000 COP",
    priceAnnual: "$10.000.000 COP",
    rawPriceDaily: 55000,
    rawPriceMonthly: 1000000,
    ownerEmail: "demo@raumlog.com",
    images: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
      "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    ],
  },
  {
    id: 6,
    title: "Mini Bodega en Sabaneta",
    type: "Bodega",
    size: "12 m²",
    location: "Sabaneta, Medellín",
    description: "Mini bodega en zona comercial, seca y segura. Contrato flexible por días, meses o año. Acceso de lunes a sábado con aviso previo.",
    priceDaily: "$22.000 COP",
    priceMonthly: "$400.000 COP",
    priceAnnual: "$4.000.000 COP",
    rawPriceDaily: 22000,
    rawPriceMonthly: 400000,
    ownerEmail: "demo@raumlog.com",
    images: [
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1620801113793-1e8de77a1a2f?w=800&q=80",
    ],
  },
];

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}

function daysBetween(a: string, b: string) {
  if (!a || !b) return 0;
  const diff = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

type ModalStep = "info" | "booking" | "payment" | "success";

function SpaceModal({ space, onClose }: { space: Space; onClose: () => void }) {
  const [currentImg, setCurrentImg] = useState(0);
  const [step, setStep] = useState<ModalStep>("info");
  const { guestInfo, setGuestInfo } = useStore();

  const today = new Date().toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [itemsDesc, setItemsDesc] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [wompiResult, setWompiResult] = useState<any>(null);

  const days = daysBetween(checkIn, checkOut);
  const months = Math.floor(days / 30);
  const useLongStay = days >= 30;
  const totalPrice = useLongStay
    ? months * space.rawPriceMonthly
    : days * space.rawPriceDaily;

  const prev = () => setCurrentImg((i) => (i === 0 ? space.images.length - 1 : i - 1));
  const next = () => setCurrentImg((i) => (i === space.images.length - 1 ? 0 : i + 1));

  async function handleBook() {
    if (!acceptedTerms) { setTermsError(true); return; }
    if (!checkIn || !checkOut || days === 0) return;
    setBookingLoading(true);
    try {
      const reservation = await createReservation({
        spaceId: space.id,
        spaceTitle: space.title,
        spaceOwnerEmail: space.ownerEmail,
        guestName: guestInfo.name,
        guestEmail: guestInfo.email,
        guestPhone: guestInfo.phone,
        itemsDescription: itemsDesc,
        checkIn,
        checkOut,
        days,
        months,
        totalPrice: String(totalPrice),
        acceptedTerms: true,
      });
      setReservationId(reservation.id);
      setStep("payment");
    } catch {
      alert("Error al crear la reserva. Intenta de nuevo.");
    } finally {
      setBookingLoading(false);
    }
  }

  async function handlePay() {
    if (!reservationId) return;
    setPayLoading(true);
    try {
      const reference = `RL-${reservationId}-${Date.now()}`;
      const integrityKey = "sandbox_wompi_integrity_key_2024";
      const sig = await generateWompiSignature(reference, totalPrice * 100, "COP", integrityKey);
      console.log("[Wompi Sandbox] Integrity signature:", sig);
      await new Promise((r) => setTimeout(r, 1500));
      const result = await payReservation(reservationId);
      setWompiResult(result.wompiResponse);
      setStep("success");
    } catch {
      alert("Error al procesar el pago. Intenta de nuevo.");
    } finally {
      setPayLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

        {step === "success" ? (
          <div className="p-10 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="font-heading text-2xl text-[#2C5E8D] mb-2">¡Pago confirmado!</h2>
            <p className="text-[#2C5E8D]/70 mb-2">Tu reserva en <strong>{space.title}</strong> está confirmada.</p>
            {wompiResult && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4 text-sm text-left">
                <p className="font-semibold text-green-700 mb-1">Respuesta Wompi (Sandbox)</p>
                <p className="text-green-600">Estado: {wompiResult.status}</p>
                <p className="text-green-600">Referencia: {wompiResult.reference}</p>
                <p className="text-green-600 text-xs mt-1 italic">{wompiResult.statusMessage}</p>
              </div>
            )}
            <p className="text-xs text-[#2C5E8D]/40 mt-4">Recibirás confirmación al correo {guestInfo.email}</p>
            <button onClick={onClose} className="mt-6 px-8 py-3 bg-[#2C5E8D] text-white font-semibold rounded-lg hover:bg-[#1a3d5c] transition-colors">
              Cerrar
            </button>
          </div>
        ) : step === "payment" ? (
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl text-[#2C5E8D]">Confirmar y Pagar</h2>
              <button onClick={onClose} className="text-[#2C5E8D]/40 hover:text-[#2C5E8D]"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-[#AECBE9]/20 rounded-xl p-4 mb-6 text-sm space-y-1">
              <p className="font-semibold text-[#2C5E8D] text-base">{space.title}</p>
              <p className="text-[#2C5E8D]/70">{checkIn} → {checkOut} · {days} días</p>
              {useLongStay && <p className="text-[#2C5E8D]/70">{months} meses × {space.priceMonthly}</p>}
              {!useLongStay && <p className="text-[#2C5E8D]/70">{days} días × {space.priceDaily}</p>}
            </div>
            <div className="border border-[#2C5E8D]/20 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-[#2C5E8D]" />
                <span className="font-semibold text-[#2C5E8D]">Pago con Wompi</span>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium">Sandbox</span>
              </div>
              <p className="text-sm text-[#2C5E8D]/60 mb-4">
                Modo de prueba activo. El pago será simulado y la reserva se marcará como pagada automáticamente.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-[#AECBE9]/40">
                <span className="font-semibold text-[#2C5E8D]">Total a pagar</span>
                <span className="text-2xl font-bold text-[#2C5E8D]">{formatCOP(totalPrice)}</span>
              </div>
            </div>
            <button
              onClick={handlePay}
              disabled={payLoading}
              className="w-full py-3.5 bg-[#2C5E8D] hover:bg-[#1a3d5c] disabled:opacity-60 text-white font-bold rounded-lg transition-colors text-base"
            >
              {payLoading ? "Procesando pago..." : `Pagar ${formatCOP(totalPrice)}`}
            </button>
            <button onClick={() => setStep("booking")} className="w-full mt-2 py-2 text-[#2C5E8D]/60 hover:text-[#2C5E8D] text-sm transition-colors">
              ← Volver
            </button>
          </div>
        ) : step === "booking" ? (
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
                <div className="bg-[#AECBE9]/20 rounded-xl p-4 text-sm">
                  <div className="flex justify-between text-[#2C5E8D]/70 mb-1">
                    <span>{useLongStay ? `${months} meses × ${space.priceMonthly}` : `${days} días × ${space.priceDaily}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#2C5E8D] text-base pt-2 border-t border-[#2C5E8D]/10 mt-2">
                    <span>Total estimado</span>
                    <span>{formatCOP(totalPrice)}</span>
                  </div>
                </div>
              )}

              {/* Guest info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Tu nombre *</label>
                  <input type="text" value={guestInfo.name} onChange={(e) => setGuestInfo({ name: e.target.value })}
                    required className="w-full border border-[#AECBE9] rounded-lg px-3 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm"
                    placeholder="Nombre completo" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Teléfono *</label>
                  <input type="tel" value={guestInfo.phone} onChange={(e) => setGuestInfo({ phone: e.target.value })}
                    required className="w-full border border-[#AECBE9] rounded-lg px-3 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm"
                    placeholder="+57 300 000 0000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Correo electrónico *</label>
                <input type="email" value={guestInfo.email} onChange={(e) => setGuestInfo({ email: e.target.value })}
                  required className="w-full border border-[#AECBE9] rounded-lg px-3 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm"
                  placeholder="tu@correo.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">¿Qué vas a guardar?</label>
                <textarea value={itemsDesc} onChange={(e) => setItemsDesc(e.target.value)} rows={2}
                  className="w-full border border-[#AECBE9] rounded-lg px-3 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm resize-none"
                  placeholder="Muebles, cajas, electrodomésticos..." />
              </div>

              {/* T&C */}
              <div>
                <label className={`flex items-start gap-3 cursor-pointer ${termsError ? "text-red-500" : "text-[#2C5E8D]/70"}`}>
                  <input type="checkbox" checked={acceptedTerms}
                    onChange={(e) => { setAcceptedTerms(e.target.checked); setTermsError(false); }}
                    className="mt-1 w-4 h-4 accent-[#2C5E8D] flex-shrink-0" />
                  <span className="text-sm">
                    Acepto los{" "}
                    <span className="underline text-[#2C5E8D] font-medium">Términos y Condiciones de Almacenamiento</span>
                    {" "}de RaumLog, incluyendo responsabilidades sobre los objetos almacenados.
                  </span>
                </label>
                {termsError && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Debes aceptar los términos para continuar.
                  </p>
                )}
              </div>

              <button
                onClick={handleBook}
                disabled={bookingLoading || days === 0 || !guestInfo.name || !guestInfo.email}
                className="w-full py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
              >
                {bookingLoading ? "Procesando..." : "Continuar al pago →"}
              </button>
              <button onClick={() => setStep("info")} className="w-full py-2 text-[#2C5E8D]/60 hover:text-[#2C5E8D] text-sm transition-colors">
                ← Volver al detalle
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Gallery */}
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

            {/* Thumbnails */}
            <div className="flex gap-2 px-5 pt-4">
              {space.images.map((img, i) => (
                <button key={i} onClick={() => setCurrentImg(i)}
                  className={`w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${i === currentImg ? "border-[#2C5E8D]" : "border-transparent"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Info */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-xs bg-[#AECBE9]/40 text-[#2C5E8D] px-2 py-1 rounded font-medium">{space.type}</span>
                  <h2 className="font-heading text-2xl text-[#1a3d5c] mt-2">{space.title}</h2>
                  <p className="text-[#2C5E8D]/60 text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" /> {space.location} &bull; {space.size}
                  </p>
                </div>
              </div>
              <p className="text-[#2C5E8D]/80 text-sm mb-6 leading-relaxed">{space.description}</p>

              {/* Pricing */}
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

              <button
                onClick={() => setStep("booking")}
                className="block w-full py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-lg transition-colors text-center text-sm tracking-wide"
              >
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
    ? spaces.filter(
        (s) =>
          s.location.toLowerCase().includes(search.toLowerCase()) ||
          s.type.toLowerCase().includes(search.toLowerCase()) ||
          s.title.toLowerCase().includes(search.toLowerCase())
      )
    : spaces;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {selectedSpace && (
        <SpaceModal space={selectedSpace} onClose={() => setSelectedSpace(null)} />
      )}
      <main className="flex-1 bg-gray-50">
        {/* Hero */}
        <section className="bg-[#2C5E8D] py-14 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl lg:text-5xl text-white mb-4 uppercase tracking-wide">
              Encuentra tu espacio
            </h1>
            <p className="text-[#AECBE9] text-lg mb-8">
              Disponible en Medellín, Bogotá y sus alrededores
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="flex-1 flex items-center bg-white rounded-lg px-4 gap-2">
                <MapPin className="w-5 h-5 text-[#2C5E8D] flex-shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ciudad, barrio o tipo..."
                  className="flex-1 py-3 outline-none text-[#2C5E8D] placeholder-[#AECBE9]"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#AECBE9] hover:bg-[#8ab5d9] text-[#2C5E8D] font-semibold rounded-lg transition-colors">
                <Search className="w-5 h-5" />
                Buscar
              </button>
            </div>
          </div>
        </section>

        {/* Listings */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-2xl text-[#2C5E8D] uppercase">
                Espacios disponibles
                {search && <span className="text-base font-normal ml-2 normal-case">· "{search}"</span>}
              </h2>
              <button className="flex items-center gap-2 text-[#2C5E8D] border border-[#AECBE9] px-4 py-2 rounded-lg hover:bg-[#AECBE9]/20 transition-colors text-sm">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-[#2C5E8D]/50">No se encontraron espacios para "{search}".</div>
            ) : (
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
                      <button
                        onClick={() => setSelectedSpace(space)}
                        className="w-full py-2 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-lg transition-colors text-sm"
                      >
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
