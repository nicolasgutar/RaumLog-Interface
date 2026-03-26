import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search, MapPin, Filter, X, ChevronLeft, ChevronRight,
  Calendar, CreditCard, CheckCircle, AlertCircle, Upload,
  Package, Clock, ThumbsUp, Banknote, FileText, Shield,
  Truck, Key, Home, Box, Car, Tv, SlidersHorizontal,
} from "lucide-react";
import { createReservation, approveReservationByHost, payReservation, checkinReservation } from "@/lib/api";
import { PaymentService, CommissionEngine, type BookingBreakdown } from "@/lib/payment-service";
import { NotificationService } from "@/lib/notifications";
import { useStore } from "@/store/useStore";

type Category = "General" | "Muebles" | "Cajas" | "Vehículos" | "Electrodomésticos";
type AccessType = "24/7" | "Con cita" | "Solo entrega";

interface Space {
  id: number; title: string; type: string; size: string; location: string;
  description: string; priceDaily: string; priceMonthly: string; priceAnnual: string;
  rawPriceDaily: number; rawPriceMonthly: number; ownerEmail: string; images: string[];
  category: Category; accessType: AccessType;
}

const spaces: Space[] = [
  { id: 1, title: "Garaje en El Poblado", type: "Garaje", size: "20 m²", location: "Medellín, El Poblado",
    description: "Garaje amplio con portón eléctrico, buena iluminación y acceso seguro las 24 horas. Ideal para almacenar vehículos, muebles o mercancía.",
    priceDaily: "$35.000 COP", priceMonthly: "$650.000 COP", priceAnnual: "$6.500.000 COP",
    rawPriceDaily: 35000, rawPriceMonthly: 650000, ownerEmail: "demo@raumlog.com",
    category: "Vehículos", accessType: "24/7",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80","https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80","https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80"] },
  { id: 2, title: "Cuarto Útil en Laureles", type: "Cuarto Útil", size: "8 m²", location: "Medellín, Laureles",
    description: "Cuarto útil limpio y seco, con buena ventilación. Perfecto para guardar cajas, electrodomésticos o artículos del hogar.",
    priceDaily: "$18.000 COP", priceMonthly: "$320.000 COP", priceAnnual: "$3.200.000 COP",
    rawPriceDaily: 18000, rawPriceMonthly: 320000, ownerEmail: "demo@raumlog.com",
    category: "Cajas", accessType: "Con cita",
    images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80","https://images.unsplash.com/photo-1558618047-3d9b42c24b5d?w=800&q=80"] },
  { id: 3, title: "Bodega Industrial en Itagüí", type: "Bodega", size: "50 m²", location: "Itagüí, Medellín",
    description: "Bodega en zona industrial con fácil acceso vehicular, piso en concreto y techado completo. Ideal para negocios y archivo.",
    priceDaily: "$75.000 COP", priceMonthly: "$1.400.000 COP", priceAnnual: "$14.000.000 COP",
    rawPriceDaily: 75000, rawPriceMonthly: 1400000, ownerEmail: "demo@raumlog.com",
    category: "General", accessType: "Solo entrega",
    images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80","https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80","https://images.unsplash.com/photo-1620801113793-1e8de77a1a2f?w=800&q=80"] },
  { id: 4, title: "Depósito en Envigado", type: "Depósito", size: "15 m²", location: "Envigado, Medellín",
    description: "Depósito en conjunto residencial cerrado, con vigilancia y cámaras de seguridad. Acceso con código personal.",
    priceDaily: "$25.000 COP", priceMonthly: "$480.000 COP", priceAnnual: "$4.800.000 COP",
    rawPriceDaily: 25000, rawPriceMonthly: 480000, ownerEmail: "demo@raumlog.com",
    category: "Muebles", accessType: "Con cita",
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80","https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80"] },
  { id: 5, title: "Garaje Doble en Bello", type: "Garaje", size: "35 m²", location: "Bello, Medellín",
    description: "Garaje doble con espacio para dos vehículos o gran capacidad de almacenamiento. Rejas de seguridad, iluminación LED.",
    priceDaily: "$55.000 COP", priceMonthly: "$1.000.000 COP", priceAnnual: "$10.000.000 COP",
    rawPriceDaily: 55000, rawPriceMonthly: 1000000, ownerEmail: "demo@raumlog.com",
    category: "Vehículos", accessType: "24/7",
    images: ["https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80","https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80","https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"] },
  { id: 6, title: "Mini Bodega en Sabaneta", type: "Bodega", size: "12 m²", location: "Sabaneta, Medellín",
    description: "Mini bodega en zona comercial, seca y segura. Contrato flexible por días, meses o año.",
    priceDaily: "$22.000 COP", priceMonthly: "$400.000 COP", priceAnnual: "$4.000.000 COP",
    rawPriceDaily: 22000, rawPriceMonthly: 400000, ownerEmail: "demo@raumlog.com",
    category: "Electrodomésticos", accessType: "Solo entrega",
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

function calcProration(checkIn: string, months: number, monthlyPrice: number) {
  if (!checkIn || months === 0) return null;
  const date = new Date(checkIn + "T12:00:00");
  const dayOfMonth = date.getDate();
  if (dayOfMonth === 1) return null;
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysRemaining = daysInMonth - dayOfMonth + 1;
  const proratedAmount = Math.round((daysRemaining / daysInMonth) * monthlyPrice);
  const fullMonths = Math.max(0, months - 1);
  return { daysRemaining, daysInMonth, proratedAmount, fullMonths, fullMonthsAmount: fullMonths * monthlyPrice };
}

type ModalStep = "info" | "booking" | "processing" | "payment" | "contract" | "checkin" | "success";

const STATUS_FLOW = [
  { key: "pending_approval", label: "Pendiente", icon: Clock },
  { key: "approved_by_host", label: "Aprobada", icon: ThumbsUp },
  { key: "paid", label: "Pagada", icon: Banknote },
  { key: "in_storage", label: "Almacenando", icon: Package },
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
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
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

const CATEGORY_ICONS: Record<Category, any> = {
  General: Box, Muebles: Home, Cajas: Package, Vehículos: Car, Electrodomésticos: Tv,
};
const ACCESS_ICONS: Record<AccessType, any> = {
  "24/7": Key, "Con cita": Calendar, "Solo entrega": Truck,
};

function ContractView({ space, guestName, guestEmail, guestPhone, checkIn, checkOut, days, months, publicPrice, platformCut, breakdown, reservationId, wompiRef }: {
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
          <p className="text-xs text-[#2C5E8D]/70">Gestionado por RaumLog S.A.S.</p>
        </div>
      </div>

      <div className="bg-[#AECBE9]/10 rounded-lg p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#2C5E8D]/60 mb-2">ESPACIO DE ALMACENAMIENTO</p>
        <p className="font-semibold">{space.title}</p>
        <p className="text-xs text-[#2C5E8D]/70">{space.location} · {space.size} · {space.type}</p>
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
          <span className="font-medium">{space.priceMonthly}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#2C5E8D]/70">Precio base del espacio</span>
          <span className="font-medium">{formatCOP(breakdown.publicTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#2C5E8D]/70">Comisión intermediación RaumLog</span>
          <span className="font-medium">{formatCOP(platformCut)} {breakdown.isLongStay ? "(1 mes, larga estancia)" : "(20%)"}</span>
        </div>
        <div className="flex justify-between text-amber-700">
          <span>IVA 19% (adicional al precio)</span>
          <span className="font-medium">+{formatCOP(breakdown.ivaAmount)}</span>
        </div>
        <div className="flex justify-between font-bold text-[#2C5E8D] pt-1 border-t border-[#AECBE9]/30">
          <span>VALOR TOTAL PAGADO (con IVA)</span>
          <span>{formatCOP(publicPrice)}</span>
        </div>
        {wompiRef && (
          <p className="text-[#2C5E8D]/40 font-mono">Ref. pago: {wompiRef}</p>
        )}
      </div>

      <div className="text-xs text-[#2C5E8D]/60 space-y-1.5 border-t border-[#AECBE9]/30 pt-3">
        <p><strong className="text-[#2C5E8D]">Cláusula 1 – Objeto y Naturaleza Jurídica:</strong> El Depositario concede al Depositante una licencia temporal de uso del Espacio para el almacenamiento de sus Artículos Almacenados por la duración pactada. Esta relación <em>no constituye un contrato de arrendamiento</em>; el Depositante renuncia a reclamar derechos de tenencia, prima comercial o renovación automática. El Depositario retiene en todo momento la posesión del inmueble (T&C §1.2).</p>
        <p><strong className="text-[#2C5E8D]">Cláusula 2 – Intermediación y Exclusión de Responsabilidad:</strong> COALGE S.A.S. actúa exclusivamente como intermediario tecnológico y agente de cobro. La custodia física de los bienes es responsabilidad exclusiva del Depositario. COALGE no responderá por daños causados por fuerza mayor, caso fortuito, culpa de la víctima o de terceros, ni por ninguna circunstancia ajena a la intermediación. La responsabilidad máxima de COALGE queda limitada al menor entre: (i) las tarifas de servicio pagadas en los últimos 12 meses, o (ii) $300.000 COP (T&C §2.1, §22.2).</p>
        <p><strong className="text-[#2C5E8D]">Cláusula 3 – Pagos Exclusivos y Sanción por Evasión:</strong> Todos los pagos derivados de esta Reserva deberán realizarse obligatoriamente a través de la plataforma RaumLog usando la pasarela Wompi. Cualquier acuerdo de pago por fuera de la plataforma faculta a COALGE a cancelar inmediatamente ambas cuentas y cobrar una cláusula penal equivalente a seis (6) meses de la Tarifa Total Mensual. Los pagos al Anfitrión se liquidarán semanalmente cada viernes, neto de comisiones, IVA y costos de pasarela (T&C §8.1, §8.4).</p>
        <p><strong className="text-[#2C5E8D]">Cláusula 4 – Artículos Prohibidos y Valor Máximo Declarado:</strong> El Depositante se obliga a no almacenar bienes cuyo valor supere los <strong>$50.000.000 COP</strong>. Quedan expresamente prohibidos: explosivos, combustibles, material biológico, pesticidas, residuos, armas, drogas, bienes robados, alimentos perecederos, animales, baterías de litio de gran capacidad y cualquier objeto ilegal conforme a la legislación colombiana. El incumplimiento faculta al Depositario a terminar inmediatamente la Reserva y aplicar el protocolo de abandono (T&C §11.11, §14.2).</p>
        <p><strong className="text-[#2C5E8D]">Cláusula 5 – Terminación, Disputas y Arbitraje:</strong> El contrato finaliza en la fecha de salida pactada; la prórroga requiere nueva solicitud y pago. En caso de mora superior a 30 días, COALGE podrá vender, donar o destruir los Artículos Almacenados. Toda controversia se resolverá primero por arreglo directo (30 días); de no lograrse, mediante Tribunal de Arbitramento ante la <em>Cámara de Comercio de Medellín para Antioquia</em>, cuyo laudo será en derecho. Quedan excluidas del arbitraje las acciones ejecutivas de cobro (T&C §16, §25).</p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="border-t-2 border-[#2C5E8D]/20 pt-2 text-center text-xs text-[#2C5E8D]/50">
          <p className="font-semibold text-[#2C5E8D]">{guestName}</p>
          <p>Depositante · Firma electrónica</p>
        </div>
        <div className="border-t-2 border-[#2C5E8D]/20 pt-2 text-center text-xs text-[#2C5E8D]/50">
          <p className="font-semibold text-[#2C5E8D]">RaumLog S.A.S.</p>
          <p>En representación del Depositario</p>
        </div>
      </div>
    </div>
  );
}

function FichaDeposito({ space, guestName, guestEmail, checkIn, checkOut, declaredValue, checkinNotes, photoCount, reservationId }: {
  space: Space; guestName: string; guestEmail: string; checkIn: string; checkOut: string;
  declaredValue: string; checkinNotes: string; photoCount: number; reservationId: number | null;
}) {
  const now = new Date();
  const fichaNo = `RL-FICHA-${reservationId || "000"}-${now.getFullYear()}`;
  const dateStr = now.toLocaleString("es-CO", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="border-2 border-[#2C5E8D]/20 rounded-xl p-5 text-sm text-[#2C5E8D] space-y-4 bg-[#AECBE9]/5">
      <div className="flex items-center justify-between border-b border-[#AECBE9]/40 pb-3">
        <div>
          <p className="font-bold text-lg text-[#1a3d5c]">FICHA DE DEPÓSITO</p>
          <p className="text-xs text-[#2C5E8D]/50">N.° {fichaNo} · {dateStr}</p>
        </div>
        <FileText className="w-8 h-8 text-[#2C5E8D]/30" />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="font-semibold text-[#2C5E8D]/60 uppercase tracking-wide mb-1">Cliente</p>
          <p className="font-semibold">{guestName}</p>
          <p className="text-[#2C5E8D]/70">{guestEmail}</p>
        </div>
        <div>
          <p className="font-semibold text-[#2C5E8D]/60 uppercase tracking-wide mb-1">Espacio</p>
          <p className="font-semibold">{space.title}</p>
          <p className="text-[#2C5E8D]/70">{space.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-white border border-[#AECBE9]/40 rounded-lg p-3 text-center">
          <p className="text-[#2C5E8D]/50 mb-1">Ingreso</p>
          <p className="font-bold">{checkIn}</p>
        </div>
        <div className="bg-white border border-[#AECBE9]/40 rounded-lg p-3 text-center">
          <p className="text-[#2C5E8D]/50 mb-1">Salida</p>
          <p className="font-bold">{checkOut}</p>
        </div>
        <div className="bg-white border border-[#AECBE9]/40 rounded-lg p-3 text-center">
          <p className="text-[#2C5E8D]/50 mb-1">Fotos</p>
          <p className="font-bold">{photoCount} adjunta(s)</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
        <p className="font-semibold text-amber-800 mb-1">Valor declarado de los bienes</p>
        <p className="text-amber-900 text-base font-bold">{formatCOP(Number(declaredValue) || 0)}</p>
        <p className="text-amber-700 mt-1">La responsabilidad máxima está limitada a este valor.</p>
      </div>

      {checkinNotes && (
        <div className="bg-white border border-[#AECBE9]/40 rounded-lg p-3 text-xs">
          <p className="font-semibold text-[#2C5E8D]/70 uppercase tracking-wide mb-2">Inventario y estado de los bienes</p>
          <p className="text-[#2C5E8D]/80 leading-relaxed">{checkinNotes}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="border-t-2 border-[#2C5E8D]/20 pt-2 text-center text-xs text-[#2C5E8D]/50">
          <p className="font-semibold text-[#2C5E8D]">{guestName}</p>
          <p>Firma electrónica del cliente</p>
        </div>
        <div className="border-t-2 border-[#2C5E8D]/20 pt-2 text-center text-xs text-[#2C5E8D]/50">
          <p className="font-semibold text-[#2C5E8D]">RaumLog S.A.S.</p>
          <p>Plataforma intermediaria</p>
        </div>
      </div>

      <p className="text-[9px] text-center text-[#2C5E8D]/30 border-t border-[#AECBE9]/20 pt-2">
        Este documento tiene validez contractual como soporte del estado en que se recibieron los bienes al inicio del período de almacenamiento. Generado automáticamente por RaumLog.
      </p>
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
  const [savedCheckinNotes, setSavedCheckinNotes] = useState("");
  const [savedPhotoCount, setSavedPhotoCount] = useState(0);

  const days = daysBetween(checkIn, checkOut);
  const months = Math.floor(days / 30);
  const breakdown: BookingBreakdown = CommissionEngine.getBookingBreakdown(
    months, days, space.rawPriceMonthly, space.rawPriceDaily
  );
  const basePrice = breakdown.publicTotal;
  const ivaAmount = breakdown.ivaAmount;
  const publicPrice = breakdown.userTotal;
  const hostNet = breakdown.hostNetTotal;
  const platformCut = breakdown.commission;
  const proration = calcProration(checkIn, months, space.rawPriceMonthly);

  const prev = () => setCurrentImg((i) => (i === 0 ? space.images.length - 1 : i - 1));
  const next = () => setCurrentImg((i) => (i === space.images.length - 1 ? 0 : i + 1));

  async function handleBook() {
    if (!acceptedTerms) { setTermsError(true); return; }
    if (!checkIn || !checkOut || days === 0 || !guestInfo.name || !guestInfo.email) return;
    setLoading(true);
    try {
      const reservation = await createReservation({
        spaceId: space.id, spaceTitle: space.title, spaceOwnerEmail: space.ownerEmail,
        guestName: guestInfo.name, guestEmail: guestInfo.email, guestPhone: guestInfo.phone,
        itemsDescription: itemsDesc, declaredValue: declaredValue || "0",
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
      await new Promise((r) => setTimeout(r, 2000));
      await approveReservationByHost(reservation.id);
      setReservationStatus("approved_by_host");
      NotificationService.onStatusChange(reservation.id, "approved_by_host", {
        guestName: guestInfo.name, guestEmail: guestInfo.email, spaceTitle: space.title,
      });
      await new Promise((r) => setTimeout(r, 1000));
      setStep("payment");
    } catch {
      alert("Error al crear la reserva. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePay() {
    if (!reservationId) return;
    setLoading(true);
    try {
      const payload = await PaymentService.prepare(reservationId, publicPrice, guestInfo.email, guestInfo.name, guestInfo.phone);
      console.log("[RaumLog PaymentService] Payload Wompi:", JSON.stringify(payload, null, 2));
      const result = await payReservation(reservationId);
      setWompiResult(result.wompiResponse);
      setReservationStatus("paid");
      NotificationService.onPaymentReceived(reservationId, publicPrice, result.wompiResponse.reference);
      NotificationService.onStatusChange(reservationId, "paid", {
        guestName: guestInfo.name, guestEmail: guestInfo.email, spaceTitle: space.title,
      });
      setStep("contract");
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
      await checkinReservation(reservationId, { checkinNotes, checkinPhotos: photoBase64s, declaredValue });
      setSavedCheckinNotes(checkinNotes);
      setSavedPhotoCount(photoBase64s.length);
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

        {/* ── SUCCESS + FICHA DE DEPÓSITO ── */}
        {step === "success" && (
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
              <h2 className="font-heading text-2xl text-[#2C5E8D] mb-1">¡Check-in completado!</h2>
              <StatusTracker current="in_storage" />
              <p className="text-[#2C5E8D]/70 text-sm">
                Tu espacio en <strong>{space.title}</strong> está activo.
              </p>
              <p className="text-xs text-[#2C5E8D]/40 mt-1">Confirmación enviada a {guestInfo.email}</p>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-[#2C5E8D]" />
                <h3 className="font-semibold text-[#1a3d5c] text-sm">Ficha de Depósito</h3>
                <span className="text-xs text-[#2C5E8D]/50">· Guarda este documento como soporte legal</span>
              </div>
              <FichaDeposito
                space={space} guestName={guestInfo.name} guestEmail={guestInfo.email}
                checkIn={checkIn} checkOut={checkOut} declaredValue={declaredValue}
                checkinNotes={savedCheckinNotes} photoCount={savedPhotoCount}
                reservationId={reservationId}
              />
            </div>

            <button onClick={onClose} className="w-full px-8 py-3 bg-[#2C5E8D] text-white font-semibold rounded-lg hover:bg-[#1a3d5c] transition-colors">
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
              Documenta el estado de tus bienes al ingresar. Este Acta tiene validez contractual y será tu soporte legal.
            </p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Valor declarado de los bienes (COP) *</label>
                <input type="text" value={declaredValue} onChange={(e) => setDeclaredValue(e.target.value)}
                  className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm"
                  placeholder="ej. 2000000" />
                <p className="text-xs text-[#2C5E8D]/50 mt-1">La responsabilidad se limita al valor declarado.</p>
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
                      <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addPhoto(e.target.files)} />
                    </label>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Inventario y estado de los bienes</label>
                <textarea value={checkinNotes} onChange={(e) => setCheckinNotes(e.target.value)} rows={3}
                  className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm resize-none"
                  placeholder="Ej: 3 cajas de libros (buen estado), sofá 2 puestos (rayado en el brazo derecho), 2 maletas..." />
              </div>
              <button onClick={handleCheckin} disabled={loading || !declaredValue}
                className="w-full py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors">
                {loading ? "Registrando..." : "Firmar Acta de Entrega →"}
              </button>
              <button onClick={() => { setSavedCheckinNotes(""); setSavedPhotoCount(0); setStep("success"); }}
                className="w-full py-2 text-[#2C5E8D]/50 hover:text-[#2C5E8D] text-sm transition-colors">
                Omitir por ahora
              </button>
            </div>
          </div>
        )}

        {/* ── CONTRACT ── */}
        {step === "contract" && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2C5E8D]" />
                <h2 className="font-heading text-xl text-[#2C5E8D]">Contrato de Almacenamiento</h2>
              </div>
              <button onClick={onClose} className="text-[#2C5E8D]/40 hover:text-[#2C5E8D]"><X className="w-5 h-5" /></button>
            </div>
            <StatusTracker current="paid" />

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-green-700 font-semibold">¡Pago procesado con éxito!</p>
                {wompiResult && <p className="text-green-600 text-xs">Ref. Wompi: {wompiResult.reference}</p>}
              </div>
            </div>

            <p className="text-sm text-[#2C5E8D]/70 mb-4">
              Tu contrato ha sido generado automáticamente. Guárdalo como comprobante de tu almacenamiento.
            </p>

            <ContractView
              space={space} guestName={guestInfo.name} guestEmail={guestInfo.email} guestPhone={guestInfo.phone}
              checkIn={checkIn} checkOut={checkOut} days={days} months={months}
              publicPrice={publicPrice} platformCut={platformCut} breakdown={breakdown}
              reservationId={reservationId} wompiRef={wompiResult?.reference || ""}
            />

            <div className="mt-5">
              <button onClick={() => setStep("checkin")}
                className="w-full py-3.5 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-bold rounded-lg transition-colors">
                Continuar al Check-in →
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

            <div className={`rounded-xl p-4 mb-5 text-sm space-y-2 ${breakdown.isLongStay ? "bg-green-50 border border-green-200" : "bg-[#AECBE9]/20"}`}>
              {breakdown.isLongStay && (
                <div className="flex items-center gap-2 mb-1">
                  <span>🎉</span>
                  <span className="font-semibold text-green-700 text-xs uppercase tracking-wide">¡Beneficio por larga estancia aplicado!</span>
                </div>
              )}
              <p className="font-semibold text-[#2C5E8D] text-base">{space.title}</p>
              <p className="text-[#2C5E8D]/70 text-xs">{checkIn} → {checkOut} · {months > 0 ? `${months} meses` : `${days} días`}</p>

              {proration && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs mt-1">
                  <p className="font-semibold text-blue-800 mb-1">📅 Prorrateo del primer mes</p>
                  <div className="text-blue-700 space-y-0.5">
                    <div className="flex justify-between">
                      <span>Primer pago ({proration.daysRemaining} días de {proration.daysInMonth})</span>
                      <span>{formatCOP(proration.proratedAmount)}</span>
                    </div>
                    {proration.fullMonths > 0 && (
                      <div className="flex justify-between">
                        <span>{proration.fullMonths} meses completos siguientes</span>
                        <span>{formatCOP(proration.fullMonthsAmount)}</span>
                      </div>
                    )}
                    <p className="text-blue-600 text-[10px] mt-1">
                      Los pagos futuros se alinearán al día 1 de cada mes.
                    </p>
                  </div>
                </div>
              )}
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
                  <span>{formatCOP(basePrice)}</span>
                </div>
                {breakdown.isLongStay ? (
                  <>
                    <div className="flex justify-between text-green-700 text-xs bg-green-50 rounded px-2 py-1">
                      <span>Comisión RaumLog (1 mes fijo · {breakdown.commissionLabel})</span>
                      <span>−{formatCOP(platformCut)}</span>
                    </div>
                    <div className="flex justify-between text-[#2C5E8D]/40 text-xs">
                      <span>Ahorro vs. modelo 20%</span>
                      <span className="text-green-600">−{formatCOP(basePrice * 0.2 - platformCut)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-[#2C5E8D]/50 text-xs">
                    <span>Comisión plataforma ({breakdown.commissionLabel})</span>
                    <span>−{formatCOP(platformCut)}</span>
                  </div>
                )}
                <div className="flex justify-between text-amber-700 text-xs pt-1 border-t border-[#AECBE9]/30">
                  <span>IVA 19% (adicional al precio)</span>
                  <span>+{formatCOP(ivaAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-[#2C5E8D] text-base pt-1 border-t border-[#AECBE9]/30">
                  <span>Total a pagar (con IVA)</span>
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

              {days > 0 && (
                <div className={`rounded-xl p-4 text-sm space-y-2 ${breakdown.isLongStay ? "bg-green-50 border border-green-200" : "bg-[#AECBE9]/20"}`}>
                  {breakdown.isLongStay && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">🎉</span>
                      <span className="font-semibold text-green-700 text-xs uppercase tracking-wide">¡Beneficio aplicado por larga estancia!</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#2C5E8D]/70">
                    <span>{months > 0 ? `${months} meses × ${space.priceMonthly}` : `${days} días × ${space.priceDaily}`}</span>
                    <span>{formatCOP(basePrice)}</span>
                  </div>
                  {proration && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-xs">
                      <p className="text-blue-700 font-semibold mb-0.5">Prorrateo aplicado</p>
                      <p className="text-blue-600">
                        1er pago: {formatCOP(proration.proratedAmount)} ({proration.daysRemaining} días restantes del mes)
                        {proration.fullMonths > 0 && ` · luego ${proration.fullMonths} mes(es) completo(s) × ${space.priceMonthly}`}
                      </p>
                    </div>
                  )}
                  {breakdown.isLongStay ? (
                    <>
                      <div className="flex justify-between text-green-700 text-xs bg-green-100 rounded-lg px-3 py-1.5">
                        <span>Comisión RaumLog (1 mes fijo)</span>
                        <span>−{formatCOP(platformCut)}</span>
                      </div>
                      <div className="flex justify-between text-[#2C5E8D]/60 text-xs">
                        <span>≈ {formatCOP(breakdown.monthlyCommissionAmortised ?? 0)}/mes amortizado</span>
                        <span className="text-green-700 font-medium">vs. 20% = {formatCOP(basePrice * 0.2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-[#2C5E8D]/50 text-xs">
                      <span>Comisión plataforma (20%)</span>
                      <span>{formatCOP(platformCut)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-amber-700 text-xs pt-1 border-t border-[#2C5E8D]/10">
                    <span>IVA 19% (adicional)</span>
                    <span>+{formatCOP(ivaAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#2C5E8D] text-base pt-1">
                    <span>Total a pagar (con IVA)</span>
                    <span>{formatCOP(publicPrice)}</span>
                  </div>
                  {!breakdown.isLongStay && months === 0 && (
                    <p className="text-[#2C5E8D]/40 text-xs">💡 Selecciona 6+ meses para comisión reducida (1 mes fijo)</p>
                  )}
                  {!breakdown.isLongStay && months > 0 && months < 6 && (
                    <p className="text-[#2C5E8D]/40 text-xs">💡 ¡Con {6 - months} meses más aplica el beneficio de larga estancia!</p>
                  )}
                </div>
              )}

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
                  <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Valor declarado (COP)</label>
                  <input type="text" value={declaredValue} onChange={(e) => setDeclaredValue(e.target.value)}
                    className="w-full border border-[#AECBE9] rounded-lg px-3 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 text-sm"
                    placeholder="ej. 2000000" />
                </div>
              </div>

              <div className={`border rounded-xl p-4 ${termsError ? "border-red-300 bg-red-50" : "border-[#AECBE9]/60 bg-[#AECBE9]/10"}`}>
                <p className="text-xs font-semibold text-[#2C5E8D] mb-2 uppercase tracking-wide">Términos y Condiciones</p>
                <ul className="text-xs text-[#2C5E8D]/70 space-y-1.5 mb-3 list-none">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C5E8D]/40 mt-1.5 flex-shrink-0" />
                    <span><strong className="text-[#2C5E8D]">Intermediario:</strong> RaumLog actúa como plataforma intermediaria. La custodia física es responsabilidad del anfitrión.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C5E8D]/40 mt-1.5 flex-shrink-0" />
                    <span><strong className="text-[#2C5E8D]">Prohibido:</strong> Alimentos perecederos, inflamables, sustancias ilegales, animales vivos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C5E8D]/40 mt-1.5 flex-shrink-0" />
                    <span><strong className="text-[#2C5E8D]">Responsabilidad:</strong> Limitada al valor declarado en el Acta de Entrega.</span>
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
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-xs bg-[#AECBE9]/40 text-[#2C5E8D] px-2 py-1 rounded font-medium">{space.type}</span>
                    <span className="text-xs bg-[#2C5E8D]/10 text-[#2C5E8D] px-2 py-1 rounded font-medium flex items-center gap-1">
                      {(() => { const Icon = CATEGORY_ICONS[space.category]; return <Icon className="w-3 h-3" />; })()}
                      {space.category}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium flex items-center gap-1">
                      {(() => { const Icon = ACCESS_ICONS[space.accessType]; return <Icon className="w-3 h-3" />; })()}
                      {space.accessType}
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl text-[#1a3d5c]">{space.title}</h2>
                  <p className="text-[#2C5E8D]/60 text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" /> {space.location} · {space.size}
                  </p>
                </div>
              </div>
              <p className="text-[#2C5E8D]/80 text-sm mb-6 leading-relaxed">{space.description}</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-[#AECBE9]/20 rounded-xl p-4 text-center">
                  <Calendar className="w-5 h-5 text-[#2C5E8D] mx-auto mb-1" />
                  <p className="text-xs text-[#2C5E8D]/60 mb-1 font-medium uppercase tracking-wide">Diario</p>
                  <p className="font-bold text-[#2C5E8D] text-sm">{space.priceDaily}</p>
                </div>
                <div className="bg-[#2C5E8D]/10 rounded-xl p-4 text-center border-2 border-[#2C5E8D]/20">
                  <Calendar className="w-5 h-5 text-[#2C5E8D] mx-auto mb-1" />
                  <p className="text-xs text-[#2C5E8D]/60 mb-1 font-medium uppercase tracking-wide">Mensual</p>
                  <p className="font-bold text-[#2C5E8D] text-sm">{space.priceMonthly}</p>
                </div>
                <div className="bg-[#AECBE9]/20 rounded-xl p-4 text-center">
                  <Calendar className="w-5 h-5 text-[#2C5E8D] mx-auto mb-1" />
                  <p className="text-xs text-[#2C5E8D]/60 mb-1 font-medium uppercase tracking-wide">Anual</p>
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

const ALL_CATEGORIES: Category[] = ["General", "Muebles", "Cajas", "Vehículos", "Electrodomésticos"];
const ALL_ACCESS: AccessType[] = ["24/7", "Con cita", "Solo entrega"];

export default function FindSpace() {
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategories, setFilterCategories] = useState<Category[]>([]);
  const [filterAccess, setFilterAccess] = useState<AccessType[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function toggleCategory(c: Category) {
    setFilterCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }
  function toggleAccess(a: AccessType) {
    setFilterAccess((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  }
  function clearFilters() {
    setFilterCategories([]); setFilterAccess([]); setMinPrice(""); setMaxPrice("");
  }

  const activeFilterCount =
    filterCategories.length + filterAccess.length +
    (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  const filtered = spaces.filter((s) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!s.location.toLowerCase().includes(q) && !s.type.toLowerCase().includes(q) && !s.title.toLowerCase().includes(q)) return false;
    }
    if (filterCategories.length > 0 && !filterCategories.includes(s.category)) return false;
    if (filterAccess.length > 0 && !filterAccess.includes(s.accessType)) return false;
    if (minPrice && s.rawPriceMonthly < Number(minPrice)) return false;
    if (maxPrice && s.rawPriceMonthly > Number(maxPrice)) return false;
    return true;
  });

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
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-2xl text-[#2C5E8D] uppercase">
                Espacios disponibles
                {search && <span className="text-base font-normal ml-2 normal-case">· "{search}"</span>}
              </h2>
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`flex items-center gap-2 text-sm border px-4 py-2 rounded-lg transition-colors ${activeFilterCount > 0 ? "bg-[#2C5E8D] text-white border-[#2C5E8D]" : "text-[#2C5E8D] border-[#AECBE9] hover:bg-[#AECBE9]/20"}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
                {activeFilterCount > 0 && (
                  <span className="bg-white text-[#2C5E8D] w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* ── Filter Panel ── */}
            {showFilters && (
              <div className="bg-white border border-[#AECBE9]/40 rounded-2xl p-5 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1a3d5c] text-sm">Filtrar espacios</h3>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 underline">
                      Limpiar filtros
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-[#2C5E8D]/60 uppercase tracking-wide mb-2">Tipo de objeto</p>
                    <div className="flex flex-wrap gap-2">
                      {ALL_CATEGORIES.map((c) => {
                        const Icon = CATEGORY_ICONS[c];
                        const active = filterCategories.includes(c);
                        return (
                          <button key={c} onClick={() => toggleCategory(c)}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${active ? "bg-[#2C5E8D] text-white border-[#2C5E8D]" : "text-[#2C5E8D] border-[#AECBE9] hover:bg-[#AECBE9]/20"}`}>
                            <Icon className="w-3.5 h-3.5" /> {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#2C5E8D]/60 uppercase tracking-wide mb-2">Tipo de acceso</p>
                    <div className="flex flex-wrap gap-2">
                      {ALL_ACCESS.map((a) => {
                        const Icon = ACCESS_ICONS[a];
                        const active = filterAccess.includes(a);
                        return (
                          <button key={a} onClick={() => toggleAccess(a)}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${active ? "bg-[#2C5E8D] text-white border-[#2C5E8D]" : "text-[#2C5E8D] border-[#AECBE9] hover:bg-[#AECBE9]/20"}`}>
                            <Icon className="w-3.5 h-3.5" /> {a}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#2C5E8D]/60 uppercase tracking-wide mb-2">Rango de precio mensual (COP)</p>
                    <div className="flex items-center gap-2">
                      <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Mín" className="w-full border border-[#AECBE9] rounded-lg px-3 py-2 text-[#2C5E8D] text-xs outline-none focus:ring-2 focus:ring-[#2C5E8D]/20" />
                      <span className="text-[#2C5E8D]/40 text-sm">—</span>
                      <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Máx" className="w-full border border-[#AECBE9] rounded-lg px-3 py-2 text-[#2C5E8D] text-xs outline-none focus:ring-2 focus:ring-[#2C5E8D]/20" />
                    </div>
                    <p className="text-[10px] text-[#2C5E8D]/40 mt-1">ej. 300000 – 1000000</p>
                  </div>
                </div>
              </div>
            )}

            {filtered.length === 0
              ? (
                <div className="text-center py-20 text-[#2C5E8D]/50">
                  <Filter className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No se encontraron espacios con los filtros aplicados.</p>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="mt-3 text-sm text-[#2C5E8D] underline">Limpiar filtros</button>
                  )}
                </div>
              )
              : (
                <>
                  <p className="text-sm text-[#2C5E8D]/50 mb-4">{filtered.length} espacio(s) encontrado(s)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((space) => {
                      const CatIcon = CATEGORY_ICONS[space.category];
                      const AccIcon = ACCESS_ICONS[space.accessType];
                      return (
                        <article key={space.id} className="bg-white rounded-2xl shadow hover:shadow-md transition-shadow overflow-hidden">
                          <div className="relative">
                            <img src={space.images[0]} alt={space.title} className="w-full h-48 object-cover" />
                            <span className="absolute top-3 left-3 text-xs bg-white/90 text-[#2C5E8D] px-2 py-1 rounded font-medium shadow-sm">
                              {space.images.length} fotos
                            </span>
                          </div>
                          <div className="p-5">
                            <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs bg-[#AECBE9]/40 text-[#2C5E8D] px-2 py-1 rounded font-medium">{space.type}</span>
                                <span className="text-xs bg-[#2C5E8D]/10 text-[#2C5E8D] px-2 py-1 rounded font-medium flex items-center gap-1">
                                  <CatIcon className="w-3 h-3" /> {space.category}
                                </span>
                              </div>
                              <span className="font-bold text-[#2C5E8D] text-sm">{space.priceMonthly}<span className="font-normal text-xs text-[#2C5E8D]/60">/mes</span></span>
                            </div>
                            <h3 className="font-semibold text-[#1a3d5c] text-lg mb-1">{space.title}</h3>
                            <p className="text-[#2C5E8D]/60 text-sm mb-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{space.location}</p>
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-[#2C5E8D]/60 text-sm">{space.size}</p>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <AccIcon className="w-3 h-3" /> {space.accessType}
                              </span>
                            </div>
                            <button onClick={() => setSelectedSpace(space)}
                              className="w-full py-2 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-lg transition-colors text-sm">
                              Ver detalles
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </>
              )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
