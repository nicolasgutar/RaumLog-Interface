export type ReservationStatus =
  | "pending_approval"
  | "approved_by_host"
  | "rejected"
  | "paid"
  | "in_storage"
  | "completed";

const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending_approval: "PENDIENTE DE APROBACIÓN",
  approved_by_host: "APROBADA POR EL ANFITRIÓN",
  rejected: "RECHAZADA",
  paid: "PAGADA",
  in_storage: "EN ALMACENAMIENTO",
  completed: "FINALIZADA",
};

function timestamp() {
  return new Date().toLocaleString("es-CO", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export const NotificationService = {
  onStatusChange(
    reservationId: number,
    newStatus: ReservationStatus,
    context?: { guestEmail?: string; guestName?: string; spaceTitle?: string }
  ) {
    const label = STATUS_LABELS[newStatus];
    const ctx = context ?? {};
    console.group(`📬 [RaumLog Notificación] ${timestamp()}`);
    console.log(`Reserva #${reservationId} → ${label}`);
    if (ctx.guestName) console.log(`👤 Cliente: ${ctx.guestName} (${ctx.guestEmail})`);
    if (ctx.spaceTitle) console.log(`🏠 Espacio: ${ctx.spaceTitle}`);
    console.log(`📧 Email simulado enviado a: ${ctx.guestEmail ?? "guest"}, anfitrión y administración`);
    console.groupEnd();
  },

  onPaymentReceived(reservationId: number, amount: number, reference: string) {
    console.group(`💳 [RaumLog Pago] ${timestamp()}`);
    console.log(`Pago recibido para reserva #${reservationId}`);
    console.log(`Monto: ${new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(amount)}`);
    console.log(`Referencia Wompi: ${reference}`);
    console.log(`Comisión RaumLog (20%): ${new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(amount * 0.2)}`);
    console.log(`Neto al anfitrión (80%): ${new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(amount * 0.8)}`);
    console.groupEnd();
  },

  onCheckin(reservationId: number, photosCount: number, spaceTitle: string) {
    console.group(`📦 [RaumLog Check-in] ${timestamp()}`);
    console.log(`Acta de Entrega completada para reserva #${reservationId}`);
    console.log(`Espacio: ${spaceTitle}`);
    console.log(`Fotos adjuntas: ${photosCount}`);
    console.log(`Estado actualizado → EN ALMACENAMIENTO`);
    console.groupEnd();
  },
};
