import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, MapPin, Calendar, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchSpaceById, createReservation, preparePayment } from "@/lib/api";
import { fetchSignedUrls } from "@/hooks/useSignedUpload";
import { CommissionEngine, type BookingBreakdown } from "@/lib/payment-service";
import { ContractView } from "@/components/FindSpace/ContractView";
import { DepositReceipt } from "@/components/FindSpace/DepositReceipt";
import { useAuthStore } from "@/store/authStore";

const PLACEHOLDER = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80";

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}

function daysBetween(a: string, b: string) {
  if (!a || !b) return 0;
  return Math.max(0, Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

type PageStep = "form" | "paying" | "success" | "error";

export default function SpaceDetailPage() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const navigate = useNavigate();
  const { user, idToken, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && user === null) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  const [space, setSpace] = useState<any | null>(null);
  const [loadingSpace, setLoadingSpace] = useState(true);
  const [spaceError, setSpaceError] = useState("");

  const [step, setStep] = useState<PageStep>("form");
  const [errorMsg, setErrorMsg] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [itemsDescription, setItemsDescription] = useState("");

  const [reservationId, setReservationId] = useState<number | null>(null);
  const [wompiRef, setWompiRef] = useState("");
  const [currentImg, setCurrentImg] = useState(0);
  const [isWompiReady, setIsWompiReady] = useState(!!(window as any).WidgetCheckout);

  const days = daysBetween(checkIn, checkOut);
  const months = Math.floor(days / 30);
  const breakdown: BookingBreakdown = CommissionEngine.getBookingBreakdown(
    months, days,
    Number(space?.priceMonthlyNum ?? 0),
    Number(space?.priceDailyNum ?? 0)
  );

  useEffect(() => {
    if ((window as any).WidgetCheckout) {
      setIsWompiReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;
    script.onload = () => setIsWompiReady(true);
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  const loadSpace = useCallback(async () => {
    if (!spaceId) return;
    setLoadingSpace(true);
    setSpaceError("");
    try {
      const raw = await fetchSpaceById(Number(spaceId));
      const images: string[] = Array.isArray(raw.images) ? raw.images : [];
      const paths = images.filter((p: string) => p && !p.startsWith("http"));
      let resolvedImages = images;
      if (paths.length > 0) {
        const urlMap = await fetchSignedUrls(paths, "spaces");
        resolvedImages = images.map((p: string) => urlMap[p] || (p.startsWith("http") ? p : PLACEHOLDER));
      }
      setSpace({ ...raw, images: resolvedImages.length > 0 ? resolvedImages : [PLACEHOLDER] });
    } catch {
      setSpaceError("No se pudo cargar el espacio.");
    } finally {
      setLoadingSpace(false);
    }
  }, [spaceId]);

  useEffect(() => { loadSpace(); }, [loadSpace]);

  async function handlePay() {
    if (!checkIn || !checkOut || days === 0 || !guestName || !guestEmail || !isWompiReady) return;
    setStep("paying");
    setErrorMsg("");
    try {
      const reservation = await createReservation({
        spaceId: Number(spaceId),
        spaceTitle: space.spaceType,
        spaceOwnerEmail: space.ownerEmail,
        guestName, guestEmail, guestPhone,
        itemsDescription, declaredValue: "0",
        checkIn, checkOut, days, months,
        totalPrice: String(breakdown.userTotal),
        hostNetPrice: String(Math.round(breakdown.hostNetTotal)),
        platformCommission: String(Math.round(breakdown.commission)),
        acceptedTerms: true,
      }, idToken ?? undefined);
      setReservationId(reservation.id);

      const params = await preparePayment(reservation.id);

      if (!(window as any).WidgetCheckout) {
        throw new Error("La pasarela de pago no está disponible aún. Espera un momento e intenta de nuevo.");
      }

      const checkout = new (window as any).WidgetCheckout({
        currency: params.currency,
        amountInCents: params.amountInCents,
        reference: params.reference,
        publicKey: params.publicKey,
        signature: { integrity: params.integritySignature },
        customerData: {
          email: params.customerData.email,
          fullName: params.customerData.fullName,
          ...(params.customerData.phoneNumber ? {
            phoneNumber: params.customerData.phoneNumber,
            phoneNumberPrefix: "+57"
          } : {})
        },
      });

      checkout.open((result: any) => {
        const status = result?.transaction?.status;
        if (status === "APPROVED") {
          setWompiRef(result.transaction.reference ?? params.reference);
          setStep("success");
        } else {
          setErrorMsg("Pago no aprobado: " + (status ?? "error desconocido"));
          setStep("error");
        }
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Error al procesar el pago.");
      setStep("error");
    }
  }

  if (loadingSpace) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFCFB]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#2C5E8D] animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (spaceError || !space) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFCFB]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-[#1a3d5c] font-semibold">{spaceError || "Espacio no encontrado."}</p>
          <button onClick={() => navigate("/encuentra-tu-espacio")} className="text-sm text-[#2C5E8D] underline">
            Volver al marketplace
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFB]">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {step === "success" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-[#1a3d5c] mb-2">¡Pago Confirmado!</h1>
              <p className="text-[#2C5E8D]/60 text-sm">Tu reserva ha sido registrada y el pago aprobado.</p>
            </div>
            <ContractView
              space={space} guestName={guestName} guestEmail={guestEmail} guestPhone={guestPhone}
              checkIn={checkIn} checkOut={checkOut} days={days} months={months}
              publicPrice={breakdown.userTotal} platformCut={breakdown.commission}
              breakdown={breakdown} reservationId={reservationId} wompiRef={wompiRef}
            />
            <DepositReceipt
              space={space} guestName={guestName} guestEmail={guestEmail}
              checkIn={checkIn} checkOut={checkOut}
              declaredValue="0" checkinNotes="" photoCount={0} reservationId={reservationId}
            />
            <button
              onClick={() => navigate("/encuentra-tu-espacio")}
              className="w-full py-4 bg-[#2C5E8D] text-white font-bold rounded-xl hover:bg-[#1a3d5c] transition-all"
            >
              Volver al Marketplace
            </button>
          </div>
        )}

        {step === "error" && (
          <div className="max-w-xl mx-auto text-center py-16">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#1a3d5c] mb-2">Pago no completado</h2>
            <p className="text-sm text-gray-500 mb-6">{errorMsg}</p>
            <button onClick={() => setStep("form")} className="bg-[#2C5E8D] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1a3d5c] transition-all">
              Intentar de nuevo
            </button>
          </div>
        )}

        {step === "paying" && (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-[#AECBE9] border-t-[#2C5E8D] rounded-full animate-spin mx-auto mb-6" />
            <p className="font-bold text-[#2C5E8D] uppercase tracking-widest">Abriendo pasarela de pago...</p>
          </div>
        )}

        {step === "form" && (
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Space details */}
            <div>
              <div className="relative h-72 bg-gray-100 rounded-2xl overflow-hidden mb-6">
                <img src={space.images[currentImg]} alt={space.spaceType} className="w-full h-full object-cover" />
                {space.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 px-4 py-2 rounded-full">
                    <button onClick={() => setCurrentImg((i) => (i === 0 ? space.images.length - 1 : i - 1))} className="text-white">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-xs text-white font-medium">{currentImg + 1} / {space.images.length}</span>
                    <button onClick={() => setCurrentImg((i) => (i === space.images.length - 1 ? 0 : i + 1))} className="text-white">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <h1 className="text-2xl font-bold text-[#1a3d5c] mb-1">{space.spaceType} en {space.city}</h1>
              <div className="flex items-center gap-1.5 text-[#2C5E8D]/60 text-sm mb-4">
                <MapPin className="w-4 h-4" />
                <span>{space.address}</span>
              </div>

              <div className="flex gap-3 mb-4">
                <span className="bg-[#AECBE9]/20 text-[#2C5E8D] text-xs font-semibold px-3 py-1 rounded-full">{space.category}</span>
                <span className="bg-[#AECBE9]/20 text-[#2C5E8D] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <Calendar className="w-3 h-3" />{space.accessType}
                </span>
              </div>

              <p className="text-[#2C5E8D]/70 text-sm leading-relaxed">{space.description}</p>

              <div className="mt-6 p-4 bg-white rounded-xl border border-[#AECBE9]/30">
                <p className="text-xs font-bold text-[#2C5E8D]/50 uppercase tracking-widest mb-1">Precio mensual</p>
                <p className="text-2xl font-bold text-[#2C5E8D]">{formatCOP(Number(space.priceMonthlyNum))}</p>
              </div>
            </div>

            {/* Booking form */}
            <div className="bg-white rounded-2xl border border-[#AECBE9]/30 shadow-sm p-6 space-y-5">
              <h2 className="text-lg font-bold text-[#1a3d5c]">Reservar este espacio</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-1.5">Fecha ingreso *</label>
                  <input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full border border-[#AECBE9] rounded-xl p-3 text-sm text-[#2C5E8D] outline-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-1.5">Fecha salida *</label>
                  <input type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full border border-[#AECBE9] rounded-xl p-3 text-sm text-[#2C5E8D] outline-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-1.5">Nombre completo *</label>
                <input type="text" placeholder="Tu nombre" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full border border-[#AECBE9] rounded-xl p-3 text-sm text-[#2C5E8D] outline-none" />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-1.5">Email *</label>
                <input type="email" placeholder="tu@email.com" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="w-full border border-[#AECBE9] rounded-xl p-3 text-sm text-[#2C5E8D] outline-none" />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-1.5">Teléfono</label>
                <input type="tel" placeholder="+57 300 0000000" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} className="w-full border border-[#AECBE9] rounded-xl p-3 text-sm text-[#2C5E8D] outline-none" />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-1.5">Descripción de ítems a almacenar</label>
                <textarea
                  placeholder="Ej: 3 cajas de libros, 1 bicicleta..."
                  value={itemsDescription}
                  onChange={(e) => setItemsDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-[#AECBE9] rounded-xl p-3 text-sm text-[#2C5E8D] outline-none resize-none"
                />
              </div>

              {days > 0 && (
                <div className="bg-[#AECBE9]/10 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-[#2C5E8D]/70">
                    <span>Subtotal ({months > 0 ? `${months} mes${months > 1 ? "es" : ""}` : `${days} días`})</span>
                    <span>{formatCOP(breakdown.publicTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#2C5E8D]/70">
                    <span>IVA 19%</span>
                    <span>{formatCOP(breakdown.ivaAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#2C5E8D] pt-2 border-t border-[#AECBE9]/30">
                    <span>Total a pagar</span>
                    <span>{formatCOP(breakdown.userTotal)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={!checkIn || !checkOut || days === 0 || !guestName || !guestEmail || !isWompiReady}
                className="w-full py-4 bg-[#2C5E8D] text-white font-bold rounded-xl hover:bg-[#1a3d5c] transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-widest"
              >
                {!isWompiReady ? "Cargando pasarela..." : "Proceder al pago →"}
              </button>
              <p className="text-center text-[10px] text-gray-400">Pago seguro procesado por Wompi</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
