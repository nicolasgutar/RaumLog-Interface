import { Router } from "express";
import { db, spacesTable, reservationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/host/spaces", async (req, res) => {
  const email = req.query["email"] as string;
  if (!email) return res.status(400).json({ error: "Email requerido" });
  const spaces = await db
    .select()
    .from(spacesTable)
    .where(eq(spacesTable.ownerEmail, email))
    .orderBy(spacesTable.createdAt);
  return res.json({ spaces });
});

router.get("/host/reservations", async (req, res) => {
  const email = req.query["email"] as string;
  if (!email) return res.status(400).json({ error: "Email requerido" });
  const reservations = await db
    .select()
    .from(reservationsTable)
    .where(eq(reservationsTable.spaceOwnerEmail, email))
    .orderBy(reservationsTable.createdAt);
  return res.json({ reservations });
});

router.patch("/host/reservations/:id/status", async (req, res) => {
  const id = Number(req.params["id"]);
  const { status, ownerEmail } = req.body as { status?: string; ownerEmail?: string };

  if (!status || !["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Estado inválido" });
  }
  if (!ownerEmail) return res.status(400).json({ error: "Email requerido" });

  const [reservation] = await db
    .select()
    .from(reservationsTable)
    .where(eq(reservationsTable.id, id));

  if (!reservation || reservation.spaceOwnerEmail !== ownerEmail) {
    return res.status(403).json({ error: "No autorizado" });
  }

  const [updated] = await db
    .update(reservationsTable)
    .set({ status: status as "approved" | "rejected", updatedAt: new Date() })
    .where(eq(reservationsTable.id, id))
    .returning();

  return res.json({ reservation: updated });
});

export default router;
