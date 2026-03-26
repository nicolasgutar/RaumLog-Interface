import { Router } from "express";
import { db, reservationsTable, spacesTable, insertReservationSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

router.post("/reservations", async (req, res) => {
  const parsed = insertReservationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parsed.error.issues });
  }
  const [reservation] = await db.insert(reservationsTable).values(parsed.data).returning();
  return res.status(201).json({ reservation });
});

router.post("/reservations/:id/pay", async (req, res) => {
  const id = Number(req.params["id"]);
  const wompiReference = `RL-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  const [reservation] = await db
    .update(reservationsTable)
    .set({ status: "paid", wompiReference, updatedAt: new Date() })
    .where(eq(reservationsTable.id, id))
    .returning();
  if (!reservation) {
    return res.status(404).json({ error: "Reserva no encontrada" });
  }
  return res.json({
    success: true,
    reservation,
    wompiResponse: {
      sandbox: true,
      reference: wompiReference,
      status: "APPROVED",
      statusMessage: "Pago aprobado (modo sandbox)",
    },
  });
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
