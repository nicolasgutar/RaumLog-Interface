import { Shield } from "lucide-react";
import type { SpaceDTO } from "@/hooks/useSpaces";
import type { BookingBreakdown } from "@/lib/payment-service";

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}

export function ContractView({ space, guestName, guestEmail, guestPhone, checkIn, checkOut, days, months, publicPrice, reservationId }: {
  space: SpaceDTO; guestName: string; guestEmail: string; guestPhone: string;
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
