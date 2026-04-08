import { FileText } from "lucide-react";
import type { SpaceDTO } from "@/hooks/useSpaces";

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}

export function DepositReceipt({ space, checkIn, checkOut, declaredValue, checkinNotes, photoCount, reservationId }: {
  space: SpaceDTO; guestName: string; guestEmail: string; checkIn: string; checkOut: string;
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
