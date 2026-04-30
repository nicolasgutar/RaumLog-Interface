import { Router } from "express";
import { db, reservationsTable, insertReservationSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { firebaseAuthMiddleware } from "../infrastructure/auth/FirebaseMiddleware";

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

router.post("/reservations", firebaseAuthMiddleware, async (req, res) => {
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

router.post("/reservations/:id/approve-host", firebaseAuthMiddleware, async (req, res) => {
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

router.post("/reservations/:id/prepare-payment", async (req, res) => {
  const id = Number(req.params["id"]);

  const [reservation] = await db
    .select()
    .from(reservationsTable)
    .where(eq(reservationsTable.id, id));

  if (!reservation) return res.status(404).json({ error: "Reserva no encontrada" });

  const integrityKey = process.env["WOMPI_INTEGRITY_KEY"];
  if (!integrityKey) return res.status(500).json({ error: "Pasarela de pago no configurada" });

  const reference = `RL-${id}-${Date.now()}`;
  const amountInCents = Math.round(Number(reservation.totalPrice ?? "0") * 100);
  const currency = "COP";

  const integritySignature = crypto
    .createHash("sha256")
    .update(`${reference}${amountInCents}${currency}${integrityKey}`)
    .digest("hex");

  // Auto-approve: owner already agreed off-platform by sharing the link
  await db
    .update(reservationsTable)
    .set({ status: "approved_by_host", wompiReference: reference, updatedAt: new Date() })
    .where(eq(reservationsTable.id, id));

  logStateChange(id, "approved_by_host", {
    guestName: reservation.guestName,
    guestEmail: reservation.guestEmail,
    spaceTitle: reservation.spaceTitle,
  });

  return res.json({
    reference,
    amountInCents,
    currency,
    integritySignature,
    publicKey: process.env["WOMPI_PUBLIC_KEY"],
    customerData: {
      email: reservation.guestEmail,
      fullName: reservation.guestName,
      phoneNumber: reservation.guestPhone ?? "",
    },
  });
});

router.post("/reservations/:id/checkin", firebaseAuthMiddleware, async (req, res) => {
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

router.post("/reservations/:id/complete", firebaseAuthMiddleware, async (req, res) => {
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

router.get("/reservations/space/:spaceId", firebaseAuthMiddleware, async (req, res) => {
  const spaceId = Number(req.params["spaceId"]);
  const reservations = await db
    .select()
    .from(reservationsTable)
    .where(eq(reservationsTable.spaceId, spaceId))
    .orderBy(reservationsTable.createdAt);
  return res.json({ reservations });
});

router.get("/reservations/guest", firebaseAuthMiddleware, async (req, res) => {
  const email = req.query["email"] as string;
  if (!email) return res.status(400).json({ error: "Email requerido" });
  const reservations = await db
    .select()
    .from(reservationsTable)
    .where(eq(reservationsTable.guestEmail, email))
    .orderBy(reservationsTable.createdAt);
  return res.json({ reservations });
});

router.get("/reservations/:id", firebaseAuthMiddleware, async (req, res) => {
  const id = Number(req.params["id"]);
  const [reservation] = await db
    .select()
    .from(reservationsTable)
    .where(eq(reservationsTable.id, id));
  if (!reservation) return res.status(404).json({ error: "Reserva no encontrada" });
  return res.json({ reservation });
});

export default router;
