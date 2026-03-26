import { Router } from "express";
import { db, reservationsTable, insertReservationSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

type ReservationStatus =
  | "pending_approval"
  | "approved_by_host"
  | "rejected"
  | "paid"
  | "in_storage"
  | "completed";

function logStateChange(id: number, status: ReservationStatus, ctx?: { guestEmail?: string; guestName?: string; spaceTitle?: string }) {
  const labels: Record<ReservationStatus, string> = {
    pending_approval: "PENDIENTE DE APROBACIÓN",
    approved_by_host: "APROBADA POR ANFITRIÓN",
    rejected: "RECHAZADA",
    paid: "PAGADA",
    in_storage: "EN ALMACENAMIENTO",
    completed: "FINALIZADA",
  };
  const ts = new Date().toLocaleString("es-CO");
  console.log(`\n📬 [RaumLog Notificación] ${ts}`);
  console.log(`  Reserva #${id} → ${labels[status]}`);
  if (ctx?.guestName) console.log(`  👤 ${ctx.guestName} (${ctx.guestEmail})`);
  if (ctx?.spaceTitle) console.log(`  🏠 ${ctx.spaceTitle}`);
  console.log(`  📧 Email simulado enviado a todas las partes\n`);
}

router.post("/reservations", async (req, res) => {
  const parsed = insertReservationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parsed.error.issues });
  }
  const [reservation] = await db.insert(reservationsTable).values(parsed.data).returning();
  logStateChange(reservation.id, "pending_approval", {
    guestName: reservation.guestName,
    guestEmail: reservation.guestEmail,
    spaceTitle: reservation.spaceTitle,
  });
  return res.status(201).json({ reservation });
});

router.post("/reservations/:id/approve-host", async (req, res) => {
  const id = Number(req.params["id"]);
  const [reservation] = await db
    .update(reservationsTable)
    .set({ status: "approved_by_host", updatedAt: new Date() })
    .where(eq(reservationsTable.id, id))
    .returning();
  if (!reservation) return res.status(404).json({ error: "Reserva no encontrada" });
  logStateChange(id, "approved_by_host", {
    guestName: reservation.guestName,
    guestEmail: reservation.guestEmail,
    spaceTitle: reservation.spaceTitle,
  });
  return res.json({ reservation });
});

router.post("/reservations/:id/pay", async (req, res) => {
  const id = Number(req.params["id"]);
  const wompiReference = `RL-${id}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

  const [reservation] = await db
    .select()
    .from(reservationsTable)
    .where(eq(reservationsTable.id, id));

  if (!reservation) return res.status(404).json({ error: "Reserva no encontrada" });
  if (!["approved_by_host", "pending_approval"].includes(reservation.status)) {
    return res.status(400).json({ error: "La reserva no está en estado válido para pagar" });
  }

  const totalPrice = Number(reservation.totalPrice);
  const months = reservation.months ?? 0;

  // Use frontend-computed commission if available; otherwise fall back to dynamic rule:
  // Scenario A (< 6 months): 20% · Scenario B (>= 6 months): 1 month flat
  let platformCommission = Number(reservation.platformCommission);
  let hostNetPrice = Number(reservation.hostNetPrice);

  if (!platformCommission || platformCommission === 0) {
    // totalPrice includes IVA (base * 1.19); recover base price first
    const basePrice = Math.round(totalPrice / 1.19);
    if (months >= 6) {
      // Scenario B: 1 month flat commission
      const monthlyBase = Math.round(basePrice / months);
      platformCommission = monthlyBase;
    } else {
      // Scenario A: 20% of base price
      platformCommission = Math.round(basePrice * 0.2);
    }
    hostNetPrice = Math.round(totalPrice / 1.19) - platformCommission;
  }

  const [updated] = await db
    .update(reservationsTable)
    .set({
      status: "paid",
      wompiReference,
      platformCommission: String(platformCommission),
      hostNetPrice: String(hostNetPrice),
      updatedAt: new Date(),
    })
    .where(eq(reservationsTable.id, id))
    .returning();

  logStateChange(id, "paid", {
    guestName: updated.guestName,
    guestEmail: updated.guestEmail,
    spaceTitle: updated.spaceTitle,
  });

  console.log(`\n💳 [RaumLog Pago] Referencia: ${wompiReference}`);
  console.log(`  Total: $${totalPrice.toLocaleString("es-CO")} COP`);
  console.log(`  Comisión RaumLog (20%): $${platformCommission.toLocaleString("es-CO")} COP`);
  console.log(`  Neto al anfitrión (80%): $${hostNetPrice.toLocaleString("es-CO")} COP\n`);

  return res.json({
    success: true,
    reservation: updated,
    wompiResponse: {
      sandbox: true,
      reference: wompiReference,
      status: "APPROVED",
      amount_in_cents: totalPrice * 100,
      currency: "COP",
      statusMessage: "Pago aprobado (modo sandbox)",
      commission: platformCommission,
      hostNet: hostNetPrice,
    },
  });
});

router.post("/reservations/:id/checkin", async (req, res) => {
  const id = Number(req.params["id"]);
  const { checkinNotes, checkinPhotos, declaredValue } = req.body as {
    checkinNotes?: string;
    checkinPhotos?: string[];
    declaredValue?: string;
  };

  const [reservation] = await db
    .select()
    .from(reservationsTable)
    .where(eq(reservationsTable.id, id));

  if (!reservation) return res.status(404).json({ error: "Reserva no encontrada" });
  if (reservation.status !== "paid") {
    return res.status(400).json({ error: "El check-in solo está disponible tras el pago" });
  }

  const [updated] = await db
    .update(reservationsTable)
    .set({
      status: "in_storage",
      checkinNotes: checkinNotes || "",
      checkinPhotos: JSON.stringify(checkinPhotos || []),
      declaredValue: declaredValue || "0",
      updatedAt: new Date(),
    })
    .where(eq(reservationsTable.id, id))
    .returning();

  logStateChange(id, "in_storage", {
    guestName: updated.guestName,
    guestEmail: updated.guestEmail,
    spaceTitle: updated.spaceTitle,
  });

  const photosCount = checkinPhotos?.length || 0;
  console.log(`\n📦 [RaumLog Check-in] Acta de Entrega completada para reserva #${id}`);
  console.log(`  Espacio: ${updated.spaceTitle} | Fotos: ${photosCount}\n`);

  return res.json({ success: true, reservation: updated });
});

router.post("/reservations/:id/complete", async (req, res) => {
  const id = Number(req.params["id"]);
  const [updated] = await db
    .update(reservationsTable)
    .set({ status: "completed", updatedAt: new Date() })
    .where(eq(reservationsTable.id, id))
    .returning();
  if (!updated) return res.status(404).json({ error: "Reserva no encontrada" });
  logStateChange(id, "completed");
  return res.json({ reservation: updated });
});

router.get("/reservations/space/:spaceId", async (req, res) => {
  const spaceId = Number(req.params["spaceId"]);
  const reservations = await db
    .select()
    .from(reservationsTable)
    .where(eq(reservationsTable.spaceId, spaceId))
    .orderBy(reservationsTable.createdAt);
  return res.json({ reservations });
});

export default router;
