import { Router } from "express";
import { db, spacesTable, reservationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { firebaseAuthMiddleware } from "../infrastructure/auth/FirebaseMiddleware";

const router = Router();

router.get("/host/spaces", firebaseAuthMiddleware, async (req, res) => {
  const email = (req as any).user.email as string;
  const spaces = await db
    .select()
    .from(spacesTable)
    .where(eq(spacesTable.ownerEmail, email))
    .orderBy(spacesTable.createdAt);
  return res.json({ spaces });
});

router.get("/host/reservations", firebaseAuthMiddleware, async (req, res) => {
  const email = (req as any).user.email as string;
  const reservations = await db
    .select()
    .from(reservationsTable)
    .where(eq(reservationsTable.spaceOwnerEmail, email))
    .orderBy(reservationsTable.createdAt);
  return res.json({ reservations });
});

router.patch("/host/reservations/:id/status", firebaseAuthMiddleware, async (req, res) => {
  const id = Number(req.params["id"]);
  const email = (req as any).user.email as string;
  const { status } = req.body as { status?: string };

  if (!status || !["approved_by_host", "rejected", "completed"].includes(status)) {
    return res.status(400).json({ error: "Estado inválido" });
  }

  const [reservation] = await db
    .select()
    .from(reservationsTable)
    .where(eq(reservationsTable.id, id));

  if (!reservation || reservation.spaceOwnerEmail !== email) {
    return res.status(403).json({ error: "No autorizado" });
  }

  const [updated] = await db
    .update(reservationsTable)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(reservationsTable.id, id))
    .returning();

  return res.json({ reservation: updated });
});

export default router;
